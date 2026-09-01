import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dog, Plus, Trash2, Image, Video, ArrowLeft, UploadCloud, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPetById, createPet, updatePet } from '../../redux/slices/pet.slice.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

export const AddEditPetPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedPet, loading } = useSelector((state) => state.pets);

  const photoFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const emptyForm = {
    name: '',
    breed: '',
    gender: 'Male',
    age: '',
    price: '',
    size: 'Medium',
    color: '',
    location: '',
    microchipNumber: '',
    description: '',
    vaccinationStatus: '',
    healthStatus: '',
    kciCertified: true,
    isAvailable: true,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchPetById(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && selectedPet) {
      setFormData({
        name: selectedPet.name || '',
        breed: selectedPet.breed || '',
        gender: selectedPet.gender || 'Male',
        age: selectedPet.age || '',
        price: selectedPet.price !== undefined ? selectedPet.price : '',
        size: selectedPet.size || 'Medium',
        color: selectedPet.color || '',
        location: selectedPet.location || '',
        microchipNumber: selectedPet.microchipNumber || '',
        description: selectedPet.description || '',
        vaccinationStatus: selectedPet.vaccinationStatus || '',
        healthStatus: selectedPet.healthStatus || '',
        kciCertified: selectedPet.kciCertified !== undefined ? selectedPet.kciCertified : true,
        isAvailable: selectedPet.isAvailable !== undefined ? selectedPet.isAvailable : true,
      });
      setPhotos(selectedPet.images || []);
      setVideos(selectedPet.videos || []);
    } else if (!isEditing) {
      setFormData(emptyForm);
      setPhotos([]);
      setVideos([]);
    }
  }, [isEditing, selectedPet]);

  // Cloudinary File Upload for Photos
  const handlePhotoFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > 30) {
      toast.error('Maximum 30 photos limit allowed');
      return;
    }

    setUploadingPhotos(true);
    const uploadFormData = new FormData();
    files.forEach((f) => uploadFormData.append('images', f));
    uploadFormData.append('folder', 'the-dogs-garage/pets/photos');

    try {
      const res = await axiosInstance.post(API_PATHS.UPLOAD.IMAGE, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedFiles = res.data.files || [];
      const newItems = uploadedFiles.map((f, idx) => ({
        url: f.secure_url || f.url,
        publicId: f.publicId,
        order: photos.length + idx + 1,
      }));
      setPhotos((prev) => [...prev, ...newItems]);
      toast.success(`Uploaded ${newItems.length} photo(s) to Cloudinary!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photos to Cloudinary');
    } finally {
      setUploadingPhotos(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = '';
    }
  };

  // Cloudinary File Upload for Videos
  const handleVideoFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (videos.length + files.length > 30) {
      toast.error('Maximum 30 videos limit allowed');
      return;
    }

    setUploadingVideos(true);
    const uploadFormData = new FormData();
    files.forEach((f) => uploadFormData.append('videos', f));
    uploadFormData.append('folder', 'the-dogs-garage/pets/videos');

    try {
      const res = await axiosInstance.post(API_PATHS.UPLOAD.VIDEO, uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedFiles = res.data.files || [];
      const newItems = uploadedFiles.map((f, idx) => ({
        url: f.secure_url || f.url,
        publicId: f.publicId,
        thumbnail: f.thumbnail || photos[0]?.url || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
        caption: `Pet Video Clip ${videos.length + idx + 1}`,
        order: videos.length + idx + 1,
      }));
      setVideos((prev) => [...prev, ...newItems]);
      toast.success(`Uploaded ${newItems.length} video(s) to Cloudinary!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload videos to Cloudinary');
    } finally {
      setUploadingVideos(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl) {
      toast.error('Please enter a valid image URL');
      return;
    }
    if (photos.length >= 30) {
      toast.error('Maximum 30 photos limit reached.');
      return;
    }
    setPhotos([...photos, { url: newPhotoUrl, order: photos.length + 1 }]);
    setNewPhotoUrl('');
    toast.success('Photo added!');
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleAddVideoUrl = () => {
    if (!newVideoUrl) {
      toast.error('Please enter a video URL');
      return;
    }
    if (videos.length >= 30) {
      toast.error('Maximum 30 videos limit reached.');
      return;
    }
    setVideos([
      ...videos,
      {
        url: newVideoUrl,
        thumbnail: photos[0]?.url || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
        caption: `Pet Video Clip ${videos.length + 1}`,
        order: videos.length + 1,
      },
    ]);
    setNewVideoUrl('');
    toast.success('Video clip added!');
  };

  const handleRemoveVideo = (idx) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        images: photos,
        videos,
      };

      if (isEditing) {
        await dispatch(updatePet({ id, data: payload })).unwrap();
        toast.success('Pet profile updated successfully!');
      } else {
        await dispatch(createPet(payload)).unwrap();
        toast.success('Pet listing published successfully!');
      }
      navigate('/admin/pets');
    } catch (err) {
      toast.error(err || 'Failed to save pet listing');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/pets"
            className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 font-display">
              {isEditing ? `Edit Pet Listing: ${formData.name}` : 'Add New Pet Listing'}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Configure puppy breed, medical certifications, price and media assets
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Pet Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-card space-y-4 text-xs font-semibold">
          <h3 className="text-sm font-bold text-zinc-900 pb-2 border-b border-zinc-100 flex items-center gap-2">
            <Dog className="w-4 h-4 text-teal-600" /> Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600">Puppy Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600">Breed *</label>
              <input
                type="text"
                required
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600">Gender *</label>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 cursor-pointer focus:border-zinc-900 focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600">Age *</label>
              <input
                type="text"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 3 Months"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600">Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600">Health Status</label>
              <input
                type="text"
                value={formData.healthStatus}
                onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                placeholder="e.g. Excellent, Vet-Checked"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600">Vaccination Status</label>
              <input
                type="text"
                value={formData.vaccinationStatus}
                onChange={(e) => setFormData({ ...formData, vaccinationStatus: e.target.value })}
                placeholder="e.g. Up to date"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600">Availability Status *</label>
              <div className="relative">
                <select
                  value={formData.isAvailable ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 cursor-pointer focus:border-zinc-900 focus:bg-white font-bold"
                >
                  <option value="true">Available</option>
                  <option value="false">Adopted</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-600">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 outline-none text-zinc-900 focus:border-zinc-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Media: Photos */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Image className="w-4 h-4 text-amber-600" /> Photos Gallery ({photos.length}/30)
            </h3>
            <span className="text-[11px] text-zinc-400 font-medium">Up to 30 high-resolution photos</span>
          </div>

          {/* Photos File Upload Button */}
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={photoFileInputRef}
              multiple
              accept="image/*"
              onChange={handlePhotoFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingPhotos}
              onClick={() => photoFileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-60"
            >
              {uploadingPhotos ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Uploading photos...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  <span>Upload Photos</span>
                </>
              )}
            </button>
          </div>

          {/* Photos Grid Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
            {photos.map((p, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden border border-zinc-200 aspect-square bg-zinc-100">
                <img src={p.url} alt={`Pet ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"
                  title="Remove Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media: Videos */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" /> Video Clips ({videos.length}/30)
            </h3>
            <span className="text-[11px] text-zinc-400 font-medium">Supports MP4 and WebM up to 50MB</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={videoFileInputRef}
              multiple
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingVideos}
              onClick={() => videoFileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-60"
            >
              {uploadingVideos ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Uploading videos...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Upload Videos</span>
                </>
              )}
            </button>
          </div>

          {/* Videos Grid Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {videos.map((v, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-900 p-2">
                <video src={v.url} controls className="w-full h-32 object-cover rounded-xl" />
                <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-300">
                  <span className="truncate">{v.caption}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/pets"
            className="px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 font-bold text-xs hover:bg-zinc-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            {isEditing ? 'Save Changes' : 'Publish Pet Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
