import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png"
            alt="SaralPath Logo"
            className="h-12"
          />
          <div className="hidden sm:block">
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          <Link className="hover:text-blue-600 transition" to="/">Home</Link>
          <Link className="hover:text-blue-600 transition" to="/about">About</Link>
          <Link className="hover:text-blue-600 transition" to="/academics">Academics</Link>
          <Link className="hover:text-blue-600 transition" to="/contact">Contact</Link>
          <Link className="hover:text-blue-600 transition" to="/admissions">Admissions</Link>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Login Portal
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-lg px-6 py-6 space-y-5">
          <Link onClick={() => setOpen(false)} className="block text-lg" to="/">Home</Link>
          <Link onClick={() => setOpen(false)} className="block text-lg" to="/about">About</Link>
          <Link onClick={() => setOpen(false)} className="block text-lg" to="/academics">Academics</Link>
          <Link onClick={() => setOpen(false)} className="block text-lg" to="/contact">Contact</Link>

          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block text-center bg-blue-600 text-white py-3 rounded-xl shadow"
          >
            Login Portal
          </Link>
        </div>
      )}
    </nav>
  )
}
