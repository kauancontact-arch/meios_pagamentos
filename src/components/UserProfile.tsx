import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, User, LogOut, ArrowLeft, Spade as Upgrade } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, signOut } = useAuth();
  const { getUserData, upgradeToPremium } = useUserData(user);
  const userData = getUserData();

  // Handle loading state when userData is null
  if (!userData) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6"
      >
        <Card className="shadow-xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpgrade = async () => {
    if (user) {
      await upgradeToPremium();
      // In a real app, this would redirect to payment
      alert("Redirecionando para pagamento...");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6"
    >
      <Card className="shadow-xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Perfil</h2>
              <p className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                {user ? user.email : "Usuário Visitante"}
              </p>
            </div>
          </div>

          {/* Plan Status */}
          <div className={`p-4 rounded-xl mb-6 ${
            userData.plan_type === 'premium' 
              ? 'bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300' 
              : 'bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {userData.plan_type === 'premium' ? (
                <Crown className="w-5 h-5 text-purple-600" />
              ) : (
                <User className="w-5 h-5 text-yellow-600" />
              )}
              <h3 className={`font-semibold ${
                userData.plan_type === 'premium' ? 'text-purple-800' : 'text-yellow-800'
              }`}>
                Plano {userData.plan_type === 'premium' ? 'Premium' : 'Gratuito'}
              </h3>
            </div>
            <p className={`text-sm ${
              userData.plan_type === 'premium' ? 'text-purple-700' : 'text-yellow-700'
            }`}>
              {userData.plan_type === 'premium' 
                ? 'Acesso completo a todas as funcionalidades'
                : 'Funcionalidades básicas disponíveis'
              }
            </p>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-base sm:text-lg text-gray-800">{userData.days_clean}</p>
              <p className="text-xs text-gray-500">Dias limpo</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-base sm:text-lg text-gray-800">R$ {userData.money_saved}</p>
              <p className="text-xs text-gray-500">Economizados</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl shadow-sm">
              <p className="font-bold text-base sm:text-lg text-gray-800">{userData.time_saved}h</p>
              <p className="text-xs text-gray-500">Tempo livre</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {userData.plan_type === 'free' && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-sm sm:text-base"
                  onClick={handleUpgrade}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade para Premium
                </Button>
              </motion.div>
            )}

            {user && (
              <Button 
                variant="outline" 
                className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            )}

            <Button 
              variant="ghost" 
              className="w-full h-12"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}