import { useAppContext } from '@/contexts/AppContext';
import { mockTopics, mockCategories } from '@/mocks/forum';
import { mockUsers } from '@/mocks/users';
import { TopicListItem } from '@/components/forum/TopicListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, PlusCircle, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function TopicListPage() {
  const { screenParams, navigate } = useAppContext();
  const { categoryId } = screenParams;

  const category = mockCategories.find(c => c.id === categoryId);
  const topics = mockTopics.filter(t => t.categoryId === categoryId);

  if (!category) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Categoria não encontrada</h1>
        <Button onClick={() => navigate('forum')}>Voltar ao Fórum</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('forum')} className="mb-4 text-sm text-gray-600 px-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para todas as categorias
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
        <p className="text-gray-500 mt-1">{category.description}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar nesta categoria..." className="pl-10" />
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Tópico
        </Button>
      </div>

      <Card className="overflow-hidden">
        {topics.length > 0 ? (
          <div>
            {topics.map(topic => {
              const author = mockUsers.find(u => u.id === topic.authorId);
              if (!author) return null;
              return (
                <TopicListItem
                  key={topic.id}
                  topic={topic}
                  author={author}
                  onClick={() => navigate('topicDetail', { topicId: topic.id })}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <h3 className="text-lg font-semibold">Ainda sem tópicos aqui.</h3>
            <p>Seja o primeiro a iniciar uma discussão nesta categoria!</p>
          </div>
        )}
      </Card>
    </div>
  );
}