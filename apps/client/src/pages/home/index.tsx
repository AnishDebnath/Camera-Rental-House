import Hero from './Hero';
import FeaturedGear from './FeaturedGear';
import CategorySelection from './CategorySelection';
import BrandSelection from './BrandSelection';
import Testimonials from './Testimonials';
import Footer from '../../components/common/footer/Footer';

const Home = () => {
  return (
    <div className="page-animate space-y-10 pb-8 md:space-y-12">
      <Hero />
      <CategorySelection />
      <FeaturedGear />
      <BrandSelection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
