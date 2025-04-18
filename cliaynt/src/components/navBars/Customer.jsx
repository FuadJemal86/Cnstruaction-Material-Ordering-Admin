import React, { useEffect, useState } from 'react'
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function Customer() {



    const [customer, setCustomer] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
    }, []);

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

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customers</h2>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto" id="customer-table">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        🖨️ Print
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        📥 Excel
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customer.map((c, index) => (
                            <tr
                                key={c.id || index}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="p-3 text-sm text-indigo-600 font-medium">{c.id}</td>
                                <td className="p-3 text-sm text-gray-800">{c.name}</td>
                                <td className="p-3 text-sm text-gray-800">{c.email}</td>
                                <td className="p-3 text-sm text-gray-500">{c.phone}</td>
                                <td className="p-3 text-sm text-gray-500">
                                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).replace(' ', '.')}
                                </td>
                            </tr>
                        ))}
                        {customer.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No product found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => fetchData(page - 1)}
                        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(num => (
                        <button
                            key={num}
                            onClick={() => fetchData(num)}
                            className={`px-3 py-1 border rounded ${num === page ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'
                                } hover:bg-indigo-100`}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => fetchData(page + 1)}
                        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        🖨️ Print
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        📥 Excel
                    </button>
                </div>
                {customer.map((c, index) => (
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
                                <span className="text-sm col-span-2">{c.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Email:</span>
                                <span className="text-sm col-span-2">{c.email}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Phone:</span>
                                <span className="text-sm col-span-2">{c.phone}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">Date:</span>
                                <span className="text-sm col-span-2 font-medium">{new Date(c.createdAt).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                }).replace(' ', '.')}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {customer.length === 0 && (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                        No orders found
                    </div>
                )}
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => fetchData(page - 1)}
                        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(num => (
                        <button
                            key={num}
                            onClick={() => fetchData(num)}
                            className={`px-3 py-1 border rounded ${num === page ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'
                                } hover:bg-indigo-100`}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => fetchData(page + 1)}
                        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Customer
