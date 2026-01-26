export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Project BLNC</h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Redefining the boundaries of luxury streetwear through innovative
            design and uncompromising quality.
          </p>
        </div>

        {/* Story Section */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Project BLNC was born from a vision to create something different—a
                brand that challenges conventions while honoring the fundamentals of
                great design. We believe in the power of minimalism, the beauty of
                clean lines, and the importance of quality over quantity.
              </p>
              <p>
                Every piece we create is a testament to our commitment to excellence.
                From the initial sketch to the final stitch, we obsess over every
                detail, ensuring that our products not only look exceptional but
                feel exceptional too.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Philosophy</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We design for the modern individual—someone who values authenticity,
                appreciates craftsmanship, and isn't afraid to stand out. Our
                collections are intentionally limited, ensuring exclusivity and
                reducing waste.
              </p>
              <p>
                Balance is at the core of everything we do. It's in our name, it's
                in our designs, and it's in our approach to business. We strive to
                balance form and function, tradition and innovation, luxury and
                accessibility.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Sustainability</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                We're committed to making fashion more sustainable. Our made-to-order
                model minimizes waste, and we carefully select materials that are
                both high-quality and responsibly sourced. We believe that luxury
                shouldn't come at the expense of our planet.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">The Future</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                This is just the beginning. As we grow, we remain committed to our
                founding principles: quality, innovation, and integrity. We're
                building more than a brand—we're building a movement.
              </p>
              <p>
                Join us on this journey as we reshape the future of fashion, one
                piece at a time.
              </p>
            </div>
          </section>
        </div>

        {/* Values */}
        <div className="mt-16 pt-16 border-t border-neutral-200">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quality First</h3>
              <p className="text-sm text-neutral-600">
                Every piece is crafted with meticulous attention to detail
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Timeless Design</h3>
              <p className="text-sm text-neutral-600">
                Creating pieces that transcend trends and seasons
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Responsible Fashion</h3>
              <p className="text-sm text-neutral-600">
                Committed to sustainable practices and ethical production
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
