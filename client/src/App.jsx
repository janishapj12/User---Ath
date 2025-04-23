import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

import { ResetPass } from './pages/ResetPass'
import DetailUser from './pages/DetailUser'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import EmailVerify from './pages/EmailVerify'



function App() {
  return (
    <div>
      <ToastContainer/>
          <Routes>
            <Route path='/' element = {<Home/>} />
            <Route path='/login' element = {<Login/>} />
            <Route path="/profile/:id" element={<DetailUser />} />
            <Route path='/email-verify' element = {<EmailVerify/>} />
            <Route path='/reset-pass' element = {<ResetPass/>} />
          </Routes>
    </div>
  )
}

export default App