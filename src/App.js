import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        // Main container with a dark background, making it fill the screen height
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">MERN To-Do App</h1>
                {token ? (
                    <div>
                        <Dashboard token={token} />
                        <button 
                            onClick={handleLogout} 
                            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full">
                        <div className="flex justify-around mb-6 border-b border-gray-700">
                           {/* We can add tabs here later if needed */}
                           <h2 className="text-2xl font-bold mb-2">Login / Register</h2>
                        </div>
                        {/* We'll simplify and show both for now */}
                        <Login setToken={setToken} />
                        <p className="text-center my-4">or</p>
                        <Register />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;