import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAppContext();
  const { signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        await signUp(email, password, { firstName, lastName });
        setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Melhor tratamento de erros específicos
      if (err.message?.includes('Failed to fetch')) {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (err.message?.includes('User already registered')) {
        setError('Este email já está cadastrado.');
      } else if (err.message?.includes('Password should be at least')) {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(err.message || 'Erro ao processar solicitação');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl rounded-2xl">
          <CardHeader className="text-center p-8">
            <div className="w-16 h-16 bg-primary rounded-xl mx-auto flex items-center justify-center text-primary-foreground font-bold text-3xl mb-4">
              P
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Comunidade de Pagamentos</h1>
            <p className="text-gray-500">Aprenda, conecte e construa o futuro.</p>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Nome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Sobrenome"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </>
              )}
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
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                {loading ? 'Processando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}