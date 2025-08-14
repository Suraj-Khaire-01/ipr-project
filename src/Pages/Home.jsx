import Hero from '../Components/Hero'
import Services from '../Components/Services'

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Hero />
      <Services />
    </div>
  )
}

export default Home
