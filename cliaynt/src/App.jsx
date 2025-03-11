import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/AdminPage/Nav';
import Login from './components/login/Login';
import Orders from './components/navBars/Orders';
import Suppliers from './components/navBars/Suppliers';
import Customer from './components/navBars/Customer';
import Payment from './components/navBars/Payment';


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />

                <Route path='/admin-page' element={<Nav />}>
                    <Route path='order' element={<Orders />} />
                    <Route path='supplier' element={<Suppliers />} />
                    <Route path='customer' element={<Customer />} />
                    <Route path='payment' element={<Payment />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
