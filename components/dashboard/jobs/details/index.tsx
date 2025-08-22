/*eslint-disable*/
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineDocument,
  HiOutlineEye
} from 'react-icons/hi2';
import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  jobId: string;
}

const statusColors = {
  wishlist: 'bg-gray-100 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  technical: 'bg-orange-100 text-orange-800',
  final: 'bg-indigo-100 text-indigo-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
  archived: 'bg-gray-100 text-gray-600'
};

const statusLabels = {
  wishlist: 'Interesse',
  applied: 'Aplicado',
  screening: 'Triagem',
  interview: 'Entrevista',
  technical: 'Técnica',
  final: 'Final',
  offer: 'Oferta',
  rejected: 'Rejeitado',
  withdrawn: 'Retirado',
  archived: 'Arquivado'
};

const priorityColors = {
  1: 'bg-gray-100 text-gray-600',
  2: 'bg-blue-100 text-blue-600',
  3: 'bg-yellow-100 text-yellow-600',
  4: 'bg-orange-100 text-orange-600',
  5: 'bg-red-100 text-red-600'
};

export default function JobDetails(props: Props) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchJob();
  }, [props.jobId]);

  const fetchJob = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', props.jobId)
        .single();

      if (error) throw error;
      
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return 'Não informado';
    if (currency === 'BRL') {
      return `R$ ${min?.toLocaleString()} - R$ ${max?.toLocaleString()}`;
    }
    return `${currency} ${min?.toLocaleString()} - ${max?.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const deleteJob = async () => {
    if (!confirm('Tem certeza que deseja excluir esta vaga?')) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', props.jobId);

      if (error) throw error;

      router.push('/dashboard/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Erro ao excluir vaga.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        user={props.user}
        userDetails={props.userDetails}
        title="Carregando..."
        description="Carregando detalhes da vaga"
      >
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-foreground">Carregando vaga...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout
        user={props.user}
        userDetails={props.userDetails}
        title="Vaga não encontrada"
        description="A vaga solicitada não foi encontrada"
      >
        <div className="p-6">
          <div className="text-center py-12">
            <HiOutlineBriefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">Vaga não encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              A vaga que você está procurando não existe ou foi removida.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/jobs">
                <Button>
                  Voltar para Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title={job.title}
      description={`Detalhes da vaga na ${job.company}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard/jobs" className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
                ← Voltar para Jobs
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <Badge className={`${statusColors[job.status as keyof typeof statusColors]}`}>
                  {statusLabels[job.status as keyof typeof statusLabels]}
                </Badge>
                <Badge className={`${priorityColors[job.priority as keyof typeof priorityColors]} text-xs`}>
                  Prioridade {job.priority}
                </Badge>
              </div>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/jobs/${job.id}/edit`}>
                <Button>
                  <HiOutlinePencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button variant="destructive" onClick={deleteJob}>
                <HiOutlineTrash className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <HiOutlineBuildingOffice2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Empresa:</span>
                  <span>{job.company}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <HiOutlineMapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Localização:</span>
                  <span>{job.location || 'Não informado'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlineCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Salário:</span>
                  <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlineBriefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Modalidade:</span>
                  <span>
                    {job.work_type === 'remote' ? 'Remoto' : 
                     job.work_type === 'hybrid' ? 'Híbrido' : 
                     job.work_type === 'onsite' ? 'Presencial' : 'Não informado'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <HiOutlineCalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tipo de Contrato:</span>
                  <span>
                    {job.employment_type === 'full-time' ? 'Tempo Integral' : 
                     job.employment_type === 'part-time' ? 'Meio Período' : 
                     job.employment_type === 'contract' ? 'Contrato' : 
                     job.employment_type === 'freelance' ? 'Freelance' : 'Não informado'}
                  </span>
                </div>

                {job.url && (
                  <div className="flex items-center gap-2">
                    <HiOutlineGlobeAlt className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">URL:</span>
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver vaga original
                      <HiOutlineEye className="inline h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {job.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {job.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{job.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-foreground">Adicionada</div>
                  <div className="text-muted-foreground">{formatDate(job.created_at)}</div>
                </div>
                
                {job.applied_date && (
                  <div className="text-sm">
                    <div className="font-medium text-foreground">Aplicação</div>
                    <div className="text-muted-foreground">{formatDate(job.applied_date)}</div>
                  </div>
                )}

                {job.interview_date && (
                  <div className="text-sm">
                    <div className="font-medium text-foreground">Entrevista</div>
                    <div className="text-muted-foreground">{formatDate(job.interview_date)}</div>
                  </div>
                )}

                <div className="text-sm">
                  <div className="font-medium text-foreground">Última atualização</div>
                  <div className="text-muted-foreground">{formatDate(job.updated_at)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Source */}
            {job.source && (
              <Card>
                <CardHeader>
                  <CardTitle>Fonte</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{job.source}</Badge>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            {(job.contact_name || job.contact_email || job.contact_phone) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {job.contact_name && (
                    <div className="text-sm">
                      <div className="font-medium">Nome</div>
                      <div className="text-muted-foreground">{job.contact_name}</div>
                    </div>
                  )}
                  {job.contact_email && (
                    <div className="text-sm">
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">{job.contact_email}</div>
                    </div>
                  )}
                  {job.contact_phone && (
                    <div className="text-sm">
                      <div className="font-medium">Telefone</div>
                      <div className="text-muted-foreground">{job.contact_phone}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
