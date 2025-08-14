import React from "react";
import { Shield, Scale, Lock, Mail, Phone, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <div className="bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-lg">
        <div className="flex items-center space-x-2">
          <Shield className="text-indigo-400" size={32} />
          <span className="text-2xl font-bold">IPSecure Legal</span>
        </div>
        <div className="space-x-6">
          <a href="#services" className="hover:text-indigo-400">Services</a>
          <a href="#about" className="hover:text-indigo-400">About</a>
          <a href="#contact" className="hover:text-indigo-400">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 bg-gray-900">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-400">
          Protecting Your Ideas, Securing Your Future
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Expert intellectual property protection with tailored legal solutions for individuals and businesses.
        </p>
        <a href="#contact" className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full text-lg font-semibold transition">
          Get a Consultation
        </a>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-gray-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-400">Our Services</h2>
          <p className="text-gray-400 mt-2">Comprehensive IP solutions tailored to your needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
            <Lock size={48} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Patent Protection</h3>
            <p className="text-gray-400">Safeguard your inventions with robust legal strategies.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
            <Scale size={48} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trademark Registration</h3>
            <p className="text-gray-400">Protect your brand identity with trademark services.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:scale-105 transition">
            <Shield size={48} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Copyright Services</h3>
            <p className="text-gray-400">Secure your creative works and ensure legal protection.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-gray-900 px-6 text-center">
        <h2 className="text-3xl font-bold text-indigo-400 mb-4">About Us</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          With decades of combined experience, IPSecure Legal is committed to delivering exceptional legal services
          that protect and enhance your intellectual property rights.
        </p>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-800 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-400">What Our Clients Say</h2>
        </div>
        <div className="max-w-3xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg">
          <p className="text-gray-300 italic">
            "IPSecure Legal made the complex process of trademark registration simple and stress-free.
            Highly recommended!"
          </p>
          <span className="block mt-4 text-indigo-400 font-semibold">— Sarah L., Startup Founder</span>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gray-900 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-400">Get in Touch</h2>
          <p className="text-gray-400">Have questions? We’re here to help.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <p className="flex items-center mb-2"><Mail className="text-indigo-400 mr-2" /> info@ipsecure.com</p>
            <p className="flex items-center mb-2"><Phone className="text-indigo-400 mr-2" /> (123) 456-7890</p>
            <p className="flex items-center"><MapPin className="text-indigo-400 mr-2" /> 123 Legal St, Law City</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <input type="text" placeholder="Name" className="w-full mb-4 p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500" />
            <input type="email" placeholder="Email" className="w-full mb-4 p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500" />
            <textarea placeholder="Message" rows="4" className="w-full mb-4 p-3 rounded bg-gray-900 border border-gray-700 focus:border-indigo-500"></textarea>
            <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded font-semibold">
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} IPSecure Legal. All rights reserved.
      </footer>
    </div>
  );
}
