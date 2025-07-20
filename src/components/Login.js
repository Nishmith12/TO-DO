import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); // For interactivity
    const [error, setError] = useState('');

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        // We don't need the local error state anymore
        // setError(''); 

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed to login');
            
            toast.success("Welcome back!"); // Success toast
            localStorage.setItem('token', data.token);
            setToken(data.token);
        } catch (err) {
            toast.error(err.message); // Error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button 
                type="submit" 
                disabled={isLoading} // Disable button while loading
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 disabled:bg-blue-300"
            >
                {isLoading ? 'Logging In...' : 'Login'}
            </button>
        </form>
    );
};

export default Login;