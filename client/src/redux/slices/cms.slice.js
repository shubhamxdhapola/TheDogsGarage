import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { defaultCmsData } from '../../utils/defaultCmsData.js';

// Deep merge helper
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        if (target[key] === undefined || target[key] === null) {
          Object.assign(output, { [key]: source[key] });
        }
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export const fetchCmsContent = createAsyncThunk(
  'cms/fetchCmsContent',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CMS);
      return res.data?.cms || defaultCmsData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch CMS content');
    }
  }
);

export const updateCmsContent = createAsyncThunk(
  'cms/updateCmsContent',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(API_PATHS.CMS, payload);
      return res.data?.cms;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update CMS content');
    }
  }
);

export const resetCmsContent = createAsyncThunk(
  'cms/resetCmsContent',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${API_PATHS.CMS}/reset`, payload || {});
      return res.data?.cms;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reset CMS content');
    }
  }
);

const cmsSlice = createSlice({
  name: 'cms',
  initialState: {
    cms: defaultCmsData,
    loading: false,
    saving: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setCmsData: (state, action) => {
      state.cms = deepMerge(action.payload, defaultCmsData);
    },
    updateLocalCms: (state, action) => {
      state.cms = deepMerge(action.payload, state.cms);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CMS
      .addCase(fetchCmsContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCmsContent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.cms = deepMerge(action.payload, defaultCmsData);
        }
      })
      .addCase(fetchCmsContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Keep defaultCmsData active so frontend never breaks
        if (!state.cms) state.cms = defaultCmsData;
      })

      // Update CMS
      .addCase(updateCmsContent.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCmsContent.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.cms = deepMerge(action.payload, defaultCmsData);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCmsContent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Reset CMS
      .addCase(resetCmsContent.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(resetCmsContent.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.cms = deepMerge(action.payload, defaultCmsData);
        }
      })
      .addCase(resetCmsContent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export const { setCmsData, updateLocalCms } = cmsSlice.actions;
export default cmsSlice.reducer;

