import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../imags/jejan.svg'
import banner from '../imags/login banner.jpg'
import api from '../../api'

function Login() {
    const navigate = useNavigate()
    const [admin, setAdmin] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { email, password } = admin

        if (!email || !password) {
            return toast.error('Please fill all fields!')
        }

        try {
            const result = await api.post('/admin/login', admin)
            if (result.data.loginStatus) {
                navigate('/admin-page')
            } else {
                toast.error(result.data.message || 'Login failed!')
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || 'An error occurred')
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Left section - Login Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-16">
                <div className="w-full max-w-md mx-auto">
                    {/* Logo and Brand */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="relative mb-1">
                            <img
                                className="relative w-48 h-24"
                                src={logo}
                                alt="ConstructEasy Logo"
                            />
                        </div>
                    </div>

                    {/* Login Form Container */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                        {/* Welcome Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                            <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="admin@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={e => setAdmin({ ...admin, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-blue-600 hover:text-blue-500">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={e => setAdmin({ ...admin, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">Remember me</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition duration-200 font-medium"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-xs text-gray-500">
                                By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to={'/supper-admin'} className="text-sm  font-medium text-blue-600 hover:text-blue-500">
                            to supper admin? <a href="#"></a>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right section - Banner Image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${banner})` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-900/80"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center p-12">
                    <div className="max-w-lg text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">E-commerce Management Dashboard</h2>
                        <p className="text-xl text-gray-200 mb-8">Access all your tools to manage products, track orders, and grow your online business.</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
                                <div className="font-bold text-3xl mb-1">1.2K</div>
                                <div className="text-sm text-gray-200">Products</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
                                <div className="font-bold text-3xl mb-1">8.4K</div>
                                <div className="text-sm text-gray-200">Customers</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
                                <div className="font-bold text-3xl mb-1">$32K</div>
                                <div className="text-sm text-gray-200">Revenue</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-white">
                                <div className="font-bold text-3xl mb-1">42%</div>
                                <div className="text-sm text-gray-200">Growth</div>
                            </div>
                        </div>

                        <div className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm shadow-lg">
                            Admin Panel v2.4 • Last updated May 2025
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login