import { useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, ArrowLeft, Lightbulb, Crown, Shield, Target, Heart, Wind } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface AICoachProps {
  onBack: () => void;
  userData: {
    days_clean: number;
    money_saved: number;
    time_saved: number;
    daily_bet_average: number;
    plan_type: 'free' | 'premium';
  };
  user: User | null;
  completedLessons: number;
  completedChallenges: number;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
  type?: 'motivation' | 'alert' | 'analysis' | 'suggestion';
}

export function AICoach({ onBack, userData, user, completedLessons, completedChallenges }: AICoachProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: userData.plan_type === 'premium' 
        ? `Olá! Sou seu Mentor Inteligente Premium. Analisei seu perfil: ${userData.days_clean} dias limpo, R$ ${userData.money_saved} economizados. Estou aqui para te apoiar com estratégias personalizadas. Como posso ajudar hoje?`
        : "Olá! Sou seu assistente de apoio. Estou aqui para te motivar nos momentos difíceis. Como posso ajudar?",
      sender: 'coach',
      timestamp: "agora",
      type: userData.plan_type === 'premium' ? 'analysis' : 'motivation'
    }
  ]);

  // Load thread ID from localStorage on component mount
  useEffect(() => {
    const savedThreadId = localStorage.getItem(`ai-coach-thread-${user?.id || 'guest'}`);
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
  }, [user]);

  // Save thread ID to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem(`ai-coach-thread-${user?.id || 'guest'}`, threadId);
    }
  }, [threadId, user]);

  // Free plan simple responses
  const freeCoachResponses = [
    "Você tem força para superar isso. Cada 'não' para as apostas é um 'sim' para seu futuro.",
    "Essa vontade é temporária, mas suas conquistas são permanentes. Você consegue passar por isso!",
    "Vamos focar no presente. Que tal fazer uma caminhada de 10 minutos? O movimento ajuda a clarear a mente.",
    "Pense no que pode fazer com o dinheiro que está economizando. Qual é seu objetivo financeiro?",
    "Lembre-se: você não está sozinho. Muitas pessoas passaram por isso e conseguiram se recuperar.",
    "Respire fundo. Este momento vai passar. Você é mais forte do que imagina."
  ];

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
        // Lógica para usuários Premium: Chamar a Edge Function
        console.log('🚀 Iniciando chamada para Edge Function...');
        console.log('📊 Dados do usuário:', {
          ...userData,
          completed_lessons: completedLessons,
          completed_challenges: completedChallenges,
        });
        console.log('💬 Histórico de chat:', messages.slice(1).map(msg => ({ content: msg.content, sender: msg.sender })));
        console.log('🔗 Thread ID atual:', threadId);
        
        const requestUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach`;
        console.log('🌐 URL da requisição:', requestUrl);
        console.log('🔑 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('🔐 Anon Key (primeiros 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));
        
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
              completed_lessons: completedLessons,
              completed_challenges: completedChallenges,
            },
            chatHistory: messages.slice(1).map(msg => ({ content: msg.content, sender: msg.sender })), // Exclude initial system message
            threadId: threadId,
          }),
        })
        .then(response => {
          console.log('📥 Resposta recebida:', response);
          console.log('✅ Status:', response.status);
          console.log('📋 Headers:', response.headers);
          
          if (!response.ok) {
            console.error('❌ Resposta não OK:', response.status, response.statusText);
            return response.json().then(errorData => {
              console.error('📄 Dados do erro:', errorData);
              throw new Error(errorData.error || 'Falha ao obter resposta do AI Coach Premium');
            });
          }
          return response.json();
        })
        .then(data => {
          console.log('📦 Dados recebidos:', data);
          const { response: aiResponseContent, threadId: newThreadId } = data;
          
          console.log('🤖 Resposta do AI:', aiResponseContent);
          console.log('🔗 Novo Thread ID:', newThreadId);
          
          // Update thread ID if we received a new one
          if (newThreadId && newThreadId !== threadId) {
            console.log('🔄 Atualizando Thread ID de', threadId, 'para', newThreadId);
            setThreadId(newThreadId);
          }
          
          const newCoachMessage: Message = {
            id: messages.length + 2,
            content: aiResponseContent,
            sender: 'coach',
            timestamp: "agora",
            type: 'analysis' // Tipo para Premium
          };
          setMessages(prevMessages => [...prevMessages, newCoachMessage]);
        })
        .catch(error => {
          console.error('💥 Erro completo:', error);
          console.error('📝 Stack trace:', error.stack);
          console.error('Erro ao chamar a Edge Function do Mentor Inteligente:', error);
          const errorMessage: Message = {
            id: messages.length + 2,
            content: `Desculpe, houve um erro ao conectar com o Mentor Inteligente Premium. Vou tentar reconectar na próxima mensagem. Por favor, tente novamente em alguns segundos.`,
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
        // Lógica para usuários Gratuitos: Usar respostas hardcoded
        const randomResponse = freeCoachResponses[Math.floor(Math.random() * freeCoachResponses.length)];
        const newCoachMessage: Message = {
          id: messages.length + 2,
          content: randomResponse,
          sender: 'coach',
          timestamp: "agora",
          type: 'motivation' // Tipo para Gratuito
        };
        setMessages(prevMessages => [...prevMessages, newCoachMessage]);
        setLoading(false); // Desativa o loading imediatamente para o plano gratuito
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md mx-auto"
    >
      <Card className="shadow-xl rounded-2xl sm:rounded-3xl border-0 h-[500px] sm:h-[600px] flex flex-col">
        <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${
              userData.plan_type === 'premium' 
                ? 'from-purple-400 to-purple-600' 
                : 'from-blue-400 to-blue-600'
            } rounded-full flex items-center justify-center`}>
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {userData.plan_type === 'premium' ? 'Mentor Inteligente Premium' : 'Chat de Apoio'}
                </h2>
                {userData.plan_type === 'premium' && (
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {userData.plan_type === 'premium' 
                  ? 'Análise inteligente e personalizada'
                  : 'Sempre aqui para você'
                }
              </p>
            </div>
          </div>

          {/* Plan Features Indicator */}
          <div className={`p-3 rounded-xl mb-4 ${
            userData.plan_type === 'premium' 
              ? 'bg-purple-100 border border-purple-300' 
              : 'bg-blue-100 border border-blue-300'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {userData.plan_type === 'premium' ? (
                <Shield className="w-4 h-4 text-purple-600" />
              ) : (
                <Heart className="w-4 h-4 text-blue-600" />
              )}
              <span className={`text-sm font-medium ${
                userData.plan_type === 'premium' ? 'text-purple-800' : 'text-blue-800'
              }`}>
                {userData.plan_type === 'premium' ? 'Modo Inteligente Ativo' : 'Modo Apoio Básico'}
              </span>
            </div>
            <p className={`text-xs ${
              userData.plan_type === 'premium' ? 'text-purple-700' : 'text-blue-700'
            }`}>
              {userData.plan_type === 'premium' 
                ? 'Respostas baseadas em análise comportamental e seu histórico'
                : 'Respostas motivacionais e apoio emocional'
              }
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                disabled={!message.trim() || loading}
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
                      {msg.type === 'analysis' && <Target className="w-3 h-3" />}
                      {msg.type === 'alert' && <Shield className="w-3 h-3" />}
                      {msg.type === 'suggestion' && <Lightbulb className="w-3 h-3" />}
                      {msg.type === 'motivation' && <Heart className="w-3 h-3" />}
                      <span className="text-xs font-medium opacity-75">
                        {userData.plan_type === 'premium' ? 'Mentor Inteligente' : 'Apoio'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="space-y-3">
            <Textarea
              placeholder={userData.plan_type === 'premium' 
                ? "Descreva seus sentimentos para análise personalizada..."
                : "Escreva como está se sentindo..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none"
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
              {loading ? 'Pensando...' : (userData.plan_type === 'premium' ? 'Analisar & Responder' : 'Enviar')}
            </Button>
          </div>

          {/* Free plan upgrade prompt */}
          {userData.plan_type === 'free' && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">Upgrade para Premium</span>
              </div>
              <p className="text-xs text-purple-700">
                {loading ? 'Pensando...' : (userData.plan_type === 'premium' ? 'Analisar & Responder' : 'Enviar')}
              </p>
            </div>
          )}
          
          {/* Thread Status for Premium Users */}
          {userData.plan_type === 'premium' && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">
                  {threadId ? 'Conversa sincronizada' : 'Iniciando nova conversa'}
                </span>
              </div>
              <p className="text-xs text-purple-700 mt-1">
                {threadId 
                  ? 'Seu Mentor Inteligente lembra de toda nossa conversa anterior'
                  : 'Uma nova sessão será criada na primeira mensagem'
                }
              </p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="w-full h-10 mt-4"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}