export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'course' | 'material' | 'mentorship' | 'subscription';
  type: 'digital' | 'physical' | 'service';
  status: 'active' | 'inactive' | 'draft';
  imageUrl?: string;
  features: string[];
  duration?: string; // Para cursos e mentorias
  format?: string; // Online, presencial, híbrido
  level?: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  stock?: number; // Para produtos físicos
  maxStudents?: number; // Para cursos
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  discountPercentage?: number;
  originalPrice?: number;
}

// Mock data
let products: Product[] = [
  {
    id: '1',
    name: 'Curso Intensivo de Emergências Médicas',
    description: 'Domine os protocolos de emergência com casos práticos e simulações realistas.',
    price: 1890.00,
    originalPrice: 2500.00,
    discountPercentage: 25,
    category: 'course',
    type: 'digital',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    features: [
      '40 horas de conteúdo',
      'Certificado reconhecido',
      'Casos práticos reais',
      'Suporte por 6 meses',
      'Material complementar'
    ],
    duration: '3 meses',
    format: 'Online ao vivo',
    level: 'intermediate',
    instructor: 'Dr. Carlos Silva',
    maxStudents: 30,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    tags: ['emergência', 'UTI', 'protocolos', 'prática']
  },
  {
    id: '2',
    name: 'Mentoria Individual em Cardiologia',
    description: 'Acompanhamento personalizado com especialista em cardiologia clínica.',
    price: 3500.00,
    category: 'mentorship',
    type: 'service',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800',
    features: [
      '12 sessões individuais',
      'Plano de estudos personalizado',
      'Revisão de casos clínicos',
      'Preparação para provas',
      'Networking exclusivo'
    ],
    duration: '6 meses',
    format: 'Online',
    level: 'advanced',
    instructor: 'Dra. Maria Santos',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-20T11:00:00Z',
    tags: ['cardiologia', 'mentoria', 'personalizado']
  },
  {
    id: '3',
    name: 'Manual de Procedimentos Cirúrgicos',
    description: 'Guia completo e ilustrado de técnicas cirúrgicas fundamentais.',
    price: 189.90,
    originalPrice: 250.00,
    discountPercentage: 24,
    category: 'material',
    type: 'digital',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
    features: [
      'PDF de alta qualidade',
      'Mais de 500 páginas',
      'Ilustrações detalhadas',
      'Atualizações gratuitas',
      'Acesso vitalício'
    ],
    createdAt: '2023-12-15T08:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
    tags: ['cirurgia', 'manual', 'referência']
  },
  {
    id: '4',
    name: 'Assinatura Premium - Acesso Total',
    description: 'Acesso ilimitado a todos os cursos e materiais da plataforma.',
    price: 199.90,
    category: 'subscription',
    type: 'service',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    features: [
      'Acesso a todos os cursos',
      'Materiais exclusivos',
      'Lives semanais',
      'Certificados ilimitados',
      'Suporte prioritário',
      'Comunidade VIP'
    ],
    duration: 'Mensal',
    format: 'Online',
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
    tags: ['assinatura', 'premium', 'acesso total']
  },
  {
    id: '5',
    name: 'Workshop de Suturas Avançadas',
    description: 'Treinamento prático presencial com técnicas avançadas de sutura.',
    price: 890.00,
    category: 'course',
    type: 'service',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800',
    features: [
      '16 horas práticas',
      'Material incluso',
      'Turma reduzida',
      'Certificado',
      'Coffee break'
    ],
    duration: '2 dias',
    format: 'Presencial',
    level: 'intermediate',
    instructor: 'Dr. Roberto Almeida',
    maxStudents: 12,
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z',
    tags: ['workshop', 'prático', 'suturas', 'presencial']
  },
  {
    id: '6',
    name: 'Kit de Estudos para Residência',
    description: 'Material completo para preparação para provas de residência médica.',
    price: 459.90,
    originalPrice: 600.00,
    discountPercentage: 23,
    category: 'material',
    type: 'physical',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
    features: [
      '5 livros físicos',
      'Acesso digital',
      '2000 questões',
      'Simulados online',
      'Frete grátis'
    ],
    stock: 50,
    createdAt: '2023-12-20T11:00:00Z',
    updatedAt: '2024-01-18T15:00:00Z',
    tags: ['residência', 'preparação', 'kit', 'estudos']
  }
];

// Service functions
export const productService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...products];
  },

  // Get product by ID
  async getById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const product = products.find(p => p.id === id);
    return product || null;
  },

  // Create new product
  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    return newProduct;
  },

  // Update product
  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return products[index];
  },

  // Delete product
  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    return true;
  },

  // Search products
  async search(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Get products by category
  async getByCategory(category: Product['category']): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return products.filter(p => p.category === category);
  },

  // Get featured products
  async getFeatured(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return products.filter(p => p.status === 'active' && p.discountPercentage).slice(0, 4);
  }
};