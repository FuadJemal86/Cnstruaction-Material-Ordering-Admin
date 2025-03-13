import React, { useEffect, useState } from 'react'
import { Edit, Trash2, Eye } from "lucide-react";
import api from '../../api';

function Payment() {

    const [payment , setPayment] = useState([])
    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Completed: "bg-green-100 text-green-800",
            Processing: "bg-blue-100 text-blue-800",
            Pending: "bg-yellow-100 text-yellow-800",
            Cancelled: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }

    useEffect(() => {
            fetchData();
        }, []);
    
        const fetchData = async () => {
            try {
                const result = await api.get('/admin/get-payment');
                if (result.data.status) {
                    setPayment(result.data.result);
                } else {
                    console.log(result.data.message);
                }
            } catch (err) {
                console.log(err);
            }
        };
    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product</h2>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payment.map((c, index) => (
                                <tr
                                    key={c.id || index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                    <td className="p-3 text-sm text-gray-800">{c.bank}</td>
                                    <td className="p-3 text-sm text-gray-800">{c.createdAt}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                    <div className="flex space-x-1">
                                        <button className="p-2 text-blue-600 rounded-l">
                                            <Edit size={20} />
                                        </button>
                                        <button className="p-2 text-red-600 rounded-lg">
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="p-2 text-blue-600 rounded-l">
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </td>
                                </tr>
                            ))}
                            {payment.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        No product found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                    {payment.map((c, index) => (
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
                                    <span className="text-sm col-span-2">{c.customer}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    <span className="text-xs text-gray-500">Address:</span>
                                    <span className="text-sm col-span-2">{c.address}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 mb-2">
                                    <span className="text-xs text-gray-500">Date:</span>
                                    <span className="text-sm col-span-2">{c.date}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                    <span className="text-xs text-gray-500">Total:</span>
                                    <span className="text-sm col-span-2 font-medium">{c.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {payment.length === 0 && (
                        <div className="text-center p-4 border rounded-lg text-gray-500">
                            No orders found
                        </div>
                    )}
                </div>
            </div>
    )
}

export default Payment
