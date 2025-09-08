'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import SocialMedia from '@/components/SocialMedia';
import Footer from '@/components/Footer';
import { ArrowLeft, MapPin, Calendar, User, Square, Clock, ArrowRight, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { projectsApi, type Project } from '@/lib/supabase';

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    try {
      const [projectData, allProjectsData] = await Promise.all([
        projectsApi.getById(params.id as string),
        projectsApi.getAll()
      ]);
      
      setProject(projectData);
      setAllProjects(allProjectsData);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="pt-24 min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-yellow-400 text-xl">Loading project...</div>
          </div>
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navigation />
        <main className="pt-24 min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-light mb-4 text-yellow-400">Project Not Found</h1>
            <p className="text-gray-300 mb-8">The project you're looking for doesn't exist.</p>
            <Link
              href="/projects"
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        </main>
      </>
    );
  }

  const relatedProjects = allProjects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  // Get project images - combine main image with additional images
  const projectImages = [
    project.main_image,
    ...(project.project_images?.map(img => img.image_url) || [])
  ].filter((img, index, arr) => img && arr.indexOf(img) === index); // Remove duplicates and null values

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  return (
    <>
      <Navigation />
      <main className="pt-24">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/5 rounded-full blur-xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/projects"
              className="inline-flex items-center space-x-3 text-yellow-400 hover:text-yellow-300 mb-16 transition-all duration-300 group bg-gray-900/30 backdrop-blur-sm px-6 py-3 rounded-full border border-yellow-400/20 hover:border-yellow-400/40"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Projects</span>
            </Link>
            
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-20 items-start">
              {/* Enhanced Project Info */}
              <div className="xl:col-span-2 space-y-10">
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-full font-bold text-sm shadow-xl transform hover:scale-105 transition-transform">
                      {project.category}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-600">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300 bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-600">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">{project.year}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight text-white leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {project.title}
                  </h1>
                  
                  <p className="text-xl text-gray-300 leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>

                {/* Enhanced Project Details Grid */}
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl p-10 border border-yellow-400/30 shadow-2xl relative overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  
                  <h3 className="text-2xl font-light mb-8 text-yellow-400 text-center">Project Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="group flex items-start space-x-4 p-6 bg-black/40 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1 font-medium">Client</p>
                        <p className="text-white font-semibold text-lg">{project.client}</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-black/40 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Square className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1 font-medium">Area</p>
                        <p className="text-white font-semibold text-lg">{project.area}</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-black/40 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1 font-medium">Duration</p>
                        <p className="text-white font-semibold text-lg">{project.duration}</p>
                      </div>
                    </div>
                    <div className="group flex items-start space-x-4 p-6 bg-black/40 rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1 font-medium">Completed</p>
                        <p className="text-white font-semibold text-lg">{project.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Image Gallery */}
              <div className="xl:col-span-3">
                <div className="relative group">
                  {/* Main Image Display */}
                  <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-yellow-400/20">
                    {projectImages.length > 0 ? (
                      <>
                        <img
                          src={projectImages[currentImageIndex]}
                          alt={`${project.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        
                        {/* Enhanced Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          {/* Navigation Arrows */}
                          {projectImages.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 border border-white/20 hover:border-yellow-400/50"
                              >
                                <ChevronLeft className="w-7 h-7" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 border border-white/20 hover:border-yellow-400/50"
                              >
                                <ChevronRight className="w-7 h-7" />
                              </button>
                            </>
                          )}
                          
                          {/* Fullscreen Button */}
                          <button
                            onClick={() => setIsGalleryOpen(true)}
                            className="absolute top-6 right-6 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 border border-white/20 hover:border-yellow-400/50"
                          >
                            <Maximize2 className="w-6 h-6" />
                          </button>
                          
                          {/* Enhanced Image Counter */}
                          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
                            {currentImageIndex + 1} of {projectImages.length}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                        <div className="text-center">
                          <Square className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                          <p className="text-lg">No images available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Thumbnail Navigation */}
                  {projectImages.length > 1 && (
                    <div className="flex space-x-4 mt-8 overflow-x-auto pb-2 scrollbar-hide">
                      {projectImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all duration-300 hover:scale-105 ${
                            index === currentImageIndex
                              ? 'border-yellow-400 shadow-lg shadow-yellow-400/25 scale-105'
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${project.title} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Project Details Section */}
        <section className="py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-16 border border-yellow-400/30 shadow-2xl relative overflow-hidden">
              {/* Top Border Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
              
              <div className="text-center mb-12">
                <h2 className="text-5xl font-light mb-6 text-yellow-400 tracking-wide">Project Overview</h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>
              
              <div className="prose prose-xl prose-invert max-w-none text-center">
                <p className="text-gray-300 leading-relaxed text-xl font-light tracking-wide">
                  {project.details}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Image Gallery Grid */}
        {projectImages.length > 1 && (
          <section className="py-32 bg-black relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-light mb-6 text-yellow-400 tracking-wide">Project Gallery</h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-6"></div>
                <p className="text-gray-300 text-lg">Explore every detail of this architectural masterpiece</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectImages.map((image, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-yellow-400/50"
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsGalleryOpen(true);
                    }}
                  >
                    <img
                      src={image}
                      alt={`${project.title} ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-sm font-medium bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                          View Full Size
                        </p>
                      </div>
                      <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-32 bg-gradient-to-b from-gray-900 to-black relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-light mb-6 text-yellow-400 tracking-wide">Related Projects</h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full mb-6"></div>
                <p className="text-gray-300 text-lg">Discover more projects in the {project.category.toLowerCase()} category</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-700 hover:border-yellow-400/50 hover:-translate-y-4 hover:scale-105"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={relatedProject.main_image}
                        alt={relatedProject.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                        {relatedProject.category}
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{relatedProject.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{relatedProject.year}</span>
                        </span>
                      </div>
                      <h3 className="text-2xl font-light mb-4 text-white group-hover:text-yellow-400 transition-colors duration-300 leading-tight">
                        {relatedProject.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {relatedProject.description}
                      </p>
                      <div className="flex items-center text-yellow-400 text-sm font-semibold group-hover:space-x-3 transition-all duration-300">
                        <span>View Project</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Enhanced Fullscreen Gallery Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Enhanced Close Button */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 border border-white/20 hover:border-yellow-400/50"
              >
                <X className="w-7 h-7" />
              </button>
              
              {/* Enhanced Navigation */}
              {projectImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 border border-white/20 hover:border-yellow-400/50"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-10 border border-white/20 hover:border-yellow-400/50"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
              
              {/* Enhanced Main Image */}
              <div className="max-w-7xl max-h-[90vh] relative">
                <img
                  src={projectImages[currentImageIndex]}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
                
                {/* Enhanced Image Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white text-sm font-medium border border-white/20">
                  {currentImageIndex + 1} of {projectImages.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <SocialMedia />
      <Footer />
    </>
  );
}