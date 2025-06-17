import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from "lucide-react";
import api from '../../api';
import Swal from 'sweetalert2';



function Category() {

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Approved: "bg-green-100 text-green-800",
            Prosses: "bg-yellow-100 text-yellow-800"
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };


    const [category, setCategory] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {

        const feachData = async () => {
            try {
                const result = await api.get(`/admin/get-category/?page=${page} && limit=10`)

                if (result.data.status) {
                    setCategory(result.data.result)
                    setTotalPages(result.data.totalPages);
                    setPage(result.data.currentPage);
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            }
        }

        feachData()
    }, [page])

    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            })

                .then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await api.delete(`/admin/delete-category/${id}`)
                        if (response.data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                            feacheOrder()
                        }
                    }
                })

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Category</h2>

            {/* Desktop View */}
            <div className=" overflow-x-auto">
                <div className='flex justify-end m-1'>
                    <Link to={'/admin-page/add-category'} className='bg-sky-900 py-2 px-2 rounded-lg text-yellow-50'>
                        Add Category
                    </Link>
                </div>
                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {category.length > 0 ? (
                                    category.map((supplier, index) => (
                                        <tr key={supplier.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 text-indigo-600 font-medium">{supplier.id}</td>
                                            <td className="py-4 px-4 text-gray-900">{supplier.category}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        onClick={() => handleDelete(supplier.id)}
                                                        className="text-red-600 hover:text-red-800 cursor-pointer p-2 rounded-full transition duration-150"
                                                    >
                                                        <Trash2 size={20} />
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-gray-500">
                                            No category found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(num => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-1 border rounded ${num === page ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'
                            } hover:bg-indigo-100`}
                    >
                        {num}
                    </button>
                ))}

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Category
