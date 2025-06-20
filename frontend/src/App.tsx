// import { useState } from 'react'
import './App.css'
import InsurerLogin from './components/general/Auth/insurer-login'
import PolicyHolderLogin from './components/general/Auth/policyHolder-login'
import PolicyHolderSignup from './components/general/Auth/policyholderKYC'
import InsurerSignup from './components/general/Auth/insurer-signup'
import LandingPage from './pages/landing'
import PolicyHolderAuth from './components/general/Auth/policyHolderAuth'
import InsurerDashMain from './pages/insurerDashmain'
import PolicyHolderDashMain from './pages/policyHolderDashMain'
import AuthDivider from './pages/AuthDivider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/auth-divider' element={<AuthDivider/>}/>
        <Route path='/user-signin' element={<PolicyHolderLogin/>}/>
        <Route path='/insurer-signin' element={<InsurerLogin/>}/>
        <Route path='/user-kyc' element={<PolicyHolderSignup/>}/>
        <Route path='/insurer-signup' element={<InsurerSignup/>}/>
        <Route path='/user-auth' element={<PolicyHolderAuth/>}/>
        <Route path='/insurer-dashboard' element={<InsurerDashMain/>}/>
        <Route path='/policyHolder-dashboard' element={<PolicyHolderDashMain/>}/>
      </Routes>
    </Router>
  )
}

export default App
