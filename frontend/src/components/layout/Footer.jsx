import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Servexa
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Trusted Local Services, Just a Click Away. Book reliable home services quickly, safely and conveniently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">All Services</Link></li>
              <li><Link to="/providers" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Find Professionals</Link></li>
              <li><Link to="/how-it-works" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refunds" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">Refund Policy</Link></li>
              <li><Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">123 Tech Park, Innovation Hub, Tech City, 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">support@servexa.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Servexa. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 dark:text-gray-500">
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
