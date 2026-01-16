export default function QuickAction({ label }) {
  return (
    <button className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition text-left">
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-gray-500 mt-2">Click to proceed</p>
    </button>
  )
}
