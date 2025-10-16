import { Track } from '@/types';

export const mockTracks: Track[] = [
  {
    id: 'track-1',
    title: 'Fundamentos de Pagamentos',
    description: 'Comece sua jornada aqui. Entenda os principais players, conceitos e o fluxo de uma transação do início ao fim.',
    icon: '🎓',
    authorId: 'admin-1',
    moduleCount: 5,
    totalDurationMinutes: 90,
    level: 'Iniciante',
  },
  {
    id: 'track-2',
    title: 'Tudo sobre o Pix',
    description: 'Mergulhe fundo no sistema de pagamento instantâneo brasileiro. Do QR Code à API, domine o Pix.',
    icon: '⚡',
    authorId: 'user-1',
    moduleCount: 8,
    totalDurationMinutes: 150,
    level: 'Intermediário',
  },
  {
    id: 'track-3',
    title: 'Prevenção à Fraude',
    description: 'Aprenda as técnicas e ferramentas essenciais para proteger seu negócio de transações fraudulentas.',
    icon: '🛡️',
    authorId: 'user-1',
    moduleCount: 6,
    totalDurationMinutes: 120,
    level: 'Intermediário',
  },
  {
    id: 'track-4',
    title: 'Arquitetura de Sistemas de Pagamentos',
    description: 'Para engenheiros e arquitetos. Explore os desafios de construir sistemas de pagamentos escaláveis e resilientes.',
    icon: '🏗️',
    authorId: 'user-2',
    moduleCount: 7,
    totalDurationMinutes: 180,
    level: 'Avançado',
  },
];