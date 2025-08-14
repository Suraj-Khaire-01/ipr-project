function Services() {
  const services = [
    {
      title: "Copyright Law",
      description:
        "Protect your creative works, writings, and artistic expressions from unauthorized use.",
      icon: "📝",
    },
    {
      title: "Patent Filing",
      description:
        "Secure exclusive rights to your inventions and innovative technologies.",
      icon: "💡",
    },
    {
      title: "Design Protection",
      description:
        "Safeguard the unique visual appearance and aesthetics of your products.",
      icon: "🎨",
    },
    {
      title: "Trademark Registration",
      description:
        "Establish and protect your brand identity, logos, and business names.",
      icon: "®️",
    },
  ]

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
