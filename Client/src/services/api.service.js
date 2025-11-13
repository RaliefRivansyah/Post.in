import api from '../utils/api';

export const authService = {
    async register(userData) {
        const response = await api.post('/api/register', userData);
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/api/login', credentials);
        console.log('Login API response:', response.data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log('Token saved to localStorage:', response.data.token);
        } else {
            console.error('No token in response:', response.data);
        }
        return response.data;
    },

    async googleLogin(credential) {
        const response = await api.post('/api/auth/google', { credential });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },
};

export const postService = {
    async getAllPosts() {
        const response = await api.get('/api/posts');
        return response.data;
    },

    async getPostById(id) {
        const response = await api.get(`/api/posts/${id}`);
        return response.data;
    },

    async createPost(postData) {
        const response = await api.post('/api/posts', postData);
        return response.data;
    },

    async likePost(postId) {
        const response = await api.post(`/api/posts/${postId}/like`);
        return response.data;
    },

    async createComment(postId, content) {
        const response = await api.post(`/api/posts/${postId}/comment`, { content });
        return response.data;
    },

    async deletePost(postId) {
        const response = await api.delete(`/api/posts/${postId}`);
        return response.data;
    },

    async deleteComment(postId, commentId) {
        const response = await api.delete(`/api/posts/${postId}/comment/${commentId}`);
        return response.data;
    },
};

export const communityService = {
    async getAllCommunities() {
        const response = await api.get('/api/communities');
        return response.data;
    },

    async getCommunityById(id) {
        const response = await api.get(`/api/communities/${id}`);
        return response.data;
    },

    async createCommunity(communityData) {
        const response = await api.post('/api/communities', communityData);
        return response.data;
    },

    async joinCommunity(id) {
        const response = await api.post(`/api/communities/${id}/join`);
        return response.data;
    },

    async leaveCommunity(id) {
        const response = await api.post(`/api/communities/${id}/leave`);
        return response.data;
    },
};

export const profileService = {
    async getProfile() {
        const response = await api.get('/api/profile');
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.post('/api/profile/edit', profileData);
        return response.data;
    },
};

export const uploadService = {
    async uploadImage(formData) {
        const response = await api.post('/api/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async uploadVideo(formData) {
        const response = await api.post('/api/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async uploadAvatar(formData) {
        const response = await api.post('/api/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deleteMedia(publicId, resourceType = 'image') {
        const response = await api.delete('/api/upload/media', {
            data: { publicId, resourceType },
        });
        return response.data;
    },
};

// Export named functions for convenience
export const uploadImage = uploadService.uploadImage;
export const uploadVideo = uploadService.uploadVideo;
export const uploadAvatar = uploadService.uploadAvatar;
export const deleteMedia = uploadService.deleteMedia;
