export interface MedicalCase {
  id: string; // Firestore document ID
  title: string;
  specialty: string;
  submittedBy: string;
  status: 'Em Análise' | 'Aprovado' | 'Requer Revisão';
  imageUrl?: string; // Could be the first image from imageUrls
  imageUrls?: string[];
  imageHint?: string;
  analysis: string | null;
  imageCount: number;
  videoCount: number;
  createdAt?: unknown; // Firestore Timestamp
}


export const initialMedicalCases: MedicalCase[] = [
  {
    id: 'caso-teka-brandao',
    title: 'Caso Teka Brandão - Individualização da Técnica Cirúrgica',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'facial surgery case study',
    analysis: `**Paciente:** Teka Brandão (esposa e secretária do curso)

**Histórico:** Blefaroplastia transconjuntival inferior há 20 anos + tratamento do platisma e plicatura do digástrico pelo acesso submento há 4 anos

**Queixas:** Pele no pescoço, sulco labiomentoniano e sulco palpebral superior alto

**Cirurgia Realizada:** Frontoplastia lateral (apenas região temporal), blefaroplastia superior (apenas pele), blefaroplastia inferior (touch), descolamento cervical, plicatura tipo Baker, Crevassi lateral, plicatura do platisma + platismotomia

**Evolução:** 48 horas pós-operatório

**Observação:** Caso usado para demonstrar individualização da técnica. "Cada paciente é único e devemos sempre individualizar a estratégia de tratamento baseado nas expectativas de resultado da paciente"`,
    imageCount: 4,
    videoCount: 1,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'caso-idosa-75anos',
    title: 'Deep Neck em Paciente Idosa - 75 Anos',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'elderly patient deep neck surgery',
    analysis: `**Idade:** 75 anos

**Histórico:** Lifting de Face total há 15 anos

**Queixas:** Melhorar pescoço e jowls

**Procedimento:** Deep neck acesso submento + retirada de gorduras + shaving do digástrico + plicatura proximal + liberação da fáscia peri-hioidea + sutura do platisma até o ângulo + acesso lateral para retirada de peles + crevassi + plicatura terço médio

**Observação:** "Não tenham receio de retirar pele de pacientes com mais de 60 anos"

**Filosofia:** Pacientes idosos toleram bem procedimentos extensos quando bem indicados e executados com técnica adequada.`,
    imageCount: 5,
    videoCount: 2,
    createdAt: '2024-01-12T14:30:00Z',
  },
  {
    id: 'caso-septuagenaria-74anos',
    title: 'Técnica Simplificada em Paciente Septuagenária',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'simplified facial surgery technique',
    analysis: `**Idade:** 74 anos

**Histórico:** Lifting de Face há 5 anos

**Queixas:** Apenas excesso de pele no pescoço, quer algo simples

**Procedimento:** Descolamento apenas periauricular + crevassi + ponto de prolene 2.0 de uma mastoide a outra usando agulha de Casagrande

**Técnica:** Entrada por pequena incisão no ângulo cervical, mesmo orifício do Crevassi para embutir o nó do prolene

**Resultado:** "Simples e eficaz"

**Filosofia:** Nem sempre precisamos de técnicas complexas. A simplicidade pode ser a chave para resultados satisfatórios e seguros.`,
    imageCount: 3,
    videoCount: 1,
    createdAt: '2024-01-10T09:15:00Z',
  },
  {
    id: 'caso-jovem-41anos',
    title: 'Abordagem Conservadora em Paciente Jovem',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'young patient conservative approach',
    analysis: `**Idade:** 41 anos

**Perfil:** Jovem com medo de cicatrizes

**Queixas:** Melhora dos 3 terços da face

**Procedimento:** Frontoplastia + Endomidface + Deep neck apenas pelo submento com shaving de digástrico + plicatura + retirada das gorduras + liberação da fáscia pré-hioidea

**Estratégia:** Abordagem minimamente invasiva focada na preservação e prevenção, respeitando a anatomia jovem e as preocupações estéticas do paciente.

**Resultado:** Melhora significativa com mínimo trauma cirúrgico.`,
    imageCount: 4,
    videoCount: 1,
    createdAt: '2024-01-08T16:20:00Z',
  },
  {
    id: 'caso-bonus-retoque',
    title: 'Caso Bônus - Retoque Cirúrgico para Simetria',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'surgical touch up symmetry',
    analysis: `**Histórico:** Pescoço isolado + prótese de mento há 5 anos com Dr. Robério

**Queixas:** Assimetria de sobrancelhas e olhos tristes

**Procedimento:** Frontoplastia isolada, retirando mais pele à esquerda para simetria

**Estratégia:** Correção direcionada da assimetria com abordagem unilateral diferenciada para obter simetria bilateral.

**Resultado:** Correção eficaz da assimetria com harmonização facial.

**Observação:** Demonstra a importância do acompanhamento a longo prazo e disponibilidade para refinamentos.`,
    imageCount: 3,
    videoCount: 0,
    createdAt: '2024-01-05T11:45:00Z',
  },
  {
    id: 'caso-meia-idade-43anos',
    title: 'Procedimento Combinado - Paciente de Meia Idade',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'combined facial procedures',
    analysis: `**Idade:** 43 anos

**Queixas:** Pescoço pesado + definição da ponta do nariz

**Procedimento Completo:** Frontoplastia + pálpebras superiores + endomidface + deep neck com retirada da gordura supra-platismal + shaving e plicatura do digástrico + sutura do ângulo do pescoço até a mastoide + crevassi + plicatura leve terço médio + enxertos de gordura no mento e lábios + rinoplastia da ponta

**Evolução:** 48 horas pós-operatório

**Estratégia:** Abordagem combinada face + nariz para resultado harmonioso integral.

**Resultado:** Rejuvenescimento completo com naturalidade.`,
    imageCount: 6,
    videoCount: 2,
    createdAt: '2024-01-03T13:10:00Z',
  },
  {
    id: 'caso-idosa-recente-75anos',
    title: 'Procedimento Extenso em Paciente Idosa - 75 Anos',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Robério Brandão',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'extensive elderly facial surgery',
    analysis: `**Idade:** 75 anos

**Procedimento Extenso:** Frontoplastia + Endomidface + plicatura e pele terço médio + Deep neck com retirada das gorduras sobre o platisma + shaving e plicatura de digástrico + abertura ampla da fáscia pré-hioidea + Crevassi com nylon 2.0 + enxertos de gordura (mento, lábios, dorso do nariz e malar) total 50ml

**Evolução:** 24 horas pós-operatório

**Observação:** Demonstra que idade avançada não é contraindicação para procedimentos extensos quando bem indicados.

**Resultado:** Rejuvenescimento significativo com segurança.`,
    imageCount: 7,
    videoCount: 1,
    createdAt: '2024-01-01T08:30:00Z',
  },
  {
    id: 'caso-complicacao-deyse',
    title: 'Casos de Complicação - Manejo Pós-Operatório',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dra. Deyse Oliveira',
    status: 'Em Análise' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'postoperative complications management',
    analysis: `**Procedimento:** Deep neck em 2 pacientes

**Complicação:** Abaulamento lateral no local da glândula (18 dias pós-op)

**Conduta:** Ultrassom para diferenciação entre fibrose e glândula + radiofrequência tópica se fibrose

**Discussão:** Casos que ilustram a importância do acompanhamento pós-operatório prolongado e da abordagem sistemática das complicações.

**Aprendizado:** Complicações são oportunidades de aprendizado e refinamento da técnica quando manejadas adequadamente.

**Protocolo:** Estabelecimento de protocolo para diferenciação e tratamento de abaulamentos pós-operatórios.`,
    imageCount: 4,
    videoCount: 0,
    createdAt: '2023-12-28T15:20:00Z',
  },
  {
    id: 'caso-primeiro-renato',
    title: 'Primeiro Deep Neck - Experiência de Aprendizado',
    specialty: 'Cirurgia Facial',
    submittedBy: 'Dr. Renato Mello',
    status: 'Aprovado' as const,
    imageUrl: 'BANNER_GENERATED', // Will be replaced by banner generator
    imageHint: 'first deep neck learning experience',
    analysis: `**Procedimento:** Primeiro Deep Neck realizado

**Dificuldades:** Identificação do hioide e localização do digástrico

**Conduta:** Não fez liberação da fáscia profunda por precaução

**Aprendizado:** Relato que ilustra a importância da curva de aprendizado em cirurgia facial e a necessidade de abordagem progressiva e segura.

**Recomendações para Iniciantes:**
- Conhecimento anatômico sólido
- Supervisão experiente
- Progressão gradual na complexidade
- Não hesitar em ser conservador quando necessário

**Resultado:** Abordagem segura com resultado satisfatório para primeiro caso.`,
    imageCount: 2,
    videoCount: 1,
    createdAt: '2023-12-25T10:00:00Z',
  },
];

