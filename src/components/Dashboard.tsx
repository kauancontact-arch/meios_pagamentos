import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Coins, Clock, Calculator, Sprout, TrendingUp, User, Crown, Award, Flame, Target, BarChart3, Bell, Star, Zap, Shield, Trophy, Gift, BookOpen, Bot } from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase';
import { useUserData } from '@/hooks/useUserData';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  userData: {
    days_clean: number;
    money_saved: number;
    time_saved: number;
    daily_bet_average: number;
    plan_type: 'free' | 'premium';
  };
  isGuest: boolean;
  user: SupabaseUser | null;
  userDataHook: ReturnType<typeof useUserData>;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  category: 'basic' | 'advanced' | 'elite';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'milestone' | 'motivation' | 'warning';
  timestamp: string;
  read: boolean;
}

export default function Dashboard({ onNavigate, userData, isGuest, user, userDataHook }: DashboardProps) {
  const { days_clean, money_saved, time_saved, daily_bet_average, plan_type } = userData;
  const [completedLessons, setCompletedLessons] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load lesson progress for premium users
  useEffect(() => {
    if (user && plan_type === 'premium') {
      loadLessonProgress();
    }
    loadNotifications();
  }, [user, plan_type, days_clean]);

  const loadLessonProgress = async () => {
    if (!user) return;

    const { data: lessons } = await supabase
      .from('user_progress')
      .select('lesson_day, challenge_completed')
      .eq('user_id', user.id);

    if (lessons) {
      setCompletedLessons(lessons.length);
      setCompletedChallenges(lessons.filter(l => l.challenge_completed).length);
    }
  };

  const loadNotifications = () => {
    // Get real notifications from userDataHook
    const realNotifications = userDataHook.getNotifications();
    
    // Convert to the format expected by the Dashboard component
    const formattedNotifications: Notification[] = realNotifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: notification.created_at,
      read: notification.read
    }));

    // Select the most recent notification of each type (motivation, achievement, milestone)
    const selectedNotifications: Notification[] = [];
    const typesNeeded = ['motivation', 'achievement', 'milestone'];
    
    for (const type of typesNeeded) {
      const notificationOfType = formattedNotifications.find(n => n.type === type);
      if (notificationOfType) {
        selectedNotifications.push(notificationOfType);
      }
    }
    
    setNotifications(selectedNotifications);
  };

  // Calculate streaks and achievements
  const currentStreak = days_clean;
  const longestStreak = Math.max(days_clean, 15);
  const weeklyGoal = 7;
  const monthlyGoal = 30;
  const weekProgress = Math.min((days_clean % 7) / weeklyGoal * 100, 100);
  const monthProgress = Math.min(days_clean / monthlyGoal * 100, 100);

  // Enhanced badges system
  const badges: Badge[] = [
    // Basic badges (Free + Premium)
    {
      id: 'first-day',
      name: 'Primeiro Passo',
      description: 'Primeiro dia sem apostar',
      icon: '🌱',
      unlocked: days_clean >= 1,
      requirement: 1,
      category: 'basic',
      rarity: 'common'
    },
    {
      id: 'week-warrior',
      name: 'Guerreiro Semanal',
      description: '7 dias consecutivos',
      icon: '⚔️',
      unlocked: days_clean >= 7,
      requirement: 7,
      category: 'basic',
      rarity: 'common'
    },
    {
      id: 'money-saver',
      name: 'Poupador',
      description: 'R$ 500 economizados',
      icon: '💰',
      unlocked: money_saved >= 500,
      requirement: 500,
      category: 'basic',
      rarity: 'rare'
    },

    // Advanced badges (Premium only)
    {
      id: 'student',
      name: 'Estudante Dedicado',
      description: '14 lições completadas',
      icon: '📚',
      unlocked: completedLessons >= 14,
      requirement: 14,
      category: 'advanced',
      rarity: 'rare'
    },
    {
      id: 'challenger',
      name: 'Desafiador',
      description: '10 desafios completados',
      icon: '🎯',
      unlocked: completedChallenges >= 10,
      requirement: 10,
      category: 'advanced',
      rarity: 'epic'
    },
    {
      id: 'month-master',
      name: 'Mestre do Mês',
      description: '30 dias consecutivos',
      icon: '👑',
      unlocked: days_clean >= 30,
      requirement: 30,
      category: 'advanced',
      rarity: 'epic'
    },

    // Elite badges (Premium only)
    {
      id: 'champion',
      name: 'Campeão',
      description: '90 lições completadas',
      icon: '🏆',
      unlocked: completedLessons >= 90,
      requirement: 90,
      category: 'elite',
      rarity: 'legendary'
    },
    {
      id: 'millionaire',
      name: 'Milionário',
      description: 'R$ 10.000 economizados',
      icon: '💎',
      unlocked: money_saved >= 10000,
      requirement: 10000,
      category: 'elite',
      rarity: 'legendary'
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Ajudou 50 pessoas',
      icon: '🧙‍♂️',
      unlocked: false,
      requirement: 50,
      category: 'elite',
      rarity: 'legendary'
    }
  ];

  // Filter badges based on plan
  const availableBadges = plan_type === 'premium' 
    ? badges 
    : badges.filter(badge => badge.category === 'basic');

  const unlockedBadges = availableBadges.filter(badge => badge.unlocked);
  const nextBadge = availableBadges.find(badge => !badge.unlocked);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Rarity mapping with Portuguese names and readable colors
  const rarityMap = {
    common: {
      name: 'Bronze',
      bgColor: 'from-amber-700 to-amber-800',
      textColor: 'text-amber-200'
    },
    rare: {
      name: 'Prata',
      bgColor: 'from-gray-400 to-gray-500',
      textColor: 'text-gray-200'
    },
    epic: {
      name: 'Ouro',
      bgColor: 'from-yellow-400 to-yellow-500',
      textColor: 'text-yellow-200'
    },
    legendary: {
      name: 'Diamante',
      bgColor: 'from-blue-400 to-blue-500',
      textColor: 'text-blue-200'
    }
  };

  const getRarityColor = (rarity: string) => {
    return rarityMap[rarity as keyof typeof rarityMap]?.bgColor || 'from-gray-400 to-gray-500';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'milestone': return '🎯';
      case 'motivation': return '💪';
      case 'warning': return '⚠️';
      default: return '📢';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      {/* User Status Bar with Notifications */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {plan_type === 'premium' ? (
            <Crown className="w-5 h-5 text-purple-600" />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {user ? user.email : 'Visitante'}
          </span>
          {plan_type === 'premium' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              Premium
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {unreadNotifications}
              </motion.span>
            )}
          </motion.button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("profile")}
            className="text-gray-600 hover:text-gray-800"
          >
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="shadow-xl rounded-2xl border-0 bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">Notificações</h3>
                <span className="text-xs text-gray-500">
                  {plan_type === 'premium' ? 'Completas' : 'Limitadas'}
                </span>
              </div>
              
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma notificação no momento
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        if (!notification.read) {
                          userDataHook.markNotificationAsRead(notification.id);
                          loadNotifications(); // Reload notifications to reflect the change
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                          : 'bg-white border-blue-200 shadow-sm hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {plan_type === 'free' && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700 text-center">
                    <Crown className="w-3 h-3 inline mr-1" />
                    Premium: Notificações push personalizadas e ilimitadas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Overview */}
      <Card className="shadow-xl rounded-3xl border-0 bg-gradient-to-br from-white to-green-50 lg:p-2">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <Sprout className="w-12 h-12 text-white" />
            </motion.div>
            <p className="text-lg font-semibold text-green-700">Sua prosperidade está crescendo!</p>
          </div>
          
          {/* Basic Stats for All Users */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-sm"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-bold text-xl text-gray-800">{days_clean}</p>
              <p className="text-xs sm:text-sm text-gray-500">Dias limpo</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-sm"
            >
              <Coins className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-bold text-xl text-gray-800">R$ {money_saved}</p>
              <p className="text-xs sm:text-sm text-gray-500">Economizados</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-sm"
            >
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-bold text-xl text-gray-800">{time_saved}h</p>
              <p className="text-xs sm:text-sm text-gray-500">Tempo livre</p>
            </motion.div>
          </div>

          {/* Premium Features: Advanced Streaks and Progress */}
          {plan_type === 'premium' && (
            <div className="space-y-4 mb-6">
              {/* Enhanced Streaks with Visual Effects */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl border border-orange-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  </motion.div>
                  <p className="font-bold text-2xl text-orange-700">{currentStreak}</p>
                  <p className="text-xs text-orange-600">Sequência Atual</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-xl border border-red-300"
                >
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="font-bold text-2xl text-red-700">{longestStreak}</p>
                  <p className="text-xs text-red-600">Melhor Sequência</p>
                </motion.div>
              </div>

              {/* Advanced Progress Visualization */}
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Meta Semanal</span>
                    </div>
                    <span className="text-xs text-blue-600">{Math.min(days_clean % 7, 7)}/7 dias</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${weekProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-blue-600">
                    {weekProgress === 100 ? '🎉 Meta semanal atingida!' : `${Math.ceil(7 - (days_clean % 7))} dias para completar`}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Meta Mensal</span>
                    </div>
                    <span className="text-xs text-green-600">{days_clean}/30 dias</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${monthProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                  <p className="text-xs text-green-600">
                    {monthProgress === 100 ? '🏆 Meta mensal conquistada!' : `${30 - days_clean} dias para completar`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Badges Section */}
      <Card className="shadow-lg rounded-2xl border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <Award className="text-yellow-600" /> 
              {plan_type === 'premium' ? 'Conquistas Avançadas' : 'Badges Básicas'}
            </h3>
            <span className="text-sm text-gray-500">
              {unlockedBadges.length}/{availableBadges.length}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {availableBadges.slice(0, plan_type === 'premium' ? 9 : 6).map((badge, index) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: badge.unlocked ? 1.1 : 1.02 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-3 rounded-xl transition-all ${
                  badge.unlocked 
                    ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} shadow-lg border-2 border-white` 
                    : 'bg-gray-100 opacity-50 border border-gray-200'
                }`}
              >
                <div className="relative">
                  <div className="text-2xl mb-1">
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>
                  {badge.unlocked && badge.rarity === 'legendary' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-2 h-2 text-yellow-800" />
                    </motion.div>
                  )}
                </div>
                <p className={`text-xs font-medium ${
                  badge.unlocked ? 'text-white' : 'text-gray-500'
                }`}>
                  {badge.name}
                </p>
                {plan_type === 'premium' && (
                  <div className={`text-xs mt-1 ${
                    badge.unlocked 
                      ? rarityMap[badge.rarity as keyof typeof rarityMap]?.textColor || 'text-gray-200'
                      : 'text-gray-400'
                  }`}>
                    {rarityMap[badge.rarity as keyof typeof rarityMap]?.name || badge.rarity}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {nextBadge && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">Próxima conquista:</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{nextBadge.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-800">{nextBadge.name}</p>
                  <p className="text-xs text-blue-600">{nextBadge.description}</p>
                  {plan_type === 'premium' && (
                    <div className="mt-1">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <motion.div 
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${Math.min(
                              (nextBadge.id === 'student' ? completedLessons :
                               nextBadge.id === 'challenger' ? completedChallenges :
                               nextBadge.id === 'money-saver' || nextBadge.id === 'millionaire' ? money_saved :
                               days_clean) / nextBadge.requirement * 100, 100
                            )}%` 
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-blue-500 mt-1">
                        {nextBadge.id === 'student' ? `${completedLessons}/${nextBadge.requirement} lições` :
                         nextBadge.id === 'challenger' ? `${completedChallenges}/${nextBadge.requirement} desafios` :
                         nextBadge.id === 'money-saver' || nextBadge.id === 'millionaire' ? `R$ ${money_saved}/R$ ${nextBadge.requirement}` :
                         `${days_clean}/${nextBadge.requirement} dias`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Savings Calculator */}
      <Card className="shadow-lg rounded-2xl border-0">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-gray-800">
            <Calculator className="text-green-600" /> 
            {plan_type === 'premium' ? 'Análise Financeira Avançada' : 'Calculadora de Economia'}
          </h3>
          
          {plan_type === 'free' ? (
            // Free Plan: Simple calculator
            <>
              <p className="text-sm text-gray-600 mb-4">Baseado em sua média de apostas de R$ {daily_bet_average}/dia:</p>
              
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <span className="text-sm font-medium">📅 Em 30 dias:</span>
                  <span className="font-bold text-green-600 text-lg">R$ {daily_bet_average * 30}</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <span className="text-sm font-medium">📈 Em 90 dias:</span>
                  <span className="font-bold text-blue-600 text-lg">R$ {daily_bet_average * 90}</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <span className="text-sm font-medium">🎯 Em 1 ano:</span>
                  <span className="font-bold text-yellow-600 text-xl">R$ {daily_bet_average * 365}</span>
                </motion.div>
              </div>
            </>
          ) : (
            // Premium Plan: Advanced analysis with interactive charts
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl text-center border border-green-300"
                >
                  <p className="text-xs text-green-600 mb-1">Economia Diária</p>
                  <p className="font-bold text-green-700 text-lg">R$ {daily_bet_average}</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl text-center border border-blue-300"
                >
                  <p className="text-xs text-blue-600 mb-1">Economia Semanal</p>
                  <p className="font-bold text-blue-700 text-lg">R$ {daily_bet_average * 7}</p>
                </motion.div>
              </div>

              {/* Interactive Progress Chart */}
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Progresso Visual Interativo</span>
                </div>
                <div className="space-y-3">
                  {[
                    { milestone: 7, label: '1 semana', color: 'blue', icon: '📅' },
                    { milestone: 14, label: '2 semanas', color: 'green', icon: '📈' },
                    { milestone: 30, label: '1 mês', color: 'purple', icon: '🎯' },
                    { milestone: 90, label: '3 meses', color: 'yellow', icon: '🏆' }
                  ].map((item, index) => {
                    const progress = Math.min((days_clean / item.milestone) * 100, 100);
                    const isCompleted = days_clean >= item.milestone;
                    const savings = daily_bet_average * item.milestone;
                    
                    return (
                      <motion.div 
                        key={item.milestone}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-800">R$ {savings}</span>
                            {isCompleted && <span className="text-green-500 ml-2">✓</span>}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full ${
                              isCompleted ? 'bg-green-500' : 
                              item.color === 'blue' ? 'bg-blue-500' :
                              item.color === 'green' ? 'bg-green-500' :
                              item.color === 'purple' ? 'bg-purple-500' :
                              'bg-yellow-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {progress.toFixed(1)}% concluído
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Investment Suggestions */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">Sugestões de Investimento</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm">💰 Poupança (100% CDI)</span>
                    <span className="text-sm font-bold text-green-600">
                      R$ {Math.round(money_saved * 1.12)} em 1 ano
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm">📊 Tesouro Direto</span>
                    <span className="text-sm font-bold text-blue-600">
                      R$ {Math.round(money_saved * 1.15)} em 1 ano
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
            <p className="text-sm text-center font-medium text-gray-700">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Continue assim e transforme sua vida financeira!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Free Plan Upgrade Prompt */}
      {plan_type === 'free' && (
        <Card className="shadow-lg rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            </motion.div>
            <h3 className="font-bold text-lg text-purple-800 mb-2">Desbloqueie o Premium</h3>
            <p className="text-sm text-purple-700 mb-4">
              Gráficos avançados, badges exclusivas, notificações push e muito mais!
            </p>
            
            <div className="mb-4 p-3 bg-white rounded-xl">
              <h4 className="font-semibold text-purple-800 mb-2 text-sm">Recursos Premium:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>Gráficos detalhados</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>Badges avançadas</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Programa Completo</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  <span>Mentor Inteligente</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              onClick={() => onNavigate("profile")}
            >
              <Crown className="w-4 h-4 mr-2" />
              Ver Planos Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Premium: Recent Achievements Showcase */}
      {plan_type === 'premium' && unlockedBadges.length > 0 && (
        <Card className="shadow-lg rounded-2xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h3 className="font-bold text-lg text-gray-800">Conquistas Recentes</h3>
            </div>
            
            <div className="space-y-3">
              {unlockedBadges.slice(-3).reverse().map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-yellow-200"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center shadow-md`}>
                    <span className="text-xl">{badge.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{badge.name}</p>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600">
                        {rarityMap[badge.rarity as keyof typeof rarityMap]?.name || badge.rarity}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Gift className="w-5 h-5 text-yellow-600" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className={`w-full h-14 sm:h-16 text-sm sm:text-base shadow-lg ${
              plan_type === 'premium' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600'
            }`}
            onClick={() => onNavigate("program")}
          >
            <span className="flex flex-row items-center justify-center gap-1.5">
              <span className="text-sm">📚</span>
              <span className="text-xs">Programa</span>
            </span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-14 sm:h-16 text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
            onClick={() => onNavigate("sos")}
          >
            <span className="flex flex-row items-center justify-center gap-1.5">
              <span className="text-sm">🚨</span>
              <span className="text-xs">SOS</span>
            </span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full h-14 sm:h-16 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg"
            onClick={() => onNavigate("community")}
          >
            <span className="flex flex-row items-center justify-center gap-1.5">
              <span className="text-sm">🌍</span>
              <span className="text-xs">Comunidade</span>
            </span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className={`w-full h-14 sm:h-16 text-sm sm:text-base shadow-lg ${
              'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
            }`}
            onClick={() => onNavigate("blocker")}
            disabled={true}
          >
            <span className="flex flex-row items-center justify-center gap-1.5">
              <span className="text-sm">🛡️</span>
              <span className="text-xs">Bloqueador</span>
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}