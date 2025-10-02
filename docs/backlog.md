# 🚀 Product Backlog – NASA Farm Navigators (1 Semana)

## 🎯 Objetivos da Semana

* Entregar um **MVP funcional e estável**.
* Garantir **interface fluida e inovadora**.
* Mostrar **impacto real** para agricultores.
* Preparar **apresentação forte para jurados**.

---

## 📂 Épico 1 – Setup & DevOps

| Tarefa                                                                               | Responsável               | Tempo Estimado | Prioridade |
| ------------------------------------------------------------------------------------ | ------------------------- | -------------- | ---------- |
| Criar GitHub Organization + repositórios (mobile, web, backend-node, backend-python) | Paulo                     | 2h             | Alta       |
| Configurar CI/CD (GitHub Actions para build/test)                                    | Paulo                     | 4h             | Alta       |
| Dockerizar serviços (NodeJS, Python)                                                 | Paulo                     | 6h             | Média      |
| Configurar deploy rápido (Vercel, Railway/Render, Expo)                              | Paulo                     | 6h             | Alta       |
| Documentar stack e guidelines em cada repo (README inicial)                          | Todos (revisão: Reinaldo) | 3h             | Alta       |

---

## 📂 Épico 2 – Frontend (Mobile + Web)

| Tarefa                                                   | Responsável       | Tempo Estimado | Prioridade |
| -------------------------------------------------------- | ----------------- | -------------- | ---------- |
| Criar protótipo UI (Figma rápido) para alinhar design    | Shelby + Reinaldo | 4h             | Alta       |
| Implementar login/cadastro (mobile + web)                | Shelby + Paulo    | 6h             | Alta       |
| Implementar registro de fazenda no mapa (Mapbox SDK)     | Shelby            | 8h             | Alta       |
| Exibir fazenda no mapa interativo                        | Shelby            | 6h             | Alta       |
| Implementar alertas visuais no app (chuva, seca, etc.)   | Shelby + Paulo    | 8h             | Alta       |
| Criar dashboard simples (gráficos com Recharts/Chart.js) | Shelby + Paulo    | 8h             | Média      |
| Melhorar UI/UX (design system unificado com Tailwind)    | Shelby            | 6h             | Alta       |
| Extra: implementar multilíngue (PT/EN)                   | Shelby            | 6h             | Baixa      |

---

## 📂 Épico 3 – Backend NodeJS (API Central)

| Tarefa                                           | Responsável   | Tempo Estimado | Prioridade |
| ------------------------------------------------ | ------------- | -------------- | ---------- |
| Criar API base NestJS + Fastify                  | Victor        | 4h             | Alta       |
| Implementar autenticação JWT                     | Victor + Nuno | 6h             | Alta       |
| Criar endpoints de usuários (CRUD)               | Victor        | 6h             | Alta       |
| Criar endpoints de fazendas (CRUD + localização) | Victor        | 6h             | Alta       |
| Criar endpoints de alertas                       | Nuno          | 6h             | Alta       |
| Integrar PostgreSQL com Prisma ORM               | Victor        | 6h             | Alta       |
| Expor endpoint para consumir microserviço Python | Victor        | 4h             | Alta       |
| Testes unitários básicos (Jest)                  | Nuno          | 4h             | Média      |

---

## 📂 Épico 4 – Backend Python (Dados + ML)

| Tarefa                                                             | Responsável       | Tempo Estimado | Prioridade |
| ------------------------------------------------------------------ | ----------------- | -------------- | ---------- |
| Configurar microserviço (FastAPI/Flask)                            | Angela            | 6h             | Alta       |
| Conectar a datasets NASA (clima, NDVI, precipitação)               | Angela + Reinaldo | 8h             | Alta       |
| Criar script de previsão climática simples                         | Angela            | 6h             | Alta       |
| Implementar endpoint `/recommendations` (responde ao backend Node) | Angela            | 6h             | Alta       |
| Implementar cálculo de irrigação inteligente (economia de água)    | Angela + Reinaldo | 8h             | Média      |
| Extra: Zonas de risco via análise de satélite (mapa de calor)      | Angela            | 10h            | Baixa      |

---

## 📂 Épico 5 – Integração & UX Final

| Tarefa                                            | Responsável     | Tempo Estimado | Prioridade |
| ------------------------------------------------- | --------------- | -------------- | ---------- |
| Integrar frontend ↔ backend NodeJS                | Shelby + Victor | 8h             | Alta       |
| Integrar backend NodeJS ↔ Python                  | Victor + Angela | 6h             | Alta       |
| Mostrar alertas no mapa em tempo real             | Shelby + Nuno   | 8h             | Alta       |
| Ajustes finais de UI/UX (fluidez, responsividade) | Shelby + Paulo  | 6h             | Alta       |
| Testes ponta a ponta (mobile + web)               | Todos           | 6h             | Alta       |

---

## 📂 Épico 6 – Pitch & Apresentação

| Tarefa                                                     | Responsável       | Tempo Estimado | Prioridade |
| ---------------------------------------------------------- | ----------------- | -------------- | ---------- |
| Criar storytelling do pitch (problema → solução → impacto) | Reinaldo          | 6h             | Alta       |
| Criar slides (com mockups/screenshots do app)              | Reinaldo + Shelby | 4h             | Alta       |
| Preparar demo fluída (script de apresentação)              | Reinaldo + Todos  | 4h             | Alta       |
| Treinar pitch de 5 minutos                                 | Todos             | 3h             | Alta       |
| Extra: gravar vídeo demo (backup para apresentação)        | Paulo + Shelby    | 3h             | Baixa      |

---

## 🔑 Priorização

* **Alta (Must Have):** Login, mapa, alertas básicos, backend Node + Python integrados, deploy funcionando, pitch.
* **Média (Should Have):** Dashboard, recomendações inteligentes, testes unitários.
* **Baixa (Nice to Have):** Multilíngue, mapa de calor avançado, vídeo demo.

---

## 📅 Timeline (1 Semana)

### **Dia 1-2** → Setup + Fundamentos

* GitHub + CI/CD + Deploy inicial.
* API Node base + Python base.
* Protótipo UI + telas iniciais.

### **Dia 3-4** → Features principais

* Login, cadastro, registro de fazenda.
* Mapa interativo funcionando com dados.
* Alertas básicos implementados.

### **Dia 5** → Integração

* Frontend ↔ NodeJS.
* NodeJS ↔ Python.
* Dashboard básico.

### **Dia 6** → UX & Refino

* Ajustes UI/UX.
* Testes ponta a ponta.
* Storytelling e mock do pitch.

### **Dia 7** → Finalização & Pitch

* Ensaiar apresentação.
* Ajustes finais no app.
* Preparar slides e demo.

