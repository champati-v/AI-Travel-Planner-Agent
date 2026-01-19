import React from 'react';
import { Plane, MapPin, Calendar, Sparkles, ArrowRight, Globe, Clock, Heart } from 'lucide-react';
import { useDarkMode } from '@/context/DarkModeContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {

  const { isDark } = useDarkMode();
  const navigate = useNavigate();

  return (
    <div className="h-screen mt-10">
      {/* Navigation */}
      {/* <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TravelAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center space-x-2 animate-bounce ${isDark? 'bg-white border-blue-200/50' : 'border-blue-400/50'}  backdrop-blur-sm border  rounded-full px-4 py-2 mb-8`}>
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">AI-Powered Travel Planning</span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl md:text-7xl font-bold ${isDark? 'text-gray-200': 'text-gray-900'} mb-6 leading-tight`}>
              Your Perfect Trip
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Planned By AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover personalized itineraries, hidden gems, and seamless travel experiences 
              crafted by artificial intelligence in seconds.
            </p>

            {/* CTA Button */}
            <button onClick={() => navigate("/plan")} className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 md:px-8 md:py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center space-x-2">
              <span>Plan your trip now!</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 mt-16 text-sm text-gray-500">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 space-x-1">
                <Heart className="w-5 h-5 text-red-500 animate-bounce" />
                <span>Loved by 50k+ travelers</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 space-x-1">
                <Globe className="w-5 h-5 text-green-500 animate-bounce" />
                <span>195+ countries covered</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 space-x-1">
                <Clock className="w-5 h-5 text-blue-500 animate-bounce" />
                <span>Plans ready in less than a Minute</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className={`group ${isDark? 'bg-white/10 border-gray-200/50' : 'bg-gradient-to-br from-blue-200 to-purple-200 border-gray-400'} backdrop-blur-sm border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-2xl font-semibold ${isDark? 'text-gray-200' : 'text-black'}  mb-4`}>Smart Destinations</h3>
              <p className={`${isDark? 'text-gray-400' : 'text-gray-600'}  leading-relaxed`}>
                AI analyzes millions of travel data points to recommend destinations that match your preferences, budget, and travel style.
              </p>
            </div>

            {/* Card 2 */}
            <div className={`group ${isDark? 'bg-white/10 border-gray-200/50' : 'bg-gradient-to-br from-blue-200 to-purple-200 border-gray-400'} backdrop-blur-sm border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-2xl font-semibold ${isDark? 'text-gray-200' : 'text-black'}  mb-4`}>Personalized Itineraries</h3>
              <p className={`${isDark? 'text-gray-400' : 'text-gray-600'}  leading-relaxed`}>
                Get day-by-day plans tailored to your interests, from adventure sports to cultural experiences and hidden local gems.
              </p>
            </div>

            {/* Card 3 */}
            <div className={`group ${isDark? 'bg-white/10 border-gray-200/50' : 'bg-gradient-to-br from-blue-200 to-purple-200 border-gray-400'} backdrop-blur-sm border rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-2xl font-semibold ${isDark? 'text-gray-200' : 'text-black'}  mb-4`}>Real-time Optimization</h3>
              <p className={`${isDark? 'text-gray-400' : 'text-gray-600'}  leading-relaxed`}>
                Plans adapt to weather, events, and your preferences in real-time, ensuring you never miss out on amazing experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;