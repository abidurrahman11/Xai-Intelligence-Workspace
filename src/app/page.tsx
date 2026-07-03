import Navigation    from '@/components/navigation/Navigation';
import Hero          from '@/components/hero/Hero';
import InsightFlow   from '@/components/insight-flow/InsightFlow';
import Dashboard     from '@/components/dashboard/Dashboard';
import Constellation from '@/components/constellation/Constellation';
import Footer        from '@/components/footer/Footer';

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <InsightFlow />
      <hr className="section-divider" aria-hidden="true" />
      <Dashboard />
      <Constellation />
      <Footer />
    </main>
  );
}
