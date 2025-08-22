# Product Requirements Document (PRD)
## Job Tracking System

### 1. Visão Geral do Produto

**Nome do Produto:** Job Tracker  
**Objetivo:** Sistema para rastrear e gerenciar candidaturas a vagas de emprego, permitindo acompanhar todo o processo desde a aplicação até o resultado final.

**Proposta de Valor:**
- Centralizar todas as candidaturas em um local
- Acompanhar o status de cada vaga
- Análise de performance das candidaturas
- Organização de documentos e contatos
- Lembretes automáticos para follow-ups

### 2. Funcionalidades Principais

#### 2.1 Gerenciamento de Vagas
- **Adicionar Vaga:** Registrar nova oportunidade com detalhes completos
- **Editar Vaga:** Atualizar informações da vaga
- **Status da Vaga:** Acompanhar progresso (Applied, Interview, Offer, Rejected, etc.)
- **Arquivar Vaga:** Mover vagas antigas para arquivo

#### 2.2 Dashboard e Analytics
- **Dashboard Principal:** Visão geral das candidaturas ativas
- **Estatísticas:** Taxa de resposta, tempo médio de processo, etc.
- **Gráficos:** Visualização de candidaturas por período, status, empresa
- **Relatórios:** Exportar dados para análise

#### 2.3 Gestão de Documentos
- **Upload de CVs:** Diferentes versões para diferentes vagas
- **Cover Letters:** Armazenar cartas de apresentação

#### 2.4 Contatos e Networking
- **Contatos:** Gerenciar recruiters e pessoas de RH
- **Notas:** Registrar conversas e feedbacks
- **Follow-ups:** Lembretes para contatos


### 3. Database Schema

O schema completo do banco de dados está documentado em [`database-schema.sql`](./database-schema.sql).

**Principais tabelas:**
- `jobs` - Vagas de emprego
- `job_contacts` - Contatos relacionados às vagas
- `job_activities` - Timeline de atividades
- `job_documents` - Documentos anexados
- `companies` - Informações das empresas
- `interview_rounds` - Rounds de entrevistas

### 4. Tarefas Técnicas Necessárias

#### 4.1 Backend/Database
1. **Aplicar novo schema no Supabase**
   - Criar migration com todas as tabelas
   - Configurar RLS policies
   - Criar indexes para performance

2. **Storage para documentos**
   - Configurar Supabase Storage bucket
   - Políticas de upload/download
   - Otimização de imagens

3. **Functions/Triggers**
   - Auto-update de timestamps
   - Validações customizadas
   - Notificações automáticas

#### 4.2 Frontend - Páginas Principais
1. **Dashboard** (`/dashboard`)
   - Overview de estatísticas
   - Gráficos de performance
   - Jobs recentes e próximas entrevistas

2. **Lista de Jobs** (`/jobs`)
   - Tabela com filtros e busca
   - Status cards (Kanban view)
   - Ações rápidas (editar, arquivar)

3. **Detalhes do Job** (`/jobs/[id]`)
   - Informações completas da vaga
   - Timeline de atividades
   - Gerenciamento de documentos
   - Contatos relacionados

4. **Adicionar/Editar Job** (`/jobs/new`, `/jobs/[id]/edit`)
   - Formulário completo
   - Upload de documentos
   - Validações

5. **Calendário** (`/calendar`)
   - Visualização de entrevistas
   - Deadlines
   - Integração com calendários externos

6. **Contatos** (`/contacts`)
   - Lista de recruiters/HR
   - Histórico de interações
   - Notas e follow-ups

7. **Relatórios** (`/reports`)
   - Analytics detalhados
   - Exportação de dados
   - Gráficos customizáveis

#### 4.3 Componentes UI
1. **JobCard** - Card para exibir job na lista
2. **StatusBadge** - Badge com cores para diferentes status
3. **ActivityTimeline** - Timeline de atividades do job
4. **DocumentUpload** - Upload e gerenciamento de arquivos
5. **ContactCard** - Card para exibir contatos
6. **InterviewScheduler** - Agendamento de entrevistas
7. **JobFilters** - Filtros avançados para busca
8. **StatsWidget** - Widgets de estatísticas para dashboard

#### 4.4 Funcionalidades Avançadas
1. **Notificações**
   - Email reminders
   - Push notifications (PWA)
   - Toast notifications no app

2. **Exportação/Importação**
   - Export para CSV/PDF
   - Import de jobs do LinkedIn
   - Backup de dados

3. **Integrações**
   - API do LinkedIn (se disponível)
   - Calendário Google/Outlook
   - Extensão do Chrome para job boards

4. **PWA Features**
   - Offline capability
   - App manifest
   - Service worker

### 5. Estrutura de Rotas

```
/dashboard - Dashboard principal
/jobs - Lista de jobs
/jobs/new - Adicionar nova vaga
/jobs/[id] - Detalhes da vaga
/jobs/[id]/edit - Editar vaga
/calendar - Calendário de entrevistas
/contacts - Gerenciar contatos
/companies - Gerenciar empresas
/reports - Relatórios e analytics
/settings - Configurações do usuário
/profile - Perfil do usuário
```

### 6. Tecnologias Recomendadas

**Frontend:**
- Next.js 15 (já configurado)
- Tailwind CSS + shadcn/ui (já configurado)
- React Hook Form para formulários
- Recharts para gráficos
- React Query/SWR para cache

**Backend:**
- Supabase (já configurado)
- PostgreSQL com RLS
- Supabase Storage para arquivos
- Edge Functions para lógica customizada

**Extras:**
- React PDF para exportação
- Date-fns para manipulação de datas
- Lucide icons (já configurado)