import { useState } from "react"
import axios from "axios"

export default function AdmitCard() {
  const [applicationId, setApplicationId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!applicationId) {
      alert("Enter Application Number")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/general/admit-card`,
        { application_Id: applicationId },
        {
          responseType: "blob"   
        }
      )

      const file = new Blob([res.data], { type: "application/pdf" })
      const url = URL.createObjectURL(file)
      window.open(url)

    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to generate admit card")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 px-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center">

        <h1 className="text-3xl font-extrabold text-gray-800">
          Download Admit Card
        </h1>

        <p className="text-gray-500 mt-3">
          Enter your Application Number to generate your Admit Card
        </p>

        <div className="mt-10">
          <input
            type="text"
            placeholder="Enter Application Number"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="w-full px-5 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
        >
          {loading ? "Generating Admit Card..." : "Generate Admit Card"}
        </button>

      </div>

    </div>
  )
}
