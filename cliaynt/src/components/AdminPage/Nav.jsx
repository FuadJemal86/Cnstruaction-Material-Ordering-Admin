import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
    Globe,
    Trash2,
    Menu,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    CreditCard,
    Tag,
    Building2,
    MessageSquare,
    Bell,
    Search,
    Settings,
    Shield,
    DeleteIcon,
    X,
} from "lucide-react";
import api from '../../api';
import logo from '../imags/jejan.svg'
import adminValidation from '../hookes/adminVerfication';

function Nav() {
    adminValidation()
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState({})
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
    };

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, title: 'Overview', path: '' },
        { icon: <Package size={20} />, title: 'Orders', path: '/admin-page/order' },
        {
            icon: <ShoppingCart size={20} />,
            Chevron: <ChevronRight size={20} />,
            title: 'Suppliers',
            path: '/admin-page/supplier',
            subMenu: [
                { icone: <Globe />, title: 'Online Suppliers', path: '/admin-page/online-suppliers' },
                { icone: <Trash2 />, title: 'Removed Suppliers', path: '/admin-page/removed-supplier' },
                { icone: <DeleteIcon />, title: 'Hard Delete', path: '/admin-page/hard-removed-supplier' }
            ]
        },
        {
            icon: <Users size={20} />,
            Chevron: <ChevronRight size={20} />,
            title: 'Customers',
            path: '/admin-page/customer',
            subMenu: [
                { icone: <Trash2 />, title: 'Removed Customer', path: '/admin-page/removed-customer' },
                { icone: <DeleteIcon />, title: 'Hard Delete', path: '/admin-page/hard-removed-customer' }
            ]
        },
        { icon: <CreditCard size={20} />, title: 'Payments', path: '/admin-page/payment' },
        { icon: <Tag size={20} />, title: 'Categories', path: '/admin-page/category' },
        { icon: <Building2 size={20} />, title: 'Bank Account', path: '/admin-page/bank-account' },
        { icon: <MessageSquare size={20} />, title: 'Complaints', path: '/admin-message-monitor' },
    ];

    const [openSubMenus, setOpenSubMenus] = useState({});

    const toggleSubMenu = (title) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileOpen(false);
        setShowMobileSearch(false);
    }, [location.pathname]);

    // Close mobile sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileOpen && !event.target.closest('aside') && !event.target.closest('[data-mobile-menu-button]')) {
                setMobileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileOpen]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const result = await api.get('/admin/admin-profile')
                if (result.data.status) {
                    setAdminProfile(result.data.adminImage)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchProfile()
    }, [])

    return (
        <div className="flex flex-col h-screen lg:flex-row min-h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0 z-50
                h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out
                ${collapsed ? 'w-20' : 'w-64'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                lg:shadow-none shadow-2xl
            `}>
                {/* Logo section */}
                <div className="p-4 flex items-center justify-between border-b border-gray-800 lg:border-none">
                    <div className="flex items-center gap-3">
                        {!collapsed ? (
                            <div className="relative mb-1">
                                <img
                                    className="relative w-32 h-12 sm:w-40 sm:h-16"
                                    src={logo}
                                    alt="ConstructEasy Logo"
                                />
                            </div>
                        ) : (
                            <div className="bg-blue-500 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                                <span className="font-bold text-xl">J</span>
                            </div>
                        )}
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={toggleMobileSidebar}
                        className="text-gray-400 hover:text-white lg:hidden p-2"
                    >
                        <X size={20} />
                    </button>

                    {/* Collapse button for desktop */}
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-white hidden lg:block p-2"
                    >
                        <ChevronLeft size={20} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-1 overflow-y-auto">
                    <ul className="space-y-1 px-3 pb-6">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const isSubMenuOpen = openSubMenus[item.title];

                            return (
                                <li key={item.path} className="w-full">
                                    <div
                                        className={`
                                            flex items-center justify-between py-3 px-3 rounded-lg transition-colors cursor-pointer
                                            ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                        `}
                                        onClick={() => {
                                            if (item.subMenu) {
                                                toggleSubMenu(item.title);
                                            }
                                        }}
                                    >
                                        <Link
                                            to={item.path}
                                            className="flex items-center flex-1"
                                            onClick={(e) => {
                                                if (item.subMenu) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <span className="inline-flex">{item.icon}</span>
                                            {!collapsed && <span className="ml-3 font-medium text-sm sm:text-base">{item.title}</span>}
                                        </Link>

                                        {/* Arrow Icon */}
                                        {!collapsed && item.Chevron && (
                                            <span className={`ml-auto transform transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`}>
                                                {item.Chevron}
                                            </span>
                                        )}
                                    </div>

                                    {/* If item has subMenu */}
                                    {item.subMenu && !collapsed && (
                                        <ul className={`ml-6 mt-1 space-y-1 transition-all duration-200 ${!isSubMenuOpen ? 'hidden' : ''}`}>
                                            {item.subMenu.map((subItem) => {
                                                const isSubActive = location.pathname === subItem.path;
                                                return (
                                                    <li key={subItem.path}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`
                                                                block py-2 px-3 rounded-lg text-sm transition-colors
                                                                ${isSubActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                                                            `}
                                                        >
                                                            <div className='flex items-center'>
                                                                <span className="inline-flex mr-2 h-4 w-4 items-center">{subItem.icone}</span>
                                                                <span className="text-xs sm:text-sm">{subItem.title}</span>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm z-30 sticky top-0">
                    <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
                        <div className="flex items-center flex-1">
                            <button
                                onClick={toggleMobileSidebar}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
                                data-mobile-menu-button
                            >
                                <Menu size={20} />
                            </button>

                            {/* Desktop Search */}
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

                            {/* Mobile Search Toggle */}
                            <button
                                onClick={toggleMobileSearch}
                                className="p-2 ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 md:hidden"
                            >
                                <Search size={18} />
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <Link to={'/admin-message-monitor'} className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <MessageSquare size={18} sm:size={20} />
                            </Link>
                            <Link to={'/setting-page'} className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <Settings size={18} sm:size={20} />
                            </Link>
                            <div className="ml-2">
                                {
                                    adminProfile?.image?.length > 0 ? (
                                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-white">
                                            <img className='rounded-full h-7 w-7 sm:h-8 sm:w-8 object-cover' src={`${api.defaults.baseURL}/images/${adminProfile.image}`} alt="Admin Profile" />
                                        </div>
                                    ) : (
                                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <span className="font-medium text-xs sm:text-sm">A</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {showMobileSearch && (
                        <div className="px-4 pb-3 md:hidden border-t border-gray-200">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Nav