import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/AdminPage/Nav';
import Login from './components/login/Login';
import Orders from './components/navBars/Orders';
import Suppliers from './components/navBars/Suppliers';
import Customer from './components/navBars/Customer';
import Payment from './components/navBars/Payment';
import Category from './components/navBars/Category';
import AddCategory from './components/navBars/AddCategory';
import Zone from './components/navBars/Zone';
import AddZones from './components/navBars/AddZones';
import BankAccount from './components/navBars/BankAccount';


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
                    <Route path='category' element={<Category />} />
                    <Route path='add-category' element={<AddCategory />} />
                    <Route path='zone' element={<Zone />} />
                    <Route path='add-zone' element={<AddZones />} />
                    <Route path='bank-account' element={<BankAccount />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
