import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Achievement notifications data
const ACHIEVEMENT_NOTIFICATIONS_DATA = [
  {"dia": 1, "mensagem": "Parabéns! Você completou o primeiro dia da sua nova vida."},
  {"dia": 2, "mensagem": "Segundo dia conquistado! Continue firme."},
  {"dia": 3, "mensagem": "Você já completou 3 dias. Cada passo conta!"},
  {"dia": 4, "mensagem": "4 dias sem apostas! Orgulho da sua evolução."},
  {"dia": 5, "mensagem": "Cinco dias completos. Você está criando um novo hábito."},
  {"dia": 6, "mensagem": "6 dias conquistados! Um a menos para completar a primeira semana."},
  {"dia": 7, "mensagem": "Uma semana de força! Você provou que consegue."},
  {"dia": 10, "mensagem": "Dez dias! Sua disciplina está dando frutos."},
  {"dia": 14, "mensagem": "Duas semanas completas. Transformação real em andamento."},
  {"dia": 21, "mensagem": "Três semanas! Seu cérebro já está se adaptando."},
  {"dia": 30, "mensagem": "Um mês sem apostas! Um marco gigante na sua vida."},
  {"dia": 45, "mensagem": "45 dias de liberdade. Você já é outra pessoa."},
  {"dia": 60, "mensagem": "Dois meses completos! Sua jornada está sólida."},
  {"dia": 75, "mensagem": "75 dias! Você está muito perto da linha de chegada."},
  {"dia": 90, "mensagem": "Você concluiu os 90 dias do programa Aposta Zero. Essa vitória é sua para sempre!"}
];

// Daily reminders data
const DAILY_REMINDERS_DATA = [
  {"id": 1, "mensagem": "Hora de dar mais um passo na sua jornada. Vamos juntos!"},
  {"id": 2, "mensagem": "Cada dia sem apostas é uma vitória. Continue firme!"},
  {"id": 3, "mensagem": "Você merece uma vida sem perdas escondidas. Complete sua lição hoje."},
  {"id": 4, "mensagem": "Apostar tira, parar devolve. Abra o app e conquiste o dia."},
  {"id": 5, "mensagem": "Seu futuro agradece cada escolha que você faz hoje. Bora avançar?"},
  {"id": 6, "mensagem": "A mudança começa em pequenos passos. O de hoje é essencial!"},
  {"id": 7, "mensagem": "Você já provou que consegue. Continue caminhando!"},
  {"id": 8, "mensagem": "Sua disciplina está criando liberdade. Não pare agora!"},
  {"id": 9, "mensagem": "Cada dia limpo é um tijolo na sua nova vida."},
  {"id": 10, "mensagem": "Seu eu do futuro vai agradecer pela decisão de hoje."},
  {"id": 11, "mensagem": "Mais um dia vencido é menos um dia perdido para as apostas."},
  {"id": 12, "mensagem": "Você tem o controle. Mostre isso hoje mais uma vez."},
  {"id": 13, "mensagem": "Pequenas vitórias diárias criam grandes transformações."},
  {"id": 14, "mensagem": "Você está construindo algo maior que qualquer aposta."},
  {"id": 15, "mensagem": "Lembre-se: desistir agora custa caro. Persistir traz liberdade."},
  {"id": 16, "mensagem": "Seu progresso não pode esperar. Vamos juntos!"},
  {"id": 17, "mensagem": "Hoje é a chance de fortalecer a decisão que você já tomou."},
  {"id": 18, "mensagem": "A cada dia você prova que é mais forte do que pensava."},
  {"id": 19, "mensagem": "Não é sobre perfeição, é sobre consistência. Faça hoje!"},
  {"id": 20, "mensagem": "A vida sem apostas já começou, e você faz parte disso."},
  {"id": 21, "mensagem": "Avançar um dia de cada vez é suficiente. Continue!"},
  {"id": 22, "mensagem": "Amanhã será reflexo do que você faz hoje. Escolha bem."},
  {"id": 23, "mensagem": "Complete a lição e lembre-se: você não está sozinho."},
  {"id": 24, "mensagem": "Sua força cresce a cada desafio vencido."},
  {"id": 25, "mensagem": "Você não precisa de sorte, precisa de consistência. E você tem!"},
  {"id": 26, "mensagem": "Hoje você pode provar a si mesmo que é possível."},
  {"id": 27, "mensagem": "O jogo terminou, mas a sua vida real está só começando."},
  {"id": 28, "mensagem": "Invista tempo em você, não em apostas."},
  {"id": 29, "mensagem": "A liberdade começa quando você cumpre sua decisão diária."},
  {"id": 30, "mensagem": "Hoje é mais uma oportunidade de vencer o antigo você."},
  {"id": 31, "mensagem": "Você já percorreu muito. Continue firme!"},
  {"id": 32, "mensagem": "Lembre-se: recaída não é opção, vitória sim."},
  {"id": 33, "mensagem": "Sua mente agradece por cada dia sem apostas."},
  {"id": 34, "mensagem": "Fortaleça seus hábitos. Eles estão moldando seu futuro."},
  {"id": 35, "mensagem": "A cada notificação, uma nova chance de mudar sua vida."},
  {"id": 36, "mensagem": "Persistência hoje, liberdade amanhã."},
  {"id": 37, "mensagem": "Você é mais forte do que qualquer impulso. Mostre isso agora!"},
  {"id": 38, "mensagem": "Não é só um desafio, é a sua vida de volta."},
  {"id": 39, "mensagem": "Cada dia completado é uma conquista contra o vício."},
  {"id": 40, "mensagem": "A vitória acontece em silêncio, um dia de cada vez."},
  {"id": 41, "mensagem": "Hoje é o único dia que você precisa vencer. E você pode!"},
  {"id": 42, "mensagem": "As apostas não definem quem você é. Suas escolhas sim."},
  {"id": 43, "mensagem": "Não espere motivação, confie na disciplina. Complete o dia!"},
  {"id": 44, "mensagem": "A sua nova história começa sempre no hoje."},
  {"id": 45, "mensagem": "Você está provando que apostar não é necessidade, é escolha. Continue!"}
];

