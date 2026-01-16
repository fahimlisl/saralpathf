export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className="bg-blue-600/10 text-blue-600 p-4 rounded-xl">
          {icon}
        </div>
      </div>

    </div>
  )
}
