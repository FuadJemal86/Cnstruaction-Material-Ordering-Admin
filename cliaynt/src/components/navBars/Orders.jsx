import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';

function Orders({ orders = [] }) {

    const [statusState, setStatusState] = useState({
        status: ''
    })

    const [order, setOrder] = useState([])

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            CANSELLED: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    useEffect(() => {

        feacheOrder()
    }, [])

    const feacheOrder = async () => {
        try {
            const result = await api.get('/admin/get-order')
            if (result.data.status) {
                setOrder(result.data.result)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleStatus = async (newStatus, id) => {
        try {
            const result = await api.put(`/admin/update-order-status/${id}`, {
                ...statusState,
                status: newStatus
            });
            if (result.data.status) {
                setStatusState({ status: newStatus });
                toast.success(result.data.message);
                feacheOrder();
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orders</h2>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((c, index) => (
                            <tr
                                key={c.id || index}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                <td className="p-3 text-sm text-gray-800">{c.customer.name}</td>
                                <td className="p-3 text-sm text-gray-800">
                                    <span className={` ${c.address && c.address.length > 0}` ? 'bg-green-100 px-2 py-1 rounded-full text-green-800' : 'bg-red-100 px-2 py-1 rounded-full text-green-800'}>
                                        {c.address && c.address.length > 0 ? c.address : 'not delivery'}
                                    </span>
                                </td>

                                <td className="p-3 text-sm text-gray-500">
                                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).replace(' ', '.')}
                                </td>

                                <td className="p-3 text-sm text-gray-800 font-medium">birr {c.totalPrice}</td>
                                <td className="p-3 text-sm">
                                    <select
                                        value={c.status || "PROCESSING"} // ✅ Ensure default value if undefined
                                        onChange={e => handleStatus(e.target.value, c.id)}
                                        className={`px-2 py-1 rounded-full text-xs font-medium outline-none} ${getStatusBadgeColor(c.status)}`}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>

                            </tr>
                        ))}
                        {order.length == 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                {order.map((c, index) => (
                    <div key={c.id || index} className="border rounded-lg overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex justify-between">
                            <span className="font-medium text-indigo-600">{c.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(c.status)}`}>
                                {c.status}
                            </span>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Customer:</span>
                                <span className="text-sm col-span-2">{c.customer.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Address:</span>
                                <span className="text-sm col-span-2">{c.address}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Date:</span>
                                <span className="text-sm col-span-2">{c.createdAt}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">Total:</span>
                                <span className="text-sm col-span-2 font-medium">{c.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {order.length === 0 && (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                        No orders found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders
