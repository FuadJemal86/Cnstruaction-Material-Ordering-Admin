import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import api from '../../api';
import { Trash2 } from 'lucide-react';

function Zone() {

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Approved: "bg-green-100 text-green-800",
            Prosses: "bg-yellow-100 text-yellow-800"
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };


    const [address, setAddress] = useState([])

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get('/admin/get-address')

                if (result.data.status) {
                    setAddress(result.data.result)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachData()
    }, [])

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suppliers</h2>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <div className='flex justify-end m-1'>
                    <Link to={'/admin-page/add-zone'} className='bg-sky-900 py-2 px-2 rounded-lg text-yellow-50'>
                        Add Zone
                    </Link>
                </div>
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Zone Services</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {address.map((c, index) => (
                            <tr key={c.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                <td className="p-3 text-sm text-gray-800">{c.address}</td>
                                <td>
                                    <div className="flex space-x-1">
                                        <button className="p-2 text-red-600 rounded-lg">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {address.length === 0 && (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">No category found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                {address.map((c, index) => (
                    <div key={c.id || index} className="border rounded-lg overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex justify-between">
                            <span className="font-medium text-indigo-600">{c.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(c.isApproved ? "Approved" : "Prosses")}`}>
                                {address.isApproved ? "Approved" : "Prosses"}
                            </span>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Company:</span>
                                <span className="text-sm col-span-2">{c.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {address.length === 0 && (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                        No category found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Zone
