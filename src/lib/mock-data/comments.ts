export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    specialty?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: Comment[];
  parentId?: string;
  isEdited?: boolean;
  resourceType: 'case' | 'article' | 'course' | 'archive';
  resourceId: string;
}

export interface Discussion {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    specialty?: string;
  };
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  views: number;
  replies: number;
  likes: number;
  isSticky?: boolean;
  isClosed?: boolean;
  lastActivity: {
    user: string;
    timestamp: string;
  };
}

// Mock users for comments
export const mockUsers = [
  {
    id: '1',
    name: 'Dr. Ana Silva',
    avatar: '/avatars/ana-silva.jpg',
    title: 'Cirurgiã Plástica',
    specialty: 'Rinoplastia'
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    avatar: '/avatars/carlos-mendes.jpg', 
    title: 'Dermatologista',
    specialty: 'Dermatologia Estética'
  },
  {
    id: '3',
    name: 'Dr. Marina Costa',
    avatar: '/avatars/marina-costa.jpg',
    title: 'Cirurgiã Plástica',
    specialty: 'Mamoplastia'
  },
  {
    id: '4',
    name: 'Dr. Roberto Lima',
    avatar: '/avatars/roberto-lima.jpg',
    title: 'Cirurgião Plástico',
    specialty: 'Lifting Facial'
  },
  {
    id: '5',
    name: 'Dr. Juliana Santos',
    avatar: '/avatars/juliana-santos.jpg',
    title: 'Medicina Estética',
    specialty: 'Preenchimentos'
  }
];

// Mock comments for various resources
export const mockComments: Comment[] = [
  // Comments for case "advanced-rhinoplasty-001"
  {
    id: 'comment-1',
    author: mockUsers[0],
    content: 'Excelente caso! A abordagem cirúrgica foi muito bem planejada. Gostei especialmente da técnica utilizada para correção da giba nasal. Você considerou alguma abordagem alternativa para o refinamento da ponta?',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 12,
    replies: [
      {
        id: 'reply-1',
        author: mockUsers[1],
        content: 'Concordo com a Dr. Ana. Também gostaria de saber mais sobre a escolha dos enxertos utilizados. Foram autólogos ou sintéticos?',
        createdAt: '2024-01-15T14:20:00Z',
        likes: 5,
        replies: [],
        parentId: 'comment-1',
        resourceType: 'case',
        resourceId: 'advanced-rhinoplasty-001'
      }
    ],
    resourceType: 'case',
    resourceId: 'advanced-rhinoplasty-001'
  },
  {
    id: 'comment-2',
    author: mockUsers[2],
    content: 'Muito interessante a evolução pós-operatória. Quanto tempo de seguimento vocês têm deste caso? Houve alguma intercorrência no período de cicatrização?',
    createdAt: '2024-01-16T09:15:00Z',
    likes: 8,
    replies: [],
    resourceType: 'case',
    resourceId: 'advanced-rhinoplasty-001'
  },

  // Comments for article 1
  {
    id: 'comment-3',
    author: mockUsers[3],
    content: 'Artigo muito bem fundamentado! As referências são atuais e a metodologia está bem clara. Seria interessante ver uma análise comparativa com outras técnicas descritas na literatura.',
    createdAt: '2024-01-10T16:45:00Z',
    likes: 15,
    replies: [
      {
        id: 'reply-2',
        author: mockUsers[4],
        content: 'Excelente sugestão, Dr. Roberto. Uma meta-análise seria muito valiosa para consolidar essas informações.',
        createdAt: '2024-01-11T08:30:00Z',
        likes: 3,
        replies: [],
        parentId: 'comment-3',
        resourceType: 'article',
        resourceId: '1'
      }
    ],
    resourceType: 'article',
    resourceId: '1'
  },

  // Comments for course "advanced-rhinoplasty"
  {
    id: 'comment-4',
    author: mockUsers[0],
    content: 'O curso está excepcional! As demonstrações práticas são muito didáticas. Gostaria de saber se haverá um módulo específico sobre complicações e como preveni-las.',
    createdAt: '2024-01-12T11:20:00Z',
    likes: 20,
    replies: [
      {
        id: 'reply-3',
        author: mockUsers[2],
        content: 'Também estou ansiosa por esse módulo. As complicações são sempre um tema crucial na formação.',
        createdAt: '2024-01-12T15:10:00Z',
        likes: 7,
        replies: [],
        parentId: 'comment-4',
        resourceType: 'course',
        resourceId: 'advanced-rhinoplasty'
      }
    ],
    resourceType: 'course',
    resourceId: 'advanced-rhinoplasty'
  }
];

