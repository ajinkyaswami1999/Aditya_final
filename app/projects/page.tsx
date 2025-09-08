'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SocialMedia from '@/components/SocialMedia';
import Footer from '@/components/Footer';
import { ArrowRight, MapPin, Calendar, User, Square, Clock } from 'lucide-react';
import { projectsApi, type Project } from '@/lib/supabase';

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectsData = await projectsApi.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
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
      <>
        <Navigation />
        <main className="pt-24">
          <section className="py-20 bg-gradient-to-b from-black to-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-yellow-400 text-xl">Loading projects...</div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-wide text-yellow-400">
              Our Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our portfolio of innovative architectural designs that push the boundaries of modern living and working spaces.
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={gridRef} className="space-y-16">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`group fade-in ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex flex-col lg:flex gap-8 lg:gap-16 items-center`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container */}
                  <div className="lg:w-3/5 w-full relative overflow-hidden rounded-2xl shadow-2xl">
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
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="lg:w-2/5 w-full space-y-6">
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

                      {/* Project Meta Info */}
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <User className="w-4 h-4" />
                          <span>{project.client}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Square className="w-4 h-4" />
                          <span>{project.area}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="group/btn inline-flex items-center space-x-2 text-yellow-400 font-medium hover:space-x-4 transition-all duration-300"
                      >
                        <span className="border-b border-yellow-400 pb-1">View Full Project</span>
                        <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SocialMedia />
      <Footer />
    </>
  );
}