import { useEffect, useState } from "react"
import StatCard from "../../components/admin/StatCard"
import QuickAction from "../../components/admin/QuickAction"
import { Users, GraduationCap, Wallet, BookOpen } from "lucide-react"
import { countStudents ,countTeacher} from "../../services/adminService"

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0)
  const [loading, setLoading] = useState(true)
  const [totalTeacher,settotalTeacher] = useState(0)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await countStudents()
        setTotalStudents(res.data.data)
        const res2 = await countTeacher()
        settotalTeacher(res2.data.data)
      } catch (err) {
        console.error("Failed to load student count", err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">School management overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Students"
          value={loading ? "Loading..." : totalStudents}
          icon={<Users />}
        />
        <StatCard
          title="Total Teachers"
          value={loading ? "Loading..." : totalTeacher}
          icon={<Users />}
        />
        <StatCard title="Monthly Fees" value="--" icon={<Wallet />} />
        <StatCard title="Active Classes" value="--" icon={<BookOpen />} />

      </div>


      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickAction label="Register Student" />
          <QuickAction label="Register Teacher" />
          <QuickAction label="Collect Fees" />
          <QuickAction label="Generate Report" />
        </div>
      </div>

    </div>
  )
}
