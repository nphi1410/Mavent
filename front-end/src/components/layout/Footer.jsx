import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="/" className="flex items-center mb-4 sm:mb-0">
            <img src="/logo.png" className="h-8 mr-3" alt="Mavent Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Mavent</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="/about" className="mr-4 hover:underline md:mr-6">About</a>
            </li>
            <li>
              <a href="/privacy-policy" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms-of-service" className="mr-4 hover:underline md:mr-6">Terms of Service</a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">Contact</a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear} <a href="/" className="hover:underline">Mavent™</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
