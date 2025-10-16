import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Shield, ArrowLeft, AlertTriangle } from "lucide-react";

interface SiteBlockerProps {
  onBack: () => void;
  userData: {
    days_clean: number;
    money_saved: number;
    time_saved: number;
    daily_bet_average: number;
    plan_type: 'free' | 'premium';
  };
}

export function SiteBlocker({ onBack, userData }: SiteBlockerProps) {
  const handleSafeReturn = () => {
    // In a real app, this would redirect to safe content
    onBack();
  };

  const handleOverride = () => {
    // In a real app, this would log the override attempt
    alert("Lembre-se: cada vez que você resiste à tentação, você fica mais forte. Tem certeza?");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-2xl rounded-3xl border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 lg:p-2">
        <CardContent className="p-8 sm:p-10 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
          >
            <ShieldAlert className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-red-600 flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Alerta de Proteção
          </h2>
          
          <div className="mb-6 p-4 bg-yellow-100 rounded-xl border border-yellow-300">
            <p className="text-sm sm:text-base font-medium text-yellow-800 mb-2">
              🚫 Site de apostas detectado
            </p>
            <p className="text-xs sm:text-sm text-yellow-700">
              Detectamos uma tentativa de acesso a um site de apostas. Lembre-se dos seus objetivos!
            </p>
          </div>

          <div className="mb-6 p-4 bg-green-100 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">💪 Sua força até agora:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
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
          
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="w-full h-12 sm:h-14 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                onClick={handleSafeReturn}
              >
                <Shield className="w-5 h-5 mr-2" />
                Voltar em Segurança
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full h-10 sm:h-12 border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleOverride}
              >
                Liberar acesso (não recomendado)
              </Button>
            </motion.div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full h-10 sm:h-12 mt-6 text-gray-500"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}