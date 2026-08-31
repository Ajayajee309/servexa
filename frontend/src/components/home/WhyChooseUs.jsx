import React from 'react';
import { ShieldCheck, CreditCard, Clock, Star, HeartHandshake, Headphones } from 'lucide-react';

const features = [
  {
    name: 'Verified Professionals',
    description: 'Every service provider goes through a strict background check and verification process.',
    icon: ShieldCheck,
  },
  {
    name: 'Transparent Pricing',
    description: 'No hidden charges. See the estimated cost before you book the service.',
    icon: CreditCard,
  },
  {
    name: 'Secure Payments',
    description: 'Pay securely online after the service is completed to your satisfaction.',
    icon: ShieldCheck,
  },
  {
    name: 'Fast Booking',
    description: 'Book a professional in less than a minute. Real-time availability.',
    icon: Clock,
  },
  {
    name: 'High Quality',
    description: 'We ensure top-notch service quality with our rating and review system.',
    icon: Star,
  },
  {
    name: '24/7 Support',
    description: 'Our customer support team is always ready to help you with any issues.',
    icon: Headphones,
  },
];

const WhyChooseUs = () => {
  return (
    <div className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-blue-600 dark:text-blue-500 font-semibold tracking-wide uppercase">Why Servexa?</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A better way to book local services
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            We connect you with trusted, reliable professionals in your area. Your satisfaction is our priority.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                <div className="absolute top-6 left-6 flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="mt-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">{feature.name}</h3>
                  <p className="text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
