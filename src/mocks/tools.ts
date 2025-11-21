import { Tool } from '@/types';

export const mockTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'Interpretador ISO 8583',
    description: 'Analise e decodifique mensagens ISO 8583 em tempo real. Visualize campos, subcampos e valide conformidade com padrões.',
    category: 'iso8583',
    icon: '🔍',
    status: 'free',
    popularity: 5,
    usageCount: 1250,
    features: [
      'Decodificação automática de mensagens',
      'Validação de campos obrigatórios',
      'Suporte a múltiplas versões ISO',
      'Exportação de relatórios',
      'Interface visual intuitiva'
    ],
    demoUrl: '/tools/iso8583-demo'
  },
  {
    id: 'tool-2',
    name: 'Planilha de Conciliação',
    description: 'Automatize a conciliação entre adquirentes, bandeiras e bancos. Identifique divergências e gere relatórios detalhados.',
    category: 'conciliation',
    icon: '📊',
    status: 'premium',
    popularity: 4,
    usageCount: 890,
    features: [
      'Importação automática de arquivos',
      'Regras de conciliação customizáveis',
      'Relatórios de divergências',
      'Dashboard de acompanhamento',
      'Alertas automáticos'
    ]
  },
  {
    id: 'tool-3',
    name: 'Métricas de Autorização',
    description: 'Acompanhe taxas de aprovação, rejeição e chargeback. Visualize tendências e identifique pontos de melhoria.',
    category: 'metrics',
    icon: '📈',
    status: 'free',
    popularity: 4,
    usageCount: 2100,
    features: [
      'Dashboards em tempo real',
      'Análise de tendências',
      'Comparativos por período',
      'Alertas configuráveis',
      'Exportação de dados'
    ]
  },
  {
    id: 'tool-4',
    name: 'Planilha de Liquidação',
    description: 'Calcule liquidações D+1, D+2 e D+30 automaticamente. Considere taxas, MDR e prazos de cada bandeira.',
    category: 'settlement',
    icon: '💰',
    status: 'premium',
    popularity: 5,
    usageCount: 675,
    features: [
      'Cálculos automáticos de MDR',
      'Suporte a múltiplas bandeiras',
      'Projeções de recebimento',
      'Relatórios de liquidação',
      'Integração com adquirentes'
    ]
  },
  {
    id: 'tool-5',
    name: 'IA Mandates',
    description: 'Inteligência artificial especializada em análise de mandates das bandeiras. Interprete regras complexas automaticamente.',
    category: 'ai',
    icon: '🤖',
    status: 'beta',
    popularity: 4,
    usageCount: 320,
    features: [
      'Análise automática de documentos',
      'Interpretação de regras complexas',
      'Recomendações de compliance',
      'Base de conhecimento atualizada',
      'Suporte a português e inglês'
    ],
    isNew: true
  },
  {
    id: 'tool-6',
    name: 'Regras das Bandeiras',
    description: 'Base de dados completa com regras atualizadas de Visa, Mastercard, Elo e American Express.',
    category: 'rules',
    icon: '🏦',
    status: 'free',
    popularity: 5,
    usageCount: 1800,
    features: [
      'Regras atualizadas automaticamente',
      'Busca avançada por tópico',
      'Comparativo entre bandeiras',
      'Alertas de mudanças',
      'Documentação técnica'
    ]
  },
  {
    id: 'tool-7',
    name: 'Simulador de Transações',
    description: 'Simule cenários de processamento de pagamentos. Teste fluxos, regras e validações sem afetar produção.',
    category: 'other',
    icon: '🎮',
    status: 'free',
    popularity: 3,
    usageCount: 450,
    features: [
      'Cenários pré-configurados',
      'Criação de testes customizados',
      'Validação de regras de negócio',
      'Relatórios de simulação',
      'Integração com APIs'
    ]
  },
  {
    id: 'tool-8',
    name: 'Analisador de Chargeback',
    description: 'Analise padrões de chargeback e implemente estratégias de redução. Identifique causas raiz automaticamente.',
    category: 'metrics',
    icon: '⚠️',
    status: 'premium',
    popularity: 4,
    usageCount: 580,
    features: [
      'Análise de padrões',
      'Razões de chargeback categorizadas',
      'Tendências por período',
      'Recomendações de prevenção',
      'Relatórios para bandeiras'
    ]
  },
  {
    id: 'tool-9',
    name: 'Calculadora de MDR',
    description: 'Calcule taxas MDR otimizadas para diferentes tipos de negócio. Compare ofertas de adquirentes.',
    category: 'settlement',
    icon: '🧮',
    status: 'free',
    popularity: 4,
    usageCount: 950,
    features: [
      'Cálculos por segmento',
      'Comparativo de adquirentes',
      'Projeções de margem',
      'Cenários "what-if"',
      'Relatórios detalhados'
    ]
  },
  {
    id: 'tool-10',
    name: 'Validador de Cartões',
    description: 'Valide números de cartão, algoritmos de Luhn e identificadores de bandeira automaticamente.',
    category: 'other',
    icon: '💳',
    status: 'free',
    popularity: 3,
    usageCount: 1200,
    features: [
      'Validação de algoritmos',
      'Identificação de bandeiras',
      'Geração de cartões teste',
      'API para integração',
      'Suporte a cartões internacionais'
    ]
  },
  {
    id: 'tool-11',
    name: 'Monitor de APIs',
    description: 'Monitore performance e disponibilidade de APIs de pagamento. Receba alertas em tempo real.',
    category: 'metrics',
    icon: '📡',
    status: 'premium',
    popularity: 4,
    usageCount: 340,
    features: [
      'Monitoramento 24/7',
      'Alertas configuráveis',
      'Relatórios de uptime',
      'Análise de latência',
      'Dashboards personalizados'
    ]
  },
  {
    id: 'tool-12',
    name: 'Gerador de QR Code Pix',
    description: 'Gere QR Codes Pix válidos com todas as informações necessárias. Valide conformidade com o BACEN.',
    category: 'other',
    icon: '📱',
    status: 'free',
    popularity: 4,
    usageCount: 780,
    features: [
      'Geração automática',
      'Validação BACEN',
      'Personalização visual',
      'API REST',
      'Suporte a múltiplas moedas'
    ]
  }
];