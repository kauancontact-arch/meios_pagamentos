import { useAppContext } from '@/contexts/AppContext';
import { mockTopics } from '@/mocks/forum';
import { mockUsers } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/forum/PostCard';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TopicDetailPage() {
  const { screenParams, navigate, currentUser } = useAppContext();
  const { topicId } = screenParams;

  const topic = mockTopics.find(t => t.id === topicId);
  const topicAuthor = mockUsers.find(u => u.id === topic?.authorId);
  const posts = mockPosts.filter(p => p.topicId === topicId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // Simplistic sort
  const originalPost = posts[0];
  const replies = posts.slice(1);

  if (!topic || !topicAuthor || !originalPost) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Tópico não encontrado</h1>
        <Button onClick={() => navigate('forum')}>Voltar ao Fórum</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('topicList', { categoryId: topic.categoryId })} className="mb-4 text-sm text-gray-600 px-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a lista de tópicos
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{topic.title}</h1>
        <div className="mt-2 flex gap-2 flex-wrap">
          {topic.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </div>

      <PostCard post={originalPost} author={topicAuthor} isOriginalPost />

      <h2 className="text-xl font-bold text-gray-800 pt-4 border-t">{replies.length} Respostas</h2>
      
      <div className="space-y-4">
        {replies.map(reply => {
          const replyAuthor = mockUsers.find(u => u.id === reply.authorId);
          if (!replyAuthor) return null;
          return <PostCard key={reply.id} post={reply} author={replyAuthor} />;
        })}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea placeholder="Escreva sua resposta..." />
              <Button>Publicar Resposta</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}