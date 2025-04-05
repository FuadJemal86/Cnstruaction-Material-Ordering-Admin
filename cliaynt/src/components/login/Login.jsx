import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../imags/logo constraction.jpeg'
import banner from '../imags/login banner.jpg'
import api from '../../api';

function Login() {


    const navigate = useNavigate()
    const [admin, setAdmin] = useState({
        email: "",
        password: ""
    })


    const handelSubmit = async (e) => {

        e.preventDefault();

        const { email, password } = admin

        if (!email || !password) {
            return toast.error('Please fill all fields!')
        }

        try {
            const result = await api.post('/admin/login', admin)

            if (result.data.loginStatus) {
                navigate('/admin-page')
            } else {
                toast.error(result.data.message || 'Signup failed!');
            }
        } catch (err) {
            console.log(err)
            toast.error(err.response.data.message)
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen gap-32">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="grid gap-5 text-center ml-52">
                <div className="grid items-center">
                    <img className="w-24 h-24 mx-auto dark:bg-white rounded-full" src={logo} alt="Logo" />
                    <span className="text-xl font-bold font-poppins ">ConstructEasy</span>
                </div>

                <div className="grid gap-1">
                    <span className="text-3xl font-bold font-poppins">Welcome Admin!</span>
                    <span className="text-sm font-light font-poppins">
                        Login in to your account
                    </span>
                </div>

                <form onSubmit={handelSubmit}>
                    <div className='max-w-[336px] grid gap-5'>
                        <div className='grid text-left'>
                            <label className='text-xs mb-1 font-light font-poppins text-gray-500'>Email</label>
                            <input
                                onChange={e => setAdmin({ ...admin, email: e.target.value })}
                                className='w-[336px] h-9 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500'
                                placeholder='your email'
                                type='email'
                            />
                        </div>

                        <div className='grid justify-center text-left'>
                            <lable className='text-xs mb-1 font-light font-poppins text-gray-500'>Password</lable>
                            <input
                                onChange={e => setAdmin({ ...admin, password: e.target.value })}
                                placeholder='your password'
                                className='w-[336px] h-9 border p-1 rounded-lg text-sm border-gray-300 outline-none focus:border-blue-400 text-gray-500 transition dark:bg-slate-200 placeholder:text-gray-500'
                                type='password'
                            />
                        </div>

                        <div>
                            <button className='w-[336px] h-8 mt-4 text-white rounded-xl bg-custom-radial font-poppins font-medium'>
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex justify-end">
                <div
                    style={{ backgroundImage: `url(${banner})` }}
                    className="bg-cover bg-center w-[500px] h-[650px] rounded-3xl relative"
                >
                    <div className="absolute bottom-4 text-5xl text-white px-6 py-3 rounded-lg font-bold shadow-lg font-poppins">
                        Welcome to, <br />Admins page
                    </div>
                </div>
            </div>



        </div>

    )
}

export default Login
