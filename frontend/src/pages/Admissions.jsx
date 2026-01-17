import { useState } from "react"
import axios from "axios"

export default function Admissions() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    birthDate: "",
    city: "",
    state: "",
    desiredClass: "",
    typeOfClass: ""
  })

  const [photo, setPhoto] = useState(null)
  const [birthCertificate, setBirthCertificate] = useState(null)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const[application_Id,setapplication_Id] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!photo || !birthCertificate) {
      alert("Please upload photo and birth certificate")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      Object.keys(form).forEach(key => {
        formData.append(key, form[key])
      })

      formData.append("photo", photo)
      formData.append("brithCertificate", birthCertificate)

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/general/online-registration`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      )
      const appId = response.data.data.application_Id
      setapplication_Id(appId)
      setSuccess(true)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-28">

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-24 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold">Admissions Open</h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto text-blue-100">
          Begin your child's journey towards excellence. Apply online and
          secure a bright future with SaralPath School.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Admission Process
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          <StepCard step="1" title="Apply Online" desc="Fill the registration form" />
          <StepCard step="2" title="Document Upload" desc="Submit required documents" />
          <StepCard step="3" title="Verification" desc="School verifies details" />
          <StepCard step="4" title="Confirmation" desc="Admission confirmation" />
        </div>
      </section>

      <section className="bg-gray-100 py-24">
        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16">

            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Online Registration Form
            </h2>

            <p className="text-center text-gray-500 mt-3">
              Fill in the details carefully. All fields marked * are mandatory.
            </p>

            {success ? (
              <div className="text-center py-20">
                <h3 className="text-3xl font-bold text-green-600">
                  Application Submitted Successfully 🎉
                </h3>
                <p className="text-gray-500 mt-4">
                  Your Application Id is <span className="text-green-600">{application_Id}</span> kindly keep this id for further refrence and amdit card generation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-12 grid md:grid-cols-2 gap-8">

                <Input label="Full Name *" name="fullName" onChange={handleChange} />
                <Input label="Email" name="email" onChange={handleChange} />
                <Input label="Phone Number *" name="phoneNumber" onChange={handleChange} />
                <Input label="Date of Birth *" type="date" name="birthDate" onChange={handleChange} />

                <Input label="City *" name="city" onChange={handleChange} />
                <Input label="State *" name="state" onChange={handleChange} />

                <Input label="Address *" name="address" onChange={handleChange} full />

                <Input label="Desired Class" name="desiredClass" onChange={handleChange} />

                <Select
                  label="Type of Class"
                  name="typeOfClass"
                  onChange={handleChange}
                  options={[
                    "Jamiah",
                    "Hifz-A",
                    "Hifz-B",
                    "Hifz-C",
                    "Hifz-D",
                    "Edadiah-I",
                    "Edadiah-II",
                    "Edadiah-III",
                    "Rapid"
                  ]}
                />

                <FileInput label="Upload Student Photo *" onChange={setPhoto} />
                <FileInput label="Upload Birth Certificate *" onChange={setBirthCertificate} />

                <div className="md:col-span-2 mt-6">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>

    </div>
  )
}

function Input({ label, name, type = "text", onChange, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        required={label.includes("*")}
        onChange={onChange}
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  )
}

function Select({ label, name, options, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>
      <select
        name={name}
        onChange={onChange}
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select</option>
        {options.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  )
}

function FileInput({ label, onChange }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>
      <input
        type="file"
        required
        onChange={(e) => onChange(e.target.files[0])}
        className="w-full"
      />
    </div>
  )
}

function StepCard({ step, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow text-center hover:shadow-xl transition">
      <div className="text-4xl font-extrabold text-blue-600 mb-4">{step}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-500 mt-2">{desc}</p>
    </div>
  )
}
