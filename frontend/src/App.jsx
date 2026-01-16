import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Login from "./auth/Login"

import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import About from "./pages/Pages"
import Admissions from "./pages/Admissions"
import Students from "./pages/admin/Students"
import Teachers from "./pages/admin/Teachers"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
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

        {/* Admin Panel */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
  path="/admin/students"
  element={
    <AdminLayout>
      <Students />
    </AdminLayout>
  }
/>

        <Route
  path="/admin/teachers"
  element={
    <AdminLayout>
      <Teachers />
    </AdminLayout>
  }
/>


      </Routes>
    </BrowserRouter>
  )
}
