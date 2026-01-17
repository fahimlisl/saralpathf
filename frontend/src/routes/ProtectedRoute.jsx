import { Navigate } from "react-router-dom"
import { getToken, getUserRole } from "../utils/auth"

export default function ProtectedRoute({ children, role }) {
  const token = getToken()
  const userRole = getUserRole()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && role !== userRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
