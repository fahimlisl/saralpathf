import { GraduationCap, BookOpen, School, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="pt-28">
      <section className="bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Shaping Minds, Building Futures
            </h1>
            <p className="mt-6 text-gray-600 text-lg">
              SaralPath School is a modern educational institution focused on
              academic excellence, discipline, and moral values.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition">
                Admissions Open
              </button>
              <button className="border border-gray-300 px-8 py-3 rounded-xl hover:bg-gray-100 transition">
                Explore Courses
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="https://res.cloudinary.com/dkrwq4wvi/image/upload/v1768550663/welcome_pic.jpg"
              alt="School"
              className="rounded-2xl shadow-xl w-full max-w-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About SaralPath School
            </h2>
            <p className="text-gray-600 leading-relaxed">
              SaralPath School is dedicated to providing quality education
              combined with strong moral values. Our institution nurtures
              students intellectually, spiritually, and socially to prepare
              them for a successful future.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold text-lg">Modern Education</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Smart classrooms and updated curriculum.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold text-lg">Qualified Teachers</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Experienced and dedicated faculty.
                </p>
              </div>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
            alt="Classroom"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Our Courses</h2>
            <p className="text-gray-600 mt-3">
              Comprehensive learning programs for every stage of education.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <CourseCard
              title="Edadiah"
              description="Foundation level education focusing on basics and moral values."
              icon={<BookOpen size={40} />}
            />

            <CourseCard
              title="Jamiah"
              description="Advanced Islamic education with academic excellence."
              icon={<GraduationCap size={40} />}
            />

            <CourseCard
              title="General"
              description="General academic curriculum for holistic development."
              icon={<School size={40} />}
            />

            <CourseCard
              title="Hifz"
              description="Specialized program for memorization of the Holy Quran."
              icon={<Star size={40} />}
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
          <p className="text-gray-600 mt-3">
            We focus on discipline, quality education, and personal growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Qualified Faculty"
            description="Highly trained and experienced teachers."
          />
          <FeatureCard
            title="Moral Education"
            description="Strong emphasis on character and values."
          />
          <FeatureCard
            title="Student Support"
            description="Individual attention and mentorship."
          />
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-white text-center">
        <h2 className="text-3xl font-bold">Admissions Now Open</h2>
        <p className="mt-4 text-lg">
          Give your child the best education for a brighter future.
        </p>

        <button className="mt-8 bg-white text-blue-600 px-10 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition">
          Apply Now
        </button>
      </section>

    </div>
  )
}

function CourseCard({ title, description, icon }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition text-center">
      <div className="flex justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-3 text-sm">{description}</p>
    </div>
  )
}

function FeatureCard({ title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow text-center hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-3">{description}</p>
    </div>
  )
}
