import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from '../imags/logo constraction.jpeg'
import { AlignLeft, MoreVertical, Eye, Package, ShoppingCart, Box, CreditCard, MessageCircle, AlertCircle, Bell } from "lucide-react";


function Nav() {
    return (
        <div className='flex'>
            <div className="bg-slate-200/50 backdrop-blur-md shadow-sm fixed right-0 left-64 h-11 flex items-center">
                <header className='w-full'>
                    <div className='flex'>
                        <div className='w-full'>
                            <button className='p-2'>
                                <AlignLeft size={24} />
                            </button>
                        </div>

                        <div className='flex text-right'>
                            <div className='text-right'>
                                <div>
                                    <button className='p-2'>
                                        <Bell size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className='text-right'>
                                <div>
                                    <button className='p-2'>
                                        <MoreVertical size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </header>
            </div>

            <div>
                <div className='bg-gray-900 w-64 h-screen z-[1000] '>
                    <div className='p-2'>
                        <div className='p-4 mt-4 mb-4 border rounded-2xl border-gray-700 flex items-center gap-2'>
                            <span className='bg-white rounded-full'><img className='w-11 h-11' src={logo} alt="" srcset="" /></span>
                            <div className='font-semibold text-gray-200 text-2xl'>Admin Page</div>
                        </div>
                        <nav className='pl-8 pt-7'>
                            <ul className='text-gray-300 grid gap-4 text-left'>
                                <li className='hover:bg-slate-700 hover:text-white w-full p-1 transition cursor-pointer rounded-md'><Link className='w-full pl-1'>Overview</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link to={'order'} className='w-full pl-1'>Orders</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link to={'supplier'} className='w-full pl-1'>Suppliers</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link to={'customer'} className='w-full pl-1'>Customer</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link  to={'payment'} className='w-full pl-1'>Payments</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link className='w-full pl-1'>Category</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link className='w-full pl-1'>Zone Servic</Link></li>
                                <li className='hover:bg-slate-700 w-full p-1 transition cursor-pointer rounded-md hover:text-white'><Link className='w-full pl-1'>Messages & Complaints</Link></li>
                            </ul>
                        </nav>
                    </div>
                </div>
                
            </div>
            <div className="flex-1 p-4 custom-scrollbar bg-gray-50">
                    <Outlet/>
                </div>
        </div>
    )
}

export default Nav
