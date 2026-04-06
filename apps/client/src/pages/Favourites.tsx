import { Heart } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';
import { useFavourites } from '../store/FavouritesContext';

const Favourites = () => {
  const { favourites } = useFavourites();

  return (
    <div className="page-animate app-shell space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-ink">My Favourites</h1>
        <p className="text-sm text-muted">Saved gear for upcoming projects.</p>
      </header>

      {favourites.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {favourites.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <EmptyState
          title="No favourites yet"
          message="Save your go-to camera bodies, lenses, and accessories for faster checkouts."
          actionLabel="Browse Gear"
          actionTo="/browse"
          icon={<Heart className="h-8 w-8" />}
        />
      )}
    </div>
  );
};

export default Favourites;
