import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Built for Expression - top of page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6 md:mb-8">
          Built for Expression.
        </h1>
        <p className="font-description text-sm sm:text-base md:text-lg text-neutral-700 leading-relaxed w-full">
          At BLANC, we merge form and function to craft timeless pieces that go beyond trends—born from purpose, driven by detail.
        </p>
      </section>

      {/* Horizontal line - full width covering the writing part */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-neutral-200 w-full" />
      </section>

      {/* The Rhythm of Movement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6 md:mb-8">
          The Rhythm of Movement
        </h2>
        <p className="font-description text-base md:text-lg text-neutral-700 leading-relaxed w-full">
          We exist in a world of motion. Each step, each shift, each blurred silhouette—an echo of change, a testament to evolution. In movement, we find purpose. In rhythm, we create identity. Our designs are built for those who refuse to stand still. Structured yet fluid, timeless yet in constant transformation. This is not just fashion—it&apos;s an extension of the body in motion.
        </p>
      </section>

      {/* First picture - 1.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden group">
          <Image
            src="/about/1.jpg"
            alt="BLANC"
            fill
            className="object-cover grayscale-0 md:grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 1280px"
            priority
          />
        </div>
      </section>

      {/* The Essence of Presence - on top of second pic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6 md:mb-8">
          The Essence of Presence
        </h2>
        <p className="font-description text-base md:text-lg text-neutral-700 leading-relaxed w-full">
          Fashion is more than what you wear—it&apos;s how you exist within it. The way fabric drapes as you move, the way light catches texture, the way structure adapts to the body. Presence is not about being seen; it&apos;s about being felt. Every piece is an exploration of form and feeling, designed to frame motion, not restrict it. We strip away the unnecessary to reveal the essence. Precision, balance, intention—crafted for those who shape the present.
        </p>
      </section>

      {/* Second picture - 2.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden group">
          <Image
            src="/about/2.JPG"
            alt="BLANC"
            fill
            className="object-cover grayscale-0 md:grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>
      </section>

      {/* The Liberation of Expression - on top of 3rd pic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6 md:mb-8">
          The Liberation of Expression
        </h2>
        <p className="font-description text-base md:text-lg text-neutral-700 leading-relaxed w-full">
          Unbound by convention, uninhibited by expectation—this is where movement becomes freedom. The pulse of creativity, the blur of expression, the unfiltered essence of individuality. Our pieces are a canvas for self-expression, a tool for those who move beyond the expected. In every fold, every silhouette, every detail—an invitation to redefine, disrupt, and reimagine.
        </p>
      </section>

      {/* Third picture - 3.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 pb-20 sm:pb-24 md:pb-32">
<div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden group">
            <Image
            src="/about/3.JPG"
            alt="BLANC"
            fill
            className="object-cover grayscale-0 md:grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>
      </section>
    </div>
  );
}
