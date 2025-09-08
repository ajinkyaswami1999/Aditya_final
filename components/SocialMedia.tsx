'use client';

import { useEffect, useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { siteSettingsApi, supabase } from '@/lib/supabase';

const defaultSocialLinks = {
  facebook: 'https://facebook.com/26asdesign',
  instagram: 'https://instagram.com/26asdesign',
  twitter: 'https://twitter.com/26asdesign',
  youtube: 'https://youtube.com/@26asdesign',
  behance: 'https://behance.net/26asdesign',
  linkedin: 'https://linkedin.com/company/26asdesign'
};

const BehanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
);

export default function SocialMedia() {
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        if (!supabase) {
          // fallback links
          setSocialLinks(defaultSocialLinks);
          return;
        }

        const socialData = await siteSettingsApi.get('social_links');
        if (socialData) {
          setSocialLinks({ ...defaultSocialLinks, ...socialData });
        }
      } catch (error) {
        console.error('Error loading social links:', error);
        setSocialLinks(defaultSocialLinks);
      }
    };

    loadSocialLinks();
  }, []);

  const socialLinksArray = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: socialLinks.facebook,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: socialLinks.instagram,
      color: 'hover:text-pink-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: socialLinks.twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: socialLinks.youtube,
      color: 'hover:text-red-600'
    },
    {
      name: 'Behance',
      icon: BehanceIcon,
      url: socialLinks.behance,
      color: 'hover:text-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: socialLinks.linkedin,
      color: 'hover:text-blue-700'
    }
  ];

  return (
    <section className="py-12 bg-black border-t border-yellow-400/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-light mb-8 tracking-wide text-yellow-400">
            Follow Our Journey
          </h3>
          <div className="flex justify-center space-x-8">
            {socialLinksArray.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-300 transition-colors duration-300 ${social.color} transform hover:scale-110`}
                aria-label={`Follow us on ${social.name}`}
              >
                <social.icon size={28} />
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-6">
            Stay connected for the latest projects and design insights
          </p>
        </div>
      </div>
    </section>
  );
}
