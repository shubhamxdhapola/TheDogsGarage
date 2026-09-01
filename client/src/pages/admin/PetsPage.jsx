import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit3, Trash2, Dog, ExternalLink, Image as ImageIcon, Video as VideoIcon, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPets, deletePet, updatePet } from '../../redux/slices/pet.slice.js';
import { formatCurrency } from '../../utils/helpers.js';

import { DeleteConfirmModal } from '../../components/common/DeleteConfirmModal.jsx';

export const AdminPetsPage = () => {
  const dispatch = useDispatch();
  const { pets, pagination, loading } = useSelector((state) => state.pets);

  const [search, setSearch] = useState('');
  const [breed, setBreed] = useState('All');
  const [page, setPage] = useState(1);
  const [petToDelete, setPetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (breed !== 'All') params.breed = breed;

    dispatch(fetchPets(params));
  }, [dispatch, search, breed, page]);

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;
    try {
      setIsDeleting(true);
      await dispatch(deletePet(petToDelete._id)).unwrap();
      toast.success(`Pet "${petToDelete.name}" removed successfully`);
      setPetToDelete(null);
      dispatch(fetchPets({ page, limit: 10 }));
    } catch (err) {
      toast.error(err || 'Failed to delete pet');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
            Live Stock (Pets)
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Manage live puppies, breeds, media photos & videos, and adoption statuses
          </p>
        </div>

        <Link
          to="/admin/pets/add"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 w-fit rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pet</span>
        </Link>
      </div>

      {/* Filter / Search Bar matching BarbaeQ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search breed or pet name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="relative">
            <select
              value={breed}
              onChange={(e) => { setBreed(e.target.value); setPage(1); }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-700 outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 transition-colors"
            >
              <option value="All">All Breeds</option>
              <option value="Golden Retriever">Golden Retriever</option>
              <option value="Beagle">Beagle</option>
              <option value="Siberian Husky">Siberian Husky</option>
              <option value="Shih Tzu">Shih Tzu</option>
              <option value="French Bulldog">French Bulldog</option>
              <option value="Labrador Retriever">Labrador Retriever</option>
              <option value="German Shepherd">German Shepherd</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Pets Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Pet Details</th>
                <th className="py-4 px-6 whitespace-nowrap">Gender / Age</th>
                <th className="py-4 px-6 whitespace-nowrap">Price</th>
                <th className="py-4 px-6 whitespace-nowrap">Media</th>
                <th className="py-4 px-6 whitespace-nowrap">Health & KCI</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900 mx-auto"></div>
                  </td>
                </tr>
              ) : pets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 font-bold">
                    No live pets found. Click "Add New Pet" to list one.
                  </td>
                </tr>
              ) : (
                pets.map((pet) => (
                  <tr key={pet._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={pet.images?.[0]?.url || '/images/dog-default.png'}
                          alt={pet.name}
                          className="w-11 h-11 rounded-xl object-cover border border-zinc-200/80"
                        />
                        <div>
                          <p className="font-bold text-zinc-900">{pet.breed}</p>
                          <p className="text-[11px] text-zinc-400 font-medium">Name: {pet.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="font-bold text-zinc-800">{pet.gender}</p>
                      <p className="text-[11px] text-zinc-400">{pet.age}</p>
                    </td>
                    <td className="py-4 px-6 font-black text-zinc-900 text-sm whitespace-nowrap">
                      {formatCurrency(pet.price)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="flex items-center gap-1 text-zinc-600 font-medium">
                          <ImageIcon className="w-3.5 h-3.5 text-amber-600" /> {pet.images?.length || 0}/30 Photos
                        </span>
                        <span className="flex items-center gap-1 text-zinc-600 font-medium">
                          <VideoIcon className="w-3.5 h-3.5 text-emerald-600" /> {pet.videos?.length || 0}/30 Videos
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <p className="text-emerald-700 font-bold">{pet.healthStatus || 'Excellent'}</p>
                      <p className="text-zinc-400 text-[10px]">{pet.kciCertified ? 'KCI Certified' : 'Non-KCI'}</p>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          pet.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        {pet.isAvailable ? 'Available' : 'Adopted'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/pets/${pet._id}`}
                          target="_blank"
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/60 transition-all"
                          title="View on store"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/pets/edit/${pet._id}`}
                          className="p-2 rounded-xl text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 border border-zinc-200/60 transition-all"
                          title="Edit pet"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setPetToDelete(pet)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-zinc-200/60 transition-all cursor-pointer"
                          title="Delete pet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Minimal Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(petToDelete)}
        onClose={() => setPetToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Pet Listing"
        itemName={petToDelete?.name}
        description={`Are you sure you want to permanently delete "${petToDelete?.name}" (${petToDelete?.breed})? This will remove all photos, videos and profile records.`}
        loading={isDeleting}
      />
    </div>
  );
};
