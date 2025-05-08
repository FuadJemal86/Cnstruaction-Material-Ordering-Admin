import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, EyeOff, Eye } from 'lucide-react';
import api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function SupperAdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const [supperAdmin, setSupperAdmin] = useState({
        email: '',
        password: ''
    })

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = supperAdmin

        if (!email || !password) {
            return toast.error('Please fill all fields!')
        }
        try {
            const result = await api.post('/supper-admin/login', supperAdmin)
            if (result.data.loginStatus) {
                navigate('/supper-admin-dashboard')
            } else {
                toast.error(result.data.message || 'Wrong email or password ')
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setSupperAdmin(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-gray-200">
                <Toaster position="top-center" reverseOrder={false} />
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-full mb-4">
                        <ShieldAlert size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Supper Admin Portal</h1>
                    <p className="text-gray-500 text-sm mt-1">Secure admin access only</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="relative">
                            <label className="text-xs font-medium text-gray-600 block mb-2">ADMIN EMAIL</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    name='email'
                                    value={supperAdmin.email}
                                    onChange={handleChange}
                                    className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                                    placeholder="admin@organization.com"
                                    type="email"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-xs font-medium text-gray-600 block mb-2">ADMIN PASSWORD</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    name='password'
                                    value={supperAdmin.password}
                                    onChange={handleChange}
                                    placeholder="Enter secure password"
                                    className="w-full h-10 pl-10 pr-10 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                                    type={showPassword ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-2.5"
                                >
                                    {showPassword ?
                                        <EyeOff className="h-4 w-4 text-gray-400" /> :
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-2 mt-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 text-xs text-gray-600">
                                    Remember this device
                                </label>
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            className="w-full h-10 text-white rounded-lg font-medium bg-blue-600 hover:bg-blue-700 transition-colors shadow-md mt-2"
                        >
                            Access Admin Panel
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        This is a restricted area. Unauthorized access is prohibited and may result in legal action.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SupperAdminLogin;