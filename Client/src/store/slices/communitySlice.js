import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communityService } from '../../services/api.service';

// Async thunk for fetching all communities
export const getAllCommunities = createAsyncThunk('community/getAllCommunities', async (_, { rejectWithValue }) => {
    try {
        const data = await communityService.getAllCommunities();
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch communities');
    }
});

// Async thunk for creating community
export const createCommunity = createAsyncThunk('community/createCommunity', async (communityData, { rejectWithValue }) => {
    try {
        const data = await communityService.createCommunity(communityData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create community');
    }
});

// Async thunk for joining community
export const joinCommunity = createAsyncThunk('community/joinCommunity', async (communityId, { rejectWithValue }) => {
    try {
        await communityService.joinCommunity(communityId);
        return communityId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to join community');
    }
});

// Async thunk for leaving community
export const leaveCommunity = createAsyncThunk('community/leaveCommunity', async (communityId, { rejectWithValue }) => {
    try {
        await communityService.leaveCommunity(communityId);
        return communityId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to leave community');
    }
});

const communitySlice = createSlice({
    name: 'community',
    initialState: {
        communities: [],
        myCommunities: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all communities
            .addCase(getAllCommunities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCommunities.fulfilled, (state, action) => {
                state.loading = false;
                state.communities = action.payload.communities || action.payload;
                state.myCommunities = action.payload.myCommunities || [];
            })
            .addCase(getAllCommunities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create community
            .addCase(createCommunity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCommunity.fulfilled, (state) => {
                state.loading = false;
                // Community will be fetched again after creation
            })
            .addCase(createCommunity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Join community
            .addCase(joinCommunity.pending, (state) => {
                state.error = null;
            })
            .addCase(joinCommunity.fulfilled, () => {
                // Will refetch communities after joining
            })
            .addCase(joinCommunity.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Leave community
            .addCase(leaveCommunity.pending, (state) => {
                state.error = null;
            })
            .addCase(leaveCommunity.fulfilled, () => {
                // Will refetch communities after leaving
            })
            .addCase(leaveCommunity.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearError } = communitySlice.actions;
export default communitySlice.reducer;
