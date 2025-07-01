import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import api from '../../api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Edit, Trash2, Eye, Printer, FileSpreadsheet } from "lucide-react";
import Swal from 'sweetalert2';
import { BlinkBlur } from 'react-loading-indicators'


function Orders({ orders = [] }) {
    const [statusState, setStatusState] = useState({
        status: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [order, setOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderItem, setOrderItem] = useState([]);
    const [Loading, setLoading] = useState(true)


    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            SHIPPED: "bg-indigo-100 text-indigo-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            DELIVERED: "bg-purple-100 text-purple-800",
            CANCELLED: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };



    useEffect(() => {
        feacheOrder();
    }, [page]);

    const feacheOrder = async () => {
        try {
            const result = await api.get(`/admin/get-order?page=${page}&limit=10`);
            if (result.data.status) {
                setOrder(result.data.result);
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
            toast.error(err.response?.data?.message || 'An error occurred');
        }
    };

    // Print the orders table
    const handlePrint = () => {
        const printContent = document.getElementById("orders-table");
        const WindowPrt = window.open('', '', 'width=900,height=650');
        WindowPrt.document.write(`
            <html>
                <head>
                    <title>Orders</title>
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

    // Export Excel file
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(order);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Orders");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Orders.xlsx");
    };

    const handleOpen = async (id) => {
        setIsModalOpen(!isModalOpen);

        try {
            const result = await api.get(`/admin/get-order-item/${id}`);
            if (result.data.status) {
                setOrderItem(result.data.orderItem);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        }
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
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await api.delete(`/admin/delete-order/${id}`);
                    if (response.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "The order has been deleted.",
                            icon: "success"
                        });
                        feacheOrder();
                    }
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Orders Management</h2>

            {/* Desktop View */}
            <div className="overflow-x-auto" id="orders-table">
                <div className="flex justify-end mb-4 gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Phone</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Phone</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.length > 0 ? (
                                    order.map((c, index) => (
                                        <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 text-indigo-600 font-medium">{c.id}</td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm font-medium text-gray-900">{c.customer.name}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-gray-900">{c.customer.phone}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm font-medium text-gray-900">{c.supplier.companyName}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-gray-900">{c.supplier.phone}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${c.address && c.address.length > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {c.address && c.address.length > 0 ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-500">
                                                {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm font-medium text-gray-900">birr {c.totalPrice}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    value={c.status || "PENDING"}
                                                    onChange={e => handleStatus(e.target.value, c.id)}
                                                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${getStatusBadgeColor(c.status)}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleOpen(c.id)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                                                        title="View Order Items"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="py-8 px-4 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <div className="text-lg font-medium text-gray-400 mb-2">No orders found</div>
                                                <div className="text-sm text-gray-400">Orders will appear here once they are created</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(num => (
                        <button
                            key={num}
                            onClick={() => setPage(num)}
                            className={`px-3 py-1 border rounded transition-colors ${num === page
                                ? 'bg-indigo-500 text-white border-indigo-500'
                                : 'bg-white text-gray-700 hover:bg-indigo-100'
                                }`}
                        >
                            {num}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded bg-white text-gray-700 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Order Items Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[80vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Order Items Details</h2>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-hidden">
                            <div className="overflow-x-auto overflow-y-auto h-full">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orderItem.length > 0 ? (
                                            orderItem.map((item, index) => (
                                                <tr key={item.id || index} className="hover:bg-gray-50">
                                                    <td className="py-4 px-4 text-sm text-gray-900">{item.order.customer.name}</td>
                                                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.product.name}</td>
                                                    <td className="py-4 px-4 text-sm text-gray-500">{item.product.category.category}</td>
                                                    <td className="py-4 px-4 text-sm text-gray-900">{item.quantity}</td>
                                                    <td className="py-4 px-4 text-sm text-gray-900">birr {item.unitPrice}</td>
                                                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                                        birr {(item.quantity * item.unitPrice).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                                                    No order items found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Responsive Modal */}
            <div className="md:hidden">
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 px-4">
                        <div className="bg-white p-4 rounded-lg w-full max-w-sm max-h-[90vh] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-4 text-center">Order Items</h2>

                            <div className="space-y-3">
                                {orderItem.map((item, index) => (
                                    <div key={item.id || index} className="border border-gray-200 rounded-lg p-3">
                                        <div className="text-sm font-medium text-gray-900 mb-1">{item.product.name}</div>
                                        <div className="text-xs text-gray-500 mb-2">{item.product.category.category}</div>
                                        <div className="flex justify-between text-sm">
                                            <span>Qty: {item.quantity}</span>
                                            <span>Price: birr {item.unitPrice}</span>
                                        </div>
                                        <div className="text-sm font-medium text-right mt-1">
                                            Total: birr {(item.quantity * item.unitPrice).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;