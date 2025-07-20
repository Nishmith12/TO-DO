import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from './Modal';

const Dashboard = ({ token }) => {
    // --- STATE MANAGEMENT ---
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    
    // State for delete confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // State for editing a task
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState('');

    // --- DATA FETCHING ---

    const fetchTodos = async () => {
        try {
            const res = await fetch('/api/todos', {
                headers: { 'x-auth-token': token },
            });
            const data = await res.json();
            if (res.ok) {
                setTodos(data);
            } else {
                toast.error(data.msg || "Failed to fetch tasks.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching tasks.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchTodos();
        }
    }, [token]);

    // --- TODO CRUD FUNCTIONS ---

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ text }),
            });
            if (!res.ok) throw new Error("Server error on add");
            toast.success("Task added!");
            setText('');
            fetchTodos();
        } catch (error) {
            toast.error("Failed to add task.");
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token },
            });
            fetchTodos();
        } catch (error) {
            toast.error("Failed to update task status.");
        }
    };

    // --- DELETE MODAL FUNCTIONS ---

    const openDeleteModal = (id) => {
        setTaskToDelete(id);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setTaskToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await fetch(`/api/todos/${taskToDelete}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token },
            });
            toast.info("Task deleted.");
            fetchTodos();
        } catch (error) {
            toast.error("Failed to delete task.");
        } finally {
            closeDeleteModal();
        }
    };

    // --- EDITING FUNCTIONS ---

    const handleEditClick = (todo) => {
        setEditingTaskId(todo._id);
        setEditingText(todo.text);
    };

    const handleSaveEdit = async (id) => {
        try {
            const res = await fetch(`/api/todos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ text: editingText }),
            });
            if (!res.ok) {
                 const data = await res.json();
                 throw new Error(data.msg || "Server error on edit");
            }
            toast.success("Task updated!");
            setEditingTaskId(null);
            setEditingText('');
            fetchTodos();
        } catch (error) {
            toast.error(error.message || "Failed to update task.");
        }
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
        setEditingText('');
    };

    // --- JSX RENDER ---

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            >
                Are you sure you want to delete this task? This action cannot be undone.
            </Modal>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
                <h2 className="text-2xl font-bold text-center mb-4">Your To-Do List</h2>
                
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a new task..."
                        required
                        className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300">
                        Add
                    </button>
                </form>

                <ul className="space-y-3">
                    {todos.map((todo) => (
                        <li key={todo._id} className="bg-gray-700 p-3 rounded-lg min-h-[58px]">
                            {editingTaskId === todo._id ? (
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="flex-grow px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        autoFocus
                                    />
                                    <button onClick={() => handleSaveEdit(todo._id)} className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg font-semibold">Save</button>
                                    <button onClick={handleCancelEdit} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold">Cancel</button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span 
                                        className={`text-lg cursor-pointer ${todo.isCompleted ? 'line-through text-gray-500' : ''}`}
                                        onClick={() => handleToggleComplete(todo._id)}
                                    >
                                        {todo.text}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditClick(todo)} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full text-xs">EDIT</button>
                                        <button onClick={() => openDeleteModal(todo._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full text-xs">DELETE</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Dashboard;