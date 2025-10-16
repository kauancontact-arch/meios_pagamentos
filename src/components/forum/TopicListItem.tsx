import { Topic, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopicListItemProps {
  topic: Topic;
  author: User;
  onClick: () => void;
}

export function TopicListItem({ topic, author, onClick }: TopicListItemProps) {
  return (
    <motion.div
      whileHover={{ backgroundColor: 'hsl(var(--accent))' }}
      className="p-4 border-b cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-800 hover:text-primary">{topic.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>{author.name}</span>
              <span>•</span>
              <span>{topic.createdAt}</span>
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {topic.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500 shrink-0 ml-4">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4" />
            <span>{topic.upvotes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>{topic.replyCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}