import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Edit, Trash2, Eye, Printer, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { BlinkBlur } from 'react-loading-indicators'


function Suppliers() {

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [suppliers, setSuppliers] = useState([]);
    const [supplierData, setSupplierData] = useState([])
    const [Loading, setLoading] = useState(true)


    const getStatusBadgeColor = (status) => {
        const statusColors = {
            Approved: "bg-green-100 text-green-800",
            Prosses: "bg-yellow-100 text-yellow-800"
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };



    useEffect(() => {

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
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [page]);






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

    // Add these state variables at the top of your component
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const handleViewDetails = (supplierId) => {
        const supplier = suppliers.find(s => s.id === supplierId);
        if (supplier) {
            setSelectedSupplier(supplier);
            setIsModalOpen(true);
            fecthDetailData(supplierId)
        }

    };

    const handleApprove = (supplierId) => {
        handleStatusChange(supplierId, "Approved");
        setIsModalOpen(false);
    };

    const handleResubmit = async (supplierId) => {
        setIsModalOpen(false);

        try {
            const resubmit = await api.post(`/admin/resubmit/${supplierId}`)

            if (resubmit.data.status) {
                toast.success(resubmit.data.message)
            } else {
                console.log(resubmit.data.message)
            }
        } catch (err) {
            console.log(err)
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
                        const response = await api.put(`/admin/delete-supplier/${id}`)
                        if (response.data.status) {
                            fetchData()
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                    }
                })

        } catch (err) {
            console.log(err)
        }
    }

    const fecthDetailData = async (supplierId) => {
        try {
            const result = await api.get(`/supplier/supplier-data/${supplierId}`)
            if (result.data.status) {
                setSupplierData(result.data.supplierData)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const [zoomedImage, setZoomedImage] = useState(null);

    const handleImageClick = (imgSrc) => {
        setZoomedImage(imgSrc);
    };

    const handleCloseZoom = () => {
        setZoomedImage(null);
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



    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suppliers</h2>

            {/* Desktop View */}
            <div className=" overflow-x-auto" id='customer-table'>
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
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tin Number</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {suppliers.length > 0 ? (
                                    suppliers.map((supplier, index) => (
                                        <tr key={supplier.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 text-indigo-600 font-medium">{supplier.id}</td>
                                            <td className="py-4 px-4 text-gray-900">{supplier.companyName}</td>
                                            <td className="py-4 px-4 text-gray-900">{supplier.email}</td>
                                            <td className="py-4 px-4 text-gray-500">{supplier.address}</td>
                                            <td className="py-4 px-4 text-gray-500">{supplier.tinNumber}</td>
                                            <td className="py-4 px-4 text-gray-500">{supplier.licenseNumber}</td>
                                            <td className="py-4 px-4 text-gray-500">
                                                {new Date(supplier.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    className={`px-3 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(supplier.isApproved ? "Approved" : "Prosses")}`}
                                                    value={supplier.isApproved ? "Approved" : "Prosses"}
                                                    onChange={(e) => handleStatusChange(supplier.id, e.target.value)}
                                                >
                                                    <option value="Prosses">Prosses</option>
                                                    <option value="Approved">Approved</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2 text-red-600 hover:text-red-800 rounded-full transition duration-150" onClick={() => handleDelete(supplier.id)}>
                                                        <Trash2 size={20} />
                                                    </button>
                                                    <button className="p-2 text-green-600 hover:text-green-800 rounded-full transition duration-150" onClick={() => handleViewDetails(supplier.id)}>
                                                        <Eye size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="py-8 text-center text-gray-500">
                                            No suppliers found
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
            {isModalOpen && selectedSupplier && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-3/4 flex flex-col">
                        {/* Modal Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Supplier Details - {selectedSupplier.companyName}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="flex-grow overflow-y-auto p-4">
                            <div className="space-y-6">
                                {/* Company Profile Image */}
                                {/* Company Profile Image */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Company Profile Image</h4>
                                    <div className="bg-gray-100 p-2 rounded">
                                        <img
                                            src={`${api.defaults.baseURL}/images/${supplierData.userImage}`}
                                            alt="Company Profile"
                                            className="w-full h-64 object-contain rounded border cursor-pointer"
                                            onClick={() => handleImageClick(`${api.defaults.baseURL}/images/${supplierData.userImage}`)}
                                        />
                                    </div>
                                </div>

                                {/* License File */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">License Document</h4>
                                    <div className="bg-gray-100 p-2 rounded">
                                        <img
                                            src={`${api.defaults.baseURL}/images/${supplierData.licenseFile}`}
                                            alt="License Document"
                                            className="w-full h-64 object-contain rounded border cursor-pointer"
                                            onClick={() => handleImageClick(`${api.defaults.baseURL}/images/${supplierData.userImage}`)}
                                        />
                                    </div>
                                </div>

                                {/* Zoomed Image Overlay */}
                                {zoomedImage && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                                        onClick={handleCloseZoom}
                                    >
                                        <img src={zoomedImage} alt="Zoomed" className="max-w-4xl max-h-full rounded shadow-lg" />
                                    </div>
                                )}

                                {/* Additional Info */}
                                <div className="bg-gray-50 p-4 rounded border">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">TIN Number</p>
                                            <p className="text-sm">{selectedSupplier.tinNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">License Number</p>
                                            <p className="text-sm">{selectedSupplier.licenseNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm">{selectedSupplier.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className={`text-sm font-medium ${selectedSupplier.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {selectedSupplier.isApproved ? 'Approved' : 'Process'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => handleResubmit(selectedSupplier.id)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Request Resubmit
                            </button>
                            <button
                                onClick={() => handleApprove(selectedSupplier.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Suppliers;
