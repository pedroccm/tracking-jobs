/*eslint-disable*/
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineBriefcase
} from 'react-icons/hi2';
import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  jobId: string;
}

export default function EditJob(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    workType: '',
    employmentType: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'BRL',
    description: '',
    requirements: '',
    benefits: '',
    jobUrl: '',
    source: '',
    priority: '3',
    status: 'wishlist',
    notes: ''
  });

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

      if (data) {
        // Extract benefits from notes if it exists
        let benefits = '';
        let notes = data.notes || '';
        
        if (notes.includes('Benefícios:')) {
          const parts = notes.split('\n\n');
          const benefitsPart = parts.find(part => part.startsWith('Benefícios:'));
          if (benefitsPart) {
            benefits = benefitsPart.replace('Benefícios: ', '');
            notes = parts.filter(part => !part.startsWith('Benefícios:')).join('\n\n');
          }
        }

        setFormData({
          title: data.title || '',
          company: data.company || '',
          location: data.location || '',
          workType: data.work_type || '',
          employmentType: data.employment_type || '',
          salaryMin: data.salary_min?.toString() || '',
          salaryMax: data.salary_max?.toString() || '',
          currency: data.currency || 'BRL',
          description: data.description || '',
          requirements: data.requirements || '',
          benefits: benefits,
          jobUrl: data.job_url || '',
          source: data.source || '',
          priority: data.priority?.toString() || '3',
          status: data.status || 'wishlist',
          notes: notes
        });
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      alert('Erro ao carregar dados da vaga.');
      router.push('/dashboard/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const supabase = createClient();
      
      // Prepare job data
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location || null,
        work_type: formData.workType || null,
        employment_type: formData.employmentType || null,
        salary_min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salary_max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        currency: formData.currency,
        description: formData.description || null,
        requirements: formData.requirements || null,
        job_url: formData.jobUrl || null,
        source: formData.source || null,
        priority: parseInt(formData.priority),
        status: formData.status,
        notes: [formData.benefits && `Benefícios: ${formData.benefits}`, formData.notes].filter(Boolean).join('\n\n') || null
      };

      // Update job in database
      const { error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', props.jobId);

      if (error) throw error;

      router.push('/dashboard/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Erro ao atualizar a vaga. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        user={props.user}
        userDetails={props.userDetails}
        title="Editando Vaga"
        description="Atualize os dados da vaga de emprego"
      >
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-foreground">Carregando dados da vaga...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Editando Vaga"
      description="Atualize os dados da vaga de emprego"
    >
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 -ml-4"
          >
            <HiOutlineArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Vaga</h1>
            <p className="text-muted-foreground">Atualize os detalhes da oportunidade de emprego</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HiOutlineBriefcase className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Senior React Developer"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input
                    id="company"
                    placeholder="Nome da empresa"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    placeholder="Ex: São Paulo, SP"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="source">Fonte</Label>
                  <Input
                    id="source"
                    placeholder="Ex: LinkedIn, Indeed"
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobUrl">Link da Vaga</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.jobUrl}
                  onChange={(e) => handleInputChange('jobUrl', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Trabalho */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Trabalho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workType">Modalidade</Label>
                  <Select value={formData.workType} onValueChange={(value) => handleInputChange('workType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remoto</SelectItem>
                      <SelectItem value="hybrid">Híbrido</SelectItem>
                      <SelectItem value="onsite">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Tipo de Contrato</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Tempo Integral</SelectItem>
                      <SelectItem value="part-time">Meio Período</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Baixa</SelectItem>
                      <SelectItem value="2">2 - Baixa-Média</SelectItem>
                      <SelectItem value="3">3 - Média</SelectItem>
                      <SelectItem value="4">4 - Alta</SelectItem>
                      <SelectItem value="5">5 - Muito Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salário Mínimo</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="0"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Salário Máximo</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="0"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wishlist">Interesse</SelectItem>
                    <SelectItem value="applied">Aplicado</SelectItem>
                    <SelectItem value="screening">Triagem</SelectItem>
                    <SelectItem value="interview">Entrevista</SelectItem>
                    <SelectItem value="offer">Oferta</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                    <SelectItem value="withdrawn">Retirado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Descrições */}
          <Card>
            <CardHeader>
              <CardTitle>Descrições e Notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Vaga</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva as responsabilidades e detalhes da vaga..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requisitos</Label>
                <Textarea
                  id="requirements"
                  placeholder="Liste os requisitos necessários para a vaga..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefícios</Label>
                <Textarea
                  id="benefits"
                  placeholder="Descreva os benefícios oferecidos..."
                  value={formData.benefits}
                  onChange={(e) => handleInputChange('benefits', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Pessoais</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione suas notas e observações sobre esta vaga..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              <HiOutlineCheck className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Atualizar Vaga'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}