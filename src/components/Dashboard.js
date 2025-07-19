import React, { useState, useEffect } from 'react';

const Dashboard = ({ token }) => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');

    const fetchTodos = async () => {
        // ... (this function remains the same)
        try {
            const res = await fetch('/api/todos', {
                headers: { 'x-auth-token': token },
            });
            const data = await res.json();
            if (res.ok) setTodos(data);
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        }
    };

    useEffect(() => {
        if (token) fetchTodos();
    }, [token]);

    const handleAddTodo = async (e) => {
        // ... (this function remains the same)
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ text }),
            });
            setText('');
            fetchTodos();
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const handleDelete = async (id) => {
        // ... (this function remains the same)
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token },
            });
            fetchTodos();
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    // --- NEW FUNCTION ---
    // Handle toggling the completion status of a todo
    const handleToggleComplete = async (id) => {
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'PUT', // Use the new PUT endpoint
                headers: {
                    'x-auth-token': token,
                },
            });
            fetchTodos(); // Refresh the list to show the change
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Your To-Do List</h2>
            
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                {/* ... (form remains the same) ... */}
                 <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a new task..."
                    required
                    className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300"
                >
                    Add
                </button>
            </form>

            <ul className="space-y-3">
                {/* --- UPDATED LIST ITEM --- */}
                {todos.map((todo) => (
                    <li 
                        key={todo._id} 
                        className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                    >
                        <span 
                            className={`text-lg cursor-pointer ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}
                            onClick={() => handleToggleComplete(todo._id)} // Click to toggle
                        >
                            {todo.text}
                        </span>
                        <button 
                            onClick={() => handleDelete(todo._id)} 
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-xs transition duration-300"
                        >
                            DELETE
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;