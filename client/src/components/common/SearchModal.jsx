import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Dog, ShoppingBag, ArrowRight } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance.js';
import { formatCurrency } from '../../utils/helpers.js';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [pets, setPets] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setPets([]);
      setProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const [petsRes, prodsRes] = await Promise.all([
            axiosInstance.get('/api/pets', { params: { search: query, limit: 4 } }),
            axiosInstance.get('/api/products', { params: { search: query, limit: 4 } }),
          ]);
          setPets(petsRes.data?.pets || []);
          setProducts(prodsRes.data?.products || []);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setPets([]);
        setProducts([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/accessories?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside backdrop to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center px-6 py-4 border-b border-stone-100 gap-3">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="Search puppies, dog food, organic shampoos, gear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base font-medium outline-none text-stone-900 placeholder:text-stone-400 bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-600 font-semibold px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close Search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Search Results / Suggestions */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="text-center py-8 text-stone-400 text-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
              Searching The Dogs Garage...
            </div>
          )}

          {!loading && query && pets.length === 0 && products.length === 0 && (
            <div className="text-center py-8 text-stone-400 text-sm">
              No pets or accessories found matching "{query}".
            </div>
          )}

          {!query && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Quick Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {['Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'Organic Shampoo', 'Puppy Nutrition'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full bg-stone-100 text-xs font-semibold text-stone-800 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Stock Results */}
          {pets.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
                  <Dog className="w-4 h-4 text-amber-600" /> Available Puppies
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/pets?search=${encodeURIComponent(query)}`);
                    onClose();
                  }}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {pets.map((pet) => (
                  <div
                    key={pet._id}
                    onClick={() => {
                      navigate(`/pets/${pet._id}`);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAFAFA] hover:bg-stone-100 border border-stone-200/70 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <img
                      src={pet.images?.[0]?.url || pet.images?.[0] || '/images/hero-dog.png'}
                      alt={pet.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-stone-900 truncate">{pet.breed}</p>
                      <p className="text-xs text-stone-500">{pet.gender} • {pet.age}</p>
                      <p className="text-xs font-extrabold text-amber-700">{formatCurrency(pet.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {products.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4 text-amber-600" /> Essentials & Products
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/accessories?search=${encodeURIComponent(query)}`);
                    onClose();
                  }}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {products.map((prod) => (
                  <div
                    key={prod._id}
                    onClick={() => {
                      navigate(`/accessories/${prod._id}`);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAFAFA] hover:bg-stone-100 border border-stone-200/70 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <img
                      src={prod.images?.[0] || '/images/product-shampoo.jpg'}
                      alt={prod.name}
                      className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-stone-900 truncate">{prod.name}</p>
                      <p className="text-xs text-stone-500">{prod.category || 'Grooming'}</p>
                      <p className="text-xs font-extrabold text-stone-900">{formatCurrency(prod.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