interface UserProfile {
  id: string;
  email: string;
  plan_type: 'free' | 'premium';
  days_clean: number;
  money_saved: number;
  time_saved: number;
  daily_bet_average: number;
  points?: number;
  last_daily_notification_day?: number;
  created_at: string;
  updated_at: string;
}

interface LocalUserData {
  email?: string;
  plan_type: 'free' | 'premium';
  days_clean: number;
  money_saved: number;
  time_saved: number;
  daily_bet_average: number;
  points?: number;
  last_daily_notification_day?: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface UserProgress {
  lesson_day: number;
  completed_at: string;
  challenge_completed: boolean;
}

interface LocalProgress {
  [lesson_day: number]: {
    lesson_completed: boolean;
    challenge_completed: boolean;
    completed_at: string;
  };
}

interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'motivation' | 'achievement' | 'milestone' | 'warning';
  created_at: string;
  read: boolean;
}

interface LocalNotification {
  id: string;
  title: string;
  message: string;
  type: 'motivation' | 'achievement' | 'milestone' | 'warning';
  created_at: string;
  read: boolean;
}

export function useUserData(user: User | null) {
  const [userData, setUserData] = useState<UserProfile | LocalUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [localProgress, setLocalProgress] = useState<LocalProgress>({});
  const [localNotifications, setLocalNotifications] = useState<LocalNotification[]>([]);

  // Load user data on mount and when user changes
  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      if (user) {
        // Load from Supabase for authenticated users
        await loadFromSupabase();
      } else {
        // Load from localStorage for guests
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage if Supabase fails
      if (user) {
        loadFromLocalStorage();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFromSupabase = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        // If error is about missing column, try without it
        if (error.message?.includes('last_daily_notification_day')) {
          const { data: profileWithoutColumn, error: fallbackError } = await supabase
            .from('user_profiles')
            .select('id, email, plan_type, days_clean, money_saved, time_saved, daily_bet_average, points, created_at, updated_at')
            .eq('id', user.id)
            .maybeSingle();

          if (fallbackError) throw fallbackError;
          
          if (profileWithoutColumn) {
            setUserData({
              ...profileWithoutColumn,
              last_daily_notification_day: 0
            });
          } else {
            // Profile doesn't exist, create it
            console.log('Creating new user profile (expected for new users)');
            const newProfileData = await createProfile({});
            if (newProfileData) {
              setUserData(newProfileData);
            }
            return;
          }
        } else {
          throw error;
        }
      } else if (!profile) {
        // Profile doesn't exist, create it
        console.log('Creating new user profile (expected for new users)');
        const newProfileData = await createProfile({});
        if (newProfileData) {
          setUserData(newProfileData);
          
          // Load progress and notifications after creating profile
          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

          if (progress) {
            const progressMap: LocalProgress = {};
            progress.forEach((p: UserProgress) => {
              progressMap[p.lesson_day] = {
                lesson_completed: true,
                challenge_completed: p.challenge_completed,
                completed_at: p.completed_at
              };
            });
            setLocalProgress(progressMap);
          }

          // Load notifications
          const { data: notifications } = await supabase
            .from('user_notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (notifications) {
            setLocalNotifications(notifications);
          }
        }
        return;
      } else if (profile) {
        // Ensure last_daily_notification_day exists
        if (profile.last_daily_notification_day === undefined) {
          profile.last_daily_notification_day = 0;
        }
        setUserData(profile);
      }

      // Load progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progress) {
        const progressMap: LocalProgress = {};
        progress.forEach((p: UserProgress) => {
          progressMap[p.lesson_day] = {
            lesson_completed: true,
            challenge_completed: p.challenge_completed,
            completed_at: p.completed_at
          };
        });
        setLocalProgress(progressMap);
      }

      // Load notifications
      const { data: notifications } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notifications) {
        setLocalNotifications(notifications);
      }

    } catch (error) {
      console.error('Error loading from Supabase:', error);
      throw error;
    }
  };

  const loadFromLocalStorage = () => {
    try {
      // Load user data
      const localData = localStorage.getItem('aposta-zero-data');
      if (localData) {
        const parsed = JSON.parse(localData);
        setUserData({
          ...parsed,
          last_daily_notification_day: parsed.last_daily_notification_day || 0
        });
      } else {
        // Initialize default data for guests
        const defaultData: LocalUserData = {
          plan_type: 'free',
          days_clean: 0,
          money_saved: 0,
          time_saved: 0,
          daily_bet_average: 0,
          points: 0,
          last_daily_notification_day: 0,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserData(defaultData);
        localStorage.setItem('aposta-zero-data', JSON.stringify(defaultData));
      }

      // Load progress
      const localProgressData = localStorage.getItem('aposta-zero-progress');
      if (localProgressData) {
        setLocalProgress(JSON.parse(localProgressData));
      }

      // Load notifications
      const localNotificationsData = localStorage.getItem('aposta-zero-notifications');
      if (localNotificationsData) {
        setLocalNotifications(JSON.parse(localNotificationsData));
      }

    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const saveToLocalStorage = (data: LocalUserData, progress?: LocalProgress, notifications?: LocalNotification[]) => {
    try {
      localStorage.setItem('aposta-zero-data', JSON.stringify(data));
      if (progress) {
        localStorage.setItem('aposta-zero-progress', JSON.stringify(progress));
      }
      if (notifications) {
        localStorage.setItem('aposta-zero-notifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile | LocalUserData>) => {
    if (!userData) return;

    const updatedData = {
      ...userData,
      ...updates,
      updated_at: new Date().toISOString()
    };

    setUserData(updatedData);

    if (user) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) {
          // If error is about missing column, try without it
          if (error.message?.includes('last_daily_notification_day') || error.message?.includes('last_daily_check_date')) {
            const { last_daily_notification_day, last_daily_check_date, ...updatesWithoutColumn } = updates;
            const { error: fallbackError } = await supabase
              .from('user_profiles')
              .update(updatesWithoutColumn)
              .eq('id', user.id);
            
            if (fallbackError) throw fallbackError;
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error updating profile in Supabase:', error);
      }
    } else {
      // Save to localStorage
      saveToLocalStorage(updatedData as LocalUserData, localProgress, localNotifications);
    }
  };

  const updateUserProgress = async (lesson_day: number, challenge_completed: boolean) => {
    const progressUpdate = {
      lesson_completed: true,
      challenge_completed,
      completed_at: new Date().toISOString()
    };

    const updatedProgress = {
      ...localProgress,
      [lesson_day]: progressUpdate
    };

    setLocalProgress(updatedProgress);

    if (user) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            lesson_day,
            challenge_completed,
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,lesson_day'
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error updating progress in Supabase:', error);
      }
    } else {
      // Save to localStorage
      saveToLocalStorage(userData as LocalUserData, updatedProgress, localNotifications);
    }

  };


  const _triggerFinancialMilestoneNotifications = async (moneySaved: number, dailyBetAverage: number) => {
    const milestones = [
      { amount: 500, title: "Poupador Oficial! 💰", message: `Você já economizou R$ ${moneySaved.toFixed(2)}! Continue assim!` },
      { amount: 1000, title: "Milestone R$ 1.000! 🎯", message: `Incrível! R$ ${moneySaved.toFixed(2)} economizados. Sua disciplina está valendo ouro!` },
      { amount: 5000, title: "Milestone R$ 5.000! 💎", message: `R$ ${moneySaved.toFixed(2)} economizados! Você está construindo um futuro sólido!` },
      { amount: 10000, title: "Milestone R$ 10.000! 🏆", message: `R$ ${moneySaved.toFixed(2)} economizados! Você é um exemplo de transformação!` }
    ];

    for (const milestone of milestones) {
      if (moneySaved >= milestone.amount && (moneySaved - dailyBetAverage) < milestone.amount) {
        await addNotification(milestone.title, milestone.message, 'milestone');
        break;
      }
    }
  };

  const _triggerDayBasedAchievementNotifications = async (currentDaysClean: number) => {
    const achievement = ACHIEVEMENT_NOTIFICATIONS_DATA.find(a => a.dia === currentDaysClean);
    if (achievement) {
      await addNotification(
        `Conquista: Dia ${currentDaysClean}! 🏆`,
        achievement.mensagem,
        'achievement'
      );
    }
  };

  const triggerDailyNotifications = async () => {
    try {
      if (!userData) return;

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const lastCheckDate = userData.last_daily_check_date || '';
      
      // Only proceed if it's a new day
      if (today <= lastCheckDate) {
        return;
      }

      let currentDaysClean = userData.days_clean;
      const lastNotificationDay = userData.last_daily_notification_day || 0;

      // Check if the current day's lesson and challenge are completed
      const currentDayProgress = user ? 
        await checkDayProgressInSupabase(currentDaysClean + 1) :
        checkDayProgressInLocalStorage(currentDaysClean + 1);

      // If current day is completed, increment days_clean
      if (currentDayProgress.lessonCompleted && currentDayProgress.challengeCompleted) {
        currentDaysClean = userData.days_clean + 1;
        const dailyBetAmount = userData.daily_bet_average || 0;
        const newMoneySaved = userData.money_saved + dailyBetAmount;
        const newTimeSaved = userData.time_saved + 60; // 1 hour per day

        await updateUserProfile({
          days_clean: currentDaysClean,
          money_saved: newMoneySaved,
          time_saved: newTimeSaved,
          last_daily_check_date: today
        });

        // Trigger financial milestone notifications
        await _triggerFinancialMilestoneNotifications(newMoneySaved, dailyBetAmount);
      } else {
        // Just update the check date without incrementing days
        await updateUserProfile({
          last_daily_check_date: today
        });
      }

      // Trigger notifications if we have a new day to celebrate
      if (currentDaysClean > lastNotificationDay) {
        // Trigger achievement notification for this day
        await _triggerDayBasedAchievementNotifications(currentDaysClean);

        // Trigger daily reminder (rotative)
        const reminderIndex = (currentDaysClean - 1) % DAILY_REMINDERS_DATA.length;
        const dailyReminder = DAILY_REMINDERS_DATA[reminderIndex];
        
        await addNotification(
          "Lembrete Diário 🌅",
          dailyReminder.mensagem,
          'motivation'
        );

        // Update the last notification day
        await updateUserProfile({
          last_daily_notification_day: currentDaysClean
        });
      }
    } catch (error) {
      console.error('Error triggering daily notifications:', error);
    }
  };

  const checkDayProgressInSupabase = async (day: number) => {
    if (!user) return { lessonCompleted: false, challengeCompleted: false };

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('challenge_completed')
        .eq('user_id', user.id)
        .eq('lesson_day', day)
        .maybeSingle();

      if (error) throw error;

      return {
        lessonCompleted: !!data,
        challengeCompleted: data?.challenge_completed || false
      };
    } catch (error) {
      console.error('Error checking day progress in Supabase:', error);
      return { lessonCompleted: false, challengeCompleted: false };
    }
  };

  const checkDayProgressInLocalStorage = (day: number) => {
    const progress = localProgress[day];
    return {
      lessonCompleted: progress?.lesson_completed || false,
      challengeCompleted: progress?.challenge_completed || false
    };
  };

  const addNotification = async (title: string, message: string, type: UserNotification['type']) => {
    if (user) {
      // Save to Supabase
      try {
        const { data, error } = await supabase
          .from('user_notifications')
          .insert({
            user_id: user.id,
            title,
            message,
            type,
            created_at: new Date().toISOString(),
            read: false
          })
          .select()
          .single();

        if (error) throw error;

        // Use the Supabase-generated notification with UUID
        const notification: LocalNotification = {
          id: data.id,
          title: data.title,
          message: data.message,
          type: data.type,
          created_at: data.created_at,
          read: data.read
        };

        const updatedNotifications = [notification, ...localNotifications];
        setLocalNotifications(updatedNotifications);
      } catch (error) {
        console.error('Error adding notification to Supabase:', error);
      }
    } else {
      // For local storage, create notification with crypto.randomUUID()
      const notification: LocalNotification = {
        id: crypto.randomUUID(),
        title,
        message,
        type,
        created_at: new Date().toISOString(),
        read: false
      };

      const updatedNotifications = [notification, ...localNotifications];
      setLocalNotifications(updatedNotifications);
      
      // Save to localStorage
      saveToLocalStorage(userData as LocalUserData, localProgress, updatedNotifications);
    }
  };

  const getNotifications = useCallback((): UserNotification[] => {
    return localNotifications;
  }, [localNotifications]);

  const markNotificationAsRead = async (notificationId: string) => {
    // Helper function to validate UUID format
    const isValidUUID = (id: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    const updatedNotifications = localNotifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setLocalNotifications(updatedNotifications);

    if (user) {
      // Only update in Supabase if the ID is a valid UUID
      if (isValidUUID(notificationId)) {
        try {
          const { error } = await supabase
            .from('user_notifications')
            .update({ read: true })
            .eq('id', notificationId);

          if (error) throw error;
        } catch (error) {
          console.error('Error marking notification as read in Supabase:', error);
        }
      } else {
        console.warn('Skipping Supabase update for non-UUID notification ID:', notificationId);
      }
    } else {
      // Save to localStorage
      saveToLocalStorage(userData as LocalUserData, localProgress, updatedNotifications);
    }
  };

  const markAllNotificationsAsRead = async () => {
    const updatedNotifications = localNotifications.map(n => ({ ...n, read: true }));
    setLocalNotifications(updatedNotifications);

    if (user) {
      // Update all notifications in Supabase
      try {
        const { error } = await supabase
          .from('user_notifications')
          .update({ read: true })
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error marking all notifications as read in Supabase:', error);
      }
    } else {
      // Save to localStorage
      saveToLocalStorage(userData as LocalUserData, localProgress, updatedNotifications);
    }
  };

  const createProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Migrate local data if exists
      const localData = localStorage.getItem('aposta-zero-data');
      const localProgressData = localStorage.getItem('aposta-zero-progress');
      const localNotificationsData = localStorage.getItem('aposta-zero-notifications');

      let dataToSave = {
        id: user.id,
        email: user.email || '',
        plan_type: 'free' as const,
        days_clean: 0,
        money_saved: 0,
        time_saved: 0,
        daily_bet_average: 0,
        points: 0,
        last_daily_notification_day: 0,
        last_daily_check_date: new Date().toISOString().split('T')[0],
        ...profileData
      };

      // If local data exists, migrate it
      if (localData) {
        const parsed = JSON.parse(localData);
        dataToSave = {
          ...dataToSave,
          days_clean: parsed.days_clean || 0,
          money_saved: parsed.money_saved || 0,
          time_saved: parsed.time_saved || 0,
          daily_bet_average: parsed.daily_bet_average || dataToSave.daily_bet_average,
          points: parsed.points || 0,
          last_daily_notification_day: parsed.last_daily_notification_day || 0,
          last_daily_check_date: parsed.last_daily_check_date || new Date().toISOString().split('T')[0]
        };
      }

      // Create profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .insert(dataToSave);

      if (error) throw error;

      // Migrate progress if exists
      if (localProgressData) {
        const progress = JSON.parse(localProgressData);
        const progressEntries = Object.entries(progress).map(([lesson_day, data]: [string, any]) => ({
          user_id: user.id,
          lesson_day: parseInt(lesson_day),
          challenge_completed: data.challenge_completed,
          completed_at: data.completed_at
        }));

        if (progressEntries.length > 0) {
          const { error: progressError } = await supabase
            .from('user_progress')
            .insert(progressEntries);

          if (progressError) console.error('Error migrating progress:', progressError);
        }
      }

      // Migrate notifications if exists
      if (localNotificationsData) {
        const notifications = JSON.parse(localNotificationsData);
        const notificationEntries = notifications.map((n: LocalNotification) => ({
          user_id: user.id,
          title: n.title,
          message: n.message,
          type: n.type,
          created_at: n.created_at,
          read: n.read
        }));

        if (notificationEntries.length > 0) {
          const { error: notificationError } = await supabase
            .from('user_notifications')
            .insert(notificationEntries);

          if (notificationError) console.error('Error migrating notifications:', notificationError);
        }
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('aposta-zero-data');
      localStorage.removeItem('aposta-zero-progress');
      localStorage.removeItem('aposta-zero-notifications');

      // Return the created profile data
      return dataToSave;

    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const getUserData = useCallback(() => {
    return userData;
  }, [userData]);

  const hasCompletedOnboarding = useCallback(() => {
    if (!userData) return false;
    
    if (user) {
      // For authenticated users, check if profile exists and has basic data
      return userData.daily_bet_average > 0;
    } else {
      // For guests, check localStorage flag
      const localData = userData as LocalUserData;
      return localData.onboarding_completed === true && localData.daily_bet_average > 0;
    }
  }, [userData, user]);

  const getCompletedLessons = useCallback(async () => {
    try {
      if (user && supabase) {
        const { data, error } = await supabase
          .from('user_progress')
          .select('lesson_day')
          .eq('user_id', user.id);

        if (error) throw error;
        return data?.length || 0;
      } else {
        return Object.keys(localProgress).length;
      }
    } catch (error) {
      console.error('Error getting completed lessons:', error);
      // Fallback to local progress if Supabase fails
      return Object.keys(localProgress).length;
    }
  }, [user, localProgress]);

  const getCompletedChallenges = useCallback(async () => {
    try {
      if (user && supabase) {
        const { data, error } = await supabase
          .from('user_progress')
          .select('lesson_day')
          .eq('user_id', user.id)
          .eq('challenge_completed', true);

        if (error) throw error;
        return data?.length || 0;
      } else {
        return Object.values(localProgress).filter(p => p.challenge_completed).length;
      }
    } catch (error) {
      console.error('Error getting completed challenges:', error);
      // Fallback to local progress if Supabase fails
      return Object.values(localProgress).filter(p => p.challenge_completed).length;
    }
  }, [user, localProgress]);

  const upgradeToPremium = async () => {
    await updateUserProfile({ plan_type: 'premium' });
  };

  return {
    userData,
    loading,
    getUserData,
    hasCompletedOnboarding,
    createProfile,
    updateUserProfile,
    updateUserProgress,
    getCompletedLessons,
    getCompletedChallenges,
    triggerDailyNotifications,
    addNotification,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    upgradeToPremium
  };
}