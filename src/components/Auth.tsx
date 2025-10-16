import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sprout, Mail, Lock, Crown, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AuthProps {
  onContinueAsGuest: () => void;
}

export function Auth({ onContinueAsGuest }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const { signIn, signUp } = useAuth();

  // Start cooldown timer
  const startCooldown = (seconds: number) => {
    setCooldownSeconds(seconds);
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Parse cooldown duration from error message
  const parseCooldownFromError = (errorMessage: string): number => {
    const match = errorMessage.match(/(\d+)\s*seconds?/i);
    return match ? parseInt(match[1]) : 60; // Default to 60 seconds if can't parse
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldownSeconds > 0) {
      return; // Prevent submission during cooldown
    }
    
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      // Handle rate limit errors specifically
      if (err.message && err.message.includes('over_email_send_rate_limit')) {
        const cooldownTime = parseCooldownFromError(err.message);
        setError(`Muitas tentativas. Tente novamente em ${cooldownTime} segundos.`);
        startCooldown(cooldownTime);
      } else if (err.message && err.message.includes('Invalid login credentials')) {
        setError('Credenciais inválidas. Verifique seu email e senha.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6"
    >
      <Card className="shadow-2xl rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="text-center pb-2 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Aposta Zero
          </h1>
          <p className="text-gray-600 text-sm">
            Recupere o controle das suas finanças
          </p>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
                {cooldownSeconds > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Aguarde {cooldownSeconds} segundos para tentar novamente
                  </p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-base font-semibold"
              disabled={loading || cooldownSeconds > 0}
            >
              {cooldownSeconds > 0 
                ? `Aguarde ${cooldownSeconds}s` 
                : loading 
                ? "Carregando..." 
                : (isLogin ? "Entrar" : "Criar Conta")
              }
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
              disabled={cooldownSeconds > 0}
            >
              {isLogin ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
            </button>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="mb-4 p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Plano Gratuito</h3>
              </div>
              <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                <li>• Programa Parcial (14 lições)</li>
                <li>• Progresso básico local</li>
                <li>• Calculadora de economia</li>
                <li>• Acesso limitado à comunidade</li>
              </ul>
            </div>

            <div className="mb-4 p-3 sm:p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Plano Premium</h3>
              </div>
              <ul className="text-xs sm:text-sm text-purple-700 space-y-1">
                <li>• Programa Completo (90 lições)</li>
                <li>• Mentor Inteligente</li>
                <li>• Badges avançadas</li>
                <li>• Análises detalhadas</li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-12 sm:h-14 text-base font-semibold"
              onClick={onContinueAsGuest}
            >
              Continuar como Visitante (Gratuito)
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}