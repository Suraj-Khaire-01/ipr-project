import { FileText, Scale, Copyright, Palette, Gavel, ArrowRight } from "lucide-react"

const services = [
  {
    icon: FileText,
    title: "Patents",
    description: "Protect your inventions and innovations with comprehensive patent services.",
    href: "/patentservice",
    color: "bg-blue-500",
  },
  {
    icon: Scale,
    title: "Trademarks",
    description: "Secure your brand identity and business reputation with trademark protection.",
    href: "/services/trademarks",
    color: "bg-emerald-500",
  },
  {
    icon: Copyright,
    title: "Copyrights",
    description: "Safeguard your creative works and artistic expressions.",
    href: "/services/copyrights",
    color: "bg-purple-500",
  },
  {
    icon: Palette,
    title: "Industrial Design",
    description: "Protect the visual design and aesthetics of your products.",
    href: "/services/industrial-design",
    color: "bg-orange-500",
  },
  {
    icon: Gavel,
    title: "IP Litigation",
    description: "Expert legal representation in intellectual property disputes.",
    href: "/services/litigation",
    color: "bg-red-500",
  },
]

export default function ServicesGrid() {
  return (
    <section className="w-full py-20 bg-gray-900 dark:bg-gray-800">
      {/* Inner container to center content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Our IP Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive intellectual property solutions tailored to protect and maximize the value of your innovations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <a
              key={service.title}
              href={service.href}
              className="group bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 ${service.color} rounded-xl flex items-center justify-center mb-6 
                            group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon className="h-8 w-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-playfair text-xl font-bold text-gray-900 dark:text-white mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {service.description}
              </p>

              {/* CTA */}
              <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold 
                              group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
