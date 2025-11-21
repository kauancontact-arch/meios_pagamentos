import { Job } from '@/types';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Engenheiro de Software Sênior - Pagamentos',
    company: 'Fintech Inovadora',
    location: 'São Paulo, SP',
    type: 'full-time',
    salary: {
      min: 12000,
      max: 18000,
      currency: 'BRL'
    },
    description: 'Estamos procurando um Engenheiro de Software Sênior para trabalhar em nossa plataforma de pagamentos. Você será responsável por desenvolver e manter sistemas críticos de processamento de transações.',
    requirements: [
      'Experiência de 5+ anos em desenvolvimento backend',
      'Conhecimento em Java, Spring Boot e microserviços',
      'Experiência com bancos de dados PostgreSQL e Redis',
      'Conhecimento em APIs REST e GraphQL',
      'Experiência com sistemas de pagamento é um diferencial'
    ],
    benefits: [
      'Vale refeição/alimentação',
      'Plano de saúde e odontológico',
      'Auxílio home office',
      'Participação nos lucros',
      'Horário flexível'
    ],
    postedBy: 'user-2',
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://fintech-inovadora.com/carreiras/engenheiro-senior',
    isRemote: false,
    experience: 'senior',
    tags: ['java', 'spring-boot', 'pagamentos', 'backend'],
    views: 245,
    applications: 12
  },
  {
    id: 'job-2',
    title: 'Analista de Produto - Open Banking',
    company: 'Banco Digital',
    location: 'Remoto',
    type: 'full-time',
    salary: {
      min: 8000,
      max: 12000,
      currency: 'BRL'
    },
    description: 'Buscamos um Analista de Produto para liderar a estratégia de produto no ecossistema Open Banking. Você trabalhará diretamente com stakeholders para definir roadmap e priorizar features.',
    requirements: [
      'Experiência em Product Management',
      'Conhecimento do ecossistema financeiro brasileiro',
      'Experiência com metodologias ágeis',
      'Habilidades de análise de dados',
      'Conhecimento em Open Banking é um diferencial'
    ],
    benefits: [
      'Trabalho 100% remoto',
      'Plano de saúde',
      'Auxílio educação',
      'Bônus por performance',
      'Ambiente de inovação'
    ],
    postedBy: 'user-1',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://banco-digital.com/vagas/analista-produto',
    isRemote: true,
    experience: 'mid',
    tags: ['product-management', 'open-banking', 'remoto', 'fintech'],
    views: 189,
    applications: 8
  },
  {
    id: 'job-3',
    title: 'Especialista em Compliance - LGPD',
    company: 'Consultoria Financeira',
    location: 'Rio de Janeiro, RJ',
    type: 'contract',
    salary: {
      min: 15000,
      max: 20000,
      currency: 'BRL'
    },
    description: 'Projeto de 12 meses para implementação de programa de compliance LGPD em instituição financeira. Buscamos especialista com experiência em regulamentação de dados.',
    requirements: [
      'Certificação em LGPD',
      'Experiência em compliance financeiro',
      'Conhecimento em regulamentação BACEN',
      'Experiência em implementação de programas de compliance',
      'Habilidades de comunicação e treinamento'
    ],
    benefits: [
      'Contrato de 12 meses',
      'Possibilidade de efetivação',
      'Auxílio transporte',
      'Ambiente corporativo',
      'Projeto desafiador'
    ],
    postedBy: 'admin-1',
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://consultoriafinanceira.com/oportunidades/compliance-lgpd',
    isRemote: false,
    experience: 'senior',
    tags: ['compliance', 'lgpd', 'regulamentação', 'pj'],
    views: 156,
    applications: 23
  },
  {
    id: 'job-4',
    title: 'Desenvolvedor Frontend - React',
    company: 'Startup de Pagamentos',
    location: 'Belo Horizonte, MG',
    type: 'full-time',
    salary: {
      min: 6000,
      max: 9000,
      currency: 'BRL'
    },
    description: 'Oportunidade para trabalhar em uma startup em crescimento desenvolvendo interfaces para sistemas de pagamento. Buscamos alguém apaixonado por UX/UI e tecnologias modernas.',
    requirements: [
      'Experiência com React e TypeScript',
      'Conhecimento em CSS-in-JS e design systems',
      'Experiência com testes automatizados',
      'Conhecimento em APIs REST',
      'Portfólio com projetos relevantes'
    ],
    benefits: [
      'Ambiente startup',
      'Horário flexível',
      'Participação societária',
      'Cursos e treinamentos',
      'Eventos e confraternizações'
    ],
    postedBy: 'user-2',
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://startup-pagamentos.com/vagas/frontend-react',
    isRemote: false,
    experience: 'mid',
    tags: ['react', 'frontend', 'typescript', 'startup'],
    views: 312,
    applications: 15
  },
  {
    id: 'job-5',
    title: 'Gerente de Segurança da Informação',
    company: 'Adquirente S.A.',
    location: 'São Paulo, SP',
    type: 'full-time',
    salary: {
      min: 20000,
      max: 28000,
      currency: 'BRL'
    },
    description: 'Liderar equipe de segurança da informação em uma das maiores adquirentes do país. Responsável por proteger dados de milhões de transações diárias.',
    requirements: [
      'Experiência em gestão de equipes de segurança',
      'Certificações CISSP ou CISM',
      'Conhecimento em PCI DSS',
      'Experiência em resposta a incidentes',
      'Conhecimento em criptografia e autenticação'
    ],
    benefits: [
      'Salário competitivo',
      'Plano de carreira estruturado',
      'Benefícios corporativos completos',
      'Ambiente de alta performance',
      'Oportunidades de crescimento'
    ],
    postedBy: 'user-1',
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://adquirente.com.br/carreiras/gerente-seguranca',
    isRemote: false,
    experience: 'lead',
    tags: ['segurança', 'pci-dss', 'gestão', 'liderança'],
    views: 98,
    applications: 6
  },
  {
    id: 'job-6',
    title: 'Estagiário em Desenvolvimento',
    company: 'Fintech Educacional',
    location: 'Remoto',
    type: 'internship',
    salary: {
      min: 1500,
      max: 2000,
      currency: 'BRL'
    },
    description: 'Programa de estágio para estudantes de computação interessados em fintech. Oportunidade de aprender sobre pagamentos digitais e contribuir para projetos reais.',
    requirements: [
      'Estudante de Ciência da Computação ou áreas relacionadas',
      'Conhecimento básico em programação',
      'Disponibilidade de 6 horas diárias',
      'Inglês intermediário',
      'Proatividade e vontade de aprender'
    ],
    benefits: [
      'Bolsa auxílio',
      'Auxílio transporte',
      'Trabalho remoto',
      'Certificado de estágio',
      'Possibilidade de efetivação'
    ],
    postedBy: 'admin-1',
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicationUrl: 'https://fintech-edu.com/estagio/desenvolvimento',
    isRemote: true,
    experience: 'entry',
    tags: ['estágio', 'desenvolvimento', 'fintech', 'remoto'],
    views: 423,
    applications: 67
  }
];