import { Badge as BadgeType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BadgesListProps {
  badges: BadgeType[];
}

export function BadgesList({ badges }: BadgesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conquistas</CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {badges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center text-center gap-2 p-2 rounded-lg hover:bg-accent w-24">
                <div className="text-4xl">{badge.icon}</div>
                <span className="text-xs font-medium text-gray-600">{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma conquista ainda. Continue participando!</p>
        )}
      </CardContent>
    </Card>
  );
}