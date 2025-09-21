'use client';
import Header from '@/components/Header';
import Intro from '@/components/Intro';
import FlickrGallery from '@/components/FlickrGallery';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="text-black">
      <Header />
      <Intro />
      <FlickrGallery />
      <Footer />
    </main>
  );
}
