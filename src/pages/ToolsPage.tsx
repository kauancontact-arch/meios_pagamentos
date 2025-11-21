import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wrench, FileText, Calculator, BarChart3, Brain, Shield, ArrowLeft } from 'lucide-react';
import { ISO8583Decoder } from '@/components/tools/ISO8583Decoder';
import { ReconciliationSpreadsheet } from '@/components/tools/ReconciliationSpreadsheet';
import { AuthorizationMetrics } from '@/components/tools/AuthorizationMetrics';
import { SettlementSpreadsheet } from '@/components/tools/SettlementSpreadsheet';
import { MandateAI } from '@/components/tools/MandateAI';
import { CardRules } from '@/components/tools/CardRules';

const tools = [
  {
    id: 'iso8583',
    title: 'Decodificador ISO 8583',
    description: 'Decodifique e analise mensagens ISO 8583 de transações de cartão.',
    icon: <FileText className="w-8 h-8" />,
    category: 'Protocolos',
    difficulty: 'Avançado',
    component: ISO8583Decoder,
  },
  {
    id: 'reconciliation',
    title: 'Planilha de Conciliação',
    description: 'Ferramenta para conciliar transações entre adquirente, emissor e estabelecimento.',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Financeiro',
    difficulty: 'Intermediário',
    component: ReconciliationSpreadsheet,
  },
  {
    id: 'metrics',
    title: 'Métricas de Autorização',
    description: 'Analise taxas de aprovação, rejeição e performance de autorização.',
    icon: <BarChart3 className="w-8 h-8" />,
    category: 'Analytics',
    difficulty: 'Intermediário',
    component: AuthorizationMetrics,
  },
  {
    id: 'settlement',
    title: 'Planilha de Liquidação',
    description: 'Calcule e simule liquidações D+1, D+2 e outros ciclos de pagamento.',
    icon: <Calculator className="w-8 h-8" />,
    category: 'Financeiro',
    difficulty: 'Intermediário',
    component: SettlementSpreadsheet,
  },
  {
    id: 'mandate-ai',
    title: 'IA de Mandates',
    description: 'Assistente inteligente para análise e validação de mandates bancários.',
    icon: <Brain className="w-8 h-8" />,
    category: 'IA',
    difficulty: 'Avançado',
    component: MandateAI,
  },
  {
    id: 'card-rules',
    title: 'Regras das Bandeiras',
    description: 'Consulte regras, limites e políticas das principais bandeiras de cartão.',
    icon: <Shield className="w-8 h-8" />,
    category: 'Compliance',
    difficulty: 'Básico',
    component: CardRules,
  },
];

const categoryColors = {
  Protocolos: 'bg-blue-100 text-blue-800',
  Financeiro: 'bg-green-100 text-green-800',
  Analytics: 'bg-purple-100 text-purple-800',
  IA: 'bg-orange-100 text-orange-800',
  Compliance: 'bg-red-100 text-red-800',
};

const difficultyColors = {
  Básico: 'bg-gray-100 text-gray-800',
  Intermediário: 'bg-yellow-100 text-yellow-800',
  Avançado: 'bg-red-100 text-red-800',
};

export function ToolsPage() {
  const { navigate } = useAppContext();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const selectedToolData = tools.find(tool => tool.id === selectedTool);

  if (selectedTool && selectedToolData) {
    const ToolComponent = selectedToolData.component;
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setSelectedTool(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para ferramentas
          </Button>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              {selectedToolData.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedToolData.title}</h1>
              <p className="text-gray-500">{selectedToolData.description}</p>
            </div>
          </div>
        </div>
        <ToolComponent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Ferramentas</h1>
        <p className="text-gray-500">Utilitários especializados para profissionais de pagamentos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <Card
            key={tool.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedTool(tool.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {tool.icon}
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={categoryColors[tool.category as keyof typeof categoryColors]}>
                    {tool.category}
                  </Badge>
                  <Badge variant="outline" className={difficultyColors[tool.difficulty as keyof typeof difficultyColors]}>
                    {tool.difficulty}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <Button className="w-full">
                <Wrench className="w-4 h-4 mr-2" />
                Usar Ferramenta
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Mais Ferramentas Em Breve</h3>
            <p className="text-gray-500">
              Estamos desenvolvendo novas ferramentas como simuladores de chargeback,
              analisadores de PCI DSS e muito mais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}