import { mockCategories } from '@/mocks/forum';
import { CategoryCard } from '@/components/forum/CategoryCard';
import { useAppContext } from '@/contexts/AppContext';

export function ForumCategoriesPage() {
  const { navigate } = useAppContext();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Fórum</h1>
        <p className="text-gray-500">Escolha uma categoria para começar a discutir.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockCategories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category}
            onClick={() => navigate('topicList', { categoryId: category.id, categoryName: category.name })}
          />
        ))}
      </div>
    </div>
  );
}