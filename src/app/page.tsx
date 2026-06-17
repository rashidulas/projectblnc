import Hero from '@/components/Hero';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <LoadingScreen />
      <Hero />
    </main>
  );
}
