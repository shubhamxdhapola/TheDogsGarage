import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

export const fetchPets = createAsyncThunk('pets/fetchPets', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.PETS.GET_ALL, { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch pets');
  }
});

export const fetchPetById = createAsyncThunk('pets/fetchPetById', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.PETS.GET_ONE(id));
    return res.data.pet;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch pet details');
  }
});

export const createPet = createAsyncThunk('pets/createPet', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.PETS.CREATE, data);
    return res.data.pet;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create pet');
  }
});

export const updatePet = createAsyncThunk('pets/updatePet', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(API_PATHS.PETS.UPDATE(id), data);
    return res.data.pet;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update pet');
  }
});

export const deletePet = createAsyncThunk('pets/deletePet', async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(API_PATHS.PETS.DELETE(id));
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete pet');
  }
});

const initialState = {
  pets: [],
  selectedPet: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 12,
  },
  loading: false,
  error: null,
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    clearSelectedPet: (state) => {
      state.selectedPet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.pets = action.payload.pets;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPet = action.payload;
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.pets = state.pets.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedPet } = petSlice.actions;
export default petSlice.reducer;
