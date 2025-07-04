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
} from "lucide-react";
import api from '../../api';
import logo from '../imags/jejan.svg'
import adminValidation from '../hookes/adminVerfication';



function Nav() {
    adminValidation()
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminProfile, setAdminProfile] = useState({})
    const location = useLocation();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen);
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
                        {!collapsed ? (
                            <div className="relative mb-1">
                                <img
                                    className="relative w-40 h-16"
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
                            const isSubMenuOpen = openSubMenus[item.title];

                            return (
                                <li key={item.path} className="w-full">

                                    <Link
                                        to={item.path}
                                        className={`
                                        flex items-center justify-between py-3 px-3 rounded-lg transition-colors
                                        ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                                    `}
                                    >
                                        <div className="flex items-center">
                                            <span className="inline-flex">{item.icon}</span>
                                            {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                                        </div>

                                        {/* Arrow Icon */}
                                        {!collapsed && item.Chevron && (
                                            <span className={`ml-auto transform transition-transform ${isSubMenuOpen ? 'rotate-90' : ''}`} onClick={item.subMenu ? () => toggleSubMenu(item.title) : undefined} >
                                                {item.Chevron}
                                            </span>
                                        )}
                                    </Link>

                                    {/* If item has subMenu */}
                                    {item.subMenu && !collapsed && (
                                        <ul className={`ml-8 mt-1 space-y-1 ${!isSubMenuOpen ? 'hidden' : ''}`}>
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
                                                                <span className="inline-flex mr-2 h-5 w-5 items-center">{subItem.icone}</span>
                                                                <span>{subItem.title}</span>
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

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-20 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

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
                            <Link to={'/admin-message-monitor'} className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <MessageSquare size={20} />
                            </Link>
                            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                                <Link to={'/setting-page'}><Settings size={20} /></Link>
                            </button>
                            <div className="ml-2">
                                {
                                    adminProfile?.image?.length > 0 ? (
                                        <div className="h-8 w-8 rounded-full  flex items-center justify-center text-white">
                                            <span className="font-medium text-sm "><img className='rounded-full h-8 w-8' src={`${api.defaults.baseURL}/images/${adminProfile.image}`} alt="" srcset="" /></span>
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <span className="font-medium text-sm">A</span>
                                        </div>
                                    )
                                }

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