import React from 'react';
import { Search, UserCheck, CalendarCheck, Smile } from 'lucide-react';

const steps = [
  {
    id: 1,
    name: 'Search Service',
    description: 'Tell us what you need. Choose from a variety of home services.',
    icon: Search,
  },
  {
    id: 2,
    name: 'Choose Provider',
    description: 'Compare professionals based on ratings, prices, and reviews.',
    icon: UserCheck,
  },
  {
    id: 3,
    name: 'Book Service',
    description: 'Select a convenient date and time for the service.',
    icon: CalendarCheck,
  },
  {
    id: 4,
    name: 'Get Service',
    description: 'The professional arrives and completes the job to your satisfaction.',
    icon: Smile,
  },
];

const HowItWorks = () => {
  return (
    <div className="py-20 bg-blue-50 dark:bg-gray-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Your home service is just four simple steps away.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-blue-200 dark:bg-gray-700 w-3/4 mx-auto" aria-hidden="true"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={step.id} className="relative text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-4 border-blue-100 dark:border-gray-700 shadow-md relative z-10">
                  <step.icon className="h-10 w-10 text-blue-600 dark:text-blue-500" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white dark:border-gray-900">
                    {step.id}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{step.name}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
