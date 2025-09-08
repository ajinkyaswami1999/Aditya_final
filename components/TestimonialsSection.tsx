'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { testimonialsApi, type Testimonial, supabase } from '@/lib/supabase';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    if (!supabase) {
      // Use fallback data when Supabase is not configured
      setTestimonials([
        {
          id: '1',
          client_name: 'Sarah Johnson',
          client_position: 'CEO, TechStart Inc.',
          testimonial_text:
            'Working with 26AS was an absolute pleasure. Their attention to detail and innovative approach transformed our vision into reality.',
          rating: 5,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          client_name: 'Michael Chen',
          client_position: 'Founder, GreenSpace',
          testimonial_text:
            'The team delivered exceptional results that exceeded our expectations. Highly recommend their services.',
          rating: 5,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const testimonialsData = await testimonialsApi.getAll();
      if (testimonialsData && testimonialsData.length > 0) {
        setTestimonials(testimonialsData);
      } else {
        // Use fallback data if no testimonials in database
        setTestimonials([
          {
            id: '1',
            client_name: 'Sarah Johnson',
            client_position: 'CEO, TechStart Inc.',
            testimonial_text:
              'Working with 26AS was an absolute pleasure. Their attention to detail and innovative approach transformed our vision into reality.',
            rating: 5,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            client_name: 'Michael Chen',
            client_position: 'Founder, GreenSpace',
            testimonial_text:
              'The team delivered exceptional results that exceeded our expectations. Highly recommend their services.',
            rating: 5,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      // Use fallback data on error
      setTestimonials([
        {
          id: '1',
          client_name: 'Sarah Johnson',
          client_position: 'CEO, TechStart Inc.',
          testimonial_text:
            'Working with 26AS was an absolute pleasure. Their attention to detail and innovative approach transformed our vision into reality.',
          rating: 5,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-yellow-400 text-xl">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 tracking-wide text-yellow-400">
            Client Reviews
          </h2>
          <div className="text-gray-400">No testimonials available</div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-16 tracking-wide text-yellow-400">
          Client Reviews
        </h2>

        <div className="relative h-64 overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentTestimonial ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-xl md:text-2xl font-light mb-8 leading-relaxed">
                "{testimonial.testimonial_text}"
              </p>
              <div>
                <h4 className="font-medium text-lg">
                  {testimonial.client_name}
                </h4>
                <p className="text-gray-400">{testimonial.client_position}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentTestimonial ? 'bg-white' : 'bg-gray-600'
              }`}
              onClick={() => setCurrentTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
