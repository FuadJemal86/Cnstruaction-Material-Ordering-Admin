import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Edit, Trash2, Eye } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function Suppliers() {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [suppliers, setSuppliers] = useState([]);

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Approved: "bg-green-100 text-green-800",
            Prosses: "bg-yellow-100 text-yellow-800"
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await api.get(`/admin/get-supplier?page=${page}&limit=10`);
            if (result.data.status) {
                setSuppliers(result.data.result);
                setPage(result.data.currentPage);
                setTotalPages(result.data.totalPages);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };


    // Function to update status
    const handleStatusChange = async (supplierId, currentStatus) => {
        const newStatus = currentStatus == "Approved" ? true : false; // Toggle status
        try {
            const result = await api.put(`/admin/update-supplier-status/${supplierId}`, { isApproved: newStatus });

            if (result.data.status) {
                fetchData();
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
        const ws = XLSX.utils.json_to_sheet(suppliers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "suppliers");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Customers.xlsx");
    };


    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suppliers</h2>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto" id='customer-table'>
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
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Tin Number</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Licence Number</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">DATE</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier, index) => (
                            <tr key={supplier.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="p-3 text-sm text-indigo-600 font-medium">{supplier.id}</td>
                                <td className="p-3 text-sm text-gray-800">{supplier.companyName}</td>
                                <td className="p-3 text-sm text-gray-800">{supplier.email}</td>
                                <td className="p-3 text-sm text-gray-500">{supplier.address}</td>
                                <td className="p-3 text-sm text-gray-500">{supplier.tinNumber}</td>
                                <td className="p-3 text-sm text-gray-500">{supplier.licenseNumber}</td>
                                <td className="p-3 text-sm text-gray-500">
                                    {new Date(supplier.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).replace(' ', '.')}
                                </td>

                                <td className="p-3 text-sm">
                                    <select
                                        className={`px-2 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(supplier.isApproved ? "Approved" : "Prosses")}`}
                                        value={supplier.isApproved ? "Approved" : "Prosses"}
                                        onChange={(e) => handleStatusChange(supplier.id, e.target.value)}
                                    >
                                        <option value="Prosses">Prosses</option>
                                        <option value="Approved">Approved</option>
                                    </select>
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
                        {suppliers.length === 0 && (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">No suppliers found</td>
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

                {suppliers.map((supplier, index) => (
                    <div key={supplier.id || index} className="border rounded-lg overflow-hidden">
                        <div className="p-3 border-b bg-gray-50 flex justify-between">
                            <span className="font-medium text-indigo-600">{supplier.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(supplier.isApproved ? "Approved" : "Prosses")}`}>
                                {supplier.isApproved ? "Approved" : "Prosses"}
                            </span>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Company:</span>
                                <span className="text-sm col-span-2">{supplier.companyName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Email:</span>
                                <span className="text-sm col-span-2">{supplier.email}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 mb-2">
                                <span className="text-xs text-gray-500">Address:</span>
                                <span className="text-sm col-span-2">{supplier.address}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">TIN Number:</span>
                                <span className="text-sm col-span-2 font-medium">{supplier.tinNumber}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <span className="text-xs text-gray-500">Licence Number:</span>
                                <span className="text-sm col-span-2 font-medium">{supplier.licenseNumber}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {suppliers.length === 0 && (
                    <div className="text-center p-4 border rounded-lg text-gray-500">
                        No suppliers found
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
    );
}

export default Suppliers;
