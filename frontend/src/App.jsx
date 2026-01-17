import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"
import AdminLayout from "./layouts/AdminLayout"

import Home from "./pages/Home"
import Login from "./auth/Login"
import About from "./pages/Pages"
import Admissions from "./pages/Admissions"

import Dashboard from "./pages/admin/Dashboard"
import Students from "./pages/admin/Students"
import Teachers from "./pages/admin/Teachers"
import Fees from "./pages/admin/Fees"

import TeacherDashboard from "./components/teacherDashboard"
import AdmitCard from "./pages/AdmitCard"
import Contact from "./pages/Contact"


const getToken = () => localStorage.getItem("accessToken")
const getRole = () => localStorage.getItem("role")

function ProtectedRoute({ children, role }) {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

        <Route
          path="/admissions"
          element={
            <MainLayout>
              <Admissions />
            </MainLayout>
          }
        />

        <Route
          path="/admit-card"
          element={
            <MainLayout>
              <AdmitCard />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />


        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Students />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Teachers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/fees"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <Fees />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
