import { MentorshipRequest } from '@/types';

export const mockMentorshipRequests: MentorshipRequest[] = [
  {
    id: 'request-1',
    mentorId: 'mentor-1',
    menteeId: 'user-current', // This would be the current user
    status: 'pending',
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    message: 'Olá Ana! Estou interessado em aprender mais sobre adquirência internacional. Você poderia me ajudar?',
    proposedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
  },
  {
    id: 'request-2',
    mentorId: 'mentor-2',
    menteeId: 'user-current',
    status: 'accepted',
    requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    message: 'Bruno, preciso de ajuda com arquitetura de microsserviços para um sistema de pagamentos.',
    proposedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
  },
];