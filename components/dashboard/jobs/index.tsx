/*eslint-disable*/
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineFilter,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineBriefcase
} from 'react-icons/hi2';
import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

// Mock data - será substituído por dados reais do Supabase
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'São Paulo, SP',
    workType: 'remote',
    employmentType: 'full-time',
    status: 'applied',
    appliedDate: '2024-01-15',
    salaryMin: 8000,
    salaryMax: 12000,
    currency: 'BRL',
    priority: 5,
    source: 'LinkedIn'
  },
  {
    id: '2',
    title: 'React Developer',
    company: 'StartupXYZ',
    location: 'Rio de Janeiro, RJ',
    workType: 'hybrid',
    employmentType: 'full-time',
    status: 'interview',
    appliedDate: '2024-01-10',
    salaryMin: 6000,
    salaryMax: 9000,
    currency: 'BRL',
    priority: 4,
    source: 'Indeed'
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Digital Agency',
    location: 'Belo Horizonte, MG',
    workType: 'onsite',
    employmentType: 'contract',
    status: 'wishlist',
    appliedDate: null,
    salaryMin: 5000,
    salaryMax: 8000,
    currency: 'BRL',
    priority: 3,
    source: 'Site da empresa'
  }
];

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

export default function Jobs(props: Props) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesWorkType = workTypeFilter === 'all' || job.work_type === workTypeFilter;
    
    return matchesSearch && matchesStatus && matchesWorkType;
  });

  const formatSalary = (min: number, max: number, currency: string) => {
    if (currency === 'BRL') {
      return `R$ ${min.toLocaleString()} - R$ ${max.toLocaleString()}`;
    }
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status: newStatus,
          applied_date: newStatus === 'applied' ? new Date().toISOString().split('T')[0] : null
        })
        .eq('id', jobId);

      if (error) throw error;

      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId 
          ? { ...job, status: newStatus, applied_date: newStatus === 'applied' ? new Date().toISOString().split('T')[0] : job.applied_date }
          : job
      ));
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Erro ao atualizar status da vaga.');
    }
  };

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Jobs"
      description="Gerencie suas candidaturas e acompanhe o progresso"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
              <p className="text-muted-foreground">Gerencie suas candidaturas e acompanhe o progresso</p>
            </div>
            <Link href="/dashboard/jobs/add">
              <Button className="flex items-center gap-2">
                <HiOutlinePlus className="h-4 w-4" />
                Nova Vaga
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por vaga ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="wishlist">Interesse</SelectItem>
              <SelectItem value="applied">Aplicado</SelectItem>
              <SelectItem value="interview">Entrevista</SelectItem>
              <SelectItem value="offer">Oferta</SelectItem>
              <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={workTypeFilter} onValueChange={setWorkTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas modalidades</SelectItem>
              <SelectItem value="remote">Remoto</SelectItem>
              <SelectItem value="hybrid">Híbrido</SelectItem>
              <SelectItem value="onsite">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="p-4">
            <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
            <div className="text-sm text-foreground">Total de Vagas</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter(j => j.status === 'applied').length}
            </div>
            <div className="text-sm text-foreground">Aplicações</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {jobs.filter(j => j.status === 'interview').length}
            </div>
            <div className="text-sm text-foreground">Entrevistas</div>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {jobs.filter(j => j.status === 'offer').length}
            </div>
            <div className="text-sm text-foreground">Ofertas</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-foreground">Carregando vagas...</div>
            </div>
          ) : filteredJobs.map((job) => (
            <div key={job.id} className="p-6 border-b border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                        <Badge className={`${priorityColors[job.priority as keyof typeof priorityColors]} text-xs`}>
                          P{job.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <HiOutlineBuildingOffice2 className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlineMapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        {(job.salary_min || job.salary_max) && (
                          <div className="flex items-center gap-1">
                            <HiOutlineCurrencyDollar className="h-4 w-4" />
                            {formatSalary(job.salary_min, job.salary_max, job.currency)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {job.work_type && (
                          <Badge variant="outline" className="text-xs">
                            {job.work_type === 'remote' ? 'Remoto' : 
                             job.work_type === 'hybrid' ? 'Híbrido' : 'Presencial'}
                          </Badge>
                        )}
                        {job.employment_type && (
                          <Badge variant="outline" className="text-xs">
                            {job.employment_type === 'full-time' ? 'Tempo Integral' : 
                             job.employment_type === 'part-time' ? 'Meio Período' : 
                             job.employment_type === 'contract' ? 'Contrato' : 'Freelance'}
                          </Badge>
                        )}
                        {job.source && (
                          <Badge variant="outline" className="text-xs">
                            {job.source}
                          </Badge>
                        )}
                      </div>

                      {job.applied_date && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <HiOutlineCalendarDays className="h-4 w-4" />
                          Aplicado em {formatDate(job.applied_date)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-2">
                    <Select 
                      value={job.status} 
                      onValueChange={(value) => updateJobStatus(job.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue>
                          <Badge className={`${statusColors[job.status as keyof typeof statusColors]} text-xs`}>
                            {statusLabels[job.status as keyof typeof statusLabels]}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wishlist">Interesse</SelectItem>
                        <SelectItem value="applied">Aplicado</SelectItem>
                        <SelectItem value="screening">Triagem</SelectItem>
                        <SelectItem value="interview">Entrevista</SelectItem>
                        <SelectItem value="technical">Técnica</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="offer">Oferta</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="withdrawn">Retirado</SelectItem>
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        <HiOutlineEye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/jobs/${job.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <HiOutlinePencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <HiOutlineTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <HiOutlineBriefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhuma vaga encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comece adicionando uma nova vaga de emprego.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/jobs/add">
                <Button>
                  <HiOutlinePlus className="h-4 w-4 mr-2" />
                  Nova Vaga
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}