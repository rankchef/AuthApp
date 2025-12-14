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
import VerifyEmail from './VerifyEmail.jsx'
import CreatePost from './CreatePost.jsx'
import Settings from './Settings.jsx'
import EditPost from './EditPost.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {index: true, element: <Home/>},
      {path: 'register', element: <Register/>},
      {path: 'login', element: <Login/>},
      {path: "verify-2fa", element: <VerifyTwoFactor/>},
      {path: "verify-email", element: <VerifyEmail/>},
      {path: "successful-register", element: <SuccessfulRegister/>},
      {path: "auth-status", element: <AuthContext/>},
      {path: "create-post", element: <ProtectedRoute><CreatePost/></ProtectedRoute>},
      {path: "settings", element: <ProtectedRoute><Settings/></ProtectedRoute>},
      {path: "edit-post", element: <ProtectedRoute><EditPost/></ProtectedRoute>}
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
