import { Tool } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Zap, Crown, Flask, CheckCircle, ExternalLink } from 'lucide-react';

interface ToolDetailProps {
  tool: Tool;
  onTryNow: () => void;
  onBack: () => void;
}

const categoryLabels = {
  iso8583: 'ISO 8583',
  conciliation: 'Conciliação',
  metrics: 'Métricas',
  settlement: 'Liquidação',
  ai: 'Inteligência Artificial',
  rules: 'Regras',
  other: 'Outros'
};

const statusIcons = {
  free: <Zap className="w-5 h-5" />,
  premium: <Crown className="w-5 h-5" />,
  beta: <Flask className="w-5 h-5" />
};

const statusLabels = {
  free: 'Gratuito',
  premium: 'Premium',
  beta: 'Beta'
};

const statusDescriptions = {
  free: 'Ferramenta gratuita disponível para todos os usuários',
  premium: 'Recursos avançados disponíveis para assinantes premium',
  beta: 'Versão em testes - feedback é bem-vindo!'
};

export function ToolDetail({ tool, onTryNow, onBack }: ToolDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Voltar
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-4xl">
            {tool.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{tool.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{categoryLabels[tool.category]}</Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                {statusIcons[tool.status]}
                {statusLabels[tool.status]}
              </Badge>
              {tool.isNew && <Badge variant="destructive">Novo</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre a Ferramenta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-lg leading-relaxed">{tool.description}</p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Recursos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{tool.usageCount}</div>
                  <div className="text-sm text-gray-500">Usuários ativos</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < tool.popularity
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {tool.status === 'free' ? '100%' : tool.status === 'beta' ? 'Beta' : 'Premium'}
                  </div>
                  <div className="text-sm text-gray-500">Disponibilidade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {tool.category === 'ai' ? 'IA' : tool.category === 'iso8583' ? 'ISO' : 'Core'}
                  </div>
                  <div className="text-sm text-gray-500">Categoria</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {statusIcons[tool.status]}
                Status da Ferramenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{statusDescriptions[tool.status]}</p>
              <Button onClick={onTryNow} className="w-full" size="lg">
                {tool.status === 'free' ? 'Usar Agora' : tool.status === 'beta' ? 'Experimentar' : 'Ver Planos'}
              </Button>
            </CardContent>
          </Card>

          {/* Demo */}
          {tool.demoUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Demo Interativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Experimente a ferramenta antes de usar em produção.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={tool.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Demo
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Related Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Relacionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  {tool.category === 'metrics' && '📊 Analisador de Chargeback'}
                  {tool.category === 'iso8583' && '🔍 Validador de Cartões'}
                  {tool.category === 'conciliation' && '📈 Métricas de Autorização'}
                  {tool.category === 'settlement' && '💰 Calculadora de MDR'}
                  {tool.category === 'ai' && '🏦 Regras das Bandeiras'}
                  {tool.category === 'rules' && '🤖 IA Mandates'}
                  {tool.category === 'other' && '📱 Gerador de QR Code Pix'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}