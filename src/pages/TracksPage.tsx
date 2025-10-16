import { mockTracks } from '@/mocks/tracks';
import { mockUsers } from '@/mocks/users';
import { TrackCard } from '@/components/tracks/TrackCard';
import { useAppContext } from '@/contexts/AppContext';

export function TracksPage() {
  const { navigate } = useAppContext();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Trilhas de Aprendizado</h1>
        <p className="text-gray-500">Siga caminhos de estudo guiados pelos melhores especialistas do mercado.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {mockTracks.map(track => {
          const author = mockUsers.find(u => u.id === track.authorId);
          if (!author) return null;
          return (
            <TrackCard 
              key={track.id} 
              track={track}
              author={author}
              onClick={() => navigate('trackDetail', { trackId: track.id })}
            />
          );
        })}
      </div>
    </div>
  );
}