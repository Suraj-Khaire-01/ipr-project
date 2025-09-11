import { useState } from 'react'
import { Calendar, User, ArrowRight, FileText } from 'lucide-react'

function Insights() {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Patents', 'Trademarks', 'Copyrights', 'Litigation', 'Industry News']

  const articles = [
    {
      id: 1,
      category: 'Patents',
      date: '1/15/2024',
      title: 'Understanding Patent Prosecution: A Complete Guide',
      excerpt: 'Learn the essential steps in patent prosecution and how to navigate the complex process of securing patent protection for your...',
      author: 'Sarah Mitchell',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      category: 'Trademarks',
      date: '1/10/2024',
      title: 'Trademark Infringement: Recent Court Decisions',
      excerpt: 'Analysis of recent trademark infringement cases and their implications for brand protection strategies',
      author: 'David Chen',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      category: 'Copyrights',
      date: '1/5/2024',
      title: 'AI and Copyright: Navigating New Legal Territory',
      excerpt: 'Exploring the intersection of artificial intelligence and copyright law in the digital age',
      author: 'Jennifer Walsh',
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      category: 'Industry News',
      date: '12/28/2023',
      title: 'International IP Strategy for Global Businesses',
      excerpt: 'Essential considerations for protecting intellectual property across multiple jurisdictions',
      author: 'Michael Brown',
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      category: 'Litigation',
      date: '12/20/2023',
      title: 'Trade Secret Protection in the Remote Work Era',
      excerpt: 'Best practices for maintaining trade secret protection when employees work remotely',
      author: 'Maria Rodriguez',
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      category: 'Patents',
      date: '12/15/2023',
      title: 'Design Patent Trends in Consumer Electronics',
      excerpt: 'Analysis of design patent filing trends and strategies in the consumer electronics industry',
      author: 'Robert Kim',
      image: '/api/placeholder/400/250'
    }
  ]

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === activeCategory)

  const getCategoryColor = (category) => {
    const colors = {
      'Patents': 'bg-blue-600',
      'Trademarks': 'bg-green-600',
      'Copyrights': 'bg-purple-600',
      'Litigation': 'bg-red-600',
      'Industry News': 'bg-orange-600'
    }
    return colors[category] || 'bg-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-teal-700 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">IP Insights & News</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay informed with the latest developments in intellectual property law, industry trends, and expert analysis from our legal team.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-gray-800 rounded-lg overflow-hidden group hover:transform hover:scale-105 transition-all duration-300">
                {/* Article Image Placeholder */}
                <div className="bg-gray-700 h-48 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-500" />
                </div>

                {/* Article Content */}
                <div className="p-6">
                  {/* Category Badge and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${getCategoryColor(article.category)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {article.date}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-teal-400 transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Author and Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <button className="text-teal-400 hover:text-teal-300 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Signup Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter for the latest IP insights and legal updates delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            />
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
            <p className="text-gray-300">
              Essential guides and resources for IP protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Patent Filing Guide</h3>
              <p className="text-gray-300 mb-4">
                Complete guide to filing patents and protecting your innovations
              </p>
              <button className="text-teal-400 hover:text-teal-300 font-medium">
                Download Guide →
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trademark Checklist</h3>
              <p className="text-gray-300 mb-4">
                Essential checklist for trademark registration and protection
              </p>
              <button className="text-teal-400 hover:text-teal-300 font-medium">
                Download Checklist →
              </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">IP Strategy Whitepaper</h3>
              <p className="text-gray-300 mb-4">
                Strategic approaches to intellectual property management
              </p>
              <button className="text-teal-400 hover:text-teal-300 font-medium">
                Download Whitepaper →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights