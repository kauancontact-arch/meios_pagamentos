import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sprout, Target, Heart, DollarSign, Clock, ArrowRight, ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

interface OnboardingProps {
  onStart: () => void;
  userDataHook: ReturnType<typeof useUserData>;
}

interface OnboardingData {
  dailyAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  timeSpent: number;
  timeUnit: 'minutes' | 'hours';
}

export function Onboarding({ onStart, userDataHook }: OnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'spending' | 'time' | 'summary'>('welcome');
  const [data, setData] = useState<OnboardingData>({
    dailyAmount: 0,
    frequency: 'daily',
    timeSpent: 0,
    timeUnit: 'minutes'
  });

  const handleStartOnboarding = () => {
    setStep('spending');
  };

  const handleSpendingNext = () => {
    if (data.dailyAmount > 0) {
      setStep('time');
    }
  };

  const handleTimeNext = () => {
    if (data.timeSpent > 0) {
      setStep('summary');
    }
  };

  const handleConfirmAndStart = async () => {
    // Calculate daily equivalents for consistent tracking
    let dailySpending = data.dailyAmount;
    if (data.frequency === 'weekly') {
      dailySpending = data.dailyAmount / 7;
    } else if (data.frequency === 'monthly') {
      dailySpending = data.dailyAmount / 30;
    }

    let dailyTimeMinutes = data.timeSpent;
    if (data.timeUnit === 'hours') {
      dailyTimeMinutes = data.timeSpent * 60;
    }
    if (data.frequency === 'weekly') {
      dailyTimeMinutes = dailyTimeMinutes / 7;
    } else if (data.frequency === 'monthly') {
      dailyTimeMinutes = dailyTimeMinutes / 30;
    }

    // Update user profile with onboarding data
    await userDataHook.updateUserProfile({
      daily_bet_average: Math.round(dailySpending),
      days_clean: 0, // Starting at day 0, will become day 1 tomorrow
      money_saved: 0,
      time_saved: 0,
    });

    // For guests, also save onboarding completion flag to localStorage
    const userData = userDataHook.getUserData();
    if (userData && 'onboarding_completed' in userData) {
      // This is a guest user, update the onboarding_completed flag
      await userDataHook.updateUserProfile({
        onboarding_completed: true
      });
    }

    // Legacy localStorage backup (for compatibility)
    localStorage.setItem('aposta-zero-data', JSON.stringify({
      days_clean: 0,
      money_saved: 0,
      time_saved: 0,
      daily_bet_average: Math.round(dailySpending)
    }));

    // Complete onboarding
    onStart();
  };

  const getFrequencyLabel = () => {
    switch (data.frequency) {
      case 'daily': return 'por dia';
      case 'weekly': return 'por semana';
      case 'monthly': return 'por mês';
    }
  };

  const getTimeLabel = () => {
    const unit = data.timeUnit === 'hours' ? 'hora(s)' : 'minuto(s)';
    const freq = data.frequency === 'daily' ? 'por dia' : 
                 data.frequency === 'weekly' ? 'por semana' : 'por mês';
    return `${unit} ${freq}`;
  };

  const calculateDailyEquivalents = () => {
    let dailySpending = data.dailyAmount;
    let dailyTime = data.timeSpent;

    if (data.frequency === 'weekly') {
      dailySpending = data.dailyAmount / 7;
      dailyTime = data.timeSpent / 7;
    } else if (data.frequency === 'monthly') {
      dailySpending = data.dailyAmount / 30;
      dailyTime = data.timeSpent / 30;
    }

    if (data.timeUnit === 'hours') {
      dailyTime = dailyTime * 60;
    }

    return {
      dailySpending: Math.round(dailySpending),
      dailyTimeMinutes: Math.round(dailyTime)
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <AnimatePresence mode="wait">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-center shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white to-green-50 lg:p-2">
              <CardContent className="p-8 sm:p-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <Sprout className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Bem-vindo ao Aposta Zero
                </h1>
                
                <p className="mb-8 text-gray-600 leading-relaxed text-sm sm:text-base">
                  Recupere o controle das suas apostas e transforme sua vida financeira. 
                  Cada dia sem apostar é um passo em direção à prosperidade.
                </p>
                
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Controle</p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Bem-estar</p>
                  </div>
                  <div className="text-center">
                    <Sprout className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-500">Crescimento</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 sm:h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                  onClick={handleStartOnboarding}
                >
                  Começar Jornada
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Spending Question Step */}
        {step === 'spending' && (
          <motion.div
            key="spending"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white to-blue-50 lg:p-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Quanto você gasta em apostas?</h2>
                  <p className="text-gray-600 text-sm">
                    Essa informação nos ajuda a calcular sua economia futura
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Frequency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'daily', label: 'Diário' },
                        { value: 'weekly', label: 'Semanal' },
                        { value: 'monthly', label: 'Mensal' }
                      ].map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => setData({ ...data, frequency: freq.value as any })}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            data.frequency === freq.value
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor {getFrequencyLabel()}:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">R$</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={data.dailyAmount || ''}
                        onChange={(e) => setData({ ...data, dailyAmount: Number(e.target.value) })}
                        className="pl-10 h-12 text-lg"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {data.dailyAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-yellow-50 rounded-xl border border-yellow-200"
                    >
                      <p className="text-sm text-yellow-800 text-center">
                        💡 Isso equivale a <strong>R$ {calculateDailyEquivalents().dailySpending} por dia</strong>
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12"
                    onClick={() => setStep('welcome')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={handleSpendingNext}
                    disabled={data.dailyAmount <= 0}
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Time Question Step */}
        {step === 'time' && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white to-purple-50 lg:p-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Quanto tempo você gasta apostando?</h2>
                  <p className="text-gray-600 text-sm">
                    Vamos calcular quanto tempo livre você vai recuperar
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Time Unit Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade de tempo:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'minutes', label: 'Minutos' },
                        { value: 'hours', label: 'Horas' }
                      ].map((unit) => (
                        <button
                          key={unit.value}
                          onClick={() => setData({ ...data, timeUnit: unit.value as any })}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            data.timeUnit === unit.value
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {unit.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'daily', label: 'Diário' },
                        { value: 'weekly', label: 'Semanal' },
                        { value: 'monthly', label: 'Mensal' }
                      ].map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => setData({ ...data, frequency: freq.value as any })}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            data.frequency === freq.value
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo {getTimeLabel()}:
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={data.timeSpent || ''}
                      onChange={(e) => setData({ ...data, timeSpent: Number(e.target.value) })}
                      className="h-12 text-lg"
                      min="0"
                      step="1"
                    />
                  </div>

                  {/* Preview */}
                  {data.timeSpent > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-purple-50 rounded-xl border border-purple-200"
                    >
                      <p className="text-sm text-purple-800 text-center">
                        ⏰ Isso equivale a <strong>{calculateDailyEquivalents().dailyTimeMinutes} minutos por dia</strong>
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 mt-8">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12"
                    onClick={() => setStep('spending')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    onClick={handleTimeNext}
                    disabled={data.timeSpent <= 0}
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary and Confirmation Step */}
        {step === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-br from-white to-green-50 lg:p-2">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumo dos seus dados</h2>
                  <p className="text-gray-600 text-sm">
                    Confirme as informações para iniciar sua jornada
                  </p>
                </div>

                {/* Data Summary */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Gastos com Apostas</h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-1">
                      <strong>R$ {data.dailyAmount}</strong> {getFrequencyLabel()}
                    </p>
                    <p className="text-xs text-blue-600">
                      Equivale a R$ {calculateDailyEquivalents().dailySpending} por dia
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">Tempo Gasto</h3>
                    </div>
                    <p className="text-sm text-purple-700 mb-1">
                      <strong>{data.timeSpent}</strong> {getTimeLabel()}
                    </p>
                    <p className="text-xs text-purple-600">
                      Equivale a {calculateDailyEquivalents().dailyTimeMinutes} minutos por dia
                    </p>
                  </div>

                  {/* Future Projections */}
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Suas Metas de Economia</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Em 1 semana:</span>
                        <span className="font-bold text-green-800">R$ {calculateDailyEquivalents().dailySpending * 7}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Em 1 mês:</span>
                        <span className="font-bold text-green-800">R$ {calculateDailyEquivalents().dailySpending * 30}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">Em 1 ano:</span>
                        <span className="font-bold text-green-800 text-lg">R$ {calculateDailyEquivalents().dailySpending * 365}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Recovery */}
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">Tempo Livre Recuperado</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700">Em 1 semana:</span>
                        <span className="font-bold text-yellow-800">{Math.round(calculateDailyEquivalents().dailyTimeMinutes * 7 / 60 * 10) / 10}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700">Em 1 mês:</span>
                        <span className="font-bold text-yellow-800">{Math.round(calculateDailyEquivalents().dailyTimeMinutes * 30 / 60 * 10) / 10}h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-yellow-700">Em 1 ano:</span>
                        <span className="font-bold text-yellow-800 text-lg">{Math.round(calculateDailyEquivalents().dailyTimeMinutes * 365 / 60)}h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12"
                    onClick={() => setStep('time')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Button 
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={handleConfirmAndStart}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Iniciar Dia 1
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}