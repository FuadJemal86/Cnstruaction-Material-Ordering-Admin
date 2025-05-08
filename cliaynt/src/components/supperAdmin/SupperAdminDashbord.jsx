import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Users, Shield, User } from 'lucide-react';
import api from '../../api';

function SupperAdminDashbord() {
    // Sample initial admin data
    const [admins, setAdmins] = useState([]);

    // States for modal
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {

        const fetchData = async () => {
            try {
                const result = await api.get('/supper-admin/get-admins')

                if (result.data.status) {
                    setAdmins(result.data.admins)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])

    // Open modal for adding new admin
    const openAddModal = () => {
        setEditMode(false);
        setFormData({
            name: '',
            email: '',
            password: ''
        });
        setShowModal(true);
    };

    // Open modal for editing admin
    const openEditModal = (admin) => {
        setEditMode(true);
        setCurrentAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
        });
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = () => {
        if (editMode) {
            // Update existing admin
            setAdmins(admins.map(admin =>
                admin.id === currentAdmin.id ? { ...admin, ...formData } : admin
            ));
        } else {
            // Add new admin
            const newAdmin = {
                id: admins.length + 1,
                ...formData
            };
            setAdmins([...admins, newAdmin]);
        }
        closeModal();
    };

    // Delete admin
    const deleteAdmin = (id) => {
        setAdmins(admins.filter(admin => admin.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-8 w-8" />
                        <h1 className="text-2xl font-bold">Supper Admin Dashboard</h1>
                    </div>
                    <div className="text-sm">Welcome, Supper Admin</div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 mt-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-semibold">Manage Admins</h2>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Admin
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        />
                    </div>

                    {/* Admin Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                            {
                                                admin.image != null ? (
                                                    <span className='rounded-full w-4 h-4'>
                                                        <img src={`http://localhost:3032/images/${admin?.image}`} alt="" srcset="" />
                                                    </span>
                                                ) : (
                                                    <User size={20} />
                                                )
                                            }
                                        </td>
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{admin.name}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500">{admin.email}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(admin)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Pencil className="h-4 w-4 inline" />
                                            </button>
                                            <button
                                                onClick={() => deleteAdmin(admin.id)}
                                                className="text-red-600 hover:text-red-900 ml-3"
                                            >
                                                <Trash2 className="h-4 w-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal for Adding/Editing Admin */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editMode ? 'Edit Admin' : 'Add New Admin'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter admin name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter admin email"
                                />
                            </div>

                            {
                                !editMode ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder='Enter your password'
                                        />
                                    </div>
                                ) : (
                                    null
                                )
                            }
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {editMode ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupperAdminDashbord;