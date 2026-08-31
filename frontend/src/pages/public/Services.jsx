import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Droplet, Zap, Wind, Wrench, Hammer, Paintbrush, Tv, Flower2, ShieldAlert, Sparkles } from 'lucide-react';

const services = [
  { name: 'Plumbing', icon: Droplet, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Electrical', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { name: 'AC Repair', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Cleaning', icon: Sparkles, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { name: 'Carpentry', icon: Hammer, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Painting', icon: Paintbrush, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Appliance Repair', icon: Tv, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' },
  { name: 'Gardening', icon: Flower2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  { name: 'Pest Control', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  { name: 'General Repair', icon: Wrench, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' }
];

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Browse through our wide range of professional home services. Every provider is verified for your safety and satisfaction.
          </p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link 
              to={`/providers?service=${encodeURIComponent(service.name)}`}
              key={service.name} 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
            >
              <div className={`p-4 rounded-2xl mb-4 ${service.bg} group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className={`w-8 h-8 ${service.color}`} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{service.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find top professionals near you</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
