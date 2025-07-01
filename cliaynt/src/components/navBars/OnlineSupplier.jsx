import React, { useEffect, useState } from 'react'
import api from '../../api'
import { Link } from 'react-router-dom';
import { Printer, FileSpreadsheet, Trash2 } from "lucide-react";
import { BlinkBlur } from 'react-loading-indicators'


function OnlineSupplier() {
    const [onlineSupplier, setOnlineSupplier] = useState([])
    const [Loading, setLoading] = useState(true)


    useEffect(() => {
        const feachData = async () => {
            try {
                const result = await api.get('/admin/get-online-supplier')

                if (result.data.status) {
                    setOnlineSupplier(result.data.onlineSupplier)
                } else {
                    console.log(result.data.message)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        feachData()
    }, [])

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
        const printContent = document.getElementById("online-supplier-table");
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
        <div>
            <div>
                <div className="p-4 mt-16 bg-white rounded-lg shadow " id='product-table'>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Online Supplier</h2>

                    <div className="overflow-x-auto" id='online-supplier-table'>

                        <div className='flex justify-end gap-2'>
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

                        </div>
                        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIN Number</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {onlineSupplier.length > 0 ? (
                                            onlineSupplier.map((order, index) => (
                                                <tr key={order.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="py-4 px-4 text-indigo-600 font-medium">{order.id}</td>
                                                    <td className="py-4 px-4 text-gray-900">{order.companyName}</td>
                                                    <td className="py-4 px-4 text-gray-700">{order.phone}</td>
                                                    <td className="py-4 px-4 text-gray-700">{order.email}</td>
                                                    <td className="py-4 px-4 text-gray-500">{order.tinNumber}</td>
                                                    <td className="py-4 px-4 text-gray-700">{order.licenseNumber}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span
                                                                onClick={() => handleDelete(order.id)}  // Make sure handleDelete is defined
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
                                                <td colSpan="7" className="py-8 text-center text-gray-500">
                                                    No online supplier found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnlineSupplier
