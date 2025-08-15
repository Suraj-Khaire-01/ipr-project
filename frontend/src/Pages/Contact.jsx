import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, MapPin, Clock, Globe, Send } from 'lucide-react'
import tt from '@tomtom-international/web-sdk-maps'
import '@tomtom-international/web-sdk-maps/dist/maps.css'

function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const mapElement = useRef(null)
  const API_KEY = import.meta.env.VITE_TOMTOM_API_KEY // from .env

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setFormData({ 
        fullName: '', 
        email: '', 
        phone: '', 
        company: '', 
        serviceType: '', 
        message: '' 
      })
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (mapElement.current && API_KEY) {
      const map = tt.map({
        key: API_KEY,
        container: mapElement.current,
        center: [-74.006, 40.7128], // NYC coordinates
        zoom: 13
      })

      new tt.Marker()
        .setLngLat([-74.006, 40.7128])
        .addTo(map)

      return () => map.remove()
    }
  }, [API_KEY])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-teal-700 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Ready to protect your intellectual property? Get in touch with our expert team for a free consultation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                Our experienced IP attorneys are ready to discuss your needs and provide tailored solutions for your intellectual property challenges.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Main Office */}
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Main Office</h3>
                  <p className="text-gray-300">123 Legal Plaza, Suite 500</p>
                  <p className="text-gray-300">New York, NY 10001</p>
                  <p className="text-gray-300">United States</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 rounded-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <p className="text-gray-300">Main: +1 (555) 123-4567</p>
                  <p className="text-gray-300">Toll Free: +1 (800) 123-4567</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-gray-300">General: info@ipsecurelegal.com</p>
                  <p className="text-gray-300">New Clients: newclient@ipsecurelegal.com</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Business Hours</h3>
                  <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-gray-300">Saturday: 10:00 AM - 2:00 PM EST</p>
                  <p className="text-gray-300">Sunday: Closed</p>
                </div>
              </div>

              {/* International Offices */}
              <div className="flex items-start space-x-4">
                <div className="bg-teal-600 p-3 rounded-lg">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">International Offices</h3>
                  <p className="text-gray-300">London, UK</p>
                  <p className="text-gray-300">Tokyo, Japan</p>
                  <p className="text-gray-300">Toronto, Canada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            
            <div className="space-y-6">
              {error && (
                <div className="bg-red-600 text-white px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-600 text-white px-4 py-3 rounded-lg">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type of Service *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                >
                  <option value="">Select a service...</option>
                  <option value="patents">Patents</option>
                  <option value="trademarks">Trademarks</option>
                  <option value="copyrights">Copyrights</option>
                  <option value="ip-litigation">IP Litigation</option>
                  <option value="licensing">Licensing</option>
                  <option value="consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us about your IP needs and how we can help..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-teal-700 hover:to-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
        <div className="bg-gray-800 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Visit Our Office</h2>
              <p className="text-gray-300">Located at VIIT - Computer Science Department</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg overflow-hidden h-96">
              <iframe
                title="Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.418632656263!2d73.8842823!3d18.459561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eaf4662547c9%3A0xd96690b0786458f5!2sVIIT%20-%20Computer%20Science%20Department!5e0!3m2!1sen!2sin!4v1692174556789!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

    </div>
  )
}

export default Contact
