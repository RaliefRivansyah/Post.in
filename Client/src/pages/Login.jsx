import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/api.service';
import { toast } from 'react-toastify';

export default function Login() {
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate('/posts');
        }
    }, [navigate]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login(formData);
            console.log('Login response:', response);
            toast.success('Login successful!');
            // Use setTimeout to ensure token is saved before navigation
            setTimeout(() => {
                navigate('/posts');
            }, 100);
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            await authService.googleLogin(credentialResponse.credential);
            toast.success('Google login successful!');
            setTimeout(() => {
                navigate('/posts');
            }, 100);
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error('Google login failed');
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-[#E0E0E0]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1A1A1A]">Postin</h1>
                    <p className="text-[#5F5F5F] mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-[#E0E0E0] rounded-md shadow-sm focus:outline-none focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-[#E0E0E0] rounded-md shadow-sm focus:outline-none focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6C63FF] hover:bg-[#4C46EF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF] disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#E0E0E0]" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-[#5F5F5F]">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap />
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#5F5F5F]">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-[#6C63FF] hover:text-[#4C46EF]">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
