import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Zap, Wind, Droplets, Hammer, Paintbrush, Tv, Flower2, Bug, WashingMachine } from 'lucide-react';

const services = [
  { name: 'Plumbing', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Electrical', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { name: 'AC Repair', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { name: 'Cleaning', icon: Wrench, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { name: 'Carpentry', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { name: 'Painting', icon: Paintbrush, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { name: 'Appliance Repair', icon: Tv, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
  { name: 'Gardening', icon: Flower2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
];

const PopularServices = () => {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Popular Services
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Explore our most requested home services tailored for you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.name}
                to={`/providers?service=${encodeURIComponent(service.name)}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`inline-flex p-4 rounded-xl ${service.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularServices;
