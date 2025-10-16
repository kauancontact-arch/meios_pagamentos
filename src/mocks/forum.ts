import { ForumCategory, Topic } from '@/types';

export const mockCategories: ForumCategory[] = [
    { id: 'cat-1', slug: 'credenciadores', name: 'Credenciadores', description: 'Discussões sobre adquirentes e o ecossistema de captura.', topicCount: 15, icon: '💳' },
    { id: 'cat-2', slug: 'subcredenciadores', name: 'Subcredenciadores', description: 'Tudo sobre subadquirentes, PFs e marketplaces.', topicCount: 8, icon: '🛍️' },
    { id: 'cat-3', slug: 'processadoras', name: 'Processadoras', description: 'O core do sistema: autorização, roteamento e mais.', topicCount: 12, icon: '⚙️' },
    { id: 'cat-4', slug: 'gateways', name: 'Gateways', description: 'A porta de entrada para pagamentos online.', topicCount: 10, icon: '🌐' },
    { id: 'cat-5', slug: 'bandeiras', name: 'Bandeiras', description: 'Regras, mandates e inovações das bandeiras.', topicCount: 22, icon: '🏳️' },
    { id: 'cat-6', slug: 'emissores', name: 'Emissores', description: 'O mundo da emissão de cartões e contas.', topicCount: 7, icon: '🏦' },
    { id: 'cat-7', slug: 'produtos-financeiros', name: 'Produtos Financeiros', description: 'Pix, Open Finance, Boletos, TED e outros.', topicCount: 31, icon: '💡' },
    { id: 'cat-8', slug: 'engenharia', name: 'Engenharia e Arquitetura', description: 'Tecnologia e sistemas que movem os pagamentos.', topicCount: 18, icon: '💻' },
];

export const mockTopics: Topic[] = [
    { id: 'topic-1', categoryId: 'cat-1', authorId: 'user-1', title: 'Como tratar liquidação D+1 para bandeiras internacionais?', slug: 'liquidacao-d1-internacional', createdAt: '2 horas atrás', upvotes: 12, replyCount: 3, tags: ['liquidação', 'internacional'] },
    { id: 'topic-2', categoryId: 'cat-7', authorId: 'user-2', title: 'Melhores práticas para implementação de webhooks Pix', slug: 'webhooks-pix', createdAt: '1 dia atrás', upvotes: 25, replyCount: 8, tags: ['pix', 'engenharia', 'webhook'] },
    { id: 'topic-3', categoryId: 'cat-8', authorId: 'user-2', title: 'Arquitetura de captura online: monolito vs. microsserviços', slug: 'arquitetura-captura-online', createdAt: '3 dias atrás', upvotes: 18, replyCount: 5, tags: ['arquitetura', 'escalabilidade'] },
    { id: 'topic-4', categoryId: 'cat-1', authorId: 'user-2', title: 'Discussão sobre as novas regras de chargeback da Visa', slug: 'regras-chargeback-visa', createdAt: '5 horas atrás', upvotes: 5, replyCount: 1, tags: ['chargeback', 'visa', 'regras'] },
    { id: 'topic-5', categoryId: 'cat-4', authorId: 'user-1', title: 'Comparativo de performance: Stripe vs. Pagar.me', slug: 'comparativo-gateways', createdAt: '2 dias atrás', upvotes: 30, replyCount: 12, tags: ['gateway', 'stripe', 'performance'] },
    { id: 'topic-6', categoryId: 'cat-7', authorId: 'user-1', title: 'O futuro do Open Finance no Brasil: o que esperar?', slug: 'futuro-open-finance', createdAt: '1 semana atrás', upvotes: 42, replyCount: 15, tags: ['open finance', 'bacen', 'futuro'] },
];