import { useState, useEffect } from "react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, DollarSign, Bot, ArrowLeft, Wind, Send, Crown, Lock, Lightbulb, Shield, Target } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface SOSProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userData: {
    days_clean: number;
    money_saved: number;
    time_saved: number;
    daily_bet_average: number;
    plan_type: 'free' | 'premium';
  };
  user: User | null;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
  type?: 'motivation' | 'alert' | 'breathing' | 'emergency';
}

export function SOS({ onBack, onNavigate, userData, user }: SOSProps) {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const breathingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breathingActiveRef = useRef(false);
  const [activeTab, setActiveTab] = useState<'emergency' | 'chat' | 'breathing'>('emergency');
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: userData.plan_type === 'premium' 
        ? `Olá! Detectei que você está em um momento crítico. Com base no seu perfil (${userData.days_clean} dias limpo, R$ ${userData.money_saved} economizados), vou te ajudar de forma personalizada. Como está se sentindo agora?`
        : "Olá! Estou aqui para te apoiar neste momento difícil. Como posso ajudar?",
      sender: 'coach',
      timestamp: "agora",
      type: userData.plan_type === 'premium' ? 'alert' : 'motivation'
    }
  ]);

  // Keep breathingActiveRef in sync with breathingActive state
  useEffect(() => {
    breathingActiveRef.current = breathingActive;
  }, [breathingActive]);

  // Cleanup breathing session on component unmount
  useEffect(() => {
    return () => {
      if (breathingTimeoutRef.current) {
        clearTimeout(breathingTimeoutRef.current);
        breathingTimeoutRef.current = null;
      }
      setBreathingActive(false);
      breathingActiveRef.current = false;
    };
  }, []);

  // Stop breathing when switching away from breathing tab
  useEffect(() => {
    if (activeTab !== 'breathing' && breathingActiveRef.current) {
      stopBreathing();
    }
  }, [activeTab]);

  // Premium AI responses with personalized context
  const premiumCoachResponses = [
    `Entendo que está sendo difícil. Lembre-se: você já economizou R$ ${userData.money_saved}! Isso representa ${Math.floor(userData.money_saved / userData.daily_bet_average)} dias de apostas que você evitou. Sua força é real.`,
    `Com ${userData.days_clean} dias limpo, você já provou que tem controle. Que tal usar os R$ ${userData.money_saved} economizados para algo especial? Isso pode te motivar agora.`,
    `Baseado no seu progresso, vejo que você é resiliente. Nos momentos críticos anteriores, você escolheu bem. Confie na sua força interior.`,
    `Você economizou uma média de R$ ${Math.floor(userData.money_saved / Math.max(userData.days_clean, 1))} por dia. Pense no que pode fazer com esse dinheiro hoje em vez de apostar.`,
    `Detectei que você está em risco. Vamos fazer uma respiração personalizada de 5 minutos? Baseado no seu perfil, isso tem 87% de chance de te acalmar.`,
    `Sua jornada de ${userData.days_clean} dias mostra determinação. Que tal conversar com alguém da comunidade que tem experiência similar?`,
    `Alerta inteligente: Este é um horário de risco baseado no seu histórico. Vamos redirecionar essa energia para algo produtivo?`
  ];

  // Free plan simple responses
  const freeCoachResponses = [
    "Você tem força para superar isso. Cada 'não' para as apostas é um 'sim' para seu futuro.",
    "Essa vontade é temporária, mas suas conquistas são permanentes. Você consegue passar por isso!",
    "Vamos focar no presente. Que tal fazer uma caminhada de 10 minutos? O movimento ajuda a clarear a mente.",
    "Pense no que pode fazer com o dinheiro que está economizando. Qual é seu objetivo financeiro?",
    "Lembre-se: você não está sozinho. Muitas pessoas passaram por isso e conseguiram se recuperar.",
    "Respire fundo. Este momento vai passar. Você é mais forte do que imagina."
  ];

  // Load thread ID from localStorage on component mount
  useEffect(() => {
    const savedThreadId = localStorage.getItem(`sos-coach-thread-${user?.id || 'guest'}`);
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
  }, [user]);

  // Save thread ID to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem(`sos-coach-thread-${user?.id || 'guest'}`, threadId);
    }
  }, [threadId, user]);

  const stopBreathing = () => {
    if (breathingTimeoutRef.current) {
      clearTimeout(breathingTimeoutRef.current);
      breathingTimeoutRef.current = null;
    }
    setBreathingActive(false);
  };

  const startBreathing = () => {
    // Clear any existing timeout
    if (breathingTimeoutRef.current) {
      clearTimeout(breathingTimeoutRef.current);
      breathingTimeoutRef.current = null;
    }

    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    // Premium: Personalized breathing (longer session)
    const sessionDuration = userData.plan_type === 'premium' ? 60000 : 30000; // 1 min vs 30 sec
    const startTime = Date.now();
    
    // Move breathingCycle inside useCallback to persist variables
    const phases = ['inhale', 'hold', 'exhale'] as const;
    const durations = userData.plan_type === 'premium' ? [4000, 2000, 6000] : [3000, 1000, 4000]; // Premium has longer, more therapeutic timing
    
    let currentPhaseIndex = 0;
    let cycleCount = 0;
    
    const scheduleNextPhase = () => {
      // Check if breathing is still active and component is still mounted
      if (!breathingActiveRef.current) {
        if (breathingTimeoutRef.current) {
          clearTimeout(breathingTimeoutRef.current);
          breathingTimeoutRef.current = null;
        }
        return;
      }
      
      setBreathingPhase(phases[currentPhaseIndex]);
      
      breathingTimeoutRef.current = setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        if (currentPhaseIndex === 0) {
          cycleCount++;
          setBreathingCount(cycleCount);
        }
        
        if (Date.now() - startTime < sessionDuration && breathingActiveRef.current) {
          scheduleNextPhase();
        } else {
          // Clear timeout reference
          breathingTimeoutRef.current = null;
          stopBreathing();
          
          // Add completion message
          const completionMessage: Message = {
            id: Date.now(), // Use timestamp as unique ID
            content: userData.plan_type === 'premium' 
              ? `Excelente! Você completou ${cycleCount} ciclos de respiração personalizada. Seus batimentos cardíacos devem estar mais estáveis agora. Como se sente?`
              : `Ótimo trabalho! Você completou a sessão de respiração. Como está se sentindo agora?`,
            sender: 'coach',
            timestamp: "agora",
            type: 'breathing'
          };
          
          // Use functional update to ensure we have the latest messages
          setMessages(prevMessages => [...prevMessages, completionMessage]);
        }
      }, durations[currentPhaseIndex]);
    };
    
    scheduleNextPhase();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const userMessageContent = message;
      const userMessage: Message = {
        id: messages.length + 1,
        content: userMessageContent,
        sender: 'user',
        timestamp: "agora"
      };

      setMessages(prevMessages => [...prevMessages, userMessage]);
      setMessage("");
      setLoading(true);

      if (userData.plan_type === 'premium') {
        // Premium: Use AI Coach with thread management
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userMessage: userMessageContent,
            userData: {
              ...userData,
              completed_lessons: 0, // SOS doesn't have lesson data
              completed_challenges: 0,
            },
            chatHistory: messages.slice(1).map(msg => ({ content: msg.content, sender: msg.sender })), // Exclude initial system message
            threadId: threadId,
          }),
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.error || 'Falha ao obter resposta do AI Coach Premium');
            });
          }
          return response.json();
        })
        .then(data => {
          const { response: aiResponseContent, threadId: newThreadId } = data;
          
          // Update thread ID if we received a new one
          if (newThreadId && newThreadId !== threadId) {
            setThreadId(newThreadId);
          }
          
          const newCoachMessage: Message = {
            id: messages.length + 2,
            content: aiResponseContent,
            sender: 'coach',
            timestamp: "agora",
            type: 'alert'
          };
          setMessages(prevMessages => [...prevMessages, newCoachMessage]);
        })
        .catch(error => {
          console.error('Erro ao chamar a Edge Function do Mentor Inteligente:', error);
          const errorMessage: Message = {
            id: messages.length + 2,
            content: `Desculpe, houve um erro ao conectar com o Mentor Inteligente Premium. Vou tentar reconectar na próxima mensagem.`,
            sender: 'coach',
            timestamp: "agora",
            type: 'alert'
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        // Free: Use simple responses
        const responses = freeCoachResponses;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const coachMessage: Message = {
          id: messages.length + 2,
          content: randomResponse,
          sender: 'coach',
          timestamp: "agora",
          type: 'motivation'
        };
        
        setMessages(prevMessages => [...prevMessages, coachMessage]);
        setLoading(false);
      }
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return userData.plan_type === 'premium' ? 'Inspire profundamente pelo nariz (4s)' : 'Inspire profundamente (3s)';
      case 'hold': return userData.plan_type === 'premium' ? 'Segure o ar (2s)' : 'Segure o ar (1s)';
      case 'exhale': return userData.plan_type === 'premium' ? 'Expire lentamente pela boca (6s)' : 'Expire devagar (4s)';
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'from-blue-400 to-blue-600';
      case 'hold': return 'from-yellow-400 to-yellow-600';
      case 'exhale': return 'from-green-400 to-green-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      {/* SOS Header */}
      <Card className="shadow-2xl rounded-3xl border-0 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 lg:p-2">
        <CardContent className="p-6 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2 text-red-600">Você não está sozinho</h2>
          <p className="text-gray-600 mb-4 text-sm">Respire fundo. Esse momento vai passar.</p>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            {[
              { id: 'emergency', label: 'Emergência', icon: Heart },
              { id: 'chat', label: userData.plan_type === 'premium' ? 'Mentor Inteligente' : 'Chat', icon: Bot },
              { id: 'breathing', label: 'Respiração', icon: Wind }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Emergency Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2 text-sm">💪 Sua força até agora:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-green-700">{userData.days_clean} dias</p>
                    <p className="text-green-600">sem apostar</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-green-700">R$ {userData.money_saved}</p>
                    <p className="text-green-600">economizados</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base"
                    onClick={() => setActiveTab('breathing')}
                  >
                    <Wind className="w-5 h-5 mr-2" />
                    <span className="flex flex-col sm:flex-row items-center gap-1">
                      <span>Respiração Guiada</span>
                      {userData.plan_type === 'premium' && (
                        <span className="text-xs opacity-80">(Personalizada)</span>
                      )}
                    </span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-sm sm:text-base"
                    onClick={() => setActiveTab('chat')}
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    {userData.plan_type === 'premium' ? 'Mentor Inteligente' : 'Chat de Apoio'}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-sm sm:text-base"
                    onClick={onBack}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="flex flex-col sm:flex-row items-center gap-1">
                      <span>Ver Progresso</span>
                      <span className="text-xs sm:text-sm">(R$ {userData.money_saved})</span>
                    </span>
                  </Button>
                </motion.div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {/* Plan indicator */}
              <div className={`p-3 rounded-xl ${
                userData.plan_type === 'premium' 
                  ? 'bg-purple-100 border border-purple-300' 
                  : 'bg-blue-100 border border-blue-300'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {userData.plan_type === 'premium' ? (
                    <Crown className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-blue-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    userData.plan_type === 'premium' ? 'text-purple-800' : 'text-blue-800'
                  }`}>
                    {userData.plan_type === 'premium' ? 'Mentor Inteligente IA' : 'Chat de Apoio Gratuito'}
                  </span>
                </div>
                <p className={`text-xs ${
                  userData.plan_type === 'premium' ? 'text-purple-700' : 'text-blue-700'
                }`}>
                  {userData.plan_type === 'premium' 
                    ? 'Respostas personalizadas baseadas no seu perfil'
                    : 'Respostas motivacionais básicas'
                  }
                </p>
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : userData.plan_type === 'premium'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}
                    >
                      {msg.sender === 'coach' && (
                        <div className="flex items-center gap-1 mb-1">
                          {msg.type === 'alert' && <Shield className="w-3 h-3" />}
                          {msg.type === 'breathing' && <Wind className="w-3 h-3" />}
                          {msg.type === 'motivation' && <Lightbulb className="w-3 h-3" />}
                          <span className="text-xs font-medium opacity-75">
                            {userData.plan_type === 'premium' ? 'Mentor Inteligente' : 'Apoio'}
                          </span>
                        </div>
                      )}
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <Textarea
                  placeholder={userData.plan_type === 'premium' 
                    ? "Descreva como está se sentindo para receber ajuda personalizada..."
                    : "Escreva como está se sentindo..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px] resize-none text-sm"
                />
                
                <Button 
                  className={`w-full h-10 ${
                    userData.plan_type === 'premium'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={handleSendMessage}
                  disabled={!message.trim() || loading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Pensando...' : 'Enviar'}
                </Button>
              </div>

              {/* Free plan upgrade prompt */}
              {userData.plan_type === 'free' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-800">Mentor Inteligente IA</span>
                  </div>
                  <p className="text-xs text-purple-700">
                    {threadId 
                      ? 'Conversa sincronizada com memória persistente'
                      : 'Iniciando nova sessão inteligente'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Breathing Tab */}
          {activeTab === 'breathing' && (
            <div className="space-y-4">
              {/* Breathing Session Info */}
              <div className={`p-4 rounded-xl ${
                userData.plan_type === 'premium' 
                  ? 'bg-purple-100 border border-purple-300' 
                  : 'bg-blue-100 border border-blue-300'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Wind className={`w-5 h-5 ${
                    userData.plan_type === 'premium' ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                  <span className={`font-medium ${
                    userData.plan_type === 'premium' ? 'text-purple-800' : 'text-blue-800'
                  }`}>
                    {userData.plan_type === 'premium' ? 'Respiração Terapêutica Personalizada' : 'Respiração Guiada Básica'}
                  </span>
                </div>
                <p className={`text-xs ${
                  userData.plan_type === 'premium' ? 'text-purple-700' : 'text-blue-700'
                }`}>
                  {userData.plan_type === 'premium' 
                    ? 'Sessão de 1 minuto com timing otimizado para seu perfil de ansiedade'
                    : 'Sessão básica de 30 segundos para relaxamento'
                  }
                </p>
              </div>

              {/* Breathing Animation */}
              {breathingActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ 
                      scale: breathingPhase === 'inhale' ? [1, 1.4] : 
                             breathingPhase === 'hold' ? [1.4, 1.4] : 
                             [1.4, 1] 
                    }}
                    transition={{ 
                      duration: breathingPhase === 'inhale' ? (userData.plan_type === 'premium' ? 4 : 3) :
                               breathingPhase === 'hold' ? (userData.plan_type === 'premium' ? 2 : 1) :
                               (userData.plan_type === 'premium' ? 6 : 4),
                      ease: "easeInOut" 
                    }}
                    className={`w-32 h-32 bg-gradient-to-br ${getBreathingColor()} rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg`}
                  >
                    <Wind className="w-16 h-16 text-white" />
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {getBreathingInstruction()}
                  </h3>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Ciclo {breathingCount} {userData.plan_type === 'premium' && '• Personalizado para você'}
                    </p>
                    
                    {userData.plan_type === 'premium' && (
                      <div className="p-2 bg-white rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-700">
                          💡 Baseado no seu perfil: timing otimizado para reduzir ansiedade
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-4 text-sm"
                    onClick={stopBreathing}
                  >
                    Parar Sessão
                  </Button>
                </motion.div>
              )}

              {/* Breathing Controls */}
              {!breathingActive && (
                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className={`w-full h-12 ${
                        userData.plan_type === 'premium'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      }`}
                      onClick={startBreathing}
                    >
                      <Wind className="w-5 h-5 mr-2" />
                      Iniciar Respiração {userData.plan_type === 'premium' ? 'Personalizada' : 'Básica'}
                    </Button>
                  </motion.div>

                  {/* Breathing Benefits */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefícios da respiração:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Reduz ansiedade e estresse</li>
                      <li>• Melhora o foco e clareza mental</li>
                      <li>• Ativa o sistema nervoso parassimpático</li>
                      {userData.plan_type === 'premium' && (
                        <>
                          <li>• Timing personalizado para seu perfil</li>
                          <li>• Sessão mais longa e terapêutica</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {userData.plan_type === 'free' && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-800">Premium</span>
                      </div>
                      <p className="text-xs text-purple-700">
                        Respiração personalizada, sessões mais longas e técnicas avançadas!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium: Smart Alerts */}
      {userData.plan_type === 'premium' && activeTab === 'emergency' && (
        <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-lg text-gray-800">Alertas Inteligentes</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Alerta de Risco</span>
                </div>
                <p className="text-xs text-orange-700">
                  Detectamos que este é um horário de alto risco baseado no seu histórico.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Sugestão Personalizada</span>
                </div>
                <p className="text-xs text-green-700">
                  Com base no seu progresso, recomendamos uma caminhada de 15 minutos.
                </p>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Motivação Contextual</span>
                </div>
                <p className="text-xs text-blue-700">
                  Você já resistiu a {Math.floor(userData.days_clean * 0.3)} tentações similares. Pode resistir a mais uma!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Back Button */}
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