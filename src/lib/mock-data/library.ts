export interface Article {
  id: number;
  title: string;
  authors: string;
  author?: string;
  journal: string;
  year: number;
  impactFactor: number;
  specialty: string;
  abstract: string;
  summary?: string;
  views: number;
  discussions: number;
  imageUrl: string;
  imageHint: string;
  publishedAt?: string;
  doi?: string;
  pages?: number;
  downloadLink?: string;
  tags?: string[];
  exampleImages?: Array<{
    url: string;
    caption: string;
    description: string;
  }>;
}

export const scientificArticles: Article[] = [
  {
    id: 1,
    title: 'Técnicas Avançadas de Rejuvenescimento Facial - Abordagem Sistemática e Resultados',
    authors: 'Dr. Robério Brandao et al.',
    journal: 'Aesthetic Surgery Journal',
    year: 2024,
    impactFactor: 5.2,
    specialty: 'Lifting',
    abstract: 'Artigo fundamental sobre técnicas de rejuvenescimento facial, código SJAD382. Este estudo abrangente de 91 páginas apresenta uma análise sistemática das técnicas mais avançadas de rejuvenescimento facial, incluindo abordagens endoscópicas, manipulação do SMAS e técnicas de suspensão. O trabalho foi amplamente compartilhado e discutido como referência essencial para cirurgiões faciais. Inclui análise de resultados em longo prazo e protocolo detalhado de planejamento cirúrgico.',
    views: 2847,
    discussions: 156,
    imageUrl: '',
    imageHint: 'facial rejuvenation surgery',
    doi: '10.1093/asj/sjad382',
    pages: 91,
    downloadLink: 'https://academic.oup.com/asj/advance-article-abstract/doi/10.1093/asj/sjad382/7502919',
    tags: ['Literatura Fundamental', 'PubMed', 'Rejuvenescimento', 'SMAS'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        caption: "Planejamento Pré-Operatório",
        description: "Marcação detalhada para rejuvenescimento facial completo com análise vetorial das forças de tração."
      },
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        caption: "Técnica SMAS Profundo",
        description: "Demonstração da dissecção e manipulação do SMAS para resultado natural e duradouro."
      },
      {
        url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
        caption: "Resultado Pós-Operatório",
        description: "Resultado após 6 meses mostrando rejuvenescimento natural com preservação das características individuais."
      }
    ]
  },
  {
    id: 2,
    title: 'Full SMAS: Rejuvenescimento Facial Completo Assistido por Endoscopia',
    authors: 'Dra. Leticia Naves, Dr. Robério Brandao, et al.',
    journal: 'Aesthetic Surgery Journal',
    year: 2024,
    impactFactor: 5.2,
    specialty: 'Lifting',
    abstract: 'Técnica inovadora de rejuvenescimento facial completo assistido por endoscopia, abordando o sistema SMAS de forma integral. Este artigo de dezembro de 2024 (Vol. 44, nº 12, pp. 1247–1257) apresenta uma abordagem revolucionária que combina a visualização endoscópica com a manipulação completa do SMAS. Material muito solicitado pelos participantes da mentoria, especialmente pela Dra. Leticia Naves. O estudo demonstra resultados superiores em termos de longevidade e naturalidade.',
    views: 1956,
    discussions: 89,
    imageUrl: '',
    imageHint: 'endoscopic facial surgery',
    doi: '10.1093/asj/sjae177',
    pages: 11,
    downloadLink: 'Disponível nos grupos do WhatsApp',
    tags: ['Técnica Inovadora', 'Endoscopia', 'SMAS', 'Artigo Recente'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        caption: "Setup Endoscópico",
        description: "Configuração completa para cirurgia facial endoscópica com visualização de alta definição."
      },
      {
        url: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop",
        caption: "Visualização Endoscópica",
        description: "Imagem endoscópica mostrando a dissecção precisa do plano SMAS com preservação das estruturas nobres."
      }
    ]
  },
  {
    id: 3,
    title: 'Cirurgia Palpebral e Periorbital - Segunda Edição Completa',
    authors: 'Múltiplos Autores Internacionais',
    journal: 'Literatura Especializada',
    year: 2023,
    impactFactor: 0,
    specialty: 'Blefaroplastia',
    abstract: 'Livro completo sobre cirurgia palpebral e periorbital, considerado referência fundamental na área. Com 1.203 páginas de conteúdo detalhado, esta segunda edição abrange desde a anatomia básica até as técnicas mais avançadas de blefaroplastia superior e inferior, cantopexia, tratamento de ptose e reconstrução palpebral. Compartilhado pelo Dr. Robério Brandao como material essencial para formação em cirurgia oculoplástica. Inclui capítulos sobre complicações e seu manejo.',
    views: 3421,
    discussions: 124,
    imageUrl: '',
    imageHint: 'eyelid surgery textbook',
    pages: 1203,
    downloadLink: 'Compartilhado nos grupos',
    tags: ['Livro Completo', 'Referência', 'Oculoplástica', 'Material Essencial'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
        caption: "Anatomia Palpebral",
        description: "Ilustração detalhada da anatomia palpebral com todas as estruturas relevantes para o cirurgião."
      },
      {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        caption: "Técnica de Blefaroplastia",
        description: "Passo a passo da técnica de blefaroplastia superior com preservação do músculo orbicular."
      },
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        caption: "Cantopexia Lateral",
        description: "Técnica de cantopexia para correção da flacidez palpebral inferior."
      }
    ]
  },
  {
    id: 4,
    title: 'Cirurgia Plástica Endoscópica - Guia Completo de Técnicas Minimamente Invasivas',
    authors: 'Dr. Robério Brandao (Curadoria)',
    journal: 'Literatura Especializada',
    year: 2022,
    impactFactor: 0,
    specialty: 'Lifting',
    abstract: 'Guia completo sobre técnicas de cirurgia plástica endoscópica com 338 páginas. Este livro abrange todas as aplicações da endoscopia na cirurgia plástica facial, incluindo frontoplastia endoscópica, lifting do terço médio, lifting temporal e cervicoplastia. Material fundamental para compreensão das técnicas minimamente invasivas que revolucionaram a cirurgia facial moderna. Inclui setup de equipamentos, anatomia endoscópica e prevenção de complicações.',
    views: 2156,
    discussions: 76,
    imageUrl: '',
    imageHint: 'endoscopic surgery book',
    pages: 338,
    downloadLink: 'Compartilhado nos grupos',
    tags: ['Endoscopia', 'Minimamente Invasivo', 'Técnica Avançada'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop",
        caption: "Equipamento Endoscópico",
        description: "Setup completo de torre endoscópica para cirurgia plástica facial."
      },
      {
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        caption: "Acesso Endoscópico",
        description: "Demonstração dos portais de acesso para frontoplastia endoscópica."
      }
    ]
  },
  {
    id: 5,
    title: 'Dissertação MINELLI - Técnicas Combinadas de Lifting Facial',
    authors: 'Dr. Minelli',
    journal: 'Dissertação Acadêmica',
    year: 2023,
    impactFactor: 0,
    specialty: 'Lifting',
    abstract: 'Dissertação acadêmica de 172 páginas sobre técnicas combinadas de lifting facial, frequentemente referenciada como "literatura fundamental" pelo Dr. Robério Brandao. O trabalho apresenta uma análise comparativa de diferentes abordagens de lifting, incluindo SMAS, deep plane, e técnicas compostas. Inclui revisão sistemática da literatura, análise de resultados em 150 pacientes e protocolo detalhado de seleção de técnica baseado em características individuais do paciente.',
    views: 1789,
    discussions: 62,
    imageUrl: '',
    imageHint: 'academic dissertation',
    pages: 172,
    downloadLink: 'Compartilhado nos grupos',
    tags: ['Dissertação', 'Pesquisa Acadêmica', 'Técnicas Combinadas'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
        caption: "Análise Comparativa",
        description: "Gráficos comparativos dos resultados das diferentes técnicas de lifting."
      },
      {
        url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
        caption: "Protocolo de Seleção",
        description: "Algoritmo de decisão para escolha da técnica baseado em características do paciente."
      }
    ]
  },
  {
    id: 6,
    title: 'Master Techniques in Facial Rejuvenation - Técnicas Avançadas',
    authors: 'Editores Múltiplos',
    journal: 'Literatura Especializada',
    year: 2023,
    impactFactor: 0,
    specialty: 'Lifting',
    abstract: 'Compêndio de 395 páginas com técnicas avançadas de rejuvenescimento facial. Descrito pelo Dr. Robério como "material relevante para um cirurgião facial", este livro reúne contribuições dos maiores especialistas mundiais em rejuvenescimento facial. Aborda desde técnicas não-invasivas até procedimentos cirúrgicos complexos, incluindo uso de tecnologias adjuvantes, técnicas de volumização e protocolos de combinação. Material essencial para compreensão holística do rejuvenescimento facial moderno.',
    views: 2634,
    discussions: 98,
    imageUrl: '',
    imageHint: 'facial rejuvenation techniques',
    pages: 395,
    downloadLink: 'Compartilhado nos grupos',
    tags: ['Material Relevante', 'Técnicas Master', 'Rejuvenescimento Completo'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        caption: "Abordagem Holística",
        description: "Planejamento integrado de rejuvenescimento facial combinando múltiplas técnicas."
      },
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        caption: "Técnicas Combinadas",
        description: "Demonstração da combinação de lifting com volumização e tecnologias."
      },
      {
        url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
        caption: "Resultados Master",
        description: "Resultados excepcionais obtidos com a aplicação das técnicas master."
      }
    ]
  },
  {
    id: 7,
    title: 'Anatomia da Região Frontal e Fossa Temporal - Knize 2001',
    authors: 'Dr. David M. Knize',
    journal: 'Literatura Clássica',
    year: 2001,
    impactFactor: 0,
    specialty: 'Outros',
    abstract: 'Referência clássica de 197 páginas sobre anatomia e técnicas cirúrgicas da região frontal e fossa temporal. Apesar de publicado em 2001, continua sendo considerado leitura obrigatória para compreensão da anatomia complexa desta região. O Dr. Knize detalha as camadas anatômicas, a inervação, vascularização e os planos de dissecção seguros para frontoplastia. Este livro é fundamental para qualquer cirurgião que deseja dominar a cirurgia da região frontal.',
    views: 1456,
    discussions: 51,
    imageUrl: '',
    imageHint: 'forehead anatomy book',
    pages: 197,
    downloadLink: 'Compartilhado nos grupos',
    tags: ['Clássico', 'Anatomia', 'Frontoplastia', 'Leitura Obrigatória'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        caption: "Anatomia Frontal",
        description: "Ilustração detalhada das camadas anatômicas da região frontal."
      },
      {
        url: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop",
        caption: "Planos de Dissecção",
        description: "Demonstração dos planos seguros de dissecção na frontoplastia."
      }
    ]
  },
  {
    id: 8,
    title: 'Neck Lift - Técnicas Completas de Lifting Cervical por Joel J. Feldman',
    authors: 'Dr. Joel J. Feldman',
    journal: 'Literatura Especializada',
    year: 2006,
    impactFactor: 0,
    specialty: 'Lifting',
    abstract: 'Guia definitivo de 552 páginas sobre técnicas de lifting cervical. Compartilhado inicialmente por Léo Victor e amplamente distribuído pelo Dr. Robério Brandao, este livro é considerado a referência mais completa sobre cervicoplastia. Feldman detalha desde a anatomia cervical até as técnicas mais avançadas de manipulação do platisma, lipectomia cervical, tratamento das bandas platismais e correção do ângulo cervicomental. Inclui capítulo especial sobre pacientes masculinos e reoperações.',
    views: 2178,
    discussions: 83,
    imageUrl: '',
    imageHint: 'neck lift surgery book',
    pages: 552,
    downloadLink: 'Compartilhado nos grupos',
    tags: ['Cervicoplastia', 'Referência Completa', 'Platisma', 'Técnica Feldman'],
    exampleImages: [
      {
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
        caption: "Anatomia Cervical",
        description: "Anatomia detalhada da região cervical com ênfase no músculo platisma."
      },
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        caption: "Técnica de Platysmaplastia",
        description: "Demonstração da técnica de plicatura medial do platisma."
      },
      {
        url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
        caption: "Resultado Cervical",
        description: "Resultado final mostrando melhora significativa do contorno cervical."
      }
    ]
  }
];

export const specialties = [
  'Todos',
  'Lifting',
  'Blefaroplastia',
  'Outros'
];

// Informações adicionais sobre o acervo
export const libraryStats = {
  totalPages: 2957,
  totalArticles: 8,
  scientificArticles: 2,
  books: 6,
  mainSource: 'Dr. Robério Brandao',
  platforms: ['PubMed', 'Scribd', 'Hotmart', 'WhatsApp Groups'],
  description: 'Curadoria cuidadosa de conteúdo científico de alta qualidade para formação em cirurgia facial'
};
// Export alias for compatibility
export const articlesData = scientificArticles;
export const libraryResources = scientificArticles;
