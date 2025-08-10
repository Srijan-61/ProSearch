import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './features/login/login'
import Register from './features/register/register'
import Home from './features/home/home'
import LoginGuard from './shared/guards/loginGuard'
import AuthGuard from './shared/guards/authGuard'
import Profile from './features/profile/profile'

function App() {

  // outside return all logical part or js
  return (// return must only have one main div to return but can have multiplr div inside main div
    // HTML View
    <Routes>
      
      <Route path='/' element={<Navigate to="/home" replace/>}/>
      <Route path='/login' element={<LoginGuard>
        <Login/>
      </LoginGuard>} />
      <Route path='/register' element={<LoginGuard>
        <Register/>
      </LoginGuard>} />
      <Route path='/home' element={<AuthGuard>
        <Home/>
        </AuthGuard>}/>
      <Route path='/profile' element={<AuthGuard><Profile/></AuthGuard>} />
      <Route path='/profile/:userId' element={<AuthGuard><Profile/></AuthGuard>} />

    </Routes>
  )
}

export default App
