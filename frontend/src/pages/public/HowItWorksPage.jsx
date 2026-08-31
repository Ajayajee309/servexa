import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HowItWorks from '../../components/home/HowItWorks';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="flex-grow pt-10">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
