import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Hero from '../../components/home/Hero';
import PopularServices from '../../components/home/PopularServices';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import HowItWorks from '../../components/home/HowItWorks';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main>
        <Hero />
        <PopularServices />
        <WhyChooseUs />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
