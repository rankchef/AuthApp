import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './Home.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import App from './App.jsx'
import SuccessfulRegister from './SuccessfulRegister.jsx'
import VerifyTwoFactor from './VerifyTwoFactor.jsx'
import AuthContext from './AuthProvider.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {index: true, element: <ProtectedRoute><Home/></ProtectedRoute>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>},
      {path: "verify-2fa", element: <VerifyTwoFactor/>},
      {path: "successful-register", element: <SuccessfulRegister/>},
      {path: "auth-status", element: <AuthContext/>}
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
    <RouterProvider router={router}/>
    </AuthContext>
  </StrictMode>
)