export const caseDetails = {
    id: 1,
    title: 'Caso Complexo de Rinoplastia Revisional',
    submittedBy: 'Dr. Ana Couto',
    submittedAt: '2024-07-28T10:00:00Z',
    specialty: 'Rinoplastia',
    difficulty: 'Avançado',
    estimatedTime: '45 min',
    status: 'Aprovado',
    analysis: 'O planejamento pré-operatório foi excelente, com boa escolha do implante. A técnica de inserção dual-plane garantiu um resultado natural e simétrico. Recomendo atenção ao acompanhamento pós-operatório para monitorar a contratura capsular.',
    presentation: 'Paciente de 28 anos apresenta deformidade nasal pós-rinoplastia primária realizada há 2 anos. Refere dificuldade respiratória e insatisfação estética com a projeção da ponta nasal.',
    clinicalHistory: 'História de rinoplastia primária com técnica fechada. Paciente nega alergias medicamentosas, tabagismo ou uso de medicações contínuas. Exames laboratoriais pré-operatórios normais.',
    physicalExam: 'Ao exame físico: nariz com ponta nasal hipoprojetada, ângulo nasolabial obtuso, presença de irregularidades no dorso nasal. Septoscopia revela desvio septal compensatório.',
    aiAnalysis: {
        suggestedDiagnosis: 'Deformidade nasal pós-cirúrgica com necessidade de rinoplastia revisional estruturada',
        confidence: 87,
        recommendations: [
            'Realizar TC de face para avaliação estrutural completa',
            'Planejamento com enxertos cartilaginosos auriculares',
            'Abordagem aberta para melhor visualização',
            'Correção simultânea do desvio septal'
        ]
    }
};

