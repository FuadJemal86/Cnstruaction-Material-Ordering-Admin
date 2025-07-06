import React, { useEffect, useState } from 'react'
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Edit, Trash2, Eye, Printer, FileSpreadsheet } from "lucide-react";
import Swal from 'sweetalert2';
import { BlinkBlur } from 'react-loading-indicators'




function HardRemoveCustomer() {




    const [customer, setCustomer] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [Loading, setLoading] = useState(true)

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            FAILED: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }


    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const result = await api.get(`/admin/get-customer?page=${page}&limit=10`);
            if (result.data.status) {
                setCustomer(result.data.result);
                setPage(result.data.currentPage);
                setTotalPages(result.data.totalPages);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    };

    // print the customer table
    const handlePrint = () => {
        const printContent = document.getElementById("customer-table");
        const WindowPrt = window.open('', '', 'width=900,height=650');
        WindowPrt.document.write(`
        <html>
            <head>
                <title>Customer</title>
                <style>
                    body { font-family: Arial; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 8px; border: 1px solid #ccc; }
                    th { background: #f0f0f0; }
                </style>
            </head>
            <body>${printContent.innerHTML}</body>
        </html>
    `);
        WindowPrt.document.close();
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close();
    };

    //  export Excel file
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(customer);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Customers.xlsx");
    };

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
                        const response = await api.delete(`/admin/hard-delete-customer/${id}`)
                        if (response.data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                            fetchData()
                        }
                    }
                })

        } catch (err) {
            console.log(err)
        }
    }

    if (Loading) {
        return (
            <div className='relative w-full h-full'>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#385d38" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customers</h2>

            {/* Desktop View */}
            <div className=" overflow-x-auto" id="customer-table">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Printer />
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <FileSpreadsheet />
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customer.length > 0 ? (
                                    customer.map((c, index) => (
                                        <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 text-indigo-600 font-medium">{c.id}</td>
                                            <td className="py-4 px-4 text-gray-900">{c.name}</td>
                                            <td className="py-4 px-4 text-gray-700">{c.email}</td>
                                            <td className="py-4 px-4 text-gray-700">{c.phone}</td>
                                            <td className="py-4 px-4 text-gray-500">
                                                {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span
                                                    className="text-red-600 hover:text-red-800 cursor-pointer p-2 rounded-full transition duration-150"
                                                    onClick={() => handleDelete(c.id)}
                                                >
                                                    <Trash2 size={20} />
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            No customer found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
        </div>
    )
}

export default HardRemoveCustomer
