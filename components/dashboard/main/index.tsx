/*eslint-disable*/
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineUsers,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineClock
} from 'react-icons/hi2';
import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  dashboardStats: {
    totalJobs: number;
    activeApplications: number;
    interviews: number;
    offers: number;
    responseRate: number;
  };
  recentJobs: any[];
  upcomingInterviews: any[];
}

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusLabels = {
  applied: 'Aplicado',
  screening: 'Triagem',
  interview: 'Entrevista',
  offer: 'Oferta',
  rejected: 'Rejeitado'
};

export default function DashboardMain(props: Props) {
  const { dashboardStats, recentJobs, upcomingInterviews } = props;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Dashboard"
      description="Visão geral das suas candidaturas e atividades"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas candidaturas e atividades</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Total de Vagas</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalJobs}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <HiOutlineBriefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Aplicações Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeApplications}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <HiOutlineChartBarSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Entrevistas</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.interviews}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <HiOutlineCalendarDays className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Taxa de Resposta</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.responseRate}%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <HiOutlineUsers className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Candidaturas Recentes</CardTitle>
              <Button variant="outline" size="sm">
                <HiOutlineEye className="h-4 w-4 mr-2" />
                Ver Todas
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.length > 0 ? recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{job.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <HiOutlineBuildingOffice2 className="h-4 w-4" />
                        {job.company}
                        <HiOutlineMapPin className="h-4 w-4 ml-2" />
                        {job.location}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Aplicado em {formatDate(job.applied_date)}
                      </p>
                    </div>
                    <Badge className={`${statusColors[job.status as keyof typeof statusColors]} ml-4`}>
                      {statusLabels[job.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                )) : (
                  <div className="text-center py-6">
                    <HiOutlineBriefcase className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Nenhuma candidatura recente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Próximas Entrevistas</CardTitle>
              <Button variant="outline" size="sm">
                <HiOutlineCalendarDays className="h-4 w-4 mr-2" />
                Calendário
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center p-3 rounded-lg border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 mr-3">
                        <HiOutlineCalendarDays className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{interview.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <HiOutlineBuildingOffice2 className="h-4 w-4" />
                          {interview.company}
                        </div>
                        {interview.interview_date && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <HiOutlineClock className="h-3 w-3" />
                            {formatDate(interview.interview_date)}
                            {interview.interview_time && ` às ${interview.interview_time}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <HiOutlineCalendarDays className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Nenhuma entrevista agendada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button className="h-16 justify-start gap-3" variant="outline">
              <HiOutlinePlus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Adicionar Vaga</div>
                <div className="text-xs text-gray-500">Registrar nova oportunidade</div>
              </div>
            </Button>
            
            <Button className="h-16 justify-start gap-3" variant="outline">
              <HiOutlineCalendarDays className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Agendar Entrevista</div>
                <div className="text-xs text-gray-500">Marcar nova entrevista</div>
              </div>
            </Button>
            
            <Button className="h-16 justify-start gap-3" variant="outline">
              <HiOutlineChartBarSquare className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Ver Relatórios</div>
                <div className="text-xs text-gray-500">Analisar performance</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
