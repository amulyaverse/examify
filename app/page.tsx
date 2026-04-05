'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
    return () => window.removeEventListener('scroll', () => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-bold text-blue-700">Examify</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
    
    
    
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
          </div>
          
          <div className="flex space-x-3">
            <Link href="/login">
              <button className="px-5 py-2 text-gray-700 hover:text-blue-600 transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
              🚀 AI-Powered Exam Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Convert Any Question Paper to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Online Exam
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload PDFs, images, or paste text. Our AI instantly transforms them 
              into interactive exams with timer, analytics, and instant results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <span>📤</span> Upload Question Paper
                </button>
              </Link>
              <Link href="/demo">
                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <span>🎯</span> Try Demo Exam
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600 mt-1">Exams Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600 mt-1">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 mt-1">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create and manage online exams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-2">Any Format</h3>
              <p className="text-gray-600">Upload PDFs, images (PNG, JPG), or paste text directly. We support all formats.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-600">Automatic question parsing and answer extraction using advanced AI.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-2">Smart Timer</h3>
              <p className="text-gray-600">Automatic submission when time expires with visual warnings.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Subject-wise performance, accuracy metrics, and improvement insights.</p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-xl font-bold mb-2">Auto-Save</h3>
              <p className="text-gray-600">Answers are automatically saved. Resume exactly where you left off.</p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Mobile Responsive</h3>
              <p className="text-gray-600">Perfect experience on desktop, tablet, and mobile devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Create an exam in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-gray-600">Upload your question paper (PDF, image, or text)</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">AI Processes</h3>
              <p className="text-gray-600">AI extracts and structures questions automatically</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Take Exam</h3>
              <p className="text-gray-600">Students take the exam with timer and navigation</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-bold mb-2">Get Results</h3>
              <p className="text-gray-600">Instant results with detailed analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students using Examify
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
                Create Free Account
              </button>
            </Link>
            <Link href="/upload">
              <button className="px-8 py-4 border-2 border-white text-white rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Upload Question Paper
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">🎓</span>
                <span className="text-2xl font-bold">Examify</span>
              </div>
              <p className="text-gray-400">AI-Powered Exam Platform</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Examify. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
