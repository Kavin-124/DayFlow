import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>© 2026 DayFlow Inc. All rights reserved.</span>
        <div className="flex gap-4 text-gray-400 font-medium">
          <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
          <a href="#" className="hover:text-gray-600 transition">Enterprise Support</a>
        </div>
      </div>
    </footer>
  );
}
