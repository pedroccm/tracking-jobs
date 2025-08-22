#!/usr/bin/env python3
"""
Script para testar a API da extensão Chrome Job Tracker
Simula o comportamento da extensão enviando dados de vagas para a API
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any

class JobTrackerTester:
    def __init__(self):
        # URLs da API (mesmas que estão na extensão)
        self.api_urls = [
            'https://tracking-jobs-git-main-pedros-projects-74eb8b5d.vercel.app/api/jobs/capture',
            'http://localhost:3000/api/jobs/capture'
        ]
        
        self.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Job Tracker Extension Tester/1.0'
        }
    
    def create_sample_job_data(self, user_id: str) -> Dict[str, Any]:
        """
        Cria dados de exemplo de uma vaga do LinkedIn
        Simula os dados que a extensão extrai
        """
        return {
            "user_id": user_id,
            "title": "Desenvolvedor Full Stack Senior",
            "company": "Tech Solutions Brasil",
            "location": "São Paulo, SP (Remoto)",
            "description": """
Estamos procurando um Desenvolvedor Full Stack Senior para se juntar ao nosso time inovador.

Responsabilidades:
• Desenvolver aplicações web usando React, Node.js e TypeScript
• Trabalhar com bancos de dados PostgreSQL e MongoDB
• Implementar APIs RESTful e GraphQL
• Colaborar com equipes multidisciplinares
• Participar de code reviews e mentoria

Requisitos:
• 5+ anos de experiência em desenvolvimento web
• Conhecimento sólido em JavaScript/TypeScript
• Experiência com React, Next.js, Node.js
• Conhecimento em bancos de dados relacionais e NoSQL
• Experiência com Git, CI/CD
• Inglês intermediário

Oferecemos:
• Salário competitivo (R$ 12.000 - R$ 18.000)
• Vale alimentação e refeição
• Plano de saúde e odontológico
• Férias flexíveis
• Orçamento para cursos e certificações
            """.strip(),
            "url": "https://www.linkedin.com/jobs/view/3756432109",
            "external_id": "3756432109",
            "status": "applied",
            "applied_date": datetime.now().strftime('%Y-%m-%d')
        }
    
    def test_api_endpoint(self, api_url: str, job_data: Dict[str, Any]) -> tuple[bool, str]:
        """
        Testa um endpoint específico da API
        
        Returns:
            tuple: (sucesso, mensagem)
        """
        try:
            print(f"🔄 Testando endpoint: {api_url}")
            
            response = requests.post(
                api_url,
                headers=self.headers,
                json=job_data,
                timeout=30
            )
            
            if response.status_code == 200:
                try:
                    result = response.json()
                    return True, f"✅ Sucesso! Resposta: {json.dumps(result, ensure_ascii=False, indent=2)}"
                except:
                    return True, f"✅ Sucesso! Status: {response.status_code}"
            else:
                try:
                    error_data = response.json()
                    return False, f"❌ Erro {response.status_code}: {error_data}"
                except:
                    return False, f"❌ Erro {response.status_code}: {response.text}"
                    
        except requests.exceptions.ConnectionError:
            return False, f"❌ Erro de conexão: Não foi possível conectar ao endpoint"
        except requests.exceptions.Timeout:
            return False, f"❌ Timeout: O endpoint demorou mais de 30s para responder"
        except Exception as e:
            return False, f"❌ Erro inesperado: {str(e)}"
    
    def test_all_endpoints(self, user_id: str) -> bool:
        """
        Testa todos os endpoints disponíveis
        
        Returns:
            bool: True se pelo menos um endpoint funcionou
        """
        job_data = self.create_sample_job_data(user_id)
        
        print("=" * 60)
        print("🚀 TESTANDO API DA EXTENSÃO JOB TRACKER")
        print("=" * 60)
        print(f"👤 User ID: {user_id}")
        print(f"📝 Vaga de teste: {job_data['title']} - {job_data['company']}")
        print("=" * 60)
        
        success_count = 0
        
        for i, api_url in enumerate(self.api_urls, 1):
            print(f"\n🔍 Teste {i}/{len(self.api_urls)}:")
            success, message = self.test_api_endpoint(api_url, job_data)
            print(message)
            
            if success:
                success_count += 1
        
        print("\n" + "=" * 60)
        print("📊 RESUMO DOS TESTES")
        print("=" * 60)
        print(f"✅ Endpoints funcionando: {success_count}/{len(self.api_urls)}")
        
        if success_count > 0:
            print("🎉 A extensão deveria funcionar corretamente!")
            return True
        else:
            print("⚠️  Nenhum endpoint está funcionando. Verifique:")
            print("   • Se a aplicação está deployada e funcionando")
            print("   • Se a URL da API está correta")
            print("   • Se não há problemas de CORS")
            print("   • Se a API aceita requisições POST no endpoint /api/jobs/capture")
            return False
    
    def test_custom_data(self, user_id: str, custom_job_data: Dict[str, Any]):
        """
        Testa com dados customizados
        """
        print("\n🔧 TESTE COM DADOS CUSTOMIZADOS")
        print("=" * 60)
        
        # Adiciona user_id aos dados customizados
        custom_job_data["user_id"] = user_id
        
        print(f"📋 Dados enviados:")
        print(json.dumps(custom_job_data, ensure_ascii=False, indent=2))
        
        for api_url in self.api_urls:
            success, message = self.test_api_endpoint(api_url, custom_job_data)
            print(f"\n{message}")
            if success:
                break

def main():
    """Função principal"""
    print("🤖 Job Tracker Extension API Tester")
    print("=" * 60)
    
    # Solicita o user_id
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
    else:
        user_id = input("Digite seu User ID (código da extensão): ").strip()
    
    if not user_id:
        print("❌ User ID é obrigatório!")
        sys.exit(1)
    
    tester = JobTrackerTester()
    
    # Menu de opções
    print(f"\nOpções disponíveis:")
    print("1. Testar com dados de exemplo")
    print("2. Testar com dados customizados")
    print("3. Testar ambos")
    
    choice = input("\nEscolha uma opção (1-3) [1]: ").strip() or "1"
    
    if choice in ["1", "3"]:
        print("\n🧪 EXECUTANDO TESTE COM DADOS DE EXEMPLO")
        success = tester.test_all_endpoints(user_id)
        
        if not success:
            sys.exit(1)
    
    if choice in ["2", "3"]:
        print("\n📝 DADOS CUSTOMIZADOS")
        print("Digite os dados da vaga (ou pressione Enter para pular):")
        
        title = input("Título da vaga: ").strip()
        company = input("Empresa: ").strip()
        location = input("Localização: ").strip()
        
        if title and company:
            custom_data = {
                "title": title,
                "company": company,
                "location": location or "Não informado",
                "description": "Dados inseridos manualmente pelo teste",
                "url": "https://www.linkedin.com/jobs/view/test",
                "external_id": "test_" + datetime.now().strftime('%Y%m%d_%H%M%S'),
                "status": "applied",
                "applied_date": datetime.now().strftime('%Y-%m-%d')
            }
            
            tester.test_custom_data(user_id, custom_data)
        else:
            print("⏭️  Pulando teste com dados customizados")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Teste cancelado pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        sys.exit(1)
