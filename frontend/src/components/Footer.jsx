import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">

        <div className="space-y-4">
          <img
            src="https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768457598/saralpath_logo.png"
            alt="SaralPath Logo"
            className="h-14"
          />
          <h2 className="text-xl font-bold text-white">SaralPath School</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Empowering students with quality education, discipline, and modern
            learning experiences.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">About Us</li>
            <li className="hover:text-white transition cursor-pointer">Academics</li>
            <li className="hover:text-white transition cursor-pointer">Admissions</li>
            <li className="hover:text-white transition cursor-pointer">Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Contact Us</h3>
          <div className="space-y-4 text-gray-400 text-sm">

            <p className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 text-blue-500" />
              Vill - Kankuria, P.O - Miapur,  
              P.S - Raghunathganj,  
              Dist - Murshidabad,  
              Pin - 742235
            </p>

            <p className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500" />
              +91 8514868658, +91 7908573548
            </p>

            <p className="flex items-center gap-3">
              <Mail size={18} className="text-blue-500" />
              saralpath2013@gmail.com
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Our Motto</h3>
          <p className="text-gray-400 leading-relaxed">
            “Education is the most powerful weapon which you can use to change
            the world.”
          </p>

          <div className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl text-center font-medium shadow">
            Student • Teacher • Admin Portal
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SaralPath School. All rights reserved.
      </div>
    </footer>
  )
}
