import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PythonIntegrationService } from './python-integration.service';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Python Integration')
@ApiBearerAuth()
@Controller('python')
@UseGuards(JwtAuthGuard)
export class PythonIntegrationController {
  constructor(
    private readonly pythonIntegrationService: PythonIntegrationService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check Python service health' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async getServiceHealth() {
    return this.pythonIntegrationService.getServiceHealth();
  }

  @Post('weather')
  @ApiOperation({ summary: 'Get weather data from Python service' })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
  })
  @ApiResponse({ status: 503, description: 'Python service unavailable' })
  async getWeatherData(
    @Body() weatherRequest: WeatherRequestDto,
  ): Promise<WeatherResponseDto> {
    return this.pythonIntegrationService.getWeatherData(weatherRequest);
  }

  @Post('recommendations')
  @ApiOperation({
    summary: 'Get AI recommendations for farming (Farm Tinder 🌱❤️)',
  })
  @ApiResponse({
    status: 200,
    description: 'Recommendations generated successfully',
    type: PythonRecommendationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Farm not found' })
  @ApiResponse({ status: 503, description: 'Python service unavailable' })
  async getRecommendations(
    @Body() recommendationRequest: RecommendationRequestDto,
  ): Promise<PythonRecommendationResponseDto> {
    return this.pythonIntegrationService.getRecommendations(
      recommendationRequest,
    );
  }

  @Post('simulate-crop')
  @ApiOperation({ summary: 'Simulate crop growth and yield prediction' })
  @ApiResponse({
    status: 200,
    description: 'Crop simulation completed successfully',
    type: CropSimulationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Farm or crop type not found' })
  @ApiResponse({ status: 503, description: 'Python service unavailable' })
  async simulateCropGrowth(
    @Body() simulationRequest: CropSimulationRequestDto,
  ): Promise<CropSimulationResponseDto> {
    return this.pythonIntegrationService.simulateCropGrowth(simulationRequest);
  }

  @Post('satellite-data')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TECHNICIAN, Role.NGO, Role.GOVERNMENT)
  @ApiOperation({ summary: 'Get satellite data and NDVI analysis' })
  @ApiResponse({
    status: 200,
    description: 'Satellite data retrieved successfully',
    type: SatelliteDataResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions for satellite data',
  })
  @ApiResponse({ status: 503, description: 'Python service unavailable' })
  async getSatelliteData(
    @Body() satelliteRequest: SatelliteDataRequestDto,
  ): Promise<SatelliteDataResponseDto> {
    return this.pythonIntegrationService.getSatelliteData(satelliteRequest);
  }
}
