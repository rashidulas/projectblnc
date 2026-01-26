'use client';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-5 py-2 text-xs font-medium tracking-wide transition-all whitespace-nowrap border ${
            activeCategory === category
              ? 'bg-black text-white border-black'
              : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-900'
          }`}
        >
          {category.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
