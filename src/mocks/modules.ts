import { Module } from '@/types';

export const mockModules: Module[] = [
  // Modules for Track 1: Fundamentos de Pagamentos
  {
    id: 'mod-1-1',
    trackId: 'track-1',
    title: 'Introdução ao Ecossistema',
    lessons: [
      { id: 'les-1-1-1', moduleId: 'mod-1-1', title: 'Quem é quem no mercado de pagamentos', type: 'video', durationMinutes: 15 },
      { id: 'les-1-1-2', moduleId: 'mod-1-1', title: 'O fluxo de uma transação com cartão', type: 'text', durationMinutes: 10 },
      { id: 'les-1-1-3', moduleId: 'mod-1-1', title: 'Quiz: Principais Players', type: 'quiz', durationMinutes: 5 },
    ],
  },
  {
    id: 'mod-1-2',
    trackId: 'track-1',
    title: 'Credenciamento e Captura',
    lessons: [
      { id: 'les-1-2-1', moduleId: 'mod-1-2', title: 'O papel do Credenciador', type: 'video', durationMinutes: 20 },
      { id: 'les-1-2-2', moduleId: 'mod-1-2', title: 'Subadquirentes e Marketplaces', type: 'video', durationMinutes: 15 },
    ],
  },
  // Modules for Track 2: Tudo sobre o Pix
  {
    id: 'mod-2-1',
    trackId: 'track-2',
    title: 'Fundamentos do Pix',
    lessons: [
      { id: 'les-2-1-1', moduleId: 'mod-2-1', title: 'A arquitetura do SPI', type: 'video', durationMinutes: 25 },
      { id: 'les-2-1-2', moduleId: 'mod-2-1', title: 'Chaves Pix e QR Codes', type: 'text', durationMinutes: 15 },
    ],
  },
];