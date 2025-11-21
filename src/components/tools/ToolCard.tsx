import { motion } from 'framer-motion';
import { Tool } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Zap, Crown, TestTube } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  onTryNow?: () => void;
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
  free: <Zap className="w-4 h-4" />,
  premium: <Crown className="w-4 h-4" />,
  beta: <TestTube className="w-4 h-4" />
};

const statusLabels = {
  free: 'Gratuito',
  premium: 'Premium',
  beta: 'Beta'
};

const statusColors = {
  free: 'bg-green-100 text-green-800',
  premium: 'bg-purple-100 text-purple-800',
  beta: 'bg-blue-100 text-blue-800'
};

export function ToolCard({ tool, onClick, onTryNow }: ToolCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              {tool.icon}
            </div>
            <div className="flex gap-1">
              {tool.isNew && <Badge variant="destructive" className="text-xs">Novo</Badge>}
              <Badge variant="secondary" className={`text-xs ${statusColors[tool.status]}`}>
                {statusIcons[tool.status]}
                <span className="ml-1">{statusLabels[tool.status]}</span>
              </Badge>
            </div>
          </div>
          <CardTitle className="text-lg">{tool.name}</CardTitle>
          <Badge variant="outline" className="w-fit text-xs">
            {categoryLabels[tool.category]}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{tool.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < tool.popularity
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-1">({tool.popularity})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-3 h-3" />
                <span>{tool.usageCount}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Principais recursos:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {tool.features.length > 3 && (
                  <li className="text-gray-500">+{tool.features.length - 3} recursos</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTryNow?.();
            }}
            className="w-full"
            variant={tool.status === 'free' ? 'default' : 'outline'}
          >
            {tool.status === 'free' ? 'Usar Agora' : tool.status === 'beta' ? 'Experimentar' : 'Ver Detalhes'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}