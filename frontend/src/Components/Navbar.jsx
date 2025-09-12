import { useState, useEffect } from "react"
import { Sun, Moon, Menu, X, ChevronDown, Scale, Copyright, FileText, Palette, Gavel, FileCheck } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const services = [
  { name: "Patents", href: "/patentservice", icon: FileText },
  { name: "Trademarks", href: "/trademarkservices", icon: Scale },
  { name: "Copyrights", href: "/copyrightservices", icon: Copyright },
  { name: "Industrial Design", href: "/industrialdesignservices", icon: Palette },
  { name: "IP Litigation", href: "/iplitigationpage", icon: Gavel },
  { name: "separator", href: "", icon: null },
  { name: "Patent Filing Process", href: "/patentGuide", icon: FileText },
  { name: "Copyright Filing Process", href: "/copyrightGuide", icon: Copyright },
  { name: "Filing Requirements", href: "/requirements", icon: FileCheck },
  { name: "Cost Estimation", href: "/cost-estimation", icon: Scale },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-teal-600" />
            <span className="font-playfair text-xl font-bold text-gray-900 dark:text-white">IPSecure Legal</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              Home
            </a>

            {/* Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 w-56 z-20">
                {services.map((service) =>
                  service.name === "separator" ? (
                    <div key="separator" className="border-t border-gray-200 dark:border-gray-600 my-2" />
                  ) : (
                    <a
                      key={service.name}
                      href={service.href}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <service.icon className="h-4 w-4" />
                      <span>{service.name}</span>
                    </a>
                  )
                )}
              </div>
            </div>

            <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              About
            </a>
            <a href="/insights" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              Insights
            </a>
            <a href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              Contact
            </a>

            {/* Login Button (New) */}
            <SignedOut>
              <a
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
              >
                Login 
              </a>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 p-0 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a
              href="/contact"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 p-0 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-9 w-9 p-0 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                Home
              </a>
              <div className="px-3 py-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Services</span>
                <div className="ml-4 mt-2 space-y-1">
                  {services.map((service) => (
                    service.name !== "separator" && (
                      <a
                        key={service.name}
                        href={service.href}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600"
                      >
                        <service.icon className="h-4 w-4" />
                        <span>{service.name}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
              <a href="/about" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                About
              </a>
              <a href="/blog" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                Insights
              </a>
              <a href="/contact" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600">
                Contact
              </a>

              {/* Mobile Login */}
              <SignedOut>
                <a
                  href="/login"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 w-full text-left"
                >
                  Login
                </a>
              </SignedOut>
              <SignedIn>
                <div className="px-3 py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <div className="px-3 py-2">
                <a
                  href="/contact"
                  className="w-full block text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
