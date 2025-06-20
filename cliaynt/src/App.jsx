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
import BankAccount from './components/navBars/BankAccount';
import OnlineSupplier from './components/navBars/OnlineSupplier';
import RemovedSupplier from './components/navBars/RemovedSupplier';
import RemovedCustomer from './components/navBars/RemovedCustomer';
import SupperAdminLogin from './components/supperAdmin/SupperAdminLogin';
import SupperAdminDashbord from './components/supperAdmin/SupperAdminDashbord';
import SettingPage from './components/navBars/SettingPage';
import AdminMessagesMonitor from './components/navBars/AdminMessagesMonitor';
import AdminDashboard from './components/navBars/AdminDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/supper-admin' element={<SupperAdminLogin />} />
                <Route path='/supper-admin-dashboard' element={<SupperAdminDashbord />} />
                <Route path='/admin-message-monitor' element={<AdminMessagesMonitor />} />
                <Route path='/setting-page' element={<SettingPage />} />


                <Route path='/admin-page' element={<Nav />}>
                    <Route path='' element={<AdminDashboard />} />
                    <Route path='order' element={<Orders />} />
                    <Route path='supplier' element={<Suppliers />} />
                    <Route path='customer' element={<Customer />} />
                    <Route path='payment' element={<Payment />} />
                    <Route path='category' element={<Category />} />
                    <Route path='add-category' element={<AddCategory />} />
                    <Route path='bank-account' element={<BankAccount />} />
                    <Route path='online-suppliers' element={<OnlineSupplier />} />
                    <Route path='removed-supplier' element={<RemovedSupplier />} />
                    <Route path='removed-customer' element={<RemovedCustomer />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
