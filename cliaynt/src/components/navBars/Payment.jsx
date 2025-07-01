import React, { useEffect, useState } from 'react'
import { Edit, Trash2, Eye, Printer, FileSpreadsheet } from "lucide-react";
import api from '../../api';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast'
import { BlinkBlur } from 'react-loading-indicators'



function Payment() {

    const [payment, setPayment] = useState([])
    const [detailPayment, setPaymentDetail] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusState, setStatusState] = useState({
        status: ''
    })
    const [Loading, setLoading] = useState(true)

    const getStatusBadgeColor = (status) => {
        const statusColors = {
            COMPLETED: "bg-green-100 text-green-800",
            PAYED: "bg-green-100 text-green-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            FAILED: "bg-red-100 text-red-800"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    }



    const fetchData = async (page = 1) => {
        try {
            const result = await api.get(`/admin/get-payment?page=${page}&limit=10`);
            if (result.data.status) {
                setPayment(result.data.payments);
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



    useEffect(() => {
        fetchData(1);
    }, [page]);

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
        const ws = XLSX.utils.json_to_sheet(payment);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "payment");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Customers.xlsx");
    };

    const handleDetilPayment = async (transactionId) => {

        try {
            const result = await api.get(`/admin/get-detil-paymen/${transactionId}`)

            if (result.data.status) {
                setIsModalOpen(true)
                setPaymentDetail(result.data.paymentDetail)
            } else {
                console.log(result.data.message)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
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

    const handleStatus = async (newStatus, id) => {
        try {
            const result = await api.put(`/admin/update-payment-status/${id}`, {
                ...statusState,
                status: newStatus
            });
            if (result.data.status) {
                setStatusState({ status: newStatus });
                toast.success(result.data.message);
                fetchData();
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };

    const handlePayedStatus = async (newStatus, id) => {
        try {
            const result = await api.put(`/admin/update-payed-status/${id}`, {
                ...statusState,
                payedStatus: newStatus
            });
            if (result.data.status) {
                setStatusState({ status: newStatus });
                toast.success(result.data.message);
                fetchData();
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
    };



    return (
        <div className="p-4 mt-16 bg-white rounded-lg shadow ">
            <Toaster position="top-center" reverseOrder={false} />
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment</h2>

            {/* Desktop View */}
            <div className=" md:block overflow-x-auto">
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
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">service</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Transaction</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payed Status</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payment.length > 0 ? (
                                    payment.map((c, index) => (
                                        <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="py-4 px-4 text-indigo-600 font-medium">{c.id}</td>
                                            <td className="py-4 px-4 text-gray-900">{c.customer.name}</td>
                                            <td className="py-4 px-4 text-gray-900 font-medium">Birr {c.totalPrice}</td>
                                            <td className="py-4 px-4 text-gray-900 font-medium">Birr {c.service}</td>
                                            <td className="py-4 px-4 text-gray-900">{c.bank.name} - {c.bank.accountNumber}</td>
                                            <td className="py-4 px-4 text-gray-900">{c.bankTransactionId}</td>
                                            <td className="py-4 px-4 text-gray-900">{c.customer.phone}</td>
                                            <td className="py-4 px-4 text-gray-500">
                                                {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                }).replace(' ', '.')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    value={c.status}
                                                    onChange={e => handleStatus(e.target.value, c.id)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(c.status)}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                    <option value="FAILED">FAILED</option>
                                                    <option value="REFUNDED">REFUNDED</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    value={c.payedStatus}
                                                    onChange={e => handlePayedStatus(e.target.value, c.id)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium outline-none ${getStatusBadgeColor(c.payedStatus)}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="PAYED">PAYED</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center">
                                                    <span onClick={() => handleDetilPayment(c.transactionId)} className="p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 transition duration-150">
                                                        <Eye size={20} />
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="py-8 text-center text-gray-500">
                                            No payments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg w-96 md:w-3/4 lg:w-3/5 h-3/4 flex flex-col">
                            {/* Header - Fixed */}
                            <div className="p-4 border-b flex-shrink-0">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold">Payment Detail #{detailPayment.paymentInfo?.id}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="flex-grow overflow-auto">
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Info</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Trans ID</th>
                                                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailPayment.orderDetails?.map((order, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-100 hover:bg-gray-100"}>
                                                    <td className="p-3 text-sm">{detailPayment.paymentInfo?.id}</td>
                                                    <td className="p-3 text-sm">{order.customer.name}</td>
                                                    <td className="p-3 text-sm">{order.customer.phone}</td>
                                                    <td className="p-3 text-sm">{order.supplier.companyName}</td>
                                                    <td className="p-3 text-sm">
                                                        {order.supplier.bank[0]?.bankName} {order.supplier.bank[0]?.account}
                                                    </td>
                                                    <td className="p-3 text-sm">{detailPayment.paymentInfo?.bankTransactionId}</td>
                                                    <td className="p-3 text-sm font-medium">birr {order.totalPrice}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Screenshot */}
                                <div className="p-4 border-t">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium mb-2">Payment Screenshot</h3>
                                        <div className="bg-gray-100 p-2 rounded">
                                            <img src={`http://localhost:3032/images/${detailPayment.paymentInfo.image}`}
                                                alt="Payment Screenshot" className="w-full h-auto rounded" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total - Fixed at bottom */}
                            <div className="p-4 bg-gray-50 border-t flex-shrink-0">
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium mr-8">Total Amount:</span>
                                            <span className="font-bold">
                                                birr {detailPayment.orderDetails?.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Fixed */}
                            <div className="p-4 border-t flex justify-end flex-shrink-0">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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

export default Payment
