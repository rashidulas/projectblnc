export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      date: 'January 2026',
      title: 'Genesis // Drop 001 Now Available',
      description:
        'Our inaugural collection is here. Explore a carefully curated selection of pieces that define the Project BLNC aesthetic.',
      category: 'Launch',
    },
    {
      id: 2,
      date: 'December 2025',
      title: 'The Making of Project BLNC',
      description:
        'Go behind the scenes and discover the story of how Project BLNC came to life, from concept to reality.',
      category: 'Feature',
    },
    {
      id: 3,
      date: 'November 2025',
      title: 'Sustainability in Fashion',
      description:
        'Our commitment to responsible fashion and how we\'re working to minimize our environmental impact.',
      category: 'Sustainability',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-neutral-500 max-w-2xl">
            Stay updated with the latest from Project BLNC. New releases,
            collaborations, and stories from behind the brand.
          </p>
        </div>

        {/* News Items */}
        <div className="space-y-12">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="pb-12 border-b border-neutral-200 last:border-0"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-neutral-500 uppercase tracking-wide">
                  {item.category}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">{item.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {item.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {item.description}
              </p>
              <button className="mt-6 text-sm font-medium hover:text-neutral-600 transition-colors">
                Read More →
              </button>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 p-8 bg-neutral-50 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Stay in the Loop</h3>
          <p className="text-neutral-600 mb-6">
            Subscribe to our newsletter for exclusive updates and early access to
            new releases.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="px-6 py-3 bg-black text-white rounded-md hover:opacity-90 transition-opacity font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
