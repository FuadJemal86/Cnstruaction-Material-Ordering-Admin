import React, { useEffect, useState } from 'react'
import api from '../../api'
import { Link } from 'react-router-dom';
import { Printer, FileSpreadsheet } from "lucide-react";

function OnlineSupplier() {
    const [onlineSupplier, setOnlineSupplier] = useState([])

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
            }
        }

        feachData()
    }, [])


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
                        <div className='w-full overflow-x-auto border-collapse'>
                            <table className="bg-gray-100 min-w-[1200px]">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">companyName</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">phone</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">email</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">tinumber</th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">licenceNumber</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {onlineSupplier.map((order, index) => (
                                        <tr
                                            key={order.id || index}
                                            className={index % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-gray-100 hover:bg-gray-100"}
                                        >
                                            <td className="p-3 text-sm text-indigo-600 font-medium">{order.id}</td>
                                            <td className="p-3 text-sm text-gray-800">{order.companyName}</td>
                                            <td className="p-3 text-sm text-gray-800">{order.phone}</td>
                                            <td className="p-3 text-sm text-gray-800">{order.email}</td>
                                            <td className="p-3 text-sm text-gray-500">{order.tinNumber}</td>
                                            <td className="p-3 text-sm text-gray-800">{order.licenceNumber}</td>
                                        </tr>
                                    ))}
                                    {onlineSupplier.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-4 text-center text-gray-500">
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
    )
}

export default OnlineSupplier
