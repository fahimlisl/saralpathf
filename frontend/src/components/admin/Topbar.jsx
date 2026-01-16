import { Bell, Search } from "lucide-react"

export default function Topbar() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl w-96">
        <Search size={18} className="text-gray-500" />
        <input
          placeholder="Search students, teachers, records..."
          className="bg-transparent outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell className="text-gray-600 cursor-pointer" />

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="font-semibold">Admin</p>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
