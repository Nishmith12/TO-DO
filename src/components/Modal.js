import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Main modal container with a semi-transparent background
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal content box */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <div className="text-white text-lg mb-4">
                    {children}
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition duration-300"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;