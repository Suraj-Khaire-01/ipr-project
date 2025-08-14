import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon, ChevronDown, Scale, Copyright, FileText, Palette, Gavel, FileCheck } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';


// Mock theme hook for demo
const useTheme = () => {
  const [theme, setTheme] = useState('light')
  return { theme, setTheme }
}

const services = [
  { name: "Patents", href: "/services/patents", icon: FileText, description: "Protect your inventions" },
  { name: "Trademarks", href: "/services/trademarks", icon: Scale, description: "Secure your brand identity" },
  { name: "Copyrights", href: "/services/copyrights", icon: Copyright, description: "Safeguard creative works" },
  { name: "Industrial Design", href: "/services/industrial-design", icon: Palette, description: "Design protection services" },
  { name: "IP Litigation", href: "/services/litigation", icon: Gavel, description: "Legal dispute resolution" },
  { name: "separator", href: "", icon: null },
  { name: "Patent Filing Process", href: "/processes/patent-filing", icon: FileText, description: "Step-by-step guidance" },
  { name: "Copyright Filing Process", href: "/processes/copyright-filing", icon: Copyright, description: "Streamlined registration" },
  { name: "Filing Requirements", href: "/processes/requirements", icon: FileCheck, description: "Documentation needed" },
]

// Enhanced Button component
const Button = ({ children, variant = "default", size = "default", className = "", onClick, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95"
  
  const variants = {
    default: "bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-lg hover:shadow-xl",
    ghost: "hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400",
    primary: "bg-gradient-to-r from-teal-600 via-teal-600 to-blue-600 text-white hover:from-teal-700 hover:via-teal-700 hover:to-blue-700 shadow-lg hover:shadow-2xl"
  }
  
  const sizes = {
    default: "h-11 py-2 px-6 rounded-lg text-sm font-semibold",
    sm: "h-9 px-4 rounded-md text-sm",
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Enhanced Dropdown components with animations
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative inline-block text-left">
      {children.map((child, index) => 
        child.type?.displayName === 'DropdownMenuTrigger' 
          ? { ...child, key: index, props: { ...child.props, onClick: () => setIsOpen(!isOpen), isOpen } }
          : child.type?.displayName === 'DropdownMenuContent' 
          ? { ...child, key: index, props: { ...child.props, isOpen, onClose: () => setIsOpen(false) } }
          : { ...child, key: index }
      )}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, onClick, className = "", isOpen }) => (
  <button 
    className={`${className} focus:outline-none transition-all duration-200 hover:text-teal-600 dark:hover:text-teal-400`} 
    onClick={onClick}
  >
    <div className="flex items-center space-x-1">
      {children}
      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
    </div>
  </button>
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

const DropdownMenuContent = ({ children, className = "", isOpen, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.relative')) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <div className={`absolute right-0 mt-3 w-72 transition-all duration-300 transform ${
      isOpen 
        ? 'opacity-100 translate-y-0 scale-100' 
        : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
    } z-50`}>
      <div className="rounded-xl shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg ring-1 ring-black/10 dark:ring-white/10 border border-gray-200/50 dark:border-gray-700/50">
        <div className="py-2">
          {children}
        </div>
      </div>
    </div>
  )
}
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuItem = ({ children, onClick, className = "" }) => (
  <button
    className={`w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 hover:text-teal-700 dark:hover:text-teal-400 transition-all duration-200 group ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) return null

  const handleNavigation = (href) => {
    // In a real app, you'd use React Router
    console.log('Navigate to:', href)
    setIsOpen(false) // Close mobile menu
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Enhanced Logo */}
          <button 
            onClick={() => handleNavigation("/")} 
            className="flex items-center space-x-3 focus:outline-none group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <Scale className="h-9 w-9 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" />
              <div className="absolute inset-0 bg-teal-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                IPSecure Legal
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                Intellectual Property Law
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {['Home', 'About', 'Insights', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 group"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              </button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="relative px-4 py-2 text-gray-700 dark:text-gray-300 transition-all duration-300 group">
                <span className="relative z-10">Services</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {services.map((service, index) =>
                  service.name === "separator" ? (
                    <div key={`separator-${index}`} className="border-t border-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 my-2 mx-4" />
                  ) : (
                    <DropdownMenuItem 
                      key={service.name} 
                      onClick={() => handleNavigation(service.href)}
                    >
                      <div className="flex items-start space-x-3 group">
                        <div className="mt-0.5">
                          <service.icon className="h-5 w-5 text-teal-600 group-hover:text-teal-700 transition-colors duration-200" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          {service.description && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {service.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="relative px-4 py-2">
                  <span className="relative z-10">Client Login</span>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Enhanced Theme Toggle */}
            <div className="mx-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 p-0 rounded-full relative overflow-hidden"
              >
                <div className={`transition-all duration-500 ${theme === "dark" ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
                  <Moon className="h-4 w-4 absolute inset-0 m-auto" />
                </div>
                <div className={`transition-all duration-500 ${theme === "dark" ? 'rotate-0 scale-100' : 'rotate-180 scale-0'}`}>
                  <Sun className="h-4 w-4 absolute inset-0 m-auto" />
                </div>
              </Button>
            </div>

            <Button 
              variant="primary" 
              onClick={() => handleNavigation("/contact")} 
              className="ml-2 relative overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 p-0 rounded-full"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)} 
              className="h-10 w-10 p-0 rounded-full relative overflow-hidden"
            >
              <div className={`transition-all duration-300 ${isOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
                <Menu className="h-5 w-5 absolute inset-0 m-auto" />
              </div>
              <div className={`transition-all duration-300 ${isOpen ? 'rotate-0 scale-100' : 'rotate-180 scale-0'}`}>
                <X className="h-5 w-5 absolute inset-0 m-auto" />
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 rounded-b-xl mt-2 shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {['Home', 'About', 'Insights', 'Contact'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => handleNavigation(`/${item.toLowerCase()}`)} 
                  className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-lg transition-all duration-300 transform hover:translate-x-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item}
                </button>
              ))}
              
              <div className="px-4 py-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Our Services</span>
                <div className="mt-3 space-y-1">
                  {services.filter(service => service.name !== "separator").map((service, index) => (
                    <button
                      key={service.name}
                      onClick={() => handleNavigation(service.href)}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-blue-50/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 rounded-lg transition-all duration-300 transform hover:translate-x-2 group"
                      style={{ animationDelay: `${(index + 4) * 50}ms` }}
                    >
                      <service.icon className="h-4 w-4 text-teal-600 group-hover:text-teal-700 transition-colors duration-200" />
                      <div className="flex flex-col">
                        <span className="font-medium">{service.name}</span>
                        {service.description && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {service.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleNavigation("/login")} 
                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-lg transition-all duration-300 transform hover:translate-x-2"
              >
                Client Login
              </button>
              
              <div className="px-4 py-4">
                <Button 
                  variant="primary"
                  onClick={() => handleNavigation("/contact")} 
                  className="w-full justify-center"
                >
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}