// Mock discussions
export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Caso Teka Brandão - Individualização da Técnica Cirúrgica',
    description: `## Caso Clínico Detalhado

### Paciente
- **Nome:** Teka Brandão (esposa e secretária do curso)
- **Perfil:** Paciente com múltiplos procedimentos prévios

### Histórico Cirúrgico
- Blefaroplastia transconjuntival inferior há 20 anos
- Tratamento do platisma e plicatura do digástrico pelo acesso submento há 4 anos

### Queixas Principais
- Pele no pescoço, sulco labiomentoniano, sulco palpebral superior alto

### Cirurgia Realizada
- **Frontoplastia lateral** (apenas região temporal)
- **Blefaroplastia superior** (apenas pele)
- **Blefaroplastia inferior** (touch)
- **Descolamento cervical, plicatura tipo Baker**
- **Crevassi lateral, plicatura do platisma + platismotomia**

### Evolução
48 horas pós-operatório - Evolução satisfatória

### Observação Importante
Este caso foi usado para demonstrar a **individualização da técnica** cirúrgica. "Cada paciente é único e devemos sempre individualizar a estratégia de tratamento baseado nas expectativas de resultado da paciente".`,
    author: {
      id: 'roberio',
      name: 'Dr. Robério Brandão',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    category: 'Cirurgia Facial',
    tags: ['individualização', 'frontoplastia', 'blefaroplastia', 'platisma'],
    views: 234,
    replies: 15,
    likes: 32,
    isSticky: true,
    lastActivity: {
      user: 'Dr. Carlos Mendes',
      timestamp: '2024-01-20T16:30:00Z'
    }
  },
  {
    id: '2',
    title: 'Deep Neck em Paciente Septuagenária - Técnica Simplificada',
    description: `## Caso Clínico - Técnica Simplificada

### Paciente
- **Idade:** 74 anos
- **Histórico:** Lifting de Face há 5 anos
- **Queixas:** Apenas excesso de pele no pescoço, desejo de procedimento simples

### Procedimento Realizado
- **Descolamento apenas periauricular**
- **Crevassi**
- **Ponto de prolene 2.0** de uma mastoide a outra usando agulha de Casagrande

### Técnica Específica
- **Entrada:** Pequena incisão no ângulo cervical
- **Estratégia:** Mesmo orifício do Crevassi para embutir o nó do prolene
- **Resultado:** "Simples e eficaz"

### Filosofia do Tratamento
Este caso demonstra que nem sempre precisamos de técnicas complexas. Às vezes, a simplicidade é a chave para um resultado satisfatório e seguro.`,
    author: {
      id: 'roberio',
      name: 'Dr. Robério Brandão',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-05T14:20:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    category: 'Cirurgia Facial',
    tags: ['deep neck', 'septuagenária', 'técnica simples', 'crevassi'],
    views: 189,
    replies: 8,
    likes: 18,
    lastActivity: {
      user: 'Dr. Marina Costa',
      timestamp: '2024-01-18T09:15:00Z'
    }
  },
  {
    id: '3',
    title: 'Protocolo Pós-Operatório Padronizado - Cirurgia Facial',
    description: `## Protocolo Pós-Operatório Padronizado

### Medicações
- **Antibiótico:** Cefadroxila 7 dias
- **Anti-inflamatório:** Nimesulida 5 dias
- **Corticoide:** Predsim 20mg 5 dias
- **Hemostático:** Transamin 500mg, 2 comprimidos 8/8h por 2 dias
- **Retirada de pontos:** 7 a 10 dias

### Solução de Infiltração
- 300ml Soro fisiológico
- 20ml Lidocaína
- 20ml Bupivacaína
- 1ml Adrenalina
- 5ml Bicarbonato

### Fios Cirúrgicos
- **Vicryl 2.0:** têmpora, terço médio (plicatura) e platisma medial
- **Nylon 2.0:** ponto do endomidface
- **Nylon 3.0:** ponto do crevassi

### Estatísticas de Técnicas (Dr. Robério)
- **Endomidface:** 100% dos casos
- **Plicatura:** 75% dos casos
- **Deep plane:** 25% dos casos`,
    author: {
      id: 'roberio',
      name: 'Dr. Robério Brandão',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-19T14:45:00Z',
    category: 'Protocolos',
    tags: ['protocolo', 'pós-operatório', 'medicações', 'infiltração'],
    views: 156,
    replies: 22,
    likes: 45,
    lastActivity: {
      user: 'Dr. Roberto Lima',
      timestamp: '2024-01-19T14:45:00Z'
    }
  },
  {
    id: '4',
    title: 'Complicações em Deep Neck - Manejo e Prevenção',
    description: `## Caso de Complicação - Deep Neck

### Contexto
- **Médica:** Dra. Deyse Oliveira
- **Procedimento:** Deep neck em 2 pacientes
- **Complicação:** Abaulamento lateral no local da glândula (18 dias pós-operatório)

### Diagnóstico Diferencial
Necessária diferenciação entre:
- **Fibrose pós-operatória**
- **Glândula salivar alterada**

### Conduta Proposta
1. **Ultrassom** para diferenciação entre fibrose e glândula
2. **Radiofrequência tópica** se confirmada fibrose
3. **Acompanhamento clínico** evolutivo

### Discussão
Este caso ilustra a importância do acompanhamento pós-operatório prolongado e da abordagem sistemática das complicações.`,
    author: {
      id: 'deyse',
      name: 'Dra. Deyse Oliveira',
      title: 'Cirurgiã Plástica',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-10T08:45:00Z',
    updatedAt: '2024-01-17T13:20:00Z',
    category: 'Complicações',
    tags: ['deep neck', 'complicações', 'abaulamento', 'manejo'],
    views: 298,
    replies: 12,
    likes: 28,
    lastActivity: {
      user: 'Dr. Juliana Santos',
      timestamp: '2024-01-17T13:20:00Z'
    }
  },
  {
    id: '5',
    title: 'Endomidface - Estatísticas e Resultados (100% dos casos)',
    description: `## Análise Estatística das Técnicas

### Estatísticas do Dr. Robério Brandão
- **Endomidface:** 100% dos casos
- **Plicatura:** 75% dos casos  
- **Deep plane:** 25% dos casos

### Filosofia da Técnica Endomidface
A técnica de endomidface é utilizada em 100% dos casos pelo Dr. Robério, demonstrando sua eficácia e versatilidade para diferentes perfis de pacientes.

### Indicações por Faixa Etária
#### Pacientes Jovens (41 anos)
- **Perfil:** Jovem com medo de cicatrizes
- **Procedimento:** Frontoplastia + Endomidface + Deep neck pelo submento

#### Pacientes Idosos (75 anos)
- **Observação:** "Não tenham receio de retirar pele de pacientes com mais de 60 anos"
- **Procedimento extenso:** Frontoplastia + Endomidface + plicatura + Deep neck`,
    author: {
      id: 'roberio',
      name: 'Dr. Robério Brandão',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-12T16:10:00Z',
    updatedAt: '2024-01-16T10:30:00Z',
    category: 'Técnicas',
    tags: ['endomidface', 'estatísticas', 'plicatura', 'deep plane'],
    views: 445,
    replies: 18,
    likes: 35,
    lastActivity: {
      user: 'Dr. Ana Silva',
      timestamp: '2024-01-16T10:30:00Z'
    }
  },
  {
    id: '6',
    title: 'Primeiro Deep Neck - Experiência do Dr. Renato Mello',
    description: `## Experiência de Aprendizado - Primeiro Deep Neck

### Contexto
- **Médico:** Dr. Renato Mello
- **Procedimento:** Primeiro Deep Neck realizado
- **Contexto:** Curso de cirurgia facial com Dr. Robério Brandão

### Dificuldades Encontradas
1. **Identificação do hioide** - Localização anatômica desafiadora
2. **Localização do digástrico** - Anatomia variável entre pacientes

### Conduta Conservadora
- **Decisão:** Não realizou liberação da fáscia profunda
- **Motivo:** Precaução devido à inexperiência
- **Resultado:** Abordagem segura para iniciantes

### Lições Aprendidas
Este relato ilustra a importância da curva de aprendizado em cirurgia facial e a necessidade de abordagem progressiva e segura.`,
    author: {
      id: 'renato',
      name: 'Dr. Renato Mello',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-14T11:30:00Z',
    updatedAt: '2024-01-19T14:20:00Z',
    category: 'Experiências',
    tags: ['primeiro caso', 'aprendizado', 'deep neck', 'experiência'],
    views: 567,
    replies: 7,
    likes: 15,
    lastActivity: {
      user: 'Dr. Pedro Almeida',
      timestamp: '2024-01-19T14:20:00Z'
    }
  },
  {
    id: '7',
    title: 'Solução de Infiltração - Protocolo Otimizado',
    description: `## Protocolo de Infiltração Otimizado

### Composição da Solução
- **300ml** Soro fisiológico (base)
- **20ml** Lidocaína (anestesia local)
- **20ml** Bupivacaína (anestesia prolongada)
- **1ml** Adrenalina (vasoconstrição)
- **5ml** Bicarbonato (neutralização do pH)

### Vantagens desta Formulação
1. **Anestesia eficaz:** Combinação lidocaína + bupivacaína
2. **Vasoconstrição controlada:** Adrenalina para hemostasia
3. **Conforto do paciente:** pH balanceado com bicarbonato
4. **Duração adequada:** Cobertura anestésica para todo o procedimento

### Considerações de Segurança
- Dosagem máxima de anestésicos respeitada
- Aspiração prévia para evitar injeção intravascular
- Monitorização contínua durante a infiltração`,
    author: {
      id: 'roberio',
      name: 'Dr. Robério Brandão',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-21T11:45:00Z',
    category: 'Protocolos',
    tags: ['infiltração', 'anestesia', 'protocolo', 'segurança'],
    views: 312,
    replies: 14,
    likes: 22,
    lastActivity: {
      user: 'Dr. Marina Santos',
      timestamp: '2024-01-21T11:45:00Z'
    }
  },
  {
    id: '8',
    title: 'Pacientes Jovens vs Idosos - Abordagem Diferenciada',
    description: `## Filosofia de Tratamento por Faixa Etária

### Pacientes Idosos (>60 anos)
**Filosofia:** "Não tenham receio de retirar pele de pacientes com mais de 60 anos"

#### Exemplo: Paciente de 75 anos
- **Histórico:** Lifting de Face total há 15 anos
- **Abordagem:** Procedimento extenso e resolutivo
- **Justificativa:** Maior tolerância e necessidade de correção significativa

### Pacientes Jovens
#### Exemplo: Paciente de 41 anos
- **Perfil:** Jovem com medo de cicatrizes
- **Abordagem:** Técnicas minimamente invasivas
- **Foco:** Preservação e prevenção

### Princípio da Individualização
"Cada paciente é único e devemos sempre individualizar a estratégia de tratamento baseado nas expectativas de resultado da paciente"`,
    author: {
      id: 'roberio',
      name: 'Dr. Robério Brandão',
      title: 'Cirurgião Plástico',
      specialty: 'Cirurgia Facial'
    },
    createdAt: '2024-01-13T15:40:00Z',
    updatedAt: '2024-01-20T08:30:00Z',
    category: 'Técnicas',
    tags: ['faixa etária', 'individualização', 'abordagem', 'filosofia'],
    views: 423,
    replies: 25,
    likes: 40,
    lastActivity: {
      user: 'Dr. Roberto Lima',
      timestamp: '2024-01-20T08:30:00Z'
    }
  },
  {
    id: 'discussion-9',
    title: 'Uso de laser CO2 fracionado: Indicações e cuidados',
    description: 'Compartilhem suas experiências com laser CO2 fracionado. Quais são os melhores protocolos?',
    author: mockUsers[0],
    createdAt: '2024-01-15T10:20:00Z',
    updatedAt: '2024-01-18T16:15:00Z',
    category: 'Dermatologia',
    tags: ['laser', 'CO2', 'rejuvenescimento'],
    views: 289,
    replies: 19,
    likes: 54,
    lastActivity: {
      user: 'Dr. Ana Silva',
      timestamp: '2024-01-18T16:15:00Z'
    }
  },
  {
    id: 'discussion-10',
    title: 'Nova regulamentação ANVISA para preenchedores',
    description: 'Discussão sobre as mudanças recentes na regulamentação da ANVISA para preenchedores dérmicos.',
    author: mockUsers[4],
    createdAt: '2024-01-11T13:50:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
    category: 'Regulamentação',
    tags: ['ANVISA', 'regulamentação', 'preenchedores'],
    views: 678,
    replies: 52,
    likes: 145,
    isSticky: true,
    lastActivity: {
      user: 'Dr. Carlos Mendes',
      timestamp: '2024-01-22T09:00:00Z'
    }
  },
  {
    id: 'discussion-11',
    title: 'Técnicas de sutura em peles finas: Dicas práticas',
    description: 'Como vocês lidam com suturas em peles muito finas? Compartilhem suas técnicas favoritas.',
    author: mockUsers[2],
    createdAt: '2024-01-09T14:30:00Z',
    updatedAt: '2024-01-17T10:20:00Z',
    category: 'Técnicas',
    tags: ['sutura', 'técnica', 'pele fina'],
    views: 356,
    replies: 23,
    likes: 71,
    lastActivity: {
      user: 'Dr. Juliana Santos',
      timestamp: '2024-01-17T10:20:00Z'
    }
  },
  {
    id: 'discussion-12',
    title: 'Comparativo: Equipamentos de radiofrequência',
    description: 'Análise comparativa dos principais equipamentos de radiofrequência disponíveis no mercado brasileiro.',
    author: mockUsers[3],
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-21T15:30:00Z',
    category: 'Equipamentos',
    tags: ['radiofrequência', 'equipamentos', 'comparativo'],
    views: 512,
    replies: 38,
    likes: 102,
    lastActivity: {
      user: 'Dr. Pedro Almeida',
      timestamp: '2024-01-21T15:30:00Z'
    }
  }
];

// Helper functions
export function getCommentsForResource(resourceType: string, resourceId: string): Comment[] {
  return mockComments.filter(comment => 
    comment.resourceType === resourceType && comment.resourceId === resourceId
  );
}

export function getDiscussionsByCategory(category?: string): Discussion[] {
  if (!category) return mockDiscussions;
  return mockDiscussions.filter(discussion => discussion.category === category);
}

export function getDiscussionById(id: string): Discussion | undefined {
  return mockDiscussions.find(discussion => discussion.id === id);
}

export function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>): Comment {
  const newComment: Comment = {
    ...comment,
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: []
  };
  
  mockComments.push(newComment);
  return newComment;
}

export function addReply(parentId: string, reply: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies' | 'parentId'>): Comment | null {
  const parentComment = mockComments.find(comment => comment.id === parentId);
  if (!parentComment) return null;
  
  const newReply: Comment = {
    ...reply,
    id: `reply-${Date.now()}`,
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: [],
    parentId
  };
  
  parentComment.replies.push(newReply);
  return newReply;
}