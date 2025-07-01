import React, { useEffect, useState } from 'react'
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Recycle, Printer, FileSpreadsheet } from "lucide-react";
import Swal from 'sweetalert2';
import { BlinkBlur } from 'react-loading-indicators'


function RemovedCustomer() {

    const [removedCustomer, setRemovedCustomer] = useState([])
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [Loading, setLoading] = useState(true)


    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const result = await api.get(`/admin/removed-customer?page=${page}&limit=10`);
            if (result.data.status) {
                setRemovedCustomer(result.data.result);
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

    if (Loading) {
        return (
            <div className='relative w-full h-full'>
                <div className="absolute inset-0 flex justify-center items-center text-center bg-white/70 z-30">
                    <BlinkBlur color="#385d38" size="medium" text="" textColor="" />
                </div>
            </div>
        )
    }
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

    const handleRecover = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                const response = await api.put(`/admin/recycle-customer/${id}`);
                if (response.data.status) {
                    await Swal.fire({
                        title: "Recycled!",
                        text: "Customer file has been recycled.",
                        icon: "success",
                    });
                    fetchData();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };



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
                                    {["Id", "Name", "Email", "Phone", "Date", "Action"].map(header => (
                                        <th key={header} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {removedCustomer.length > 0 ? removedCustomer.map((c, index) => (
                                    <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="py-4 px-4 text-indigo-600 font-medium">{c.id}</td>
                                        <td className="py-4 px-4 text-gray-900">{c.name}</td>
                                        <td className="py-4 px-4 text-gray-900">{c.email}</td>
                                        <td className="py-4 px-4 text-gray-500">{c.phone}</td>
                                        <td className="py-4 px-4 text-gray-500">
                                            {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            }).replace(' ', '.')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <span onClick={() => handleRecover(c.id)} className="text-blue-600 hover:text-blue-800 cursor-pointer p-2 rounded-full transition duration-150">
                                                    <Recycle size={20} />
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            No removed customers found
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

export default RemovedCustomer
