import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import HowItWorks from './components/sections/HowItWorks';
import UseCases from './components/sections/UseCases';
import ModelConfigurator from './components/sections/ModelConfigurator';
import Pricing from './components/sections/Pricing';
import Security from './components/sections/Security';
import FAQ from './components/sections/FAQ';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <UseCases />
        <ModelConfigurator />
        <Pricing />
        <Security />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
