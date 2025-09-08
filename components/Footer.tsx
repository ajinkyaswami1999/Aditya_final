'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { siteSettingsApi } from '@/lib/supabase';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    address: '123 Design Street, Suite 456, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@26asdesign.com',
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      if (!supabase) {
        // Use fallback data when Supabase is not configured
        setContactInfo({
          phone: '+91 98765 43210',
          email: 'info@26asdesign.com',
          address: 'Mumbai, Maharashtra, India',
        });
        return;
      }

      const contactData = await siteSettingsApi.get('contact_info');
      if (contactData) {
        setContactInfo(contactData);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      // Use fallback data on error
      setContactInfo({
        phone: '+91 98765 43210',
        email: 'info@26asdesign.com',
        address: 'Mumbai, Maharashtra, India',
      });
    }
  };

  return (
    <footer className="bg-black text-white py-16 border-t border-yellow-400/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-light tracking-widest mb-4 text-yellow-400">
              26AS
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Creating exceptional architectural experiences through innovative
              design and thoughtful execution.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-yellow-400">
              Contact Info
            </h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>{contactInfo.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-yellow-400">
              Services
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>Architectural Design</li>
              <li>Interior Design</li>
              <li>Urban Planning</li>
              <li>Construction Management</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-yellow-400/20 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 26AS Design Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
