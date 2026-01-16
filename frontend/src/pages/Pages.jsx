import { GraduationCap, Users, BookOpen, Award } from "lucide-react"

export default function About() {
  return (
    <div className="pt-28">

      <section className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white py-28">
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            About SaralPath School
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            A trusted name in education, shaping future leaders with knowledge,
            discipline, and values.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            A Legacy of Excellence in Education
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            SaralPath School is a premier educational institution dedicated to
            nurturing young minds with academic excellence, moral discipline,
            and leadership values. Our mission is to prepare students for a
            successful future in both modern education and ethical living.
          </p>

          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            We combine modern teaching methodologies with strong traditional
            values to create a balanced, future-ready education system.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <StatBox number="500+" label="Students" />
            <StatBox number="30+" label="Teachers" />
            <StatBox number="10+" label="Years of Excellence" />
            <StatBox number="100%" label="Dedicated Support" />
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
          alt="Campus"
          className="rounded-3xl shadow-2xl"
        />
      </section>

      <section className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">

          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              To become a globally respected institution that nurtures students
              into confident, knowledgeable, and responsible citizens.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              To provide quality education with modern infrastructure,
              experienced faculty, and strong moral values to build a better
              generation for tomorrow.
            </p>
          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Our Core Values</h2>
          <p className="mt-4 text-gray-600 text-lg">
            The foundation of our institution
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-10">

          <ValueCard
            icon={<GraduationCap size={40} />}
            title="Academic Excellence"
            desc="Commitment to high-quality education and results."
          />

          <ValueCard
            icon={<Users size={40} />}
            title="Discipline"
            desc="Building strong character and integrity."
          />

          <ValueCard
            icon={<BookOpen size={40} />}
            title="Knowledge"
            desc="Modern and traditional learning combined."
          />

          <ValueCard
            icon={<Award size={40} />}
            title="Leadership"
            desc="Shaping future leaders of society."
          />

        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-24 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-6">Message from the Principal</h2>

          <p className="text-lg leading-relaxed text-blue-100">
            "At SaralPath School, we believe that education is not just about
            books, but about shaping character, discipline, and confidence.
            Our goal is to empower every student to achieve excellence in both
            academics and life."
          </p>

          <p className="mt-6 font-semibold text-xl">
            — Principal, SaralPath School
          </p>

        </div>
      </section>

    </div>
  )
}

function StatBox({ number, label }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <h3 className="text-3xl font-extrabold text-blue-600">{number}</h3>
      <p className="mt-2 text-gray-600 font-medium">{label}</p>
    </div>
  )
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-10 rounded-3xl shadow hover:shadow-2xl transition text-center hover:-translate-y-2 duration-300">
      <div className="flex justify-center text-blue-600 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-4 text-gray-600">{desc}</p>
    </div>
  )
}
