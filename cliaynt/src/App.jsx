import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/AdminPage/Nav';
import Login from './components/login/Login';


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element = {<Login/>} />
                <Route path='/admin-page' element = {<Nav/>} />
            </Routes>
        </Router>
    )
}

export default App
