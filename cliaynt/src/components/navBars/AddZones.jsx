import React, { useState } from 'react'
import api from '../../api'
import toast, { Toaster } from 'react-hot-toast'

function AddZones() {

    const [zone, setZone] = useState({
        address: ""
    })

    const handelSubmit = async(c) => {
        c.preventDefault()

        const {address} = zone

        if(!address) {
            return toast.error('fill the form')
        }

        try {
            const result  = await api.post('/admin/add-address',zone) 

            if(result.data.status) {
                toast.success(result.data.message)
            } else {
                toast.error(result.data.message)
            }
        } catch(err) {
            console.log(err)
            toast.error(err.response.data.message)
        }

    }
    return (
        <div>
            <div className="flex justify-center items-center p-6 bg-gray-50 mt-6">
            <Toaster position="top-center" reverseOrder={false} />
                <form onSubmit={handelSubmit}>
                    <div className="w-96 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-center mb-6 text-indigo-800">Add Zone Service</h2>

                        <div className="space-y-5">
                            <div className="group">
                                <input
                                    onChange={e => setZone({ ...zone, address: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-indigo-400 focus:outline-none transition-colors"
                                    placeholder="Name"
                                />
                            </div>

                            <button className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200">
                                Add Now
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default AddZones
