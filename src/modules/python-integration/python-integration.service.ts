import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import { firstValueFrom } from 'rxjs';
import {
  WeatherRequestDto,
  RecommendationRequestDto,
  CropSimulationRequestDto,
  SatelliteDataRequestDto,
} from './dto/python-requests.dto';
import {
  WeatherResponseDto,
  PythonRecommendationResponseDto,
  CropSimulationResponseDto,
  SatelliteDataResponseDto,
} from './dto/python-responses.dto';

@Injectable()
export class PythonIntegrationService {
  private readonly logger = new Logger(PythonIntegrationService.name);
  private readonly pythonServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.pythonServiceUrl = this.configService.get<string>(
      'PYTHON_SERVICE_URL',
      'http://localhost:8000',
    );
  }

  async getWeatherData(
    weatherRequest: WeatherRequestDto,
  ): Promise<WeatherResponseDto> {
    try {
      this.logger.log(
        `Requesting weather data for lat: ${weatherRequest.lat}, lon: ${weatherRequest.lon}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.pythonServiceUrl}/weather`,
          weatherRequest,
          {
            timeout: 30000, // 30 seconds timeout
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log('Weather data received successfully');

      // Cache weather data in database for future use
      await this.cacheWeatherData(weatherRequest, response.data);

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get weather data: ${error.message}`);

      // Try to get cached data if available
      const cachedData = await this.getCachedWeatherData(weatherRequest);
      if (cachedData) {
        this.logger.log('Returning cached weather data');
        return cachedData;
      }

      throw new HttpException(
        'Failed to fetch weather data from Python service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getRecommendations(
    recommendationRequest: RecommendationRequestDto,
  ): Promise<PythonRecommendationResponseDto> {
    try {
      this.logger.log(
        `Requesting recommendations for farm ID: ${recommendationRequest.farmId}`,
      );

      // Get farm data to enrich the request
      const farm = await this.prisma.farm.findUnique({
        where: { id: recommendationRequest.farmId },
        include: {
          owner: true,
          fields: true,
          plantings: {
            include: {
              crop: true,
            },
            take: 5, // Last 5 plantings for context
            orderBy: {
              plantedAt: 'desc',
            },
          },
        },
      });

      if (!farm) {
        throw new HttpException('Farm not found', HttpStatus.NOT_FOUND);
      }

      // Enrich request with farm context
      const enrichedRequest = {
        ...recommendationRequest,
        farm_data: {
          lat: farm.centroidLat,
          lon: farm.centroidLon,
          area_ha: farm.areaHa,
          soil_type: farm.soilType,
          province: farm.province,
          municipality: farm.municipality,
        },
        historical_plantings: farm.plantings.map((p) => ({
          crop_name: p.crop.name,
          planted_at: p.plantedAt,
          area_ha: p.areaHa,
          actual_yield: p.actualYieldKg,
        })),
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.pythonServiceUrl}/recommendations`,
          enrichedRequest,
          {
            timeout: 60000, // 60 seconds timeout for ML processing
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log('Recommendations received successfully');

      // Save recommendations to database
      await this.saveRecommendations(
        recommendationRequest.farmId,
        response.data.recommendations,
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get recommendations: ${error.message}`);
      throw new HttpException(
        'Failed to fetch recommendations from Python service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async simulateCropGrowth(
    simulationRequest: CropSimulationRequestDto,
  ): Promise<CropSimulationResponseDto> {
    try {
      this.logger.log(
        `Requesting crop simulation for farm ID: ${simulationRequest.farmId}, crop: ${simulationRequest.cropTypeId}`,
      );

      // Get farm and crop data
      const [farm, cropType] = await Promise.all([
        this.prisma.farm.findUnique({
          where: { id: simulationRequest.farmId },
        }),
        this.prisma.cropType.findUnique({
          where: { id: simulationRequest.cropTypeId },
        }),
      ]);

      if (!farm || !cropType) {
        throw new HttpException(
          'Farm or crop type not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Enrich request with context
      const enrichedRequest = {
        ...simulationRequest,
        farm_data: {
          lat: farm.centroidLat,
          lon: farm.centroidLon,
          soil_type: farm.soilType,
        },
        crop_data: {
          name: cropType.name,
          scientific_name: cropType.scientificName,
          typical_start_month: cropType.typicalStartMonth,
          typical_end_month: cropType.typicalEndMonth,
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.pythonServiceUrl}/simulate-crop`,
          enrichedRequest,
          {
            timeout: 60000, // 60 seconds timeout
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log('Crop simulation completed successfully');
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to simulate crop growth: ${error.message}`);
      throw new HttpException(
        'Failed to run crop simulation from Python service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getSatelliteData(
    satelliteRequest: SatelliteDataRequestDto,
  ): Promise<SatelliteDataResponseDto> {
    try {
      this.logger.log(
        `Requesting satellite data for lat: ${satelliteRequest.lat}, lon: ${satelliteRequest.lon}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.pythonServiceUrl}/satellite-data`,
          satelliteRequest,
          {
            timeout: 120000, // 2 minutes timeout for satellite data processing
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log('Satellite data received successfully');

      // Cache satellite data
      await this.cacheSatelliteData(satelliteRequest, response.data);

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get satellite data: ${error.message}`);
      throw new HttpException(
        'Failed to fetch satellite data from Python service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // Helper methods for caching
  private async cacheWeatherData(
    request: WeatherRequestDto,
    data: any,
  ): Promise<void> {
    try {
      await this.prisma.weatherObservation.create({
        data: {
          timestamp: new Date(),
          source: 'python_service',
          temperatureC: data.data?.current?.temperature,
          precipitationMm: data.data?.current?.precipitation,
          humidity: data.data?.current?.humidity,
          windSpeedMps: data.data?.current?.windSpeed,
          raw: data,
        },
      });
    } catch (error) {
      this.logger.warn('Failed to cache weather data:', error.message);
    }
  }

  private async getCachedWeatherData(
    request: WeatherRequestDto,
  ): Promise<WeatherResponseDto | null> {
    try {
      const cached = await this.prisma.weatherObservation.findFirst({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 3600000), // 1 hour cache
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      });

      return (cached?.raw as any) || null;
    } catch (error) {
      this.logger.warn('Failed to get cached weather data:', error.message);
      return null;
    }
  }

  private async saveRecommendations(
    farmId: number,
    recommendations: any[],
  ): Promise<void> {
    try {
      for (const rec of recommendations) {
        await this.prisma.recommendation.create({
          data: {
            farmId,
            createdBy: 'python_service',
            type: rec.type || 'GENERAL',
            title: rec.title || `${rec.cropName} Recommendation`,
            body: rec.description || JSON.stringify(rec.recommendations),
            score: rec.confidence,
            actionSuggested: rec.recommendations,
            metadata: {
              yield_estimate: rec.yield_estimate,
              source: 'ml_model',
              processed_at: new Date().toISOString(),
            },
          },
        });
      }
    } catch (error) {
      this.logger.warn('Failed to save recommendations:', error.message);
    }
  }

  private async cacheSatelliteData(
    request: SatelliteDataRequestDto,
    data: any,
  ): Promise<void> {
    try {
      await this.prisma.satelliteObservation.create({
        data: {
          timestamp: new Date(),
          source: 'python_service',
          ndvi: data.data?.ndvi?.current,
          evi: data.data?.evi?.current,
          soilMoisture: data.data?.soil_moisture?.current,
          rawUrl: data.raw_urls?.[0],
          metrics: data,
        },
      });
    } catch (error) {
      this.logger.warn('Failed to cache satellite data:', error.message);
    }
  }

  async getServiceHealth(): Promise<{
    status: string;
    python_service: string;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.pythonServiceUrl}/health`, {
          timeout: 5000,
        }),
      );

      return {
        status: 'healthy',
        python_service: response.data.status || 'unknown',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        python_service: 'unavailable',
      };
    }
  }
}
