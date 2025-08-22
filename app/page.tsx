'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
  HiBolt
} from 'react-icons/hi2';
import { IoMoon, IoSunny } from 'react-icons/io5';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen dark:bg-zinc-950 bg-white">
      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <HiBolt className="h-5 w-5" />
              </div>
              <span className="ml-3 text-xl font-bold text-zinc-950 dark:text-white">Job Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline" className="border-zinc-200 dark:border-zinc-800">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signin/signup">
                <Button className="bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-6xl">
              Gerencie suas
              <span className="mx-3 rounded-md bg-zinc-950 px-3 py-1 text-white dark:bg-white dark:text-zinc-950">
                candidaturas
              </span>
              <br />
              de forma inteligente
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Organize todas suas aplicações para vagas, acompanhe entrevistas, 
              gerencie contatos e tenha insights completos sobre sua jornada profissional.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signin/signup">
                <Button size="lg" className="text-lg px-8 py-3 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                  Começar gratuitamente
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-3 border-zinc-200 dark:border-zinc-800"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-white mb-4">
                Tudo que você precisa para organizar sua busca
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Ferramentas completas para profissionais que levam a carreira a sério
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature Cards */}
              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 mb-4">
                    <HiOutlineBriefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-zinc-950 dark:text-white">Gestão de Vagas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Registre e acompanhe todas suas candidaturas em um só lugar. 
                    Status, datas, empresas e muito mais.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20 mb-4">
                    <HiOutlineCalendarDays className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-zinc-950 dark:text-white">Agenda de Entrevistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Nunca mais perca uma entrevista. Organize datas, horários 
                    e receba lembretes automáticos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20 mb-4">
                    <HiOutlineChartBarSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-zinc-950 dark:text-white">Relatórios e Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Analise sua performance, taxa de resposta e identifique 
                    oportunidades de melhoria.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20 mb-4">
                    <HiOutlineUsers className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-zinc-950 dark:text-white">Rede de Contatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Mantenha registro de recruiters, referências e conexões 
                    importantes para sua carreira.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/20 mb-4">
                    <HiOutlineBuildingOffice2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-zinc-950 dark:text-white">Base de Empresas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Centralize informações sobre empresas, cultura, salários 
                    e histórico de processos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/20 mb-4">
                    <HiOutlineCheckCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <CardTitle className="text-zinc-950 dark:text-white">Controle Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Acesse seus dados de qualquer lugar, sincronizado 
                    automaticamente na nuvem.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 text-center">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12">
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-white mb-6">
                Pronto para organizar sua carreira?
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de profissionais que já estão usando o Job Tracker 
                para acelerar suas carreiras.
              </p>
              <Link href="/auth/signin/signup">
                <Button size="lg" className="text-lg px-8 py-3 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                  Criar conta gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Theme Toggle Button */}
      <Button
        className="fixed bottom-6 right-6 flex min-h-10 min-w-10 cursor-pointer rounded-full bg-zinc-950 p-0 text-xl text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 z-20"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'light' ? (
          <IoMoon className="h-4 w-4" />
        ) : (
          <IoSunny className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}