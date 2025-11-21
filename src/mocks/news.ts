import { News } from '@/types';

export const mockNews: News[] = [
  {
    id: 'news-1',
    title: 'BACEN aprova novas regras para Pix Instantâneo',
    summary: 'O Banco Central anunciou mudanças significativas no sistema Pix, incluindo novos limites e medidas de segurança.',
    content: `O Banco Central do Brasil anunciou hoje novas regras para o sistema Pix que visam aumentar a segurança e eficiência das transações instantâneas. As principais mudanças incluem:

• Limite máximo de R$ 1.000 para transações noturnas (22h às 6h)
• Obrigatoriedade de autenticação biométrica para valores acima de R$ 500
• Novo sistema de detecção de fraudes baseado em inteligência artificial
• Expansão do Pix para transações internacionais

Segundo o diretor de pagamentos do BACEN, as medidas visam proteger os usuários contra fraudes enquanto mantêm a praticidade do sistema. As mudanças entrarão em vigor em 90 dias.`,
    authorId: 'admin-1',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'regulatory',
    tags: ['pix', 'bacen', 'regulamentação', 'segurança'],
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop',
    readTime: 5,
    featured: true,
    views: 1250,
    likes: 89
  },
  {
    id: 'news-2',
    title: 'Visa lança novo programa de aceleração para fintechs brasileiras',
    summary: 'Programa oferece mentoria, investimento e acesso ao ecossistema global da Visa para startups brasileiras.',
    content: `A Visa anunciou o lançamento do "Visa Fintech Accelerator Brazil", um programa exclusivo para startups brasileiras do setor financeiro. O programa oferece:

• Mentoria com executivos da Visa
• Investimento inicial de até R$ 500 mil
• Acesso à rede global de parceiros
• Suporte técnico e tecnológico
• Participação em eventos internacionais

O programa é voltado para fintechs que trabalham com pagamentos digitais, open banking, criptomoedas e soluções de inclusão financeira. As inscrições estarão abertas até o final do mês.`,
    authorId: 'user-1',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'industry',
    tags: ['visa', 'fintech', 'startup', 'inovação'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    readTime: 4,
    featured: false,
    views: 890,
    likes: 67
  },
  {
    id: 'news-3',
    title: 'Crescimento do e-commerce impulsiona adoção de carteiras digitais',
    summary: 'Com o aumento das vendas online, carteiras digitais registram crescimento de 300% no último ano.',
    content: `O mercado de carteiras digitais no Brasil registrou um crescimento impressionante de 300% no último ano, impulsionado principalmente pelo boom do e-commerce durante a pandemia. Segundo dados da ABCD (Associação Brasileira de Crédito Digital), mais de 45 milhões de brasileiros já utilizam carteiras digitais regularmente.

Os principais fatores para esse crescimento incluem:
• Facilidade de pagamento em compras online
• Integração com delivery e marketplaces
• Programas de cashback e benefícios
• Segurança nas transações

As carteiras digitais já representam 35% de todas as transações de e-commerce no país.`,
    authorId: 'user-2',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'market',
    tags: ['e-commerce', 'carteiras digitais', 'mercado', 'crescimento'],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
    readTime: 6,
    featured: true,
    views: 2100,
    likes: 145
  },
  {
    id: 'news-4',
    title: 'Open Finance: 150 instituições já aderiram ao sistema',
    summary: 'Plataforma de Open Finance do BACEN já conta com 150 participantes, incluindo bancos, fintechs e instituições de pagamento.',
    content: `A plataforma de Open Finance do Banco Central já conta com 150 instituições participantes, superando as expectativas iniciais. O sistema permite que os clientes autorizem o compartilhamento de seus dados financeiros entre diferentes instituições.

As instituições participantes incluem:
• 12 bancos tradicionais
• 89 fintechs
• 32 instituições de pagamento
• 17 cooperativas de crédito

O Open Finance tem como objetivo promover competição, inovação e melhores serviços financeiros para os consumidores brasileiros.`,
    authorId: 'admin-1',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'technology',
    tags: ['open finance', 'bacen', 'inovação', 'dados'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    readTime: 4,
    featured: false,
    views: 675,
    likes: 43
  },
  {
    id: 'news-5',
    title: 'PagSeguro anuncia investimento de R$ 500 milhões em tecnologia',
    summary: 'Empresa vai investir em IA, blockchain e expansão internacional nos próximos 3 anos.',
    content: `O PagSeguro anunciou um investimento de R$ 500 milhões em tecnologia para os próximos 3 anos. O plano estratégico inclui:

• Desenvolvimento de soluções baseadas em inteligência artificial
• Implementação de tecnologia blockchain para contratos inteligentes
• Expansão para mercados da América Latina
• Criação de um hub de inovação em São Paulo

Segundo o CEO da empresa, o investimento visa posicionar o PagSeguro como líder em pagamentos digitais na América Latina.`,
    authorId: 'user-1',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'company',
    tags: ['pagseguro', 'investimento', 'tecnologia', 'ia'],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    readTime: 3,
    featured: false,
    views: 890,
    likes: 78
  },
  {
    id: 'news-6',
    title: 'Fraudes em pagamentos digitais caem 40% com novas tecnologias',
    summary: 'Uso de biometria e IA reduz significativamente os casos de fraude no setor de pagamentos.',
    content: `O setor de pagamentos digitais registrou uma queda de 40% nos casos de fraude nos últimos 12 meses, segundo dados da ABSEG (Associação Brasileira de Segurança). As principais tecnologias responsáveis por essa redução incluem:

• Autenticação biométrica (facial e digital)
• Inteligência artificial para detecção de padrões suspeitos
• Machine learning para análise de comportamento
• Tokenização de dados sensíveis

As instituições que mais investiram em segurança registraram as maiores quedas nos índices de fraude.`,
    authorId: 'user-2',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'technology',
    tags: ['segurança', 'fraude', 'biometria', 'ia'],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    readTime: 5,
    featured: false,
    views: 1200,
    likes: 92
  }
];