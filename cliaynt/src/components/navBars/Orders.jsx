import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Edit, Trash2, Eye } from "lucide-react";
import Swal from 'sweetalert2';


function Orders({ orders = [] }) {

    const [statusState, setStatusState] = useState({
        status: ''
    })
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [order, setOrder] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [orderItem, setOrderItem] = useState([])

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
            const result = await api.get(`/admin/get-order?page=${page}&limit=10`)
            if (result.data.status) {
                setOrder(result.data.result)
                setPage(result.data.currentPage);
                setTotalPages(result.data.totalPages);
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
        const ws = XLSX.utils.json_to_sheet(customer);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Customers.xlsx");
    };

    const handleOpen = async (id) => {

        if (!isModalOpen) {
            setIsModalOpen(true)
        } else {
            setIsModalOpen(false)
        }

        try {
            const result = await api.get(`/admin/get-order-item/${id}`)

            if (result.data.status) {
                setOrderItem(result.data.orderItem)
            } else {
                console.log(err)
            }
        } catch (err) {
            console.log(err)
        }

    }


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
                        const response = await api.delete(`/admin/delete-order/${id}`)
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
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orders</h2>

            {/* Desktop View */}
            <div>
                <div className="" id='customer-table'>
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
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Phone</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier Phone</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Dilivery</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Order Item</th>
                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
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
                                    <td className="p-3 text-sm text-gray-800">{c.customer.phone}</td>
                                    <td className="p-3 text-sm text-gray-800">{c.supplier.companyName}</td>
                                    <td className="p-3 text-sm text-gray-800">{c.supplier.phone}</td>
                                    <td className="p-3 text-sm text-gray-800">
                                        <span className={` ${c.address && c.address.length > 0}` ? 'bg-green-100 px-2 py-1 rounded-full text-green-800' : 'bg-red-100 px-2 py-1 rounded-full text-green-800'}>
                                            {c.address && c.address.length > 0 ? c.address : 'No'}
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
                                            value={c.status || "PROCESSING"}
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
                                    <td className="p-3 text-sm text-gray-800">
                                        <span onClick={e => handleOpen(c.id)} className='text-blue-600 cursor-pointer'>
                                            <Eye />
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm  text-red-600">
                                        <span onClick={e => handleDelete(c.id)} className='cursor-pointer'>
                                            <Trash2 />
                                        </span>
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

            {isModalOpen && (
                <div className="hidden md:flex h-auto fixed inset-0 bg-gray-600 bg-opacity-50 justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-96 md:w-3/4 lg:w-3/5 h-auto flex flex-col">
                        <div className=' p-4 flex-shrink-0 border-b'>
                            <h2 className="text-xl font-bold mb-4">Order Items for Order</h2>
                        </div>
                        <table className=" overflow-auto flex-grow">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Customer</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Product Name</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Category</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Quantity</th>
                                    <th className="p-3 text-left text-xs font-medium text-gray-500">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orderItem.map(c => (
                                        <tr key={c.id}>
                                            <td className="p-3 text-sm">{c.order.customer.name}</td>
                                            <td className="p-3 text-sm">{c.product.name}</td>
                                            <td className="p-3 text-sm">{c.product.category.category}</td>
                                            <td className="p-3 text-sm">{c.quantity}</td>
                                            <td className="p-3 text-sm">{c.unitPrice}</td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>
                        <button onClick={() => setIsModalOpen(false)} className="mt-4 m-2 w-1/5 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders
