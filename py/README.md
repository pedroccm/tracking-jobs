# 🧪 Job Tracker Extension API Tester

Script Python para testar a API da extensão Chrome Job Tracker em produção.

## 📋 Pré-requisitos

- Python 3.7+
- Biblioteca `requests`

## 🚀 Instalação

1. **Instale as dependências:**
```bash
pip install requests
```

Ou usando o arquivo requirements.txt:
```bash
pip install -r requirements.txt
```

## 💻 Como usar

### 1. Teste Básico (com dados de exemplo)
```bash
python test_extension_api.py
```

### 2. Teste com User ID específico
```bash
python test_extension_api.py "seu_user_id_aqui"
```

### 3. Teste Interativo
Execute o script e siga as instruções na tela:
- Digite seu User ID (mesmo código usado na extensão)
- Escolha o tipo de teste:
  - **Opção 1:** Dados de exemplo (vaga fictícia mas realista)
  - **Opção 2:** Dados customizados (você digita os dados)
  - **Opção 3:** Ambos os testes

## 📊 O que o script testa

### APIs Testadas:
- ✅ **Produção:** `https://tracking-jobs-git-main-pedros-projects-74eb8b5d.vercel.app/api/jobs/capture`
- ✅ **Desenvolvimento:** `http://localhost:3000/api/jobs/capture`

### Dados Enviados:
- `user_id`: Código do usuário (mesmo da extensão)
- `title`: Título da vaga
- `company`: Nome da empresa
- `location`: Localização
- `description`: Descrição detalhada
- `url`: URL da vaga no LinkedIn
- `external_id`: ID extraído do LinkedIn
- `status`: Status da candidatura (padrão: "applied")
- `applied_date`: Data da candidatura

### Verificações:
- 🔗 **Conectividade:** Testa se consegue conectar aos endpoints
- ⏱️ **Timeout:** Verifica se a API responde em até 30 segundos
- 📡 **Status HTTP:** Analisa códigos de resposta
- 📋 **Formato de resposta:** Valida se retorna JSON válido
- ❌ **Tratamento de erros:** Captura e exibe erros detalhados

## 📝 Exemplo de uso

```bash
$ python test_extension_api.py

🤖 Job Tracker Extension API Tester
============================================================
Digite seu User ID (código da extensão): meu_codigo_123

Opções disponíveis:
1. Testar com dados de exemplo
2. Testar com dados customizados
3. Testar ambos

Escolha uma opção (1-3) [1]: 1

🧪 EXECUTANDO TESTE COM DADOS DE EXEMPLO
============================================================
🚀 TESTANDO API DA EXTENSÃO JOB TRACKER
============================================================
👤 User ID: meu_codigo_123
📝 Vaga de teste: Desenvolvedor Full Stack Senior - Tech Solutions Brasil
============================================================

🔍 Teste 1/2:
🔄 Testando endpoint: https://tracking-jobs-git-main-pedros-projects-74eb8b5d.vercel.app/api/jobs/capture
✅ Sucesso! Resposta: {
  "message": "Job captured successfully",
  "jobId": "123456"
}

============================================================
📊 RESUMO DOS TESTES
============================================================
✅ Endpoints funcionando: 1/2
🎉 A extensão deveria funcionar corretamente!
```

## 🔧 Troubleshooting

### Problemas Comuns:

#### ❌ **Erro de conexão**
```
❌ Erro de conexão: Não foi possível conectar ao endpoint
```
**Solução:** Verifique sua conexão com a internet e se a URL está correta.

#### ❌ **Erro 404**
```
❌ Erro 404: {"error": "Not found"}
```
**Solução:** A rota `/api/jobs/capture` pode não existir. Verifique se a API está deployada corretamente.

#### ❌ **Erro 500**
```
❌ Erro 500: {"error": "Internal server error"}
```
**Solução:** Erro no servidor. Verifique os logs da aplicação no Vercel/Netlify.

#### ❌ **Timeout**
```
❌ Timeout: O endpoint demorou mais de 30s para responder
```
**Solução:** A API pode estar sobrecarregada ou com problemas. Tente novamente em alguns minutos.

## 🎯 Interpretando os resultados

### ✅ **Sucesso total**
- Todos os endpoints funcionam
- A extensão deve funcionar perfeitamente

### ⚠️ **Sucesso parcial**
- Pelo menos um endpoint funciona
- A extensão pode funcionar, mas pode ter fallback

### ❌ **Falha total**
- Nenhum endpoint funciona
- A extensão não conseguirá salvar dados
- Verifique deployment e configurações

## 🔗 Relação com a Extensão

Este script simula exatamente o que a extensão Chrome faz:

1. **Mesmas URLs:** Usa as mesmas URLs definidas na extensão
2. **Mesmo formato:** Envia dados no mesmo formato JSON
3. **Mesmos headers:** Usa Content-Type application/json
4. **Mesmo comportamento:** Tenta múltiplos endpoints como fallback

## 🛠️ Customização

Para testar com suas próprias URLs:

```python
# Edite o arquivo test_extension_api.py
self.api_urls = [
    'https://sua-api.com/api/jobs/capture',
    'http://localhost:3000/api/jobs/capture'
]
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se a API está online e funcionando
2. Confirme se as URLs estão corretas
3. Teste com um User ID válido
4. Verifique logs do servidor para erros detalhados
