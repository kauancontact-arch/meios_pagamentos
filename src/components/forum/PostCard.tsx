import { Post, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface PostCardProps {
  post: Post;
  author: User;
  isOriginalPost?: boolean;
}

export function PostCard({ post, author, isOriginalPost = false }: PostCardProps) {
  return (
    <Card className={post.isBestAnswer ? 'border-green-500 border-2' : ''}>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={author.avatarUrl} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">{author.name}</p>
              <p className="text-sm text-gray-500">{author.title}</p>
            </div>
            {post.isBestAnswer && (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Melhor Resposta
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-gray-50/50 flex items-center justify-between text-sm text-gray-600">
        <span>Postado {post.createdAt}</span>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4" />
            {post.upvotes}
          </Button>
          {!isOriginalPost && (
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              Responder
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}