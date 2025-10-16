import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, BookOpen, Target, ArrowLeft, Lock, Crown, ChevronLeft, ChevronRight, Award, Flame } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { useUserData } from '@/hooks/useUserData';

interface ProgramProps {
  onBack: () => void;
  userData: {
    days_clean: number;
    money_saved: number;
    time_saved: number;
    daily_bet_average: number;
    plan_type: 'free' | 'premium';
  };
  user: User | null;
  userDataHook: ReturnType<typeof useUserData>;
  completedLessons: number;
  completedChallenges: number;
}

interface Lesson {
  day: number;
  title: string;
  content: string;
  challenge: string;
  category: 'foundation' | 'psychology' | 'finance' | 'lifestyle' | 'advanced';
}


const lessons: Lesson[] = [
  // Semana 1: Fundamentos (Acesso Gratuito)
  { day: 1, title: "O primeiro passo", content: "Reconhecer o problema é o primeiro passo para a recuperação. Você já deu esse passo corajoso ao estar aqui.", challenge: "Escreva 3 motivos pelos quais você quer parar de apostar.", category: 'foundation' },
  { day: 2, title: "Entendendo o vício", content: "O vício em apostas afeta o cérebro da mesma forma que outras dependências, liberando dopamina e criando ciclos viciosos.", challenge: "Identifique seus principais gatilhos para apostar.", category: 'foundation' },
  { day: 3, title: "O custo real", content: "Além do dinheiro perdido, as apostas custam tempo, relacionamentos, saúde mental e oportunidades futuras.", challenge: "Calcule quanto você gastou nos últimos 3 meses.", category: 'foundation' },
  { day: 4, title: "Bloqueando tentações", content: "Remova aplicativos de apostas, bloqueie sites e evite ambientes que estimulem o comportamento.", challenge: "Delete todos os apps de apostas do seu celular.", category: 'foundation' },
  { day: 5, title: "Rede de apoio", content: "Conte para pessoas próximas sobre sua decisão. O apoio social é fundamental para a recuperação.", challenge: "Converse com uma pessoa de confiança sobre sua jornada.", category: 'foundation' },
  { day: 6, title: "Substituindo hábitos", content: "Substitua o tempo gasto apostando por atividades saudáveis: exercícios, hobbies, leitura.", challenge: "Escolha uma atividade para fazer quando sentir vontade de apostar.", category: 'foundation' },
  { day: 7, title: "Primeira semana completa", content: "Parabéns! Você completou sua primeira semana. Isso prova que você tem força para continuar.", challenge: "Celebre sua conquista de forma saudável.", category: 'foundation' },
  
  // Semana 2: Psicologia (Acesso Gratuito)
  { day: 8, title: "Como os cassinos te prendem", content: "Cassinos usam luzes, sons e recompensas variáveis para criar dependência. Conhecer essas táticas te protege.", challenge: "Liste 3 táticas que você reconhece ter afetado você.", category: 'psychology' },
  { day: 9, title: "O mito da sorte", content: "Apostas são matemática, não sorte. A casa sempre tem vantagem estatística a longo prazo.", challenge: "Pesquise as probabilidades reais de seus jogos favoritos.", category: 'psychology' },
  { day: 10, title: "Pensamento mágico", content: "Superstições e \"sistemas\" de apostas são ilusões. Não existe fórmula para vencer a matemática.", challenge: "Identifique suas superstições sobre apostas.", category: 'psychology' },
  { day: 11, title: "Lidando com recaídas", content: "Recaídas podem acontecer. O importante é não desistir e aprender com cada experiência.", challenge: "Crie um plano de ação para momentos de fraqueza.", category: 'psychology' },
  { day: 12, title: "Mindfulness e presença", content: "Práticas de atenção plena ajudam a reconhecer impulsos sem agir sobre eles.", challenge: "Pratique 10 minutos de respiração consciente.", category: 'psychology' },
  { day: 13, title: "Reescrevendo sua história", content: "Você não é suas apostas passadas. Cada dia limpo é uma nova página da sua história.", challenge: "Escreva como você quer ser lembrado daqui a 5 anos.", category: 'psychology' },
  { day: 14, title: "Duas semanas de força", content: "Duas semanas mostram que mudança real é possível. Seu cérebro já está se adaptando.", challenge: "Reflita sobre as mudanças positivas que já notou.", category: 'psychology' },

  // Conteúdo Premium (A partir do Dia 15)
  { day: 15, title: "Planejamento financeiro", content: "Crie um orçamento realista e estabeleça metas financeiras claras para substituir a emoção das apostas.", challenge: "Faça um orçamento mensal detalhado.", category: 'finance' },
  { day: 16, title: "Investimentos seguros", content: "Aprenda sobre investimentos de baixo risco que podem fazer seu dinheiro crescer de forma consistente.", challenge: "Pesquise sobre CDB, Tesouro Direto ou poupança.", category: 'finance' },
  { day: 17, title: "Fundo de emergência", content: "Construa uma reserva de emergência para reduzir ansiedade financeira e tentações de apostas rápidas.", challenge: "Defina uma meta para seu fundo de emergência.", category: 'finance' },
  { day: 18, title: "Controle de impulsos", content: "Técnicas avançadas para reconhecer e controlar impulsos antes que se tornem ações.", challenge: "Pratique a técnica dos 10 minutos quando sentir impulso.", category: 'psychology' },
  { day: 19, title: "Exercícios e endorfinas", content: "Atividade física libera endorfinas naturais, substituindo a busca por emoções nas apostas.", challenge: "Faça 30 minutos de exercício hoje.", category: 'lifestyle' },
  { day: 20, title: "Relacionamentos saudáveis", content: "Reconstrua relacionamentos danificados pelas apostas e cultive conexões genuínas.", challenge: "Entre em contato com alguém que você magoou.", category: 'lifestyle' },
  { day: 21, title: "Metas de longo prazo", content: "Estabeleça objetivos de 1, 5 e 10 anos que sejam incompatíveis com apostas.", challenge: "Escreva suas 3 principais metas de vida.", category: 'lifestyle' },
  { day: 22, title: "Dormir bem, viver melhor", content: "O sono regula emoções, foco e reduz impulsos; insônia alimenta recaídas.", challenge: "Defina um horário fixo para dormir hoje.", category: 'lifestyle' },
  { day: 23, title: "Alimentação consciente", content: "Uma dieta equilibrada estabiliza humor e energia, reduzindo gatilhos.", challenge: "Prepare uma refeição saudável e anote como se sente depois.", category: 'lifestyle' },
  { day: 24, title: "Meditação guiada", content: "Meditar ajuda a observar pensamentos sem agir sobre eles.", challenge: "Faça uma meditação guiada de 15 minutos.", category: 'psychology' },
  { day: 25, title: "Criando rotina produtiva", content: "Estrutura no dia reduz espaços para recaídas.", challenge: "Monte sua agenda diária com pelo menos 3 blocos de atividades.", category: 'lifestyle' },
  { day: 26, title: "Pequenas vitórias", content: "Celebrar vitórias cria motivação sustentável.", challenge: "Escolha uma forma saudável de se recompensar hoje.", category: 'psychology' },
  { day: 27, title: "Criatividade como cura", content: "Atividades criativas reduzem ansiedade e melhoram autoestima.", challenge: "Desenhe, escreva ou crie algo por 30 minutos.", category: 'lifestyle' },
  { day: 28, title: "Autocompaixão", content: "Recuperação exige paciência e bondade consigo mesmo.", challenge: "Escreva uma carta de apoio para si mesmo.", category: 'psychology' },
  { day: 29, title: "Três semanas completas", content: "Três semanas sem apostar mostram disciplina e foco.", challenge: "Compartilhe sua conquista com alguém de confiança.", category: 'foundation' },
  { day: 30, title: "Um mês de liberdade", content: "Trinta dias representam uma mudança real de hábitos. Você provou que pode viver sem apostas.", challenge: "Comemore com algo especial que sempre quis fazer.", category: 'foundation' },
  { day: 31, title: "O poder da disciplina", content: "Disciplina vale mais que motivação momentânea.", challenge: "Crie um hábito diário que quer manter além da recuperação.", category: 'psychology' },
  { day: 32, title: "Lidando com gatilhos sociais", content: "Festas, bares ou amigos que apostam podem ser riscos.", challenge: "Identifique 2 situações sociais de risco e planeje como evitá-las.", category: 'psychology' },
  { day: 33, title: "Dinheiro sob controle", content: "Planilhas/apps dão clareza e evitam compulsões.", challenge: "Registre todas as suas despesas de hoje.", category: 'finance' },
  { day: 34, title: "Gratidão diária", content: "Gratidão reduz estresse e fortalece bem-estar.", challenge: "Escreva 5 coisas pelas quais é grato hoje.", category: 'psychology' },
  { day: 35, title: "O corpo como aliado", content: "Alongamentos e exercícios aliviam tensão.", challenge: "Faça 20 minutos de alongamento ou yoga.", category: 'lifestyle' },
  { day: 36, title: "Redefinindo diversão", content: "Diversão sem apostas é possível e necessária.", challenge: "Programe uma atividade divertida sem envolvimento com apostas.", category: 'lifestyle' },
  { day: 37, title: "Resiliência em ação", content: "Resiliência é levantar após quedas.", challenge: "Liste 3 situações em que superou dificuldades.", category: 'psychology' },
  { day: 38, title: "Redes de apoio ampliadas", content: "Grupos/comunidades mantêm foco.", challenge: "Participe de um grupo de apoio ou fórum hoje.", category: 'foundation' },
  { day: 39, title: "Visualização positiva", content: "Ver-se livre das apostas fortalece a mente.", challenge: "Visualize sua vida em 1 ano sem apostar e anote 3 cenas.", category: 'psychology' },
  { day: 40, title: "Reconstruindo confiança", content: "Confiança volta com atitudes consistentes.", challenge: "Faça algo concreto para restaurar a confiança de alguém.", category: 'lifestyle' },
  { day: 41, title: "Autocontrole financeiro", content: "Compras impulsivas imitam o jogo.", challenge: "Passe um dia gastando só o essencial.", category: 'finance' },
  { day: 42, title: "Reconhecendo emoções", content: "Nomear emoções evita agir no automático.", challenge: "Anote todas as emoções sentidas hoje e quando surgiram.", category: 'psychology' },
  { day: 43, title: "O ciclo do vício", content: "Entender o ciclo ajuda a interrompê-lo cedo.", challenge: "Descreva seu ciclo pessoal e um ponto de quebra.", category: 'psychology' },
  { day: 44, title: "Altruísmo e propósito", content: "Ajudar outros fortalece sua recuperação.", challenge: "Faça uma boa ação hoje, por pequena que seja.", category: 'lifestyle' },
  { day: 45, title: "Metade do mês 2", content: "O progresso é real e mensurável.", challenge: "Releia desafios passados e marque os que viraram hábitos.", category: 'foundation' },
  { day: 46, title: "Evitando autossabotagem", content: "\"Só uma vez\" é armadilha.", challenge: "Escreva sua resposta padrão para quando esse pensamento surgir.", category: 'psychology' },
  { day: 47, title: "Pequenos prazeres", content: "Valorizar o simples traz satisfação diária.", challenge: "Curta um momento simples com atenção plena.", category: 'lifestyle' },
  { day: 48, title: "Estresse sob controle", content: "Técnicas de relaxamento previnem recaídas.", challenge: "Pratique respiração, música ou banho quente por 15 minutos.", category: 'psychology' },
  { day: 49, title: "Honestidade radical", content: "Sinceridade previne recaídas escondidas.", challenge: "Compartilhe uma dificuldade atual com alguém de confiança.", category: 'foundation' },
  { day: 50, title: "Planejamento de futuro", content: "Futuro claro afasta tentações.", challenge: "Escreva 3 objetivos para os próximos 6 meses.", category: 'lifestyle' },
  { day: 51, title: "Força mental", content: "Mente treinada resiste melhor a impulsos.", challenge: "Leia 15 minutos de algo inspirador.", category: 'psychology' },
  { day: 52, title: "Reconstruindo autoestima", content: "Recuperação reergue sua autoimagem.", challenge: "Anote 3 qualidades suas que admira.", category: 'psychology' },
  { day: 53, title: "Resgatando sonhos antigos", content: "Sonhos foram deixados de lado — recupere-os.", challenge: "Liste 2 sonhos antigos a retomar e um primeiro passo.", category: 'lifestyle' },
  { day: 54, title: "Cortando contatos nocivos", content: "Pessoas ligadas ao jogo podem sabotar.", challenge: "Identifique 1 contato a se afastar e como fará isso.", category: 'foundation' },
  { day: 55, title: "Foco no presente", content: "Presença reduz ansiedade e ruminação.", challenge: "Faça uma atividade sem multitarefas por 20 minutos.", category: 'psychology' },
  { day: 56, title: "Aprendendo com recaídas", content: "Erros viram lições quando analisados.", challenge: "Escreva 3 aprendizados de recaídas passadas.", category: 'psychology' },
  { day: 57, title: "Conexão com a natureza", content: "Natureza acalma e renova.", challenge: "Passe 30 minutos ao ar livre, sem celular.", category: 'lifestyle' },
  { day: 58, title: "Inspiração externa", content: "Histórias de superação motivam.", challenge: "Leia/assista uma história de recuperação e anote 3 insights.", category: 'psychology' },
  { day: 59, title: "Preparando os 2 meses", content: "Um marco importante se aproxima.", challenge: "Planeje uma comemoração saudável e simples.", category: 'foundation' },
  { day: 60, title: "Dois meses de crescimento", content: "Sessenta dias mostram transformação profunda. Você não é mais a mesma pessoa que começou.", challenge: "Compare sua vida hoje com há 60 dias.", category: 'advanced' },
  { day: 61, title: "Consolidando hábitos", content: "Hábito sólido nasce da repetição.", challenge: "Eleja 1 hábito saudável para reforçar hoje.", category: 'lifestyle' },
  { day: 62, title: "Reconstruindo crédito", content: "Apostas afetam dívidas e crédito; organize-se.", challenge: "Levante sua situação financeira e trace um plano.", category: 'finance' },
  { day: 63, title: "Propósito de vida", content: "Um propósito forte protege contra recaídas.", challenge: "Escreva qual propósito guia suas decisões agora.", category: 'psychology' },
  { day: 64, title: "Evitando comparação", content: "Comparar-se mina autoestima.", challenge: "Anote 3 conquistas pessoais sem se comparar.", category: 'psychology' },
  { day: 65, title: "Lidando com ansiedade", content: "Técnicas práticas reduzem ansiedade.", challenge: "Pratique a respiração 4-7-8 por 5 ciclos.", category: 'psychology' },
  { day: 66, title: "Metas em micro-passos", content: "Dividir metas aumenta a execução.", challenge: "Pegue uma meta e quebre em 3 passos pequenos.", category: 'lifestyle' },
  { day: 67, title: "Cultivando paciência", content: "Paciência sustenta o longo prazo.", challenge: "Faça algo que exija paciência (cozinhar, puzzle).", category: 'psychology' },
  { day: 68, title: "Autonomia financeira", content: "Renda saudável reduz dependências.", challenge: "Identifique 1 forma realista de aumentar renda.", category: 'finance' },
  { day: 69, title: "Progresso oculto", content: "Nem todo ganho é visível.", challenge: "Liste 3 áreas que melhoraram sem você notar.", category: 'psychology' },
  { day: 70, title: "Prevenção de recaídas", content: "Prevenir é mais eficaz que remediar.", challenge: "Escreva 5 estratégias de prevenção para os próximos meses.", category: 'advanced' },
  { day: 71, title: "Relacionamento com dinheiro", content: "Dinheiro deve ser aliado, não gatilho.", challenge: "Anote como você se sente ao lidar com dinheiro e por quê.", category: 'finance' },
  { day: 72, title: "Trabalho com propósito", content: "Ajustes no trabalho elevam satisfação.", challenge: "Liste 3 ações para tornar o trabalho mais gratificante.", category: 'lifestyle' },
  { day: 73, title: "Respeitando limites", content: "Dizer \"não\" protege sua energia.", challenge: "Diga não a algo que não contribui para seu progresso.", category: 'psychology' },
  { day: 74, title: "Paciência nos relacionamentos", content: "Ouvir e acolher fortalecem vínculos.", challenge: "Faça uma conversa ouvindo sem interromper.", category: 'lifestyle' },
  { day: 75, title: "Três quartos da jornada", content: "Você percorreu um longo caminho.", challenge: "Revise conquistas desde o dia 1 e escolha 1 para celebrar hoje.", category: 'advanced' },
  { day: 76, title: "Criando legado", content: "Sua história pode inspirar.", challenge: "Escreva o impacto que quer deixar na família/comunidade.", category: 'advanced' },
  { day: 77, title: "Enfrentando a solidão", content: "Solidão é gatilho comum.", challenge: "Contate alguém com quem não fala há tempos.", category: 'psychology' },
  { day: 78, title: "Disciplina financeira", content: "Guardar é autocuidado, não sacrifício.", challenge: "Transfira uma quantia simbólica para sua reserva.", category: 'finance' },
  { day: 79, title: "Reforçando identidade", content: "Você não é \"apostador\"; é resiliente.", challenge: "Escreva uma frase-mantra da sua nova identidade.", category: 'psychology' },
  { day: 80, title: "Novos prazeres", content: "Substitua a adrenalina por prazeres saudáveis.", challenge: "Experimente uma atividade prazerosa inédita hoje.", category: 'lifestyle' },
  { day: 81, title: "Autonomia emocional", content: "Validar-se reduz dependência externa.", challenge: "Anote 3 formas de se acolher num dia difícil.", category: 'psychology' },
  { day: 82, title: "Celebrando progresso", content: "Recompensas sustentam motivação.", challenge: "Presenteie-se com algo saudável e simples.", category: 'lifestyle' },
  { day: 83, title: "Respeite seus limites físicos", content: "O corpo sinaliza necessidades.", challenge: "Durma 1 hora mais cedo hoje.", category: 'lifestyle' },
  { day: 84, title: "Mentalidade de crescimento", content: "Acreditar na evolução aumenta resiliência.", challenge: "Escreva 1 aprendizado inesperado desta jornada.", category: 'psychology' },
  { day: 85, title: "Reconciliação", content: "Perdão traz leveza e foco.", challenge: "Escreva uma carta de perdão (mesmo que não entregue).", category: 'psychology' },
  { day: 86, title: "Futuro financeiro", content: "Planejamento de longo prazo dá segurança.", challenge: "Defina 1 meta financeira para 5 anos.", category: 'finance' },
  { day: 87, title: "Aprendizado contínuo", content: "Estudar mantém a mente ativa e protegida.", challenge: "Dedique 20 minutos a aprender algo novo.", category: 'lifestyle' },
  { day: 88, title: "Recompensas naturais", content: "O cérebro pode amar o simples.", challenge: "Liste 3 prazeres simples do seu dia.", category: 'psychology' },
  { day: 89, title: "Um passo da vitória", content: "Você está a um dia de 90 — a transformação é real!", challenge: "Escreva uma mensagem de motivação para seu \"eu do futuro\".", category: 'advanced' },
  { day: 90, title: "Formatura Aposta Zero", content: "Noventa dias. Você não apenas parou de apostar — você se transformou. Esta é sua formatura no Aposta Zero: prova viva de coragem, disciplina e amor próprio. A partir de hoje, entre no Modo Manutenção do app: check-ins semanais, acompanhamento do Mentor Inteligente e participação na comunidade para seguir crescendo. Sua história inspira — obrigado por confiar no Aposta Zero.", challenge: "Escreva uma carta para o seu \"eu do Dia 1\" contando como você venceu. Publique um breve depoimento no app para inspirar outros e defina sua próxima meta (180 dias).", category: 'advanced' }
];

