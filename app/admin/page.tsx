'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Upload, X, Save, Eye, Users, MessageSquare, Settings, LogOut, Image, Shield } from 'lucide-react';
import { projectsApi, projectImagesApi, teamMembersApi, testimonialsApi, siteSettingsApi, type Project, type TeamMember, type Testimonial } from '@/lib/supabase';
import { uploadImage, deleteImage } from '@/lib/storage';

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'super_admin';
  permissions: Record<string, boolean>;
}

interface ProjectForm extends Omit<Project, 'id' | 'created_at' | 'updated_at' | 'project_images'> {
  additional_images: string[];
}

interface TeamMemberForm extends Omit<TeamMember, 'id' | 'created_at' | 'updated_at'> {}

interface TestimonialForm extends Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> {}

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Site Settings States
  const [siteStats, setSiteStats] = useState({
    projectsCompleted: 150,
    yearsExperience: 12,
    happyClients: 200,
    successRate: 95
  });
  const [contactInfo, setContactInfo] = useState({
    address: '123 Design Street, Suite 456, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@26asdesign.com'
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/26asdesign',
    instagram: 'https://instagram.com/26asdesign',
    twitter: 'https://twitter.com/26asdesign',
    youtube: 'https://youtube.com/@26asdesign',
    behance: 'https://behance.net/26asdesign'
  });

  const [projectForm, setProjectForm] = useState<ProjectForm>({
    title: '',
    category: '',
    location: '',
    year: '',
    description: '',
    details: '',
    client: '',
    area: '',
    duration: '',
    featured: false,
    main_image: '',
    additional_images: []
  });

  const [teamMemberForm, setTeamMemberForm] = useState<TeamMemberForm>({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    email: '',
    linkedin_url: '',
    sort_order: 0,
    active: true
  });

  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({
    client_name: '',
    client_position: '',
    testimonial_text: '',
    rating: 5,
    project_id: '',
    active: true
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const checkAuth = () => {
    const userData = localStorage.getItem('admin_user');
    if (!userData) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } catch (error) {
      console.error('Invalid user data:', error);
      router.push('/admin/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const canEdit = () => {
    return currentUser?.role === 'super_admin';
  };

  const loadData = async () => {
    try {
      const [projectsData, teamData, testimonialsData, settingsData] = await Promise.all([
        projectsApi.getAll(),
        teamMembersApi.getAll(),
        testimonialsApi.getAll(),
        loadSiteSettings()
      ]);
      
      setProjects(projectsData);
      setTeamMembers(teamData);
      setTestimonials(testimonialsData);

      // Load site settings
      await loadSiteSettings();
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load admin data. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  const loadSiteSettings = async () => {
    try {
      const [stats, contact, social, slides] = await Promise.all([
        siteSettingsApi.get('stats'),
        siteSettingsApi.get('contact_info'),
        siteSettingsApi.get('social_links'),
        siteSettingsApi.get('hero_slides')
      ]);

      if (stats) setSiteStats(stats);
      if (contact) setContactInfo(contact);
      if (social) setSocialLinks(social);
      if (slides) setHeroSlides(slides);
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const saveSiteSettings = async () => {
    if (!canEdit()) {
      alert('You do not have permission to update settings.');
      return;
    }

    try {
      await Promise.all([
        siteSettingsApi.set('stats', siteStats),
        siteSettingsApi.set('contact_info', contactInfo),
        siteSettingsApi.set('social_links', socialLinks),
        siteSettingsApi.set('hero_slides', heroSlides)
      ]);
      alert('Site settings updated successfully!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Error saving site settings. Please try again.');
    }
  };

  const handleImageUpload = async (file: File, isMainImage: boolean = false, isTeamMember: boolean = false, isHeroSlide: boolean = false, slideIndex?: number) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      
      if (isHeroSlide && slideIndex !== undefined) {
        setHeroSlides(prev => {
          const updated = [...prev];
          updated[slideIndex] = { ...updated[slideIndex], image: imageUrl };
          return updated;
        });
      } else if (isTeamMember) {
        setTeamMemberForm(prev => ({ ...prev, image_url: imageUrl }));
      } else if (isMainImage) {
        setProjectForm(prev => ({ ...prev, main_image: imageUrl }));
      } else {
        setProjectForm(prev => ({
          ...prev,
          additional_images: [...prev.additional_images, imageUrl]
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const addHeroSlide = () => {
    setHeroSlides(prev => [...prev, { image: '', title: '', subtitle: '' }]);
  };

  const removeHeroSlide = (index: number) => {
    setHeroSlides(prev => prev.filter((_, i) => i !== index));
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    setHeroSlides(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Project Functions
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit()) {
      alert('You do not have permission to modify projects.');
      return;
    }
    
    try {
      const projectData = {
        title: projectForm.title,
        category: projectForm.category,
        location: projectForm.location,
        year: projectForm.year,
        description: projectForm.description,
        details: projectForm.details,
        client: projectForm.client,
        area: projectForm.area,
        duration: projectForm.duration,
        featured: projectForm.featured,
        main_image: projectForm.main_image
      };

      let savedProject: Project;
      
      if (editingProject) {
        savedProject = await projectsApi.update(editingProject.id, projectData);
        
        // Delete existing additional images
        if (editingProject.project_images) {
          for (const img of editingProject.project_images) {
            await projectImagesApi.delete(img.id);
          }
        }
      } else {
        savedProject = await projectsApi.create(projectData);
      }

      // Handle additional images
      if (projectForm.additional_images.length > 0) {
        for (let i = 0; i < projectForm.additional_images.length; i++) {
          await projectImagesApi.create({
            project_id: savedProject.id,
            image_url: projectForm.additional_images[i],
            alt_text: `${savedProject.title} - Image ${i + 2}`,
            sort_order: i + 1
          });
        }
      }

      await loadData();
      setShowProjectForm(false);
      setEditingProject(null);
      resetProjectForm();
      alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      category: '',
      location: '',
      year: '',
      description: '',
      details: '',
      client: '',
      area: '',
      duration: '',
      featured: false,
      main_image: '',
      additional_images: []
    });
  };

  const editProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      category: project.category,
      location: project.location,
      year: project.year,
      description: project.description,
      details: project.details,
      client: project.client,
      area: project.area,
      duration: project.duration,
      featured: project.featured,
      main_image: project.main_image,
      additional_images: project.project_images?.map(img => img.image_url) || []
    });
    setShowProjectForm(true);
  };

  const deleteProject = async (id: string) => {
    if (!canEdit()) {
      alert('You do not have permission to delete projects.');
      return;
    }

    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsApi.delete(id);
        await loadData();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  // Team Member Functions
  const handleTeamMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit()) {
      alert('You do not have permission to modify team members.');
      return;
    }
    
    try {
      if (editingTeamMember) {
        await teamMembersApi.update(editingTeamMember.id, teamMemberForm);
        alert('Team member updated successfully!');
      } else {
        await teamMembersApi.create(teamMemberForm);
        alert('Team member created successfully!');
      }

      await loadData();
      setShowTeamForm(false);
      setEditingTeamMember(null);
      resetTeamMemberForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Error saving team member. Please try again.');
    }
  };

  const resetTeamMemberForm = () => {
    setTeamMemberForm({
      name: '',
      position: '',
      bio: '',
      image_url: '',
      email: '',
      linkedin_url: '',
      sort_order: 0,
      active: true
    });
  };

  const editTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamMemberForm(member);
    setShowTeamForm(true);
  };

  const deleteTeamMember = async (id: string) => {
    if (!canEdit()) {
      alert('You do not have permission to delete team members.');
      return;
    }

    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamMembersApi.delete(id);
        await loadData();
        alert('Team member deleted successfully!');
      } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Error deleting team member. Please try again.');
      }
    }
  };

  // Testimonial Functions
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit()) {
      alert('You do not have permission to modify testimonials.');
      return;
    }
    
    try {
      if (editingTestimonial) {
        await testimonialsApi.update(editingTestimonial.id, testimonialForm);
        alert('Testimonial updated successfully!');
      } else {
        await testimonialsApi.create(testimonialForm);
        alert('Testimonial created successfully!');
      }

      await loadData();
      setShowTestimonialForm(false);
      setEditingTestimonial(null);
      resetTestimonialForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error saving testimonial. Please try again.');
    }
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      client_name: '',
      client_position: '',
      testimonial_text: '',
      rating: 5,
      project_id: '',
      active: true
    });
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm(testimonial);
    setShowTestimonialForm(true);
  };

  const deleteTestimonial = async (id: string) => {
    if (!canEdit()) {
      alert('You do not have permission to delete testimonials.');
      return;
    }

    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await testimonialsApi.delete(id);
        await loadData();
        alert('Testimonial deleted successfully!');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Error deleting testimonial. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-yellow-400 text-xl">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-yellow-400 mb-2">Admin Panel</h1>
            <p className="text-gray-300">
              Welcome, {currentUser?.username} ({currentUser?.role})
              {!canEdit() && <span className="text-orange-400 ml-2">(Read Only)</span>}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { key: 'projects', label: 'Projects', icon: Eye },
            { key: 'team', label: 'Team', icon: Users },
            { key: 'testimonials', label: 'Testimonials', icon: MessageSquare },
            { key: 'hero', label: 'Hero Images', icon: Image },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-md font-medium capitalize transition-colors flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-yellow-400">Projects ({projects.length})</h2>
              {canEdit() && (
                <button
                  onClick={() => {
                    resetProjectForm();
                    setEditingProject(null);
                    setShowProjectForm(true);
                  }}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Project</span>
                </button>
              )}
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400/50 transition-colors">
                  <div className="aspect-video relative">
                    <img
                      src={project.main_image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{project.category} • {project.location}</p>
                    <div className="flex space-x-2">
                      {canEdit() && (
                        <>
                          <button
                            onClick={() => editProject(project)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-yellow-400">Team Members ({teamMembers.length})</h2>
              {canEdit() && (
                <button
                  onClick={() => {
                    resetTeamMemberForm();
                    setEditingTeamMember(null);
                    setShowTeamForm(true);
                  }}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Team Member</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400/50 transition-colors">
                  <div className="aspect-square relative">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    {!member.active && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Inactive
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 text-white">{member.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{member.position}</p>
                    <div className="flex space-x-2">
                      {canEdit() && (
                        <>
                          <button
                            onClick={() => editTeamMember(member)}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteTeamMember(member.id)}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-yellow-400">Testimonials ({testimonials.length})</h2>
              {canEdit() && (
                <button
                  onClick={() => {
                    resetTestimonialForm();
                    setEditingTestimonial(null);
                    setShowTestimonialForm(true);
                  }}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Testimonial</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-yellow-400/50 transition-colors">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full mr-1"></div>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.testimonial_text}"</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-white">{testimonial.client_name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.client_position}</p>
                  </div>
                  <div className="flex space-x-2">
                    {canEdit() && (
                      <>
                        <button
                          onClick={() => editTestimonial(testimonial)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light text-yellow-400">Hero Slider Images</h2>
              {canEdit() && (
                <button
                  onClick={addHeroSlide}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Slide</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              {heroSlides.map((slide, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                        {slide.image ? (
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Image className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                      {canEdit() && (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                            <div className="flex items-center space-x-2">
                              <Upload className="w-5 h-5 text-gray-400" />
                              <p className="text-sm text-gray-400">
                                {uploading ? 'Uploading...' : 'Upload Image'}
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, false, false, true, index);
                              }}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                          disabled={!canEdit()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                          disabled={!canEdit()}
                        />
                      </div>
                      {canEdit() && (
                        <button
                          onClick={() => removeHeroSlide(index)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove Slide</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {canEdit() && (
              <div className="mt-8 text-center">
                <button
                  onClick={saveSiteSettings}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-green-700 transition-colors mx-auto"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Hero Images</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-light text-yellow-400">Site Settings</h2>
            
            {/* Stats Section */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-medium text-yellow-400 mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Projects Completed</label>
                  <input
                    type="number"
                    value={siteStats.projectsCompleted}
                    onChange={(e) => setSiteStats(prev => ({ ...prev, projectsCompleted: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Years Experience</label>
                  <input
                    type="number"
                    value={siteStats.yearsExperience}
                    onChange={(e) => setSiteStats(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Happy Clients</label>
                  <input
                    type="number"
                    value={siteStats.happyClients}
                    onChange={(e) => setSiteStats(prev => ({ ...prev, happyClients: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Success Rate (%)</label>
                  <input
                    type="number"
                    value={siteStats.successRate}
                    onChange={(e) => setSiteStats(prev => ({ ...prev, successRate: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-medium text-yellow-400 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <textarea
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white resize-none"
                    disabled={!canEdit()}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                      disabled={!canEdit()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                      disabled={!canEdit()}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-medium text-yellow-400 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, youtube: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Behance</label>
                  <input
                    type="url"
                    value={socialLinks.behance}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, behance: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    disabled={!canEdit()}
                  />
                </div>
              </div>
            </div>

            {canEdit() && (
              <div className="text-center">
                <button
                  onClick={saveSiteSettings}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-green-700 transition-colors mx-auto"
                >
                  <Save className="w-5 h-5" />
                  <span>Save All Settings</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light text-yellow-400">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                  resetProjectForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Mixed-Use">Mixed-Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, client: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Area</label>
                  <input
                    type="text"
                    value={projectForm.area}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-300">Featured Project</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Details</label>
                <textarea
                  value={projectForm.details}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, details: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-white"
                  required
                />
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Main Image</label>
                <div className="space-y-4">
                  {projectForm.main_image && (
                    <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={projectForm.main_image}
                        alt="Main project image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setProjectForm(prev => ({ ...prev, main_image: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          {uploading ? 'Uploading...' : 'Click to upload main image'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, true);
                        }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Additional Images</label>
                <div className="space-y-4">
                  {projectForm.additional_images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {projectForm.additional_images.map((image, index) => (
                        <div key={index} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          {uploading ? 'Uploading...' : 'Click to upload additional images'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(file => handleImageUpload(file, false));
                        }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading || !projectForm.main_image}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                    resetProjectForm();
                  }}
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Form Modal */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light text-yellow-400">
                {editingTeamMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => {
                  setShowTeamForm(false);
                  setEditingTeamMember(null);
                  resetTeamMemberForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTeamMemberSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={teamMemberForm.name}
                    onChange={(e) => setTeamMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <input
                    type="text"
                    value={teamMemberForm.position}
                    onChange={(e) => setTeamMemberForm(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={teamMemberForm.email || ''}
                    onChange={(e) => setTeamMemberForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={teamMemberForm.linkedin_url || ''}
                    onChange={(e) => setTeamMemberForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={teamMemberForm.sort_order}
                    onChange={(e) => setTeamMemberForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={teamMemberForm.active}
                    onChange={(e) => setTeamMemberForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-300">Active</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={teamMemberForm.bio || ''}
                  onChange={(e) => setTeamMemberForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-white"
                />
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Image</label>
                <div className="space-y-4">
                  {teamMemberForm.image_url && (
                    <div className="relative w-32 h-32 bg-gray-800 rounded-lg overflow-hidden mx-auto">
                      <img
                        src={teamMemberForm.image_url}
                        alt="Profile image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setTeamMemberForm(prev => ({ ...prev, image_url: '' }))}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          {uploading ? 'Uploading...' : 'Click to upload profile image'}
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, false, true);
                        }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading || !teamMemberForm.image_url}
                  className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingTeamMember ? 'Update Member' : 'Create Member'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTeamForm(false);
                    setEditingTeamMember(null);
                    resetTeamMemberForm();
                  }}
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showTestimonialForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-light text-yellow-400">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button
                onClick={() => {
                  setShowTestimonialForm(false);
                  setEditingTestimonial(null);
                  resetTestimonialForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={testimonialForm.client_name}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, client_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client Position</label>
                  <input
                    type="text"
                    value={testimonialForm.client_position}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, client_position: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="testimonial-active"
                    checked={testimonialForm.active}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400"
                  />
                  <label htmlFor="testimonial-active" className="ml-2 text-sm text-gray-300">Active</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Testimonial Text</label>
                <textarea
                  value={testimonialForm.testimonial_text}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, testimonial_text: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors resize-none text-white"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-yellow-500 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTestimonialForm(false);
                    setEditingTestimonial(null);
                    resetTestimonialForm();
                  }}
                  className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}