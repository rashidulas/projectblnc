import LandingPage from '@/components/LandingPage';

export default function Home() {
  return (
    <>
      <link rel="preload" href="/hero/sea.mp4" as="video" type="video/mp4" />
      <LandingPage />
    </>
  );
}
