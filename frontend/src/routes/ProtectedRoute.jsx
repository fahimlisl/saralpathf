import { Navigate } from "react-router-dom"

const getToken = () => localStorage.getItem("accessToken")
const getRole = () => localStorage.getItem("role")

export default function ProtectedRoute({ children, role }) {
  const token = getToken()
  const userRole = getRole()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && role !== userRole) {
    return <Navigate to="/login" replace />
  }

  return children
}
