import { useNavigate } from 'react-router-dom';
import CategoryChips from '../../components/CategoryChips';
import { categories } from '../../data/mockProducts';

const CategorySelection = () => {
  const navigate = useNavigate();

  return (
    <section className="app-shell space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-ink md:text-2xl">
          Explore Categories
        </h2>
        <p className="text-sm text-muted">
          Tap a lane and jump straight into matching gear.
        </p>
      </div>
      <CategoryChips
        categories={categories}
        activeCategory="All"
        onSelect={(category) =>
          navigate(category === 'All' ? '/category' : `/category?category=${category}`)
        }
      />
    </section>
  );
};

export default CategorySelection;
