import { LayoutDashboard, Users, GraduationCap, Wallet, Settings, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(

        `${import.meta.env.VITE_BASE_URL}/admin/logout`,
        {},
        { withCredentials: true }
      )

      navigate("/login")
    } catch (error) {
      console.error("Logout failed", error)
      alert("Logout failed. Please try again.")
    }
  }

  return (
    <aside className="w-72 bg-[#020617] text-white min-h-screen hidden lg:flex flex-col">

      <div className="px-8 py-6 border-b border-white/10">
        <h1 className="text-2xl font-extrabold">SaralPath ERP</h1>
        <p className="text-sm text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">

        <NavItem icon={<LayoutDashboard />} label="Dashboard" to="/admin/dashboard" />
        <NavItem icon={<Users />} label="Students" to="/admin/students" />
        <NavItem icon={<GraduationCap />} label="Teachers" to="/admin/teachers" />
        <NavItem icon={<Wallet />} label="Fees Management" to="/admin/fees" />
        <NavItem icon={<Settings />} label="Settings" to="/admin/settings" />

      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition"
        >
          <LogOut />
          Logout
        </button>
      </div>

    </aside>
  )
}

function NavItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 transition"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}
