import React, { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';


function BankAccount() {
    const [banks] = useState(['CBE', 'ABBCINYA', 'HBRET', 'OROMIYA']);
    const [selectedBank, setSelectedBank] = useState('CBE');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing bank accounts
    useEffect(() => {

        fetchBankAccounts();
    }, []);

    const fetchBankAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/bank-accounts');
            if (response.data.status) {
                setBankAccounts(response.data.accounts);
            }
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            toast.error('Failed to load bank accounts');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!accountNumber.trim()) {
            toast.error('Please enter an account number');
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.post('/admin/add-bank-account', {
                bank_name: selectedBank,
                account_number: accountNumber
            });

            if (response.data.status) {
                toast.success('Bank account added successfully');
                setBankAccounts([...bankAccounts, response.data.account]);
                setAccountNumber('');
            } else {
                toast.error(response.data.message || 'Failed to add bank account');
            }
        } catch (error) {
            console.error('Error adding bank account:', error);
            toast.error('Failed to add bank account');
        } finally {
            setIsLoading(false);
        }
    };

    // delete bank account

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
                        const response = await api.delete(`/admin/delete-bank-account/${id}`)
                        if (response.data.status) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                            fetchBankAccounts()
                        }
                    }
                })

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="bg-white  rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Bank Accounts</h2>

            {/* Add New Account Form */}
            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Add New Account</h3>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4 items-end">
                    <div className="md:col-span-5">
                        <label className="block text-sm font-medium mb-1">Account Number</label>
                        <input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300  rounded-md "
                            placeholder="Enter your account number"
                        />
                    </div>

                    <div className="md:col-span-5">
                        <label className="block text-sm font-medium mb-1">Bank Branch</label>
                        <div className="relative">
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="appearance-none w-full p-2 border border-gray-300  bg-white  rounded-md pr-8"
                            >
                                {banks.map((bank) => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 ">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Adding...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Accounts List */}
            <div>
                <h3 className="text-lg font-medium mb-4">Compnay Bank Accounts</h3>

                {isLoading && bankAccounts.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-pulse text-gray-500">Loading accounts...</div>
                    </div>
                ) : bankAccounts.length === 0 ? (
                    <div className="bg-gray-50  rounded-md p-4 text-center">
                        <p className="text-gray-500 ">You haven't added any bank accounts yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500  uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white  divide-y divide-gray-200 ">
                                {bankAccounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-gray-50 ">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className=" bg-yellow-100  flex items-center justify-center mr-3">
                                                    <span className="text-yellow-800 px-2 py-1  font-medium text-sm">
                                                        {account.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono">{account.accountNumber}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                aria-label="Delete account"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BankAccount
