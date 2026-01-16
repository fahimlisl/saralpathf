import { useState } from "react"
import { loginAdmin, loginTeacher, loginStudent } from "../services/authService.js"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()

  const [role, setRole] = useState("admin")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const payload = {
      email: identifier.includes("@") ? identifier : "",
      phoneNumber: identifier.includes("@") ? "" : identifier,
      password
    }

    try {
      if (role === "admin") {
        await loginAdmin(payload)
        navigate("/admin/dashboard")
      }

      if (role === "teacher") {
        await loginTeacher(payload)
        navigate("/teacher/dashboard")
      }

      if (role === "student") {
        await loginStudent(payload)
        navigate("/student/dashboard")
      }

    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#020617] flex items-center justify-center px-6 text-white">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png"
            className="h-24"
            alt="SaralPath"
          />
        </div>

        <h2 className="text-3xl font-bold text-center">Portal Login</h2>
        <p className="text-center text-gray-300 mt-2">
          Login to your institution account
        </p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          {["admin", "teacher", "student"].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-3 rounded-xl font-semibold transition ${
                role === r
                  ? "bg-blue-600 shadow"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        {role === "student" && (
          <p className="mt-4 text-sm text-blue-300 text-center">
            Student password is your Date of Birth (DOB)
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>

        </form>
      </div>
    </div>
  )
}
