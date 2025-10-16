import { Post } from '@/types';

export const mockPosts: Post[] = [
  // Posts for Topic 1
  {
    id: 'post-1',
    topicId: 'topic-1',
    authorId: 'user-1',
    content: 'Estou com um desafio em um projeto novo. Precisamos liquidar transações com cartões internacionais em D+1, mas nosso parceiro atual só oferece D+30. Alguém já passou por isso? Quais credenciadores ou soluções vocês recomendam para agilizar esse fluxo?',
    createdAt: '2 horas atrás',
    upvotes: 15,
    isBestAnswer: false,
  },
  {
    id: 'post-2',
    topicId: 'topic-1',
    authorId: 'user-2',
    content: 'Ótima pergunta, Ana! Já tive uma experiência parecida. A Stripe Connect e a Adyen for Platforms são excelentes para isso, pois gerenciam a complexidade do repasse internacional. A integração é mais complexa, mas a flexibilidade que você ganha é enorme.',
    createdAt: '1 hora atrás',
    upvotes: 8,
    isBestAnswer: false,
  },
  {
    id: 'post-3',
    topicId: 'topic-1',
    authorId: 'admin-1',
    content: 'Complementando o que o Bruno disse, vale a pena verificar também as soluções de "cross-border payments" que alguns bancos digitais estão oferecendo. Eles podem ter taxas mais competitivas para o câmbio.',
    createdAt: '30 minutos atrás',
    upvotes: 5,
    isBestAnswer: false,
  },

  // Posts for Topic 2
  {
    id: 'post-4',
    topicId: 'topic-2',
    authorId: 'user-2',
    content: 'Pessoal, estou implementando webhooks para confirmação de pagamentos Pix e gostaria de saber quais são as melhores práticas. Como vocês lidam com retentativas, idempotência e segurança para garantir que a notificação não seja forjada?',
    createdAt: '1 dia atrás',
    upvotes: 28,
    isBestAnswer: false,
  },
  {
    id: 'post-5',
    topicId: 'topic-2',
    authorId: 'user-1',
    content: 'Para idempotência, sempre uso uma chave única no header da requisição (como `X-Idempotency-Key`) e armazeno os IDs das transações já processadas em um cache (Redis é ótimo para isso). Para segurança, valido a assinatura do webhook usando um segredo compartilhado, geralmente com HMAC-SHA256. Nunca confie apenas no IP de origem.',
    createdAt: '22 horas atrás',
    upvotes: 18,
    isBestAnswer: true,
  },
];