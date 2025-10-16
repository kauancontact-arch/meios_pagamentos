# Regras de IA para o Aplicativo Aposta Zero

Este documento descreve a pilha tecnológica e as diretrizes para o desenvolvimento de funcionalidades dentro do aplicativo Aposta Zero. A adesão a estas regras garante consistência, manutenibilidade e desempenho ideal.

## Visão Geral da Pilha Tecnológica

O aplicativo Aposta Zero é construído usando uma pilha de desenvolvimento web moderna, focada em desempenho, experiência do usuário e escalabilidade.

*   **React**: Uma biblioteca JavaScript declarativa e baseada em componentes para a construção de interfaces de usuário.
*   **TypeScript**: Um superconjunto tipado de JavaScript que compila para JavaScript puro, melhorando a qualidade do código e a experiência do desenvolvedor.
*   **Vite**: Uma ferramenta de build rápida que oferece um servidor de desenvolvimento extremamente ágil e empacota seu código para produção.
*   **Tailwind CSS**: Um framework CSS utilitário para construir rapidamente designs personalizados diretamente em sua marcação.
*   **shadcn/ui**: Uma coleção de componentes reutilizáveis construídos com Radix UI e estilizados com Tailwind CSS, fornecendo primitivos de UI acessíveis e personalizáveis.
*   **Framer Motion**: Uma biblioteca de animação pronta para produção para React, que facilita a adição de animações e gestos aos componentes.
*   **Lucide React**: Uma biblioteca de ícones de código aberto bonitos e personalizáveis, integrada para elementos visuais.
*   **Supabase**: Uma alternativa de código aberto ao Firebase, fornecendo um banco de dados PostgreSQL, autenticação, APIs instantâneas e Edge Functions para serviços de backend.
*   **OpenAI Assistants API**: Utilizada através das Supabase Edge Functions para funcionalidade de coaching de IA inteligente e interações personalizadas com o usuário.
*   **Navegação Baseada em Estado Customizada**: O aplicativo gerencia sua navegação entre telas internamente usando o hook `useState` do React, renderizando componentes dinamicamente com base no estado `currentScreen`.

## Diretrizes de Uso de Bibliotecas

Para manter uma base de código consistente e eficiente, siga estas diretrizes para o uso de bibliotecas:

*   **Componentes de UI**: Sempre utilize componentes do **`shadcn/ui`** (por exemplo, `Button`, `Card`, `Input`, `Textarea`) para elementos de UI padrão. Se um componente específico não estiver disponível no `shadcn/ui` e não puder ser composto a partir de primitivos existentes, crie um novo e pequeno componente em `src/components/` e estilize-o com Tailwind CSS.
*   **Estilização**: Toda a estilização deve ser feita usando classes **Tailwind CSS**. Evite escrever CSS personalizado em arquivos `.css` ou `.module.css` separados, exceto para estilos globais em `src/index.css`.
*   **Ícones**: Utilize ícones exclusivamente da biblioteca **`lucide-react`**.
*   **Animações**: Implemente todas as animações e transições usando **`framer-motion`**.
*   **Autenticação**: Lide com a autenticação do usuário (cadastro, login, logout) através do hook **`useAuth`**, que interage com o Supabase.
*   **Gerenciamento de Dados do Usuário**: Gerencie todos os dados específicos do usuário (perfis, progresso, notificações) usando o hook **`useUserData`**, que interage com o Supabase e o armazenamento local para usuários convidados.
*   **Backend e Banco de Dados**: Todas as interações de backend, incluindo operações de banco de dados e autenticação, devem utilizar o **cliente Supabase** (`src/lib/supabase.ts`).
*   **Funcionalidade de IA**: Para quaisquer recursos impulsionados por IA, utilize as **Supabase Edge Functions** (por exemplo, `supabase/functions/ai-coach/index.ts`) que se integram com a OpenAI Assistants API.
*   **Roteamento**: O aplicativo atualmente utiliza um sistema de navegação baseado em estado customizado, definido em `src/App.tsx`. Novas telas devem ser integradas a esta lógica de navegação existente, adicionando-as ao estado `currentScreen` e à renderização condicional em `App.tsx`. Não introduza `react-router-dom` ou bibliotecas de roteamento semelhantes, a menos que seja explicitamente solicitado.
*   **Estrutura de Arquivos**:
    *   Novos componentes devem ser colocados em `src/components/`.
    *   Novas páginas devem ser colocadas em `src/pages/`.
    *   Hooks devem ser colocados em `src/hooks/`.
    *   Funções utilitárias devem ser colocadas em `src/lib/` ou `src/utils/`.
    *   Mantenha os arquivos pequenos e focados, idealmente com menos de 100 linhas para componentes.