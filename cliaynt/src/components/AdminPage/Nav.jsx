import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
    Menu,
    ChevronLeft,
    LayoutDashboard,  // <-- correct name
    Package,
    ShoppingCart,
    Users,
    CreditCard,
    Tag,
    Building2,
    MessageSquare,
    Bell,
    Search,
    Settings
} from "lucide-react";


function Nav() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, title: 'Overview', path: '/' },
        { icon: <Package size={20} />, title: 'Orders', path: '/admin-page/order' },
        { icon: <ShoppingCart size={20} />, title: 'Suppliers', path: '/admin-page/supplier' },
        { icon: <Users size={20} />, title: 'Customers', path: '/admin-page/customer' },
        { icon: <CreditCard size={20} />, title: 'Payments', path: '/admin-page/payment' },
        { icon: <Tag size={20} />, title: 'Categories', path: '/admin-page/category' },
        { icon: <Building2 size={20} />, title: 'Bank Account', path: '/admin-page/bank-account' },
        { icon: <MessageSquare size={20} />, title: 'Complaints', path: '/admin-page/complaints' },
    ];

    return (
        <div className="flex flex-col h-screen lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0
                h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
                ${collapsed ? 'w-24' : 'w-64'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo section */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span className="font-bold text-xl">A</span>
                        </div>
                        {!collapsed && (
                            <h1 className="font-medium text-lg text-gray-100">Admin Panel</h1>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-white hidden lg:block"
                    >
                        <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6 ">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center py-3 px-3 rounded-lg transition-colors
                                            ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                        `}
                                    >
                                        <span className="inline-flex">{item.icon}</span>
                                        {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm z-10 sticky top-0">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center">
                            <button
                                onClick={toggleMobileSidebar}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="ml-2 lg:ml-6 relative text-gray-500 focus-within:text-gray-900 hidden md:block">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <Bell size={20} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <MessageSquare size={20} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <Settings size={20} />
                            </button>
                            <div className="ml-2">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <span className="font-medium text-sm">JD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Nav