const CategoryChips = ({ categories, activeCategory, onSelect }) => (
  <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
    {categories.map((category) => (
      <button
        key={category}
        type="button"
        onClick={() => onSelect(category)}
        className={`min-h-11 whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-medium ${
          activeCategory === category
            ? 'border-primary bg-primary text-white'
            : 'border-line bg-white text-ink'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
);

export default CategoryChips;
