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
              ? 'bg-neutral-800 text-neutral-50 border-neutral-800'
              : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-neutral-800'
          }`}
        >
          {category.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
