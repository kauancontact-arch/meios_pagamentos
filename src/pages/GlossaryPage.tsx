import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Construction, Clock } from 'lucide-react';

export function GlossaryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Glossário</h1>
        <p className="text-gray-500">Termos e conceitos importantes do mundo dos pagamentos</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-gray-800">Em Construção</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Estamos trabalhando duro para criar um glossário completo com todos os termos técnicos
            do universo dos pagamentos digitais.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Previsão de lançamento: Janeiro 2025</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-blue-800 mb-2">O que você encontrará aqui:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Definições claras de termos técnicos</li>
              <li>• Exemplos práticos de uso</li>
              <li>• Contexto histórico e evolução</li>
              <li>• Ligações entre conceitos relacionados</li>
              <li>• Busca rápida e filtros por categoria</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}