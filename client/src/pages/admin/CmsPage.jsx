import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Save,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  LayoutTemplate,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Type,
  Eye,
  ArrowRight,
  ShieldCheck,
  Star,
  Globe,
  Phone,
  MessageCircle,
  Mail,
  Heart,
  Dog,
  ShoppingBag,
  Footprints,
  Palette,
  Compass,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCmsContent,
  updateCmsContent,
  resetCmsContent,
} from '../../redux/slices/cms.slice.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

export const CmsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cms, loading, saving } = useSelector((state) => state.cms);

  // Active page tab
  const activeTab = searchParams.get('tab') || 'home';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Local state for editing form
  const [formData, setFormData] = useState(defaultCmsData);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const fileInputRef = useRef(null);
  const [activeUploadCallback, setActiveUploadCallback] = useState(null);

  // Sync redux state to local state
  useEffect(() => {
    if (cms) {
      setFormData(JSON.parse(JSON.stringify(cms)));
    }
  }, [cms]);

  // Handle generic nested property update
  const handleFieldChange = (path, value) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
    setHasChanges(true);
  };

  // Upload image to Cloudinary via backend API
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    const toastId = toast.loading('Uploading image to Cloudinary...');
    try {
      const res = await axiosInstance.post(API_PATHS.UPLOAD.SINGLE_IMAGE, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url =
        res.data?.image?.url ||
        res.data?.image?.secure_url ||
        res.data?.url ||
        res.data?.secure_url;

      if (url && activeUploadCallback) {
        activeUploadCallback(url);
        toast.success('Image uploaded successfully!', { id: toastId });
        setHasChanges(true);
      } else {
        toast.error('Upload succeeded but no URL was returned.', { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image', { id: toastId });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveUploadCallback(null);
      setUploadingField(null);
    }
  };

  const triggerUpload = (callback, fieldKey) => {
    setActiveUploadCallback(() => callback);
    setUploadingField(fieldKey);
    fileInputRef.current?.click();
  };

  // Save changes to backend
  const handleSave = async () => {
    try {
      await dispatch(updateCmsContent(formData)).unwrap();
      toast.success('All CMS changes saved and live on website!');
      setHasChanges(false);
    } catch (err) {
      toast.error(err || 'Failed to save changes');
    }
  };

  // Reset section to default
  const handleResetSection = async (sectionKey) => {
    if (
      !window.confirm(
        `Are you sure you want to reset "${sectionKey}" to original defaults? Any unsaved edits will be lost.`
      )
    ) {
      return;
    }
    try {
      await dispatch(resetCmsContent({ section: sectionKey })).unwrap();
      toast.success(`Reset ${sectionKey} to default`);
      setHasChanges(false);
    } catch (err) {
      toast.error(err || 'Failed to reset');
    }
  };

  // Helper component for Image Field with Live Preview & Cloudinary Upload
  const ImageField = ({ label, value, onChange, fieldKey }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-stone-700 block">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Preview Thumbnail */}
        <div className="w-16 h-16 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/dog-default.png';
              }}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-zinc-400" />
          )}
        </div>

        {/* Input + Action */}
        <div className="flex-1 w-full space-y-1.5">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs font-medium outline-none transition-all"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => triggerUpload(onChange, fieldKey)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer hover:scale-102"
            >
              <Upload className="w-3 h-3 text-amber-400" />
              <span>{uploadingField === fieldKey ? 'Uploading...' : 'Upload Image'}</span>
            </button>
            <span className="text-[10px] text-zinc-400">Direct file upload or URL</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper for tag array loop inputs (e.g. ['Deserves.', 'Loves.', 'Needs.'])
  const LoopArrayField = ({ label, items = [], onChange, placeholder = 'Add item...' }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
      if (!inputValue.trim()) return;
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    };

    const handleRemove = (index) => {
      onChange(items.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-stone-700 block">{label}</label>
        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-zinc-50 border border-zinc-200">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-stone-800 shadow-2xs"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}

          <div className="flex items-center gap-1 flex-1 min-w-[140px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder={placeholder}
              className="px-2.5 py-1 bg-transparent text-xs font-medium outline-none w-full"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="p-1 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'home', label: 'Home Page', icon: LayoutTemplate, count: '11 Sections' },
    { id: 'about', label: 'About Page', icon: Sparkles, count: 'Story & Pillars' },
    { id: 'contact', label: 'Contact Page', icon: Phone, count: 'Helpline & Form' },
    { id: 'pets', label: 'Live Stock Page', icon: Dog, count: 'Header & Filters' },
    { id: 'accessories', label: 'Accessories Page', icon: ShoppingBag, count: 'Shop Header' },
    { id: 'global', label: 'Brand & Global Header/Footer', icon: Palette, count: 'Logo & Name' },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Image Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Top 3 Summary Stat Metric Cards (Directly matching Reference Image UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Active Sections */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Active CMS Sections
            </p>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
              12 Sections
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs shrink-0">
            <LayoutTemplate className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Dynamic Blocks */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Dynamic Live Fields
            </p>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
              100+ Live Fields
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Real-Time Sync */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Live Website Sync
            </p>
            <p className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
              100% Real-Time
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Floating / Sticky Action Bar when changes occur */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-20">
        <div className="flex items-center gap-3">
          <span
            className={`w-3 h-3 rounded-full ${
              hasChanges ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
            }`}
          />
          <div>
            <p className="text-xs font-bold text-stone-900">
              {hasChanges
                ? 'You have unsaved changes in CMS'
                : 'All CMS changes are synchronized live with customer storefront'}
            </p>
            <p className="text-[11px] text-zinc-500 font-medium">
              Update text, capsule badges, brand logo, brand name, gallery images, loop tags, and cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleResetSection(activeTab)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tab</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-black text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs border ${
                isActive
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================= TAB 1: HOME PAGE ======================= */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Quick jump anchor links */}
          <div className="p-3 bg-zinc-100 rounded-2xl flex flex-wrap gap-2 text-[11px] font-bold text-zinc-600">
            <span className="text-zinc-400 py-1">Quick Jump:</span>
            <a href="#hero-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">01. Hero</a>
            <a href="#breeds-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">02. Popular Breeds</a>
            <a href="#pets-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">03. Meet the Pets</a>
            <a href="#highlights-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">04. Highlights</a>
            <a href="#signature-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">05. Signature Pick</a>
            <a href="#story-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">06. Brand Story</a>
            <a href="#trust-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">07. Why TDG</a>
            <a href="#process-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">08. Seamless Journey</a>
            <a href="#reviews-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">09. Reviews</a>
            <a href="#reel-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">10. Visual Reel</a>
            <a href="#social-sec" className="px-2.5 py-1 rounded-lg bg-white hover:text-amber-600 shadow-2xs">11. Digital Pack</a>
          </div>

          {/* Section 01: Hero Section */}
          <div id="hero-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Hero Section & 3D Centerpiece
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Main heading, rotating word loop, eyebrow, CTA buttons and 3D circular dog gallery
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Eyebrow Prefix</label>
                <input
                  type="text"
                  value={formData.home?.hero?.eyebrowPrefix || ''}
                  onChange={(e) => handleFieldChange('home.hero.eyebrowPrefix', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <LoopArrayField
                label="Eyebrow Rotating Badges (Capsules)"
                items={formData.home?.hero?.eyebrowLoops || []}
                onChange={(items) => handleFieldChange('home.hero.eyebrowLoops', items)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Main Heading Prefix</label>
                <input
                  type="text"
                  value={formData.home?.hero?.headingPrefix || ''}
                  onChange={(e) => handleFieldChange('home.hero.headingPrefix', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <LoopArrayField
                label="Heading Rotating Loop Words (Deserves., Loves., etc.)"
                items={formData.home?.hero?.headingLoops || []}
                onChange={(items) => handleFieldChange('home.hero.headingLoops', items)}
              />

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Supporting Subtitle Text</label>
                <textarea
                  rows={2}
                  value={formData.home?.hero?.description || ''}
                  onChange={(e) => handleFieldChange('home.hero.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Primary Button Text</label>
                <input
                  type="text"
                  value={formData.home?.hero?.primaryBtnText || ''}
                  onChange={(e) => handleFieldChange('home.hero.primaryBtnText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Secondary Button Text</label>
                <input
                  type="text"
                  value={formData.home?.hero?.secondaryBtnText || ''}
                  onChange={(e) => handleFieldChange('home.hero.secondaryBtnText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* 3D Circular Gallery Dogs Editor */}
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                  3D Circular Gallery Breeds ({formData.home?.hero?.galleryDogs?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const current = formData.home?.hero?.galleryDogs || [];
                    handleFieldChange('home.hero.galleryDogs', [
                      ...current,
                      {
                        title: 'New Breed',
                        subtitle: 'Gentle & Loving',
                        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&h=600&q=80',
                      },
                    ]);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Breed Slide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(formData.home?.hero?.galleryDogs || []).map((dog, dIdx) => (
                  <div key={dIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = formData.home.hero.galleryDogs.filter((_, i) => i !== dIdx);
                        handleFieldChange('home.hero.galleryDogs', filtered);
                      }}
                      className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Remove slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <ImageField
                      label={`Breed #${dIdx + 1} Image`}
                      value={dog.image}
                      fieldKey={`hero_dog_${dIdx}`}
                      onChange={(val) => {
                        const copy = [...formData.home.hero.galleryDogs];
                        copy[dIdx] = { ...copy[dIdx], image: val };
                        handleFieldChange('home.hero.galleryDogs', copy);
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-600">Breed Name</label>
                        <input
                          type="text"
                          value={dog.title || ''}
                          onChange={(e) => {
                            const copy = [...formData.home.hero.galleryDogs];
                            copy[dIdx] = { ...copy[dIdx], title: e.target.value };
                            handleFieldChange('home.hero.galleryDogs', copy);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-600">Subtitle / Trait</label>
                        <input
                          type="text"
                          value={dog.subtitle || ''}
                          onChange={(e) => {
                            const copy = [...formData.home.hero.galleryDogs];
                            copy[dIdx] = { ...copy[dIdx], subtitle: e.target.value };
                            handleFieldChange('home.hero.galleryDogs', copy);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 02: Popular Breeds & Champion Lineages Marquee */}
          <div id="breeds-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Popular Breeds & Champion Lineages Loop
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Scrolling loop marquee displaying breeds and icon badges
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = formData.home?.brandPartners?.items || [];
                  handleFieldChange('home.brandPartners.items', [
                    ...current,
                    { name: 'New Breed', icon: '🐾' },
                  ]);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Breed Chip</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Section Eyebrow Capsule Text</label>
              <input
                type="text"
                value={formData.home?.brandPartners?.eyebrow || ''}
                onChange={(e) => handleFieldChange('home.brandPartners.eyebrow', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
              {(formData.home?.brandPartners?.items || []).map((bp, bIdx) => (
                <div key={bIdx} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.home.brandPartners.items.filter((_, i) => i !== bIdx);
                      handleFieldChange('home.brandPartners.items', filtered);
                    }}
                    className="absolute top-1 right-1 p-0.5 text-zinc-400 hover:text-rose-600 rounded cursor-pointer"
                    title="Remove"
                  >
                    &times;
                  </button>
                  <input
                    type="text"
                    value={bp.icon || '🐾'}
                    onChange={(e) => {
                      const copy = [...formData.home.brandPartners.items];
                      copy[bIdx] = { ...copy[bIdx], icon: e.target.value };
                      handleFieldChange('home.brandPartners.items', copy);
                    }}
                    className="w-8 text-center px-1 py-0.5 rounded bg-white border border-zinc-200 text-sm"
                  />
                  <input
                    type="text"
                    value={bp.name || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.brandPartners.items];
                      copy[bIdx] = { ...copy[bIdx], name: e.target.value };
                      handleFieldChange('home.brandPartners.items', copy);
                    }}
                    className="w-full px-2 py-1 rounded bg-white border border-zinc-200 text-xs font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 03: Meet the Pets (Live Stock Header & Capsule) -> USER SCREENSHOT 5 */}
          <div id="pets-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Meet the Pets (Live Stock Showcase Header)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Capsule tag, title, description, and "View All Available Pets" button text
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Eyebrow Capsule (e.g. ETHICAL COMPANIONSHIP)</label>
                <input
                  type="text"
                  value={formData.home?.liveStock?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('home.liveStock.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Main Title (e.g. Meet the Pets)</label>
                <input
                  type="text"
                  value={formData.home?.liveStock?.title || ''}
                  onChange={(e) => handleFieldChange('home.liveStock.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Supporting Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.liveStock?.description || ''}
                  onChange={(e) => handleFieldChange('home.liveStock.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">CTA Button Text</label>
                <input
                  type="text"
                  value={formData.home?.liveStock?.ctaText || ''}
                  onChange={(e) => handleFieldChange('home.liveStock.ctaText', e.target.value)}
                  placeholder="View All Available Pets"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">CTA Link URL</label>
                <input
                  type="text"
                  value={formData.home?.liveStock?.ctaLink || '/pets'}
                  onChange={(e) => handleFieldChange('home.liveStock.ctaLink', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 04: Animated Highlights & Bento Grid */}
          <div id="highlights-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 font-display">
                  Animated Highlights, Marquee & Bento Cards
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Two-way animated scroll velocity text strips and 3 high-impact bento cards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LoopArrayField
                label="Marquee Row 1 (Upper Strip Text Loop)"
                items={formData.home?.highlights?.marqueeRow1 || []}
                onChange={(items) => handleFieldChange('home.highlights.marqueeRow1', items)}
              />

              <LoopArrayField
                label="Marquee Row 2 (Lower Strip Text Loop)"
                items={formData.home?.highlights?.marqueeRow2 || []}
                onChange={(items) => handleFieldChange('home.highlights.marqueeRow2', items)}
              />
            </div>

            {/* Bento Grid 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-zinc-100">
              {/* Card 1 */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Bento Card 1 (Health Protocol)
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.home?.highlights?.card1Badge || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card1Badge', e.target.value)}
                    placeholder="Capsule Badge"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.home?.highlights?.card1Title || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card1Title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                  />
                  <textarea
                    rows={2}
                    value={formData.home?.highlights?.card1Description || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card1Description', e.target.value)}
                    placeholder="Card Description"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Bento Card 2 (Families Count)
                </span>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.home?.highlights?.card2Count || 1000}
                      onChange={(e) => handleFieldChange('home.highlights.card2Count', Number(e.target.value))}
                      placeholder="Count (1000)"
                      className="w-2/3 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.home?.highlights?.card2Suffix || '+'}
                      onChange={(e) => handleFieldChange('home.highlights.card2Suffix', e.target.value)}
                      placeholder="+"
                      className="w-1/3 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.home?.highlights?.card2Title || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card2Title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                  />
                  <textarea
                    rows={2}
                    value={formData.home?.highlights?.card2Description || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card2Description', e.target.value)}
                    placeholder="Card Description"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-900 bg-stone-200 px-2 py-0.5 rounded-full">
                  Bento Card 3 (Looking for Puppy CTA)
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.home?.highlights?.card3Title || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card3Title', e.target.value)}
                    placeholder="Card Title"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                  />
                  <textarea
                    rows={2}
                    value={formData.home?.highlights?.card3Description || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card3Description', e.target.value)}
                    placeholder="Card Description"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />
                  <input
                    type="text"
                    value={formData.home?.highlights?.card3BtnText || ''}
                    onChange={(e) => handleFieldChange('home.highlights.card3BtnText', e.target.value)}
                    placeholder="Button Text"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 05: Signature Pick (The One They Love / Accessories Spotlight) */}
          <div id="signature-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  05
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Signature Pick (Shampoo Spotlight)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Capsule tag, title, description, details link, and 4 formula checklist points
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Capsule Eyebrow (e.g. OUR SIGNATURE PICK)</label>
                <input
                  type="text"
                  value={formData.home?.signaturePick?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('home.signaturePick.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Title (e.g. The One They Love.)</label>
                <input
                  type="text"
                  value={formData.home?.signaturePick?.title || ''}
                  onChange={(e) => handleFieldChange('home.signaturePick.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.signaturePick?.description || ''}
                  onChange={(e) => handleFieldChange('home.signaturePick.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">CTA Link Text</label>
                <input
                  type="text"
                  value={formData.home?.signaturePick?.ctaText || 'Product Details'}
                  onChange={(e) => handleFieldChange('home.signaturePick.ctaText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">CTA Link URL</label>
                <input
                  type="text"
                  value={formData.home?.signaturePick?.ctaLink || '/accessories'}
                  onChange={(e) => handleFieldChange('home.signaturePick.ctaLink', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <LoopArrayField
                  label="Formula Checklist Points (4 Bullet points)"
                  items={formData.home?.signaturePick?.features || []}
                  onChange={(items) => handleFieldChange('home.signaturePick.features', items)}
                />
              </div>
            </div>
          </div>

          {/* Section 06: Brand Story & Ethos */}
          <div id="story-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                06
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 font-display">
                  Brand Story & Core Ethos
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Philosophy text, large 3D showcase image, quote loop, and 3 key animated counters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageField
                label="Story Showcase Photograph"
                value={formData.home?.brandStory?.image}
                fieldKey="brand_story_img"
                onChange={(val) => handleFieldChange('home.brandStory.image', val)}
              />

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Capsule Label</label>
                  <input
                    type="text"
                    value={formData.home?.brandStory?.ethosCapsule || ''}
                    onChange={(e) => handleFieldChange('home.brandStory.ethosCapsule', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Quote Prefix</label>
                  <input
                    type="text"
                    value={formData.home?.brandStory?.ethosQuotePrefix || ''}
                    onChange={(e) => handleFieldChange('home.brandStory.ethosQuotePrefix', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                  />
                </div>
                <LoopArrayField
                  label="Ethos Quote Rotating Words (family., companions., daily joy.)"
                  items={formData.home?.brandStory?.ethosLoops || []}
                  onChange={(items) => handleFieldChange('home.brandStory.ethosLoops', items)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Title</label>
                <input
                  type="text"
                  value={formData.home?.brandStory?.title || ''}
                  onChange={(e) => handleFieldChange('home.brandStory.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Lead Philosophy Text</label>
                <input
                  type="text"
                  value={formData.home?.brandStory?.leadText || ''}
                  onChange={(e) => handleFieldChange('home.brandStory.leadText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Detailed Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.brandStory?.description || ''}
                  onChange={(e) => handleFieldChange('home.brandStory.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium resize-none"
                />
              </div>

              {/* 3 Metric Counters */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <label className="text-[11px] font-bold text-zinc-600 block">Metric Counter 1</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={formData.home?.brandStory?.stat1Count || 1000}
                    onChange={(e) => handleFieldChange('home.brandStory.stat1Count', Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.home?.brandStory?.stat1Label || 'Happy Families'}
                    onChange={(e) => handleFieldChange('home.brandStory.stat1Label', e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <label className="text-[11px] font-bold text-zinc-600 block">Metric Counter 2</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={formData.home?.brandStory?.stat2Count || 50}
                    onChange={(e) => handleFieldChange('home.brandStory.stat2Count', Number(e.target.value))}
                    className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={formData.home?.brandStory?.stat2Label || 'Certified Breeds'}
                    onChange={(e) => handleFieldChange('home.brandStory.stat2Label', e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 07: Why The Dogs Garage (4 Trust Cards & Badges) */}
          <div id="trust-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                07
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 font-display">
                  Why The Dogs Garage (Trust Strip)
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Header text and 4 cornerstone trust cards (Responsible, Trusted, Transparent, Personal)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Eyebrow</label>
                <input
                  type="text"
                  value={formData.home?.trustStrip?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('home.trustStrip.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Title</label>
                <input
                  type="text"
                  value={formData.home?.trustStrip?.title || ''}
                  onChange={(e) => handleFieldChange('home.trustStrip.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.trustStrip?.description || ''}
                  onChange={(e) => handleFieldChange('home.trustStrip.description', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium resize-none"
                />
              </div>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(formData.home?.trustStrip?.cards || []).map((card, cIdx) => (
                <div key={cIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-400 uppercase">Card #{cIdx + 1}</span>
                    <input
                      type="text"
                      value={card.badge || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.trustStrip.cards];
                        copy[cIdx] = { ...copy[cIdx], badge: e.target.value };
                        handleFieldChange('home.trustStrip.cards', copy);
                      }}
                      placeholder="Badge"
                      className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-[10px] font-bold text-right"
                    />
                  </div>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.trustStrip.cards];
                      copy[cIdx] = { ...copy[cIdx], title: e.target.value };
                      handleFieldChange('home.trustStrip.cards', copy);
                    }}
                    placeholder="Card Title"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                  />
                  <textarea
                    rows={3}
                    value={card.description || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.trustStrip.cards];
                      copy[cIdx] = { ...copy[cIdx], description: e.target.value };
                      handleFieldChange('home.trustStrip.cards', copy);
                    }}
                    placeholder="Card Description"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 08: Seamless Journey (Simple From Start to Home) -> USER SCREENSHOT 4 */}
          <div id="process-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  08
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Seamless Journey (Simple From Start to Home)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Capsule eyebrow, title, description, and the 3-step adoption journey cards (01 Explore, 02 Connect, 03 Welcome Home)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = formData.home?.adoptionProcess?.steps || [];
                  handleFieldChange('home.adoptionProcess.steps', [
                    ...current,
                    {
                      num: `0${current.length + 1}`,
                      title: 'New Step',
                      description: 'Step instructions and details.',
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Eyebrow Capsule (e.g. SEAMLESS JOURNEY)</label>
                <input
                  type="text"
                  value={formData.home?.adoptionProcess?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('home.adoptionProcess.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Title (e.g. Simple From Start to Home.)</label>
                <input
                  type="text"
                  value={formData.home?.adoptionProcess?.title || ''}
                  onChange={(e) => handleFieldChange('home.adoptionProcess.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.adoptionProcess?.description || ''}
                  onChange={(e) => handleFieldChange('home.adoptionProcess.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">CTA Button Text (e.g. Begin Your Journey)</label>
                <input
                  type="text"
                  value={formData.home?.adoptionProcess?.btnText || 'Begin Your Journey'}
                  onChange={(e) => handleFieldChange('home.adoptionProcess.btnText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">CTA Button Link</label>
                <input
                  type="text"
                  value={formData.home?.adoptionProcess?.btnLink || '/pets'}
                  onChange={(e) => handleFieldChange('home.adoptionProcess.btnLink', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold"
                />
              </div>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-zinc-100">
              {(formData.home?.adoptionProcess?.steps || []).map((step, sIdx) => (
                <div key={sIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.home.adoptionProcess.steps.filter((_, i) => i !== sIdx);
                      handleFieldChange('home.adoptionProcess.steps', filtered);
                    }}
                    className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Remove step"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={step.num || `0${sIdx + 1}`}
                      onChange={(e) => {
                        const copy = [...formData.home.adoptionProcess.steps];
                        copy[sIdx] = { ...copy[sIdx], num: e.target.value };
                        handleFieldChange('home.adoptionProcess.steps', copy);
                      }}
                      className="w-16 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-black text-amber-700"
                    />
                    <input
                      type="text"
                      value={step.title || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.adoptionProcess.steps];
                        copy[sIdx] = { ...copy[sIdx], title: e.target.value };
                        handleFieldChange('home.adoptionProcess.steps', copy);
                      }}
                      placeholder="Step Title (e.g. Explore)"
                      className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={step.description || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.adoptionProcess.steps];
                      copy[sIdx] = { ...copy[sIdx], description: e.target.value };
                      handleFieldChange('home.adoptionProcess.steps', copy);
                    }}
                    placeholder="Step description..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 09: Testimonials / Reviews -> USER SCREENSHOT 3 */}
          <div id="reviews-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  09
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Loved by Pet Parents (Testimonials)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Rating capsule, title, description, pause hint, and all review cards
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = formData.home?.testimonials?.reviews || [];
                  handleFieldChange('home.testimonials.reviews', [
                    ...current,
                    {
                      name: 'Customer Name',
                      location: 'Bangalore',
                      pet: 'Adopted Companion',
                      review: 'Wonderful experience with healthy puppy and clear medical records.',
                      rating: 5,
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Capsule Rating Tag (e.g. 4.9 / 5 RATED BY 1,000+ PET PARENTS)</label>
                <input
                  type="text"
                  value={formData.home?.testimonials?.capsule || ''}
                  onChange={(e) => handleFieldChange('home.testimonials.capsule', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Title (e.g. Loved by Pet Parents.)</label>
                <input
                  type="text"
                  value={formData.home?.testimonials?.title || ''}
                  onChange={(e) => handleFieldChange('home.testimonials.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.testimonials?.description || ''}
                  onChange={(e) => handleFieldChange('home.testimonials.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Pause Hint Text</label>
                <input
                  type="text"
                  value={formData.home?.testimonials?.pauseHint || 'Hover over cards to pause scrolling'}
                  onChange={(e) => handleFieldChange('home.testimonials.pauseHint', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs"
                />
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {(formData.home?.testimonials?.reviews || []).map((rev, rIdx) => (
                <div key={rIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.home.testimonials.reviews.filter((_, i) => i !== rIdx);
                      handleFieldChange('home.testimonials.reviews', filtered);
                    }}
                    className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Remove review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rev.name || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.testimonials.reviews];
                        copy[rIdx] = { ...copy[rIdx], name: e.target.value };
                        handleFieldChange('home.testimonials.reviews', copy);
                      }}
                      placeholder="Parent Name"
                      className="w-2/3 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                    <select
                      value={rev.rating || 5}
                      onChange={(e) => {
                        const copy = [...formData.home.testimonials.reviews];
                        copy[rIdx] = { ...copy[rIdx], rating: Number(e.target.value) };
                        handleFieldChange('home.testimonials.reviews', copy);
                      }}
                      className="w-1/3 px-2 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold cursor-pointer"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={rev.pet || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.testimonials.reviews];
                        copy[rIdx] = { ...copy[rIdx], pet: e.target.value };
                        handleFieldChange('home.testimonials.reviews', copy);
                      }}
                      placeholder="Adopted Pet"
                      className="px-2 py-1 rounded-lg bg-white border border-zinc-200 text-[11px]"
                    />
                    <input
                      type="text"
                      value={rev.location || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.testimonials.reviews];
                        copy[rIdx] = { ...copy[rIdx], location: e.target.value };
                        handleFieldChange('home.testimonials.reviews', copy);
                      }}
                      placeholder="Location"
                      className="px-2 py-1 rounded-lg bg-white border border-zinc-200 text-[11px]"
                    />
                  </div>

                  <textarea
                    rows={3}
                    value={rev.review || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.testimonials.reviews];
                      copy[rIdx] = { ...copy[rIdx], review: e.target.value };
                      handleFieldChange('home.testimonials.reviews', copy);
                    }}
                    placeholder="Review quote text"
                    className="w-full px-2 py-1 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 10: Visual Chronicles (Infinite Reel) -> USER SCREENSHOT 2 */}
          <div id="reel-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  10
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Visual Chronicles (Life at The Dogs Garage)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Eyebrow, title, subtitle, and every infinite carousel reel card
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = formData.home?.imageShowcase?.items || [];
                  handleFieldChange('home.imageShowcase.items', [
                    ...current,
                    {
                      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
                      title: 'Happy Pup',
                      tag: 'Play Time',
                      description: 'Socialization and exercise.',
                    },
                  ]);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Photo Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Eyebrow (e.g. VISUAL CHRONICLES)</label>
                <input
                  type="text"
                  value={formData.home?.imageShowcase?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('home.imageShowcase.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Title (e.g. Life at The Dogs Garage)</label>
                <input
                  type="text"
                  value={formData.home?.imageShowcase?.title || ''}
                  onChange={(e) => handleFieldChange('home.imageShowcase.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.imageShowcase?.description || ''}
                  onChange={(e) => handleFieldChange('home.imageShowcase.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {(formData.home?.imageShowcase?.items || []).map((item, iIdx) => (
                <div key={iIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 relative group">
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = formData.home.imageShowcase.items.filter((_, i) => i !== iIdx);
                      handleFieldChange('home.imageShowcase.items', filtered);
                    }}
                    className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <ImageField
                    label={`Reel Photo #${iIdx + 1}`}
                    value={item.image}
                    fieldKey={`reel_img_${iIdx}`}
                    onChange={(val) => {
                      const copy = [...formData.home.imageShowcase.items];
                      copy[iIdx] = { ...copy[iIdx], image: val };
                      handleFieldChange('home.imageShowcase.items', copy);
                    }}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.imageShowcase.items];
                        copy[iIdx] = { ...copy[iIdx], title: e.target.value };
                        handleFieldChange('home.imageShowcase.items', copy);
                      }}
                      placeholder="Title"
                      className="px-2 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={item.tag || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.imageShowcase.items];
                        copy[iIdx] = { ...copy[iIdx], tag: e.target.value };
                        handleFieldChange('home.imageShowcase.items', copy);
                      }}
                      placeholder="Tag (e.g. Play Time)"
                      className="px-2 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                  </div>

                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.imageShowcase.items];
                      copy[iIdx] = { ...copy[iIdx], description: e.target.value };
                      handleFieldChange('home.imageShowcase.items', copy);
                    }}
                    placeholder="Short description"
                    className="w-full px-2 py-1 rounded-lg bg-white border border-zinc-200 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 11: Digital Pack (Connect Across Channels) -> USER SCREENSHOT 1 */}
          <div id="social-sec" className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  11
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 font-display">
                    Digital Pack (Connect Across Channels)
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Capsule tag, title, description, and the 4 social/helpline channels (Instagram, WhatsApp, Phone, Email)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Capsule Tag (e.g. JOIN OUR DIGITAL PACK)</label>
                <input
                  type="text"
                  value={formData.home?.communitySocial?.capsule || ''}
                  onChange={(e) => handleFieldChange('home.communitySocial.capsule', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Section Title (e.g. Connect Across Channels)</label>
                <input
                  type="text"
                  value={formData.home?.communitySocial?.title || ''}
                  onChange={(e) => handleFieldChange('home.communitySocial.title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={formData.home?.communitySocial?.description || ''}
                  onChange={(e) => handleFieldChange('home.communitySocial.description', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium outline-none resize-none"
                />
              </div>
            </div>

            {/* 4 Social Channel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-zinc-100">
              {(formData.home?.communitySocial?.channels || []).map((ch, cIdx) => (
                <div key={cIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-400 uppercase">Channel #{cIdx + 1}</span>
                    <input
                      type="text"
                      value={ch.badge || ''}
                      onChange={(e) => {
                        const copy = [...formData.home.communitySocial.channels];
                        copy[cIdx] = { ...copy[cIdx], badge: e.target.value };
                        handleFieldChange('home.communitySocial.channels', copy);
                      }}
                      placeholder="Badge"
                      className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-[10px] font-bold text-right"
                    />
                  </div>

                  <input
                    type="text"
                    value={ch.name || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.communitySocial.channels];
                      copy[cIdx] = { ...copy[cIdx], name: e.target.value };
                      handleFieldChange('home.communitySocial.channels', copy);
                    }}
                    placeholder="Channel Name"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                  />

                  <input
                    type="text"
                    value={ch.handle || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.communitySocial.channels];
                      copy[cIdx] = { ...copy[cIdx], handle: e.target.value };
                      handleFieldChange('home.communitySocial.channels', copy);
                    }}
                    placeholder="Handle / Phone / Email"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-amber-700"
                  />

                  <textarea
                    rows={2}
                    value={ch.description || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.communitySocial.channels];
                      copy[cIdx] = { ...copy[cIdx], description: e.target.value };
                      handleFieldChange('home.communitySocial.channels', copy);
                    }}
                    placeholder="Channel Description"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />

                  <input
                    type="text"
                    value={ch.cta || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.communitySocial.channels];
                      copy[cIdx] = { ...copy[cIdx], cta: e.target.value };
                      handleFieldChange('home.communitySocial.channels', copy);
                    }}
                    placeholder="CTA Button Text"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold"
                  />

                  <input
                    type="text"
                    value={ch.link || ''}
                    onChange={(e) => {
                      const copy = [...formData.home.communitySocial.channels];
                      copy[cIdx] = { ...copy[cIdx], link: e.target.value };
                      handleFieldChange('home.communitySocial.channels', copy);
                    }}
                    placeholder="Direct Link / URL"
                    className="w-full px-2.5 py-1 rounded bg-white border border-zinc-200 text-[11px] text-zinc-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: ABOUT PAGE ======================= */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-extrabold text-stone-900 font-display">
                About Page Content & Mission
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Headline, ethos quote, detailed bio, and 3 core pillar highlight cards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Eyebrow</label>
                <input
                  type="text"
                  value={formData.about?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('about.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Main Title</label>
                <input
                  type="text"
                  value={formData.about?.title || ''}
                  onChange={(e) => handleFieldChange('about.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Featured Quote</label>
                <input
                  type="text"
                  value={formData.about?.quote || ''}
                  onChange={(e) => handleFieldChange('about.quote', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Detailed Mission Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.about?.description || ''}
                  onChange={(e) => handleFieldChange('about.description', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs resize-none"
                />
              </div>
            </div>

            {/* 3 Core Pillars */}
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                3 Core Pillars
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(formData.about?.pillars || []).map((pillar, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-400">Pillar #{pIdx + 1}</span>
                      <input
                        type="text"
                        value={pillar.badge || ''}
                        onChange={(e) => {
                          const copy = [...formData.about.pillars];
                          copy[pIdx] = { ...copy[pIdx], badge: e.target.value };
                          handleFieldChange('about.pillars', copy);
                        }}
                        placeholder="Badge"
                        className="px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-[10px] font-bold text-right"
                      />
                    </div>
                    <input
                      type="text"
                      value={pillar.title || ''}
                      onChange={(e) => {
                        const copy = [...formData.about.pillars];
                        copy[pIdx] = { ...copy[pIdx], title: e.target.value };
                        handleFieldChange('about.pillars', copy);
                      }}
                      placeholder="Title"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                    />
                    <textarea
                      rows={3}
                      value={pillar.description || ''}
                      onChange={(e) => {
                        const copy = [...formData.about.pillars];
                        copy[pIdx] = { ...copy[pIdx], description: e.target.value };
                        handleFieldChange('about.pillars', copy);
                      }}
                      placeholder="Description"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 3: CONTACT PAGE ======================= */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-extrabold text-stone-900 font-display">
                Contact Page, Inquiry Form & Concierge Card
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Header text, nursery visit concierge card, live advisory badges and inquiry categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Eyebrow</label>
                <input
                  type="text"
                  value={formData.contact?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('contact.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Main Title</label>
                <input
                  type="text"
                  value={formData.contact?.title || ''}
                  onChange={(e) => handleFieldChange('contact.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.contact?.description || ''}
                  onChange={(e) => handleFieldChange('contact.description', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs resize-none"
                />
              </div>
            </div>

            {/* Nursery Concierge Showcase Card */}
            <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                Interactive Concierge Showcase Card (Right Column)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageField
                  label="Concierge Background Image"
                  value={formData.contact?.conciergeImage}
                  fieldKey="concierge_img"
                  onChange={(val) => handleFieldChange('contact.conciergeImage', val)}
                />

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.contact?.conciergeBadge || ''}
                      onChange={(e) => handleFieldChange('contact.conciergeBadge', e.target.value)}
                      placeholder="Badge"
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={formData.contact?.conciergeStatus || ''}
                      onChange={(e) => handleFieldChange('contact.conciergeStatus', e.target.value)}
                      placeholder="Status (Live Advisory)"
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                    />
                  </div>

                  <input
                    type="text"
                    value={formData.contact?.conciergeTitle || ''}
                    onChange={(e) => handleFieldChange('contact.conciergeTitle', e.target.value)}
                    placeholder="Concierge Title"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-black"
                  />

                  <textarea
                    rows={2}
                    value={formData.contact?.conciergeDescription || ''}
                    onChange={(e) => handleFieldChange('contact.conciergeDescription', e.target.value)}
                    placeholder="Concierge Description"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs resize-none"
                  />

                  <input
                    type="text"
                    value={formData.contact?.conciergeCtaText || ''}
                    onChange={(e) => handleFieldChange('contact.conciergeCtaText', e.target.value)}
                    placeholder="WhatsApp Button Text"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Form Inquiry Categories */}
            <LoopArrayField
              label="Contact Form Inquiry Dropdown Categories"
              items={formData.contact?.formCategories || []}
              onChange={(items) => handleFieldChange('contact.formCategories', items)}
            />
          </div>
        </div>
      )}

      {/* ======================= TAB 4: LIVE STOCK (PETS) PAGE ======================= */}
      {activeTab === 'pets' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-extrabold text-stone-900 font-display">
                Live Stock (Pets) Page Header & Capsule Filters
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Title, animated text loops, subtitle description, and quick breed capsule filters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Eyebrow Prefix</label>
                <input
                  type="text"
                  value={formData.petsPage?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('petsPage.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <LoopArrayField
                label="Eyebrow Rotating Badges"
                items={formData.petsPage?.eyebrowLoops || []}
                onChange={(items) => handleFieldChange('petsPage.eyebrowLoops', items)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Page Title</label>
                <input
                  type="text"
                  value={formData.petsPage?.title || ''}
                  onChange={(e) => handleFieldChange('petsPage.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.petsPage?.description || ''}
                  onChange={(e) => handleFieldChange('petsPage.description', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <LoopArrayField
                  label="Quick Filter Breed Pills"
                  items={formData.petsPage?.breedsList || []}
                  onChange={(items) => handleFieldChange('petsPage.breedsList', items)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 5: ACCESSORIES PAGE ======================= */}
      {activeTab === 'accessories' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-extrabold text-stone-900 font-display">
                Accessories & Care Page Header
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Store headline, capsule badge, and introductory paragraph
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Eyebrow Capsule</label>
                <input
                  type="text"
                  value={formData.accessoriesPage?.eyebrow || ''}
                  onChange={(e) => handleFieldChange('accessoriesPage.eyebrow', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Main Title</label>
                <input
                  type="text"
                  value={formData.accessoriesPage?.title || ''}
                  onChange={(e) => handleFieldChange('accessoriesPage.title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={formData.accessoriesPage?.description || ''}
                  onChange={(e) => handleFieldChange('accessoriesPage.description', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 6: GLOBAL, BRAND & LOGO ======================= */}
      {activeTab === 'global' && (
        <div className="space-y-6">
          {/* Brand Identity & Logo Card */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-stone-900 font-display">
                  Brand Identity, Logo & Store Name
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Customize the brand name, typography accents, and upload a custom brand logo image
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Brand Name Prefix (First Part)</label>
                <input
                  type="text"
                  value={formData.global?.brandNamePrefix || ''}
                  onChange={(e) => handleFieldChange('global.brandNamePrefix', e.target.value)}
                  placeholder="e.g. The Dogs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
                <span className="text-[10px] text-zinc-400">Regular colored prefix in navbar & footer</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Brand Name Highlight (Accent Part)</label>
                <input
                  type="text"
                  value={formData.global?.brandNameHighlight || ''}
                  onChange={(e) => handleFieldChange('global.brandNameHighlight', e.target.value)}
                  placeholder="e.g. Garage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-black text-amber-700 outline-none"
                />
                <span className="text-[10px] text-zinc-400">Highlighted accent word in orange/amber</span>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Full Brand Name (SEO, Titles & Copyright)</label>
                <input
                  type="text"
                  value={formData.global?.brandName || ''}
                  onChange={(e) => handleFieldChange('global.brandName', e.target.value)}
                  placeholder="e.g. The Dogs Garage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Logo Graphic Type</label>
                <select
                  value={formData.global?.logoType || 'icon'}
                  onChange={(e) => handleFieldChange('global.logoType', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold cursor-pointer"
                >
                  <option value="icon">Badge with Paw Print Icon (Standard)</option>
                  <option value="image">Custom Uploaded Logo Image</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <ImageField
                  label="Custom Brand Logo Image (Used if Logo Type is set to 'Custom Uploaded Logo Image')"
                  value={formData.global?.logoImage}
                  fieldKey="brand_logo_img"
                  onChange={(val) => handleFieldChange('global.logoImage', val)}
                />
              </div>
            </div>
          </div>

          {/* Global Announcement & Footer Details */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="border-b border-zinc-100 pb-4">
              <h3 className="text-base font-extrabold text-stone-900 font-display">
                Top Announcement Ribbon & Footer Content
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Top bar announcement ribbon, footer bio, verified credentials and copyright notice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">
                    Top Announcement Ribbon Text
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.global?.announcementActive ?? true}
                      onChange={(e) => handleFieldChange('global.announcementActive', e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span>Show Announcement</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.global?.announcement || ''}
                  onChange={(e) => handleFieldChange('global.announcement', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Footer Tagline & Bio</label>
                <textarea
                  rows={2}
                  value={formData.global?.footerTagline || ''}
                  onChange={(e) => handleFieldChange('global.footerTagline', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Footer Trust Badge Text</label>
                <input
                  type="text"
                  value={formData.global?.footerVerifiedBadge || ''}
                  onChange={(e) => handleFieldChange('global.footerVerifiedBadge', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Copyright Line</label>
                <input
                  type="text"
                  value={formData.global?.footerCopyright || ''}
                  onChange={(e) => handleFieldChange('global.footerCopyright', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsPage;