export function Program({ onBack, userData, user, userDataHook, completedLessons, completedChallenges }: ProgramProps) {
  // Determine access level
  const freeAccessLimit = 14; // First 14 lessons for free users
  const maxAccessibleLesson = userData.plan_type === 'premium' ? lessons.length : freeAccessLimit;
  const accessibleLessons = lessons.slice(0, maxAccessibleLesson);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(Math.min(userData.days_clean, maxAccessibleLesson - 1));
  const [loading, setLoading] = useState(false);
  const [challengeResponse, setChallengeResponse] = useState("");

  // Sync currentLessonIndex with userData.days_clean when it changes
  useEffect(() => {
    const newLessonIndex = Math.min(userData.days_clean, maxAccessibleLesson - 1);
    setCurrentLessonIndex(newLessonIndex);
  }, [userData.days_clean, maxAccessibleLesson]);

  // Get local progress from userDataHook
  const localProgress = userDataHook.userData ? 
    (user ? {} : JSON.parse(localStorage.getItem('aposta-zero-progress') || '{}')) : 
    {};

  const isLessonCompleted = (lessonDay: number) => {
    if (user) {
      // For authenticated users, check if lesson is in completed lessons count
      // This is a simplified check - in a real implementation you'd want more detailed tracking
      return lessonDay <= completedLessons;
    } else {
      // For guests, check localStorage
      return localProgress[lessonDay]?.lesson_completed || false;
    }
  };

  const isChallengeCompleted = (lessonDay: number) => {
    if (user) {
      // For authenticated users, we need to check if this specific lesson's challenge is completed
      // This is a simplified approach - ideally we'd have more detailed progress tracking
      return localProgress[lessonDay]?.challenge_completed || false;
    } else {
      // For guests, check localStorage
      return localProgress[lessonDay]?.challenge_completed || false;
    }
  };

  const completeLesson = async (lessonDay: number) => {
    setLoading(true);
    
    try {
      // Use userDataHook to update progress, which will handle both Supabase and localStorage
      await userDataHook.updateUserProgress(lessonDay, isChallengeCompleted(lessonDay));
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (lessonDay: number) => {
    if (!challengeResponse.trim()) {
      alert("Por favor, escreva sua resposta ao desafio antes de completar.");
      return;
    }

    setLoading(true);
    
    try {
      // Use userDataHook to update progress with challenge completed
      await userDataHook.updateUserProgress(lessonDay, true);
        setChallengeResponse("");
        alert("Desafio completado com sucesso!");
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLesson = accessibleLessons[currentLessonIndex];
  
  // Check if current lesson is available (based on days clean)
  const isLessonAvailable = currentLesson.day <= userData.days_clean + 1;
  const isCurrentDayLesson = currentLesson.day === userData.days_clean + 1;
  const isCompletedLesson = isLessonCompleted(currentLesson.day);
  const isFutureLesson = currentLesson.day > userData.days_clean + 1;

  // Free users upgrade prompt
  if (userData.plan_type === 'free' && currentLessonIndex >= freeAccessLimit) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto space-y-6"
      >
        <Card className="shadow-xl rounded-3xl border-0 bg-gradient-to-br from-white to-yellow-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Programa Premium</h2>
            <p className="text-gray-600 mb-6">
              Você completou as lições gratuitas! O programa completo de 90 dias está disponível no Premium.
            </p>
            <div className="mb-6 p-4 bg-purple-50 rounded-xl">
              <h3 className="font-semibold text-purple-800 mb-2">Com o Premium você terá:</h3>
              <ul className="text-sm text-purple-700 space-y-1 text-left">
                <li>• 90 lições estruturadas completas</li>
                <li>• Desafios práticos diários</li>
                <li>• Sistema de recompensas e badges</li>
                <li>• Progresso sincronizado na nuvem</li>
                <li>• Certificado de conclusão</li>
              </ul>
            </div>
            <Button 
              className="w-full mb-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              onClick={() => onBack()}
            >
              <Crown className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
            <Button variant="outline" className="w-full" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'foundation': return 'from-green-400 to-green-600';
      case 'psychology': return 'from-blue-400 to-blue-600';
      case 'finance': return 'from-yellow-400 to-yellow-600';
      case 'lifestyle': return 'from-purple-400 to-purple-600';
      case 'advanced': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'foundation': return 'Fundamentos';
      case 'psychology': return 'Psicologia';
      case 'finance': return 'Finanças';
      case 'lifestyle': return 'Estilo de Vida';
      case 'advanced': return 'Avançado';
      default: return 'Geral';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      {/* Program Header */}
      <Card className="shadow-xl rounded-3xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(currentLesson.category)} rounded-full flex items-center justify-center`}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Programa de Recuperação</h2>
                <p className="text-sm text-gray-500">
                  {userData.plan_type === 'premium' ? '90 dias completos' : '14 lições gratuitas'}
                </p>
              </div>
            </div>
            {userData.plan_type === 'premium' && (
              <Crown className="w-6 h-6 text-purple-600" />
            )}
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
              <BookOpen className="w-6 h-6 mx-auto mb-1 text-blue-500" />
              <p className="font-bold text-lg text-gray-800">{completedLessons}</p>
              <p className="text-xs text-gray-500">Lições</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
              <Target className="w-6 h-6 mx-auto mb-1 text-orange-500" />
              <p className="font-bold text-lg text-gray-800">{completedChallenges}</p>
              <p className="text-xs text-gray-500">Desafios</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
              <Flame className="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p className="font-bold text-lg text-gray-800">{Math.floor((completedLessons / maxAccessibleLesson) * 100)}%</p>
              <p className="text-xs text-gray-500">Progresso</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
              <span className="text-xs text-gray-600">{completedLessons}/{maxAccessibleLesson}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedLessons / maxAccessibleLesson) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Lesson */}
      <Card className="shadow-xl rounded-3xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(currentLesson.category)} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">{currentLesson.day}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{currentLesson.title}</h3>
                <p className="text-sm text-gray-500">{getCategoryName(currentLesson.category)}</p>
              </div>
            </div>
            {isLessonCompleted(currentLesson.day) && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
          
          {isFutureLesson && (
            <div className="mb-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300 text-center">
              <div className="flex items-center gap-2">
                <Lock className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-yellow-800 mb-2">Lição Bloqueada</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Esta lição será liberada no <strong>dia {currentLesson.day}</strong> da sua jornada.
              </p>
              <div className="p-3 bg-white rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Você está no dia {userData.days_clean + 1}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentLesson.day - (userData.days_clean + 1)} dia(s) restante(s)
                </p>
              </div>
            </div>
          )}

          {!isFutureLesson && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentLesson.content}
              </p>
            </div>
          )}

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className={`w-full mb-4 h-12 ${
                isCompletedLesson
                  ? 'bg-green-600 hover:bg-green-700' 
                  : isFutureLesson
                  ? 'bg-gray-400 hover:bg-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => completeLesson(currentLesson.day)}
              disabled={loading || isCompletedLesson || isFutureLesson}
            >
              {isCompletedLesson ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Lição Concluída
                </>
              ) : isFutureLesson ? (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Lição Bloqueada
                </>
              ) : (
                loading ? 'Salvando...' : 'Concluir Lição'
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Daily Challenge */}
      <Card className="shadow-lg rounded-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-orange-500" />
            <h3 className="font-semibold text-lg text-gray-800">Desafio do Dia {currentLesson.day}</h3>
            {isChallengeCompleted(currentLesson.day) && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          
          <div className="mb-4 p-4 bg-orange-50 rounded-xl">
            {isFutureLesson ? (
              <div className="text-center py-6">
                <Lock className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h4 className="text-lg font-bold text-orange-800 mb-2">Desafio Bloqueado</h4>
                <p className="text-sm text-orange-700 mb-3">
                  O desafio será liberado no <strong>dia {currentLesson.day}</strong>.
                </p>
                <div className="p-3 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700">
                    Volte amanhã para descobrir seu próximo desafio!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-3">
                  {currentLesson.challenge}
                </p>
                
                {/* Challenge Response Input */}
                {isCurrentDayLesson && !isChallengeCompleted(currentLesson.day) && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Escreva sua resposta ao desafio aqui..."
                      value={challengeResponse}
                      onChange={(e) => setChallengeResponse(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                )}
                
                {isChallengeCompleted(currentLesson.day) && (
                  <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-700 font-medium">
                        Desafio completado com sucesso!
                      </p>
                    </div>
                  </div>
                )}

                {!isCurrentDayLesson && !isChallengeCompleted(currentLesson.day) && !isFutureLesson && (
                  <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Este desafio estava disponível no dia {currentLesson.day}.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline"
              className={`w-full mb-4 h-10 ${
                isChallengeCompleted(currentLesson.day) 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : isFutureLesson
                  ? 'bg-gray-50 border-gray-300 text-gray-500'
                  : 'border-orange-500 text-orange-700 hover:bg-orange-50'
              }`}
              onClick={() => completeChallenge(currentLesson.day)}
              disabled={loading || isChallengeCompleted(currentLesson.day) || isFutureLesson || !isCurrentDayLesson}
            >
              {isChallengeCompleted(currentLesson.day) ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Desafio Concluído
                </>
              ) : isFutureLesson ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Desafio Bloqueado
                </>
              ) : (
                loading ? 'Salvando...' : 'Completar Desafio'
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* Lesson Navigation */}
      <Card className="shadow-lg rounded-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Navegação</h3>
            <span className="text-sm text-gray-500">
              {currentLessonIndex + 1} de {accessibleLessons.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
              disabled={currentLessonIndex === 0}
              className="flex-1 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Anterior</span>
              <span className="sm:hidden">Ant</span>
            </Button>

            <div className="flex gap-1">
              {accessibleLessons.slice(
                Math.max(0, currentLessonIndex - 2),
                Math.min(accessibleLessons.length, currentLessonIndex + 3)
              ).map((lesson, index) => {
                const actualIndex = Math.max(0, currentLessonIndex - 2) + index;
                const isCompleted = isLessonCompleted(lesson.day);
                const isCurrent = actualIndex === currentLessonIndex;
                const isLocked = lesson.day > userData.days_clean + 1;
                
                return (
                  <button
                    key={lesson.day}
                    onClick={() => setCurrentLessonIndex(actualIndex)}
                    disabled={isLocked}
                    className={`flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-full text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-blue-500 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : isLocked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isLocked ? <Lock className="w-3 h-3" /> : lesson.day}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentLessonIndex(Math.min(accessibleLessons.length - 1, currentLessonIndex + 1))}
              disabled={currentLessonIndex === accessibleLessons.length - 1}
              className="flex-1 min-h-[44px]"
            >
              <span className="hidden sm:inline">Próxima</span>
              <span className="sm:hidden">Prox</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Locked lessons indicator for free users */}
          {userData.plan_type === 'free' && currentLessonIndex >= freeAccessLimit - 3 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-yellow-600" />
                <p className="text-xs text-yellow-700">
                  Lições {freeAccessLimit + 1}-90 disponíveis no Premium
                </p>
              </div>
            </div>
          )}
          
          {/* Daily release info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-700">
                Lições são liberadas diariamente. Você está no dia {userData.days_clean + 1} da sua jornada.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium: Achievement Summary */}
      {userData.plan_type === 'premium' && completedLessons > 0 && (
        <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-lg text-gray-800">Conquistas Recentes</h3>
            </div>
            
            <div className="space-y-2">
              {completedLessons >= 7 && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span className="text-lg">⚔️</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Guerreiro Semanal</p>
                    <p className="text-xs text-gray-500">7 lições completadas</p>
                  </div>
                </div>
              )}
              
              {completedLessons >= 14 && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span className="text-lg">🧠</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Mestre da Mente</p>
                    <p className="text-xs text-gray-500">14 lições completadas</p>
                  </div>
                </div>
              )}
              
              {completedChallenges >= 10 && (
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Desafiador</p>
                    <p className="text-xs text-gray-500">10 desafios completados</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Button 
        variant="outline" 
        className="w-full h-12 shadow-md"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Dashboard
      </Button>
    </motion.div>
  );
}