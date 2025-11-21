import { Event } from '@/types';

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Workshop: Introdução ao Pix',
    description: 'Aprenda os fundamentos do Pix, desde a criação de chaves até a implementação de webhooks. Workshop prático com exemplos reais.',
    type: 'workshop',
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias no futuro
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 horas depois
    location: 'São Paulo, SP',
    remote_link: 'https://meet.google.com/abc-defg-hij',
    max_attendees: 50,
    created_by: 'admin-1',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-2',
    title: 'Palestra: O Futuro dos Pagamentos Digitais',
    description: 'Discussão sobre tendências emergentes nos pagamentos digitais, incluindo criptomoedas, BNPL e open banking.',
    type: 'lecture',
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias no futuro
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 horas depois
    location: 'Rio de Janeiro, RJ',
    max_attendees: 100,
    created_by: 'user-1',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-3',
    title: 'Reunião Remota: Compliance e Regulamentação',
    description: 'Discussão mensal sobre atualizações regulatórias no setor de pagamentos. Participação aberta a todos os membros.',
    type: 'remote_meeting',
    start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias no futuro
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 horas depois
    remote_link: 'https://zoom.us/j/123456789',
    max_attendees: 200,
    created_by: 'admin-1',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-4',
    title: 'Conferência Anual de Pagamentos 2024',
    description: 'O maior evento do ano para profissionais de pagamentos. Palestrantes internacionais, networking e workshops práticos.',
    type: 'conference',
    start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias no futuro
    end_date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias depois
    location: 'Centro de Convenções, São Paulo',
    max_attendees: 500,
    created_by: 'user-2',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-5',
    title: 'Meetup: Open Finance na Prática',
    description: 'Encontro presencial para discutir implementações reais de Open Finance. Compartilhe experiências e aprenda com cases de sucesso.',
    type: 'in_person',
    start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias no futuro
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 horas depois
    location: 'Coworking TechHub, Belo Horizonte',
    max_attendees: 30,
    created_by: 'user-1',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'event-6',
    title: 'Workshop: Segurança em Transações Online',
    description: 'Workshop intensivo sobre melhores práticas de segurança, prevenção de fraudes e compliance PCI DSS.',
    type: 'workshop',
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias no passado
    end_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 horas depois
    location: 'Auditório Empresa X, Porto Alegre',
    max_attendees: 40,
    created_by: 'admin-1',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];