export const timelineEvents = [
    {
        id: 1,
        type: 'submitted',
        title: 'Caso Submetido',
        description: 'Caso enviado para análise pelos mentores',
        timestamp: '2024-07-28T10:00:00Z',
        user: 'Dr. Ana Couto'
    },
    {
        id: 2,
        type: 'assigned',
        title: 'Mentor Designado',
        description: 'Dr. Roberto Silva foi designado como mentor responsável',
        timestamp: '2024-07-28T11:30:00Z',
        user: 'Sistema'
    },
    {
        id: 3,
        type: 'analysis',
        title: 'Análise Iniciada',
        description: 'Mentor iniciou a análise detalhada do caso',
        timestamp: '2024-07-28T14:15:00Z',
        user: 'Dr. Roberto Silva'
    },
    {
        id: 4,
        type: 'feedback',
        title: 'Feedback Solicitado',
        description: 'Solicitação de informações adicionais ao cirurgião',
        timestamp: '2024-07-28T16:45:00Z',
        user: 'Dr. Roberto Silva'
    },
    {
        id: 5,
        type: 'updated',
        title: 'Caso Atualizado',
        description: 'Cirurgião forneceu informações complementares',
        timestamp: '2024-07-28T18:20:00Z',
        user: 'Dr. Ana Couto'
    },
    {
        id: 6,
        type: 'approved',
        title: 'Caso Aprovado',
        description: 'Análise finalizada com aprovação e recomendações',
        timestamp: '2024-07-29T09:30:00Z',
        user: 'Dr. Roberto Silva'
    }
];