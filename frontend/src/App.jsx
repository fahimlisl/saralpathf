import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import Login from "./auth/Login.jsx";
import About from "./pages/Pages.jsx";
import Admissions from "./pages/Admissions.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Students from "./pages/admin/Students.jsx";
import Teachers from "./pages/admin/Teachers.jsx";
import Fees from "./pages/admin/Fees.jsx";

import TeacherDashboard from "./components/TeacherDashboard.jsx";
import AdmitCard from "./pages/AdmitCard.jsx";
import Contact from "./pages/Contact.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

const getToken = () => localStorage.getItem("accessToken");
const getRole = () => localStorage.getItem("role");

function ProtectedRoute({ children, role }) {
  const token = getToken();
  const userRole = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role && role !== userRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
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

        <Route
          path="/student/dashboard"
          element={
            // <StudentLayout>
            <StudentDashboard />
            // {/* </StudentLayout> */}
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
