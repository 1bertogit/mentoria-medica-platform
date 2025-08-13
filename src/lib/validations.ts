import { z } from 'zod';

// Auth Schemas
export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const signUpSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
  specialty: z.string().min(1, 'Especialidade é obrigatória'),
  crm: z.string().regex(/^\d{4,6}$/, 'CRM deve conter entre 4 e 6 dígitos'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

// Case Schemas
export const caseSchema = z.object({
  title: z.string()
    .min(10, 'Título deve ter no mínimo 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z.string()
    .min(100, 'Descrição deve ter no mínimo 100 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres'),
  category: z.enum(['rinoplastia', 'mamoplastia', 'abdominoplastia', 'lipoaspiração', 'outros']),
  patientAge: z.number()
    .min(18, 'Idade mínima é 18 anos')
    .max(100, 'Idade máxima é 100 anos'),
  surgeryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  complications: z.string().optional(),
  results: z.string().min(50, 'Resultados devem ter no mínimo 50 caracteres'),
  images: z.array(z.string().url()).optional(),
});

// Comment Schema
export const commentSchema = z.object({
  content: z.string()
    .min(3, 'Comentário deve ter no mínimo 3 caracteres')
    .max(1000, 'Comentário deve ter no máximo 1000 caracteres'),
});

// Discussion Schemas
export const discussionSchema = z.object({
  title: z.string()
    .min(10, 'Título deve ter no mínimo 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  category: z.enum(['técnicas', 'complicações', 'discussão', 'dúvidas', 'anúncios']),
  content: z.string()
    .min(30, 'Conteúdo deve ter no mínimo 30 caracteres')
    .max(10000, 'Conteúdo deve ter no máximo 10000 caracteres'),
  tags: z.array(z.string()).min(1, 'Adicione pelo menos uma tag').max(5, 'Máximo de 5 tags'),
});

// Article Schema
export const articleSchema = z.object({
  title: z.string()
    .min(10, 'Título deve ter no mínimo 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  abstract: z.string()
    .min(100, 'Resumo deve ter no mínimo 100 caracteres')
    .max(500, 'Resumo deve ter no máximo 500 caracteres'),
  content: z.string()
    .min(500, 'Conteúdo deve ter no mínimo 500 caracteres'),
  category: z.enum(['pesquisa', 'revisão', 'caso-clínico', 'técnica', 'opinião']),
  authors: z.array(z.string()).min(1, 'Adicione pelo menos um autor'),
  references: z.array(z.string()).optional(),
  keywords: z.array(z.string()).min(3, 'Adicione pelo menos 3 palavras-chave').max(10, 'Máximo de 10 palavras-chave'),
});

// Profile Schema
export const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  specialty: z.string().min(1, 'Especialidade é obrigatória'),
  crm: z.string().regex(/^\d{4,6}$/, 'CRM deve conter entre 4 e 6 dígitos'),
  bio: z.string().max(500, 'Bio deve ter no máximo 500 caracteres').optional(),
  phone: z.string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX')
    .optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  }).optional(),
});

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Assunto deve ter no mínimo 5 caracteres'),
  message: z.string()
    .min(20, 'Mensagem deve ter no mínimo 20 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().min(2, 'Busca deve ter no mínimo 2 caracteres'),
  category: z.enum(['all', 'cases', 'articles', 'discussions', 'users']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'popularity']).optional(),
});

// Export types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type CaseFormData = z.infer<typeof caseSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type DiscussionFormData = z.infer<typeof discussionSchema>;
export type ArticleFormData = z.infer<typeof articleSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;