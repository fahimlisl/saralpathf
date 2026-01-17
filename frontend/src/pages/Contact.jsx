import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function Contact() {
  return (
    <div className="pt-28 bg-gray-50">

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-28 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Contact SaralPath Academy
        </h1>

        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-blue-100">
          We’d love to hear from you. Reach out for admissions, support, or any
          queries regarding our academic programs.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div>

            <h2 className="text-3xl font-bold text-gray-900">
              Get In Touch
            </h2>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Our support team is always ready to help you. Visit our campus,
              call us, or drop an email anytime.
            </p>

            <div className="mt-10 space-y-6">

              <ContactCard
                icon={<MapPin size={28} />}
                title="Our Campus"
                text="Vill - Kankuria, PO - Miapur, PS - Raghunathganj,
                Dist - Murshidabad, Pin - 742235"
              />

              <ContactCard
                icon={<Phone size={28} />}
                title="Call Us"
                text="+91 85148 68658, +91 79085 73548"
              />

              <ContactCard
                icon={<Mail size={28} />}
                title="Email"
                text="saralpath2013@gmail.com"
              />

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-14">

            <h3 className="text-2xl font-bold text-gray-800">
              Send Us a Message
            </h3>

            <p className="text-gray-500 mt-2">
              Fill out the form below and our team will contact you shortly.
            </p>

            <form className="mt-10 space-y-6">

              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Full Name" />
                <Input label="Phone Number" />
              </div>

              <Input label="Email Address" />
              <Textarea label="Your Message" />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg
                flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-lg"
              >
                <Send size={20} />
                Send Message
              </button>

            </form>
          </div>

        </div>

      </section>

      <section className="w-full h-[500px] mt-20">
        <iframe
          title="SaralPath Academy Location"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Murshidabad%20West%20Bengal&output=embed"
        />
      </section>

    </div>
  )
}

function ContactCard({ icon, title, text }) {
  return (
    <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
      <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
        {icon}
      </div>

      <div>
        <h4 className="text-lg font-bold text-gray-800">
          {title}
        </h4>
        <p className="text-gray-600 mt-1 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  )
}

function Input({ label }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        required
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  )
}

function Textarea({ label }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>
      <textarea
        rows="5"
        required
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />
    </div>
  )
}
