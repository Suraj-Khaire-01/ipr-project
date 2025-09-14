import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Scale,
  Copyright,
  FileText,
  Palette,
  Gavel,
  FileCheck,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const services = [
  { name: "Patents", href: "/patentservice", icon: FileText },
  { name: "Trademarks", href: "/trademarkservices", icon: Scale },
  { name: "Copyrights", href: "/copyrightservices", icon: Copyright },
  { name: "Industrial Design", href: "/industrialdesignservices", icon: Palette },
  { name: "IP Litigation", href: "/iplitigationpage", icon: Gavel },
  { name: "separator", href: "", icon: null },
  { name: "Patent Filing Process", href: "/patentGuide", icon: FileText },
  { name: "Copyright Filing Process", href: "/copyrightGuide", icon: Copyright },
  { name: "Filing Requirements", href: "/requirements", icon: FileCheck }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load theme from localStorage or fallback to light
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Hide navbar on dashboard and admin-dashboard pages
  if (location.pathname === "/dashboard" || location.pathname === "/admin-dashboard") return null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Apply theme on mount and when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    setShowUserDropdown(false);
    // Force a complete page refresh for better state management
    window.location.href = path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserDropdown(false);
      // Force navigation to home after sign out
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl shadow-gray-200/50 dark:shadow-gray-800/50 translate-y-0 border-b border-gray-200/50 dark:border-gray-700/50"
          : "bg-transparent translate-y-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => handleNavigation("/")}
          >
            <div className="relative">
              <Scale className="h-8 w-8 text-teal-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-out" />
              <div className="absolute inset-0 bg-teal-600/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            </div>
            <span className="font-playfair text-xl font-bold bg-gradient-to-r from-gray-900 via-teal-700 to-gray-900 dark:from-white dark:via-teal-400 dark:to-white bg-clip-text text-transparent">
              IPSecure Legal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group"
              onClick={() => handleNavigation("/")}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group">
                <span>Services</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <div className="absolute hidden group-hover:block bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-xl mt-3 w-64 z-20 border border-gray-200/50 dark:border-gray-600/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-2">
                  {services.map((service, index) =>
                    service.name === "separator" ? (
                      <div
                        key="separator"
                        className="border-t border-gray-200 dark:border-gray-600 my-2"
                      />
                    ) : (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 transition-all duration-200 group/item transform hover:scale-[1.02]"
                        onClick={() => handleNavigation(service.href)}
                      >
                        <service.icon className="h-4 w-4 text-teal-600 group-hover/item:scale-110 transition-transform duration-200" />
                        <span className="group-hover/item:text-teal-600 transition-colors duration-200">{service.name}</span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="relative text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group"
              onClick={() => handleNavigation("/about")}
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/insights"
              className="relative text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group"
              onClick={() => handleNavigation("/insights")}
            >
              Insights
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/contact"
              className="relative text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group"
              onClick={() => handleNavigation("/contact")}
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Profile / Login */}
            <SignedOut>
              <Link
                to="/login"
                className="relative text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group"
                onClick={() => handleNavigation("/login")}
              >
                Login
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </SignedOut>
            
            <SignedIn>
              <div className="relative user-dropdown">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {isLoaded && user ? (user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || 'U') : 'U'}
                  </div>
                  <span className="hidden lg:block">Profile</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-600/50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {isLoaded && user ? (user.firstName || 'User') : 'Loading...'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {isLoaded && user?.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SignedIn>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Show Get Started only when logged out */}
            <SignedOut>
              <Link
                to="/login"
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25 font-medium"
                onClick={() => handleNavigation("/login")}
              >
                Get Started
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-gray-200 dark:border-gray-600"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 w-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 animate-in fade-in slide-in-from-top-4 duration-300 rounded-b-2xl mx-4 mb-4 shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link
                to="/"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                onClick={() => handleNavigation("/")}
              >
                Home
              </Link>

              <div className="px-4 py-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Services
                </span>
                <div className="ml-4 mt-2 space-y-1">
                  {services.map(
                    (service) =>
                      service.name !== "separator" && (
                        <Link
                          key={service.name}
                          to={service.href}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200"
                          onClick={() => handleNavigation(service.href)}
                        >
                          <service.icon className="h-4 w-4" />
                          <span>{service.name}</span>
                        </Link>
                      )
                  )}
                </div>
              </div>

              <Link
                to="/about"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                onClick={() => handleNavigation("/about")}
              >
                About
              </Link>
              <Link
                to="/insights"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                onClick={() => handleNavigation("/insights")}
              >
                Insights
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                onClick={() => handleNavigation("/contact")}
              >
                Contact
              </Link>

              <SignedOut>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="block text-center bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 mt-4 font-medium"
                  onClick={() => handleNavigation("/login")}
                >
                  Get Started
                </Link>
              </SignedOut>
              
              <SignedIn>
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {isLoaded && user ? (user.firstName || 'User') : 'Loading...'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {isLoaded && user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigation("/dashboard")}
                    className="w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-teal-600 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}