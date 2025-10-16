import { motion } from 'framer-motion';
import { ForumCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
  category: ForumCategory;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
              {category.icon}
            </div>
            <div>
              <CardTitle>{category.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{category.topicCount} tópicos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{category.description}</p>
          <Button onClick={onClick} className="w-full">Entrar</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}