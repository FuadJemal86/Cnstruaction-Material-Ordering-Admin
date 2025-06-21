import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
    Users, Store, ShoppingCart, DollarSign, TrendingUp, TrendingDown,
    UserCheck, UserX, AlertTriangle, Shield, Eye, Settings,
    Package, Truck, Star, Activity, CheckCircle, XCircle, Clock,
    MoreVertical, Search, Filter
} from 'lucide-react';
import api from '../../api';

const AdminMetricCard = ({ title, value, icon: Icon, change, color, subtitle, action }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${color} shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {action && (
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
            )}
        </div>
        <div className="mt-4">
            <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(change)}%
                </div>
            </div>
            <p className="text-gray-600 text-sm mt-1">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

const ControlPanel = ({ title, icon: Icon, children, actions }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const StatusBadge = ({ status, count }) => {
    const statusConfig = {
        active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        suspended: { color: 'bg-red-100 text-red-800', icon: XCircle },
        review: { color: 'bg-blue-100 text-blue-800', icon: Eye }
    };

    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${config.color}`}>
            <Icon className="w-4 h-4" />
            <span className="capitalize">{status}</span>
            <span className="bg-white bg-opacity-50 px-2 py-0.5 rounded-full text-xs">
                {count}
            </span>
        </div>
    );
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [totalSuppliers, setTotalSuppliers] = useState();
    const [totalCustomers, setTotalCustomers] = useState();
    const [revenueDistribution, setRevenueDistribution] = useState([])
    const [activeSuppliers, setActiveSuppliers] = useState()
    const [pendingSuppliers, setPendingSuppliers] = useState()
    const [suspendedSuppliers, setSuspendedSuppliers] = useState()
    const [newCustomers, setNewCustomers] = useState()
    // Admin metrics data
    const adminMetrics = {
        totalCustomers: 15420,
        activeCustomers: 12850,
        totalRevenue: 2847500,
        totalOrders: 18450,
        disputesCases: 23,
        systemHealth: 99.2
    };


    // total supplier
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-total-supplier')

                if (result.data.status) {
                    setTotalSuppliers(result.data.totalSupplier)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])

    // total customer

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-total-customer')

                if (result.data.status) {
                    setTotalCustomers(result.data.totalCustomer)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])

    // category
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-all-category')

                if (result.data.status) {
                    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

                    const formattedData = result.data.categoryWithTotal.map((item, index) => ({
                        category: item.category,
                        totalPrice: item.totalPrice,
                        value: item.totalPrice,
                        color: colors[index % colors.length]
                    }));

                    setRevenueDistribution(formattedData)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchData()
    }, [])


    // active supplier

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-active-supplier')

                if (result.data.status) {
                    setActiveSuppliers(result.data.totalSupplier)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])


    // get pending supplier

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-pending-supplier')

                if (result.data.status) {
                    setPendingSuppliers(result.data.pendingSupplier)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])

    // rejected supplier

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-rejected-supplier')

                if (result.data.status) {
                    setSuspendedSuppliers(result.data.rejectedSupplier)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])


    // this month customer

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-new-customer')

                if (result.data.status) {
                    setNewCustomers(result.data.newCustomer)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchData()

    }, [])

    // Supplier data
    const supplierData = [
        { month: 'Jan', new: 45, approved: 38, rejected: 7, active: 680 },
        { month: 'Feb', new: 52, approved: 44, rejected: 8, active: 724 },
        { month: 'Mar', new: 38, approved: 32, rejected: 6, active: 756 },
        { month: 'Apr', new: 67, approved: 58, rejected: 9, active: 814 },
        { month: 'May', new: 41, approved: 35, rejected: 6, active: 849 },
        { month: 'Jun', new: 29, approved: 26, rejected: 3, active: 875 }
    ];

    // Customer behavior data
    const customerData = [
        { month: 'Jan', new: 1250, active: 10200, churned: 180 },
        { month: 'Feb', new: 1480, active: 11100, churned: 220 },
        { month: 'Mar', new: 1680, active: 11800, churned: 195 },
        { month: 'Apr', new: 1920, active: 12500, churned: 175 },
        { month: 'May', new: 2100, active: 13200, churned: 160 },
        { month: 'Jun', new: 1850, active: 12850, churned: 145 }
    ];


    // System performance data
    const systemPerformance = [
        { day: 'Mon', uptime: 99.8, transactions: 2450, errors: 3 },
        { day: 'Tue', uptime: 99.9, transactions: 2680, errors: 1 },
        { day: 'Wed', uptime: 98.9, transactions: 2340, errors: 8 },
        { day: 'Thu', uptime: 99.7, transactions: 2890, errors: 2 },
        { day: 'Fri', uptime: 99.9, transactions: 3200, errors: 1 },
        { day: 'Sat', uptime: 99.5, transactions: 2950, errors: 4 },
        { day: 'Sun', uptime: 99.8, transactions: 2100, errors: 2 }
    ];

    const recentSuppliers = [
        { name: 'TechVision Ltd', status: 'pending', products: 45, revenue: 12500, rating: 0, joinDate: '2024-06-20' },
        { name: 'Fashion Forward', status: 'active', products: 128, revenue: 85600, rating: 4.8, joinDate: '2024-06-18' },
        { name: 'HomeStyle Co', status: 'review', products: 67, revenue: 34200, rating: 4.2, joinDate: '2024-06-15' },
        { name: 'SportsPro Inc', status: 'suspended', products: 89, revenue: 15400, rating: 3.1, joinDate: '2024-06-10' }
    ];

    const recentCustomers = [
        { name: 'John Smith', status: 'active', orders: 12, spent: 2340, joinDate: '2024-06-19', lastActive: '2 hours ago' },
        { name: 'Sarah Johnson', status: 'active', orders: 8, spent: 1890, joinDate: '2024-06-17', lastActive: '1 day ago' },
        { name: 'Mike Chen', status: 'pending', orders: 0, spent: 0, joinDate: '2024-06-20', lastActive: 'Never' },
        { name: 'Lisa Brown', status: 'suspended', orders: 23, spent: 4560, joinDate: '2024-05-10', lastActive: '1 week ago' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 w-fit">
                    {[
                        { id: 'overview', label: 'Overview', icon: Activity },
                        { id: 'suppliers', label: 'Suppliers', icon: Store },
                        { id: 'customers', label: 'Customers', icon: Users },
                        { id: 'system', label: 'System', icon: Settings }
                    ].map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AdminMetricCard
                            title="Total Suppliers"
                            value={totalSuppliers || 0}
                            icon={Store}
                            change={8.2}
                            color="bg-blue-600"
                            subtitle={`${activeSuppliers} active`}
                        />
                        <AdminMetricCard
                            title="Total Customers"
                            value={totalCustomers || 0}
                            icon={Users}
                            change={12.5}
                            color="bg-green-600"
                            subtitle={`${newCustomers} new this month`}
                        />
                        <AdminMetricCard
                            title="Platform Revenue"
                            value={`$${(adminMetrics.totalRevenue / 1000000).toFixed(1)}M`}
                            icon={DollarSign}
                            change={15.8}
                            color="bg-purple-600"
                            subtitle="Monthly recurring"
                        />
                        <AdminMetricCard
                            title="Active Disputes"
                            value={adminMetrics.disputesCases}
                            icon={AlertTriangle}
                            change={-5.2}
                            color="bg-orange-600"
                            subtitle="Requires attention"
                        />
                    </div>

                    {/* Charts Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Growth</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={supplierData}>
                                    <defs>
                                        <linearGradient id="colorSuppliers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="active" stroke="#3B82F6" fill="url(#colorSuppliers)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={revenueDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {revenueDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(id, category) => [`${id}%`, category]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {revenueDistribution.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-gray-700">{item.category}</span>
                                        </div>
                                        <span className="font-medium text-gray-900">Birr {item.totalPrice.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Suppliers Tab */}
            {activeTab === 'suppliers' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AdminMetricCard
                            title="Active Suppliers"
                            value={activeSuppliers || 0}
                            icon={CheckCircle}
                            change={5.2}
                            color="bg-green-600"
                        />
                        <AdminMetricCard
                            title="Pending Approval"
                            value={pendingSuppliers || 0}
                            icon={Clock}
                            change={12.8}
                            color="bg-yellow-500"
                        />
                        <AdminMetricCard
                            title="Under Review"
                            value={pendingSuppliers || 0}
                            icon={Eye}
                            change={-3.1}
                            color="bg-blue-600"
                        />
                        <AdminMetricCard
                            title="Suspended"
                            value={suspendedSuppliers || 0}
                            icon={XCircle}
                            change={-8.4}
                            color="bg-red-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ControlPanel
                                title="Supplier Applications Trend"
                                icon={TrendingUp}
                                actions={
                                    <>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Filter className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                            <Search className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </>
                                }
                            >
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={supplierData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                                        <Bar dataKey="approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="rejected" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ControlPanel>
                        </div>

                        <div>
                            <ControlPanel title="Recent Suppliers" icon={Store}>
                                <div className="space-y-4">
                                    {recentSuppliers.map((supplier, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 text-sm">{supplier.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StatusBadge status={supplier.status} count={supplier.products} />
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span>${supplier.revenue.toLocaleString()}</span>
                                                    {supplier.rating > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            <span>{supplier.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </ControlPanel>
                        </div>
                    </div>
                </>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AdminMetricCard
                            title="Active Customers"
                            value={adminMetrics.activeCustomers}
                            icon={UserCheck}
                            change={8.5}
                            color="bg-green-600"
                        />
                        <AdminMetricCard
                            title="New This Month"
                            value={newCustomers}
                            icon={Users}
                            change={15.2}
                            color="bg-blue-600"
                        />
                        <AdminMetricCard
                            title="Avg Order Value"
                            value="$156"
                            icon={ShoppingCart}
                            change={7.3}
                            color="bg-purple-600"
                        />
                        <AdminMetricCard
                            title="Customer LTV"
                            value="$2,340"
                            icon={DollarSign}
                            change={12.1}
                            color="bg-indigo-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <ControlPanel title="Customer Growth & Retention" icon={TrendingUp}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={customerData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                                        <Line type="monotone" dataKey="new" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
                                        <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
                                        <Line type="monotone" dataKey="churned" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ControlPanel>
                        </div>

                        <div>
                            <ControlPanel title="Recent Customers" icon={Users}>
                                <div className="space-y-4">
                                    {recentCustomers.map((customer, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 text-sm">{customer.name}</h4>
                                                <StatusBadge status={customer.status} count={customer.orders} />
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span>${customer.spent.toLocaleString()}</span>
                                                    <span>{customer.lastActive}</span>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </ControlPanel>
                        </div>
                    </div>
                </>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AdminMetricCard
                            title="System Uptime"
                            value={`${adminMetrics.systemHealth}%`}
                            icon={Activity}
                            change={0.1}
                            color="bg-green-600"
                        />
                        <AdminMetricCard
                            title="Daily Transactions"
                            value="18.4K"
                            icon={TrendingUp}
                            change={5.8}
                            color="bg-blue-600"
                        />
                        <AdminMetricCard
                            title="System Errors"
                            value={21}
                            icon={AlertTriangle}
                            change={-15.2}
                            color="bg-red-600"
                        />
                        <AdminMetricCard
                            title="Server Load"
                            value="67%"
                            icon={Settings}
                            change={8.3}
                            color="bg-orange-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ControlPanel title="System Performance" icon={Activity}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={systemPerformance}>
                                    <defs>
                                        <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="uptime" stroke="#10B981" fill="url(#colorUptime)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ControlPanel>

                        <ControlPanel title="Security & Monitoring" icon={Shield}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-medium text-green-900">All Systems Operational</span>
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Database Health</span>
                                        <span className="text-sm font-medium text-green-600">Excellent</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">API Response Time</span>
                                        <span className="text-sm font-medium text-blue-600">145ms</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Memory Usage</span>
                                        <span className="text-sm font-medium text-orange-600">67%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </ControlPanel>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;