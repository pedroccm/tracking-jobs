# Job Tracker - Chrome Extension

Extensão do Chrome para capturar vagas do LinkedIn e salvar automaticamente no Job Tracker.

## 🚀 Como Instalar

1. **Baixe os arquivos da extensão:**
   - Todos os arquivos estão na pasta `chrome-extension/`

2. **Instale no Chrome:**
   - Abra o Chrome e vá para `chrome://extensions/`
   - Ative o "Modo do desenvolvedor" no canto superior direito
   - Clique em "Carregar sem compactação"
   - Selecione a pasta `chrome-extension/`

3. **Configure sua conta:**
   - Vá para Settings no Job Tracker (`http://localhost:3000/dashboard/settings`)
   - Copie seu código de usuário
   - Clique na extensão no Chrome e cole o código

## 📖 Como Usar

1. **Navegue para uma vaga no LinkedIn:**
   - Vá para qualquer página de vaga: `linkedin.com/jobs/view/[id]`

2. **Capture a vaga:**
   - Clique no ícone da extensão Job Tracker
   - Clique em "Capturar Vaga"
   - A vaga será salva automaticamente na sua conta

## ✨ Funcionalidades

- ✅ **Detecção automática** de vagas do LinkedIn
- ✅ **Extração completa** de dados (título, empresa, localização, descrição)
- ✅ **Salvamento direto** no banco de dados
- ✅ **Prevenção de duplicatas** baseada no ID da vaga
- ✅ **Interface simples** e intuitiva

## 🛠️ Dados Capturados

A extensão captura automaticamente:
- **Título da vaga**
- **Nome da empresa**
- **Localização**
- **Descrição completa**
- **URL da vaga**
- **ID da vaga** (para evitar duplicatas)
- **Data de aplicação** (hoje)
- **Status** (marcado como "applied")

## 🔒 Privacidade

- A extensão só funciona em páginas do LinkedIn
- Dados são enviados apenas para seu servidor local
- Nenhuma informação é compartilhada com terceiros

## ⚡ Requisitos

- Job Tracker rodando em `http://localhost:3000`
- Chrome ou navegadores baseados em Chromium
- Conta válida no Job Tracker

## 🐛 Solução de Problemas

**Erro "Job Tracker não está rodando":**
- Certifique-se que o servidor está ativo em `localhost:3000`

**Erro "Código de usuário inválido":**
- Verifique se copiou o código correto das configurações
- O código deve ser um UUID válido

**Erro "Vaga já existe":**
- Esta vaga já foi capturada anteriormente
- Não é possível capturar a mesma vaga duas vezes