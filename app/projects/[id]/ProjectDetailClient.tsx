'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SocialMedia from '@/components/SocialMedia';
import Footer from '@/components/Footer';
import {
  ArrowLeft, MapPin, Calendar, User, Square, Clock, ArrowRight
} from 'lucide-react';
import type { Project } from '@/lib/supabase';

export default function ProjectDetailClient({
  project,
  allProjects
}: {
  project: Project;
  allProjects: Project[];
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const relatedProjects = allProjects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const projectImages = [
    project.main_image,
    ...(project.project_images?.map(img => img.image_url) || [])
  ].filter((img, index, arr) => arr.indexOf(img) === index);

  return (
    <>
      <Navigation />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/projects"
              className="inline-flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Projects</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Project Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-medium">
                      {project.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-yellow-400">
                    {project.title}
                  </h1>

                  <p className="text-xl text-gray-300 leading-relaxed mb-8">
                    {project.description}
                  </p>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-900 rounded-lg border border-yellow-400/20">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Client</p>
                      <p className="text-white font-medium">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Square className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Area</p>
                      <p className="text-white font-medium">{project.area}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p className="text-white font-medium">{project.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-400">Completed</p>
                      <p className="text-white font-medium">{project.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={projectImages[currentImageIndex]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Navigation */}
                {projectImages.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto">
                    {projectImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex
                            ? 'border-yellow-400'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${project.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-8 text-yellow-400">Project Details</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg">
                {project.details}
              </p>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        {projectImages.length > 1 && (
          <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-light mb-12 text-center text-yellow-400">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-light mb-12 text-center text-yellow-400">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="group bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-400/20 hover:border-yellow-400/40"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedProject.main_image}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-400 mb-2">
                        {relatedProject.category} • {relatedProject.location}
                      </div>
                      <h3 className="text-xl font-medium mb-3 text-white group-hover:text-yellow-400 transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {relatedProject.description}
                      </p>
                      <div className="flex items-center text-yellow-400 text-sm font-medium">
                        <span>View Project</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SocialMedia />
      <Footer />
    </>
  );
}