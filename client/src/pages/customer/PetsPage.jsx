import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Dog,
  Sparkles,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPets } from '../../redux/slices/pet.slice.js';
import { PetCard } from '../../components/customer/PetCard.jsx';
import { Pagination } from '../../components/common/Pagination.jsx';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { TextLoop } from '../../components/reactbits/TextLoop.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ScrollReveal } from '../../components/reactbits/ScrollReveal.jsx';

export const PetsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { pets, pagination, loading } = useSelector((state) => state.pets);

  // Local filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [breed, setBreed] = useState(searchParams.get('breed') || 'All');
  const [gender, setGender] = useState(searchParams.get('gender') || 'All');
  const [size, setSize] = useState(searchParams.get('size') || 'All');
  const [isAvailable, setIsAvailable] = useState(searchParams.get('isAvailable') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Collapsible sidebar state (HIDDEN by default as requested)
  const [showFilters, setShowFilters] = useState(false);

  // Accordion states for filter sections
  const [accordions, setAccordions] = useState({
    breed: true,
    gender: true,
    size: true,
    availability: true,
  });

  const toggleAccordion = (key) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Top breeds for quick capsule filters
  const breedsList = [
    'All',
    'Siberian Husky',
    'German Shepherd',
    'Labrador Retriever',
    'Golden Retriever',
  ];

  const genderOptions = ['All', 'Male', 'Female'];
  const sizeOptions = ['All', 'Small', 'Medium', 'Large'];

  // Sync state to API query
  useEffect(() => {
    const params = { page, limit: 12 };

    if (search.trim()) params.search = search.trim();
    if (breed !== 'All') params.breed = breed;
    if (gender !== 'All') params.gender = gender;
    if (size !== 'All') params.size = size;
    if (isAvailable === 'available') params.isAvailable = 'true';
    if (sort) params.sort = sort;

    dispatch(fetchPets(params));

    // Update URL search parameters
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (breed !== 'All') newParams.breed = breed;
    if (gender !== 'All') newParams.gender = gender;
    if (size !== 'All') newParams.size = size;
    if (isAvailable !== 'all') newParams.isAvailable = isAvailable;
    if (sort !== 'newest') newParams.sort = sort;
    if (page > 1) newParams.page = page;

    setSearchParams(newParams, { replace: true });
  }, [dispatch, search, breed, gender, size, isAvailable, sort, page]);

  // Calculate active filter count
  const activeFiltersCount = [
    breed !== 'All',
    gender !== 'All',
    size !== 'All',
    isAvailable !== 'all',
    search.trim() !== '',
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearch('');
    setBreed('All');
    setGender('All');
    setSize('All');
    setIsAvailable('all');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="pt-8 pb-28 bg-[#FAFAFA] min-h-screen text-stone-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
        
        {/* Centered Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 py-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-black tracking-widest text-amber-700 uppercase font-display mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>LIVE STOCK • </span>
            <TextLoop
              items={['KCI CERTIFIED', '42-PT VET CHECK', 'ETHICALLY RAISED', 'LIFETIME CARE']}
              interval={2800}
              className="text-stone-800"
            />
          </div>

          <BlurText
            text="Find Your Perfect Companion"
            delay={50}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 font-display tracking-tight justify-center"
          />

          <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed max-w-xl mx-auto">
            Ethically raised, vet-certified puppies from champion bloodlines with complete medical records, microchips, and direct WhatsApp consultations.
          </p>
        </div>

        {/* Breed Filter Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
          {breedsList.map((b) => {
            const isActive = breed === b;
            return (
              <ClickSpark key={b} sparkColor="#E86A2C">
                <button
                  type="button"
                  onClick={() => {
                    setBreed(b);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-card scale-105'
                      : 'bg-white border border-stone-200/90 text-stone-600 hover:bg-stone-50 hover:text-stone-900 shadow-2xs'
                  }`}
                >
                  {b}
                </button>
              </ClickSpark>
            );
          })}
        </div>

        {/* Search, Filter Toggle & Sort Action Bar */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-stone-200/80 shadow-subtle flex flex-row items-center justify-between gap-3">
          
          {/* Left: Filter Toggle & Search Bar */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ClickSpark sparkColor="#E86A2C">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer border shrink-0 ${
                  showFilters
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-[#FAFAFA] text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showFilters ? 'Hide Filters' : 'Filter Pets'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </ClickSpark>

            {/* Search Input - Hidden on smaller screens */}
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by breed, companion name or city..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-[#FAFAFA] border border-stone-200/90 text-xs font-semibold text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Sort Options & Reset Button */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl bg-[#FAFAFA] border border-stone-200 text-xs font-bold text-stone-800 outline-none cursor-pointer hover:border-stone-300 focus:border-amber-600 transition-all shadow-2xs"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest Listed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.5]" />
            </div>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-stone-400 font-bold text-[11px] uppercase tracking-wider mr-1">
              Active Filters:
            </span>

            {breed !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-900 font-bold shadow-2xs">
                <span>Breed: {breed}</span>
                <button
                  type="button"
                  onClick={() => setBreed('All')}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {gender !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-900 font-bold shadow-2xs">
                <span>Gender: {gender}</span>
                <button
                  type="button"
                  onClick={() => setGender('All')}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {size !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-900 font-bold shadow-2xs">
                <span>Size: {size}</span>
                <button
                  type="button"
                  onClick={() => setSize('All')}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {isAvailable !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-900 font-bold shadow-2xs">
                <span>{isAvailable === 'available' ? 'Available Only' : 'All Statuses'}</span>
                <button
                  type="button"
                  onClick={() => setIsAvailable('all')}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {search.trim() !== '' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-900 font-bold shadow-2xs">
                <span>"{search}"</span>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-amber-700 hover:underline font-bold text-xs ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Collapsible Filter Sidebar (Shown only when toggled) */}
          {showFilters && (
            <div className="lg:col-span-3 space-y-4">
              <SpotlightCard
                spotlightColor="rgba(232, 106, 44, 0.08)"
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-subtle space-y-5"
              >
                <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
                  <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2 font-display">
                    <Filter className="w-4 h-4 text-amber-600" />
                    <span>Filter Criteria</span>
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* 1. Breed Accordion */}
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('breed')}
                    className="w-full flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider hover:text-stone-900 cursor-pointer"
                  >
                    <span>Breed Selection</span>
                    {accordions.breed ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>

                  {accordions.breed && (
                    <div className="space-y-1.5 pt-1 max-h-56 overflow-y-auto pr-1">
                      {breedsList.map((b) => (
                        <label
                          key={b}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="breed"
                              checked={breed === b}
                              onChange={() => {
                                setBreed(b);
                                setPage(1);
                              }}
                              className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className={breed === b ? 'font-bold text-stone-900' : ''}>{b}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Gender Selection */}
                <div className="space-y-2.5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('gender')}
                    className="w-full flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider hover:text-stone-900 cursor-pointer"
                  >
                    <span>Gender</span>
                    {accordions.gender ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>

                  {accordions.gender && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {genderOptions.map((g) => {
                        const isSelected = gender === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => {
                              setGender(g);
                              setPage(1);
                            }}
                            className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'bg-[#FAFAFA] border border-stone-200 text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Size Category */}
                <div className="space-y-2.5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('size')}
                    className="w-full flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider hover:text-stone-900 cursor-pointer"
                  >
                    <span>Breed Size</span>
                    {accordions.size ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>

                  {accordions.size && (
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {sizeOptions.map((s) => {
                        const isSelected = size === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setSize(s);
                              setPage(1);
                            }}
                            className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-stone-900 text-white shadow-xs'
                                : 'bg-[#FAFAFA] border border-stone-200 text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Availability Status */}
                <div className="space-y-2.5 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('availability')}
                    className="w-full flex items-center justify-between text-xs font-black text-stone-500 uppercase tracking-wider hover:text-stone-900 cursor-pointer"
                  >
                    <span>Adoption Status</span>
                    {accordions.availability ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </button>

                  {accordions.availability && (
                    <div className="space-y-1.5 pt-1">
                      <label className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer">
                        <input
                          type="radio"
                          name="isAvailable"
                          checked={isAvailable === 'all'}
                          onChange={() => {
                            setIsAvailable('all');
                            setPage(1);
                          }}
                          className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className={isAvailable === 'all' ? 'font-bold text-stone-900' : ''}>All Companions</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer">
                        <input
                          type="radio"
                          name="isAvailable"
                          checked={isAvailable === 'available'}
                          onChange={() => {
                            setIsAvailable('available');
                            setPage(1);
                          }}
                          className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className={isAvailable === 'available' ? 'font-bold text-stone-900' : ''}>
                          Available Litters Only
                        </span>
                      </label>
                    </div>
                  )}
                </div>

              </SpotlightCard>
            </div>
          )}

          {/* Right: Pet Cards Grid (Spans full 12 cols when filters are closed) */}
          <div className={showFilters ? 'lg:col-span-9 space-y-6' : 'lg:col-span-12 space-y-6'}>
            
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
              <span>
                Showing <strong className="text-stone-900 font-display">{pets.length}</strong> of{' '}
                <strong className="text-stone-900 font-display">{pagination?.total || pets.length}</strong> certified companions
              </span>
            </div>

            {loading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-6`}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-subtle animate-pulse space-y-4 h-96"
                  >
                    <div className="aspect-square bg-stone-100 rounded-2xl" />
                    <div className="h-5 bg-stone-100 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                    <div className="h-8 bg-stone-100 rounded w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : pets.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-subtle text-center space-y-4 max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
                  <Dog className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-stone-900 font-display">No Companions Found</h3>
                  <p className="text-xs text-stone-500 font-medium">
                    We couldn't find any puppies matching your current filters. Try resetting the criteria.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 ${
                  showFilters ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
                } gap-3 sm:gap-6`}
              >
                {pets.map((pet, idx) => (
                  <PetCard key={pet._id || pet.id || idx} pet={pet} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="pt-8 border-t border-stone-200/80 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default PetsPage;
