'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { projectsApi, type Project } from '@/lib/supabase';


export default function ProjectsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProjects();
  }, []);

  const loadFeaturedProjects = async () => {
    try {
      if (!supabase) {
        // Use fallback data when Supabase is not configured
        setProjects([
          {
            id: '1',
            title: 'Modern Villa Residence',
            category: 'Residential',
            location: 'California',
            year: '2024',
            description: 'A stunning contemporary villa featuring clean lines and sustainable materials.',
            details: 'This modern villa represents the pinnacle of contemporary residential design.',
            client: 'Johnson Family',
            area: '4,500 sq ft',
            duration: '18 months',
            featured: true,
            main_image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Corporate Headquarters',
            category: 'Commercial',
            location: 'New York',
            year: '2023',
            description: 'State-of-the-art office building designed for maximum productivity and wellness.',
            details: 'A revolutionary approach to corporate architecture.',
            client: 'Tech Innovations Corp',
            area: '25,000 sq ft',
            duration: '24 months',
            featured: true,
            main_image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);
        return;
      }

      const featuredProjects = await projectsApi.getFeatured();
      setProjects(featuredProjects.slice(0, 4)); // Show only first 4 featured projects
    } catch (error) {
      console.error('Error loading featured projects:', error);
      // Use fallback data on error
      setProjects([
        {
          id: '1',
          title: 'Modern Villa Residence',
          category: 'Residential',
          location: 'California',
          year: '2024',
          description: 'A stunning contemporary villa featuring clean lines and sustainable materials.',
          details: 'This modern villa represents the pinnacle of contemporary residential design.',
          client: 'Johnson Family',
          area: '4,500 sq ft',
          duration: '18 months',
          featured: true,
          main_image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = gridRef.current?.querySelectorAll('.fade-in');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [projects]);

  if (loading) {
    return (
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-yellow-400 text-xl">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gray-400 text-xl">No featured projects available</div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block">
            <span className="text-sm font-medium tracking-widest text-yellow-400 uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-white">
              Featured Projects
            </h2>
            <div className="w-24 h-0.5 bg-yellow-400 mx-auto mb-6"></div>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our latest architectural masterpieces that blend innovation with timeless design principles
          </p>
        </div>
        
        <div ref={gridRef} className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group fade-in ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex gap-8 lg:gap-16 items-center`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              {/* Image Container */}
              <div className={`${
                index % 2 === 0 ? 'lg:w-3/5' : 'lg:w-1/2'
              } w-full relative overflow-hidden rounded-2xl shadow-2xl`}>
                <div className="aspect-[4/3] relative">
                  <img
                    src={project.main_image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-black">{project.category}</span>
                  </div>
                  
                  {/* View Project Button */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <Link
                      href={`/projects/${project.id}`}
                      className="bg-yellow-400 text-black px-6 py-3 rounded-full font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors duration-300"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className={`${
                index % 2 === 0 ? 'lg:w-2/5' : 'lg:w-1/2'
              } w-full space-y-6`}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-light tracking-tight text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="group/btn inline-flex items-center space-x-2 text-yellow-400 font-medium hover:space-x-4 transition-all duration-300"
                  >
                    <span className="border-b border-yellow-400 pb-1">Learn More</span>
                    <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="text-center mt-20">
          <Link href="/projects" className="group inline-block bg-yellow-400 text-black px-12 py-4 rounded-full font-medium text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center space-x-3">
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}