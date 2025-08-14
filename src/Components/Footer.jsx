import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  const handleNavigation = (href) => {
    // In a real app, you'd use React Router
    if (href === '#') return // Handle social media links
    window.location.href = href
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-teal-400" />
              <span className="font-serif text-xl font-bold">IPSecure Legal</span>
            </div>
            <p className="text-gray-400 text-sm">
              Protecting your intellectual property rights with expertise, dedication, and innovative legal solutions.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleNavigation("#")} 
                className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleNavigation("#")} 
                className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleNavigation("#")} 
                className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleNavigation("#")} 
                className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavigation("/services/patents")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Patents
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/services/trademarks")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Trademarks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/services/copyrights")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Copyrights
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/services/industrial-design")}
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Industrial Design
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/services/litigation")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  IP Litigation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/processes/patent-filing")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Patent Filing Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/processes/copyright-filing")}
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Copyright Filing Process
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/processes/requirements")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Filing Requirements
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavigation("/about")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/blog")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Insights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/contact")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/login")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Client Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation("/privacy")} 
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left focus:outline-none"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Legal Plaza, Suite 500
                  <br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <a 
                  href="tel:+15551234567" 
                  className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <a 
                  href="mailto:info@ipsecurelegal.com" 
                  className="text-gray-400 hover:text-teal-400 transition-colors focus:outline-none"
                >
                  info@ipsecurelegal.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} IPSecure Legal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}