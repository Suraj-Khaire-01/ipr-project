import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="bg-indigo-600 text-white py-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Protect Your Intellectual Property
        </h1>
        <p className="text-lg text-indigo-100 max-w-2xl mb-8">
          Expert legal services for patents, trademarks, copyrights, and design protection. 
          Safeguard your innovations with our experienced IP law team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
          >
            Get Consultation
          </Link>
          <Link
            to="/#services"
            className="bg-indigo-500 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-400 transition"
          >
            Our Services
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
