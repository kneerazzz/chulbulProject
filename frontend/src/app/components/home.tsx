'use client'

import React, { useState, useEffect } from 'react'
import { 
  Target, 
  TrendingUp, 
  Brain,
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Star,
  Flame,
  Globe,
  Shield,
  Code,
  Palette,
  PlayCircle,
  Clock,
  Activity,
  Lightbulb,
  Rocket,
  ChevronRight,
  Eye,
  Heart,
  Cpu,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// Enhanced Hero Section
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  const router = useRouter()
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          width={500}
          height={300}
          src="/assets/skillSprint.jpg"
          alt="Background"
          className="object-cover w-full h-full opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">AI-Powered Learning Platform</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Master Skills at
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lightning Speed
            </span>
          </h1>

          <p className="text-gray-400 text-xl mt-6 max-w-2xl leading-relaxed">
            Create personalized learning paths, track your progress, and achieve mastery with AI-driven insights. 
            Your journey to expertise starts here.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1+</div>
              <div className="text-sm text-gray-400">Active Learners</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-sm text-gray-400">Skills Mastered</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.push("/dashboard") } className="group relative bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 transform hover:scale-105">
              <Rocket className="h-5 w-5" />
              Start Learning Today
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
            
            <button onClick={() => router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ")} className="group border border-gray-500 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
              <PlayCircle className="h-5 w-5" />
              Watch Demo
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-sm">Free forever plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}

// Enhanced Features Section
const FeaturesSection = () => {

  const mainFeatures = [
    {
      icon: <Target className="text-2xl text-blue-400" />,
      title: 'Smart Learning Paths',
      description: 'AI creates personalized roadmaps based on your goals, current level, and learning style.',
      stats: '90% faster skill acquisition',
      color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
    },
    {
      icon: <Brain className="text-2xl text-purple-400" />,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations, progress analytics, and adaptive learning suggestions.',
      stats: '3x better retention rates',
      color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
    },
    {
      icon: <TrendingUp className="text-2xl text-green-400" />,
      title: 'Real-time Progress Tracking',
      description: 'Visual dashboards, streaks, milestones, and detailed analytics to keep you motivated.',
      stats: '85% completion rate',
      color: 'from-green-500/20 to-green-600/20 border-green-500/30'
    },
    {
      icon: <Users className="text-2xl text-orange-400" />,
      title: 'Community Learning',
      description: 'Join study groups, compete with friends, and learn from a global community of learners.',
      stats: '1+ active learners',
      color: 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
    }
  ]

  const additionalFeatures = [
    { icon: <Flame className="h-5 w-5 text-red-400" />, title: 'Streak Tracking', description: 'Maintain learning consistency' },
    { icon: <Trophy className="h-5 w-5 text-yellow-400" />, title: 'Achievement System', description: 'Earn badges and rewards' },
    { icon: <Calendar className="h-5 w-5 text-blue-400" />, title: 'Smart Scheduling', description: 'AI optimizes your study time' },
    { icon: <BarChart3 className="h-5 w-5 text-green-400" />, title: 'Analytics Dashboard', description: 'Deep insights into your progress' },
    { icon: <Lightbulb className="h-5 w-5 text-purple-400" />, title: 'Daily Challenges', description: 'Fresh practice every day' },
    { icon: <Globe className="h-5 w-5 text-cyan-400" />, title: 'Multi-language Support', description: 'Learn in your preferred language' }
  ]

  const skillCategories = [
    { icon: <Code className="h-6 w-6" />, name: 'Programming', count: '150+ courses', color: 'text-blue-400' },
    { icon: <Palette className="h-6 w-6" />, name: 'Design', count: '80+ courses', color: 'text-purple-400' },
    { icon: <BarChart3 className="h-6 w-6" />, name: 'Business', count: '120+ courses', color: 'text-green-400' },
    { icon: <Users className="h-6 w-6" />, name: 'Management', count: '90+ courses', color: 'text-orange-400' },
    { icon: <Shield className="h-6 w-6" />, name: 'Cybersecurity', count: '70+ courses', color: 'text-red-400' },
    { icon: <Globe className="h-6 w-6" />, name: 'Languages', count: '60+ courses', color: 'text-cyan-400' }
  ]

  return (
    <section className="bg-black border-t border-neutral-800 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything you need to
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              accelerate learning
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform combines cutting-edge technology with proven learning science 
            to help you master any skill faster than ever before.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid gap-8 lg:grid-cols-2 mb-20">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index} 
              className={`group relative bg-gradient-to-br ${feature.color} p-8 rounded-2xl border hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{feature.stats}</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Plus many more features</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-neutral-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon}
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Categories */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Master skills across every domain</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category, index) => (
              <div key={index} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-neutral-700 transition-all hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className={`${category.color}`}>
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">{category.name}</h4>
                    <p className="text-gray-400 text-sm">{category.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Enhanced Product Preview Section
const ProductPreview = () => {
  const [activeDemo, setActiveDemo] = useState('dashboard')

  const demoFeatures = [
    {
      id: 'dashboard',
      title: 'Analytics Dashboard',
      description: 'Track progress, streaks, and achievements in one beautiful interface',
      image: '/assets/dashboard.png'
    },
    {
      id: 'plans',
      title: 'Learning Plans',
      description: 'AI-generated study plans tailored to your goals and schedule',
      image: '/assets/plans.png'
    },
    {
      id: 'progress',
      title: 'Progress Tracking',
      description: 'Visual progress indicators and detailed analytics',
      image: '/assets/progress.png'
    }
  ]

  const metrics = [
    { icon: <Users className="h-5 w-5 text-blue-400" />, label: 'Active Users', value: '1+' },
    { icon: <Trophy className="h-5 w-5 text-yellow-400" />, label: 'Skills Completed', value: '5+' },
    { icon: <Star className="h-5 w-5 text-green-400" />, label: 'Success Rate', value: '2%' },
    { icon: <Clock className="h-5 w-5 text-purple-400" />, label: 'Avg. Learning Time', value: '30min/day' }
  ]

  return (
    <section className="bg-black py-32 px-4 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-full mb-6">
            <Eye className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Product Preview</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your learning journey,
            <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              beautifully visualized
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Experience a clean, intuitive interface designed to keep you motivated and focused. 
            Every element is crafted to enhance your learning experience.
          </p>
        </div>

        {/* Demo Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800">
            {demoFeatures.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                  activeDemo === demo.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Demo */}
        <div className="text-center mb-12">
          {demoFeatures.map((demo) => (
            activeDemo === demo.id && (
              <div key={demo.id} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{demo.title}</h3>
                  <p className="text-gray-400">{demo.description}</p>
                </div>
                
                {/* Product Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 max-w-5xl mx-auto group">
                  <Image
                    width={500}
                    height={300}
                    src={demo.image}
                    alt={`${demo.title} Preview`}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-6 right-6 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Live Updates</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-center hover:border-neutral-700 transition-colors">
              <div className="flex justify-center mb-3">
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-gray-400 text-sm">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Key Features Highlights */}
        <div className="grid gap-8 md:grid-cols-3 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-time Analytics</h3>
            <p className="text-gray-400">Monitor your learning velocity, retention rates, and skill progression with detailed insights.</p>
          </div>
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-purple-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <Cpu className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
            <p className="text-gray-400">Get personalized suggestions for topics, study schedules, and learning strategies.</p>
          </div>
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Motivation System</h3>
            <p className="text-gray-400">Stay motivated with streaks, achievements, and community challenges.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Enhanced CTA Section
const CtaSection = () => {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const benefits = [
    { icon: <CheckCircle className="h-5 w-5 text-green-400" />, text: 'Free forever plan' },
    { icon: <CheckCircle className="h-5 w-5 text-green-400" />, text: 'No credit card required' },
    { icon: <CheckCircle className="h-5 w-5 text-green-400" />, text: 'Start learning in 30 seconds' },
    { icon: <CheckCircle className="h-5 w-5 text-green-400" />, text: 'Cancel anytime' }
  ]

  const testimonials = [
    {
      quote: "SkillSprint helped me learn React in just 3000 days. The AI recommendations were never right!",
      author: "Retarded neeraj",
      role: "vella insaan",
      avatar: "👩‍💻"
    },
    {
      quote: "The progress tracking kept me motivated. I finally able to match the glory of jordan!",
      author: "Lebron James",
      role: "Goat (bakri)",
      avatar: "👨‍🔬"
    },
    {
      quote: "Best learning platform I've used. It helped me in the invention of time machine.",
      author: "Burchatta sanjay kumar",
      role: "Scientist",
      avatar: "👩‍💼"
    }
  ]

  return (
    <section className="relative bg-black text-white py-32 border-t border-neutral-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-8">
            <Rocket className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Ready to Transform Your Learning?</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Start your journey to
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              skill mastery today
            </span>
          </h2>
          
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of learners who are already accelerating their careers with SkillSprint. 
            Your future self will thank you.
          </p>

          {/* Email Signup */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 justify-center">
              <Rocket className="h-5 w-5" />
              Get Started Free
            </button>
          </div>
            <p className='text-white font-bold text-xl mb-4'>It won&apos;t do Shii. Maybe i will add functionality later</p>
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                {benefit.icon}
                <span className="text-sm text-gray-300">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.push('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 justify-center">
              <PlayCircle className="h-5 w-5" />
              Watch 2-min Demo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 border border-gray-500 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2 justify-center" onClick={() => router.push("/skills")}>
              <BookOpen className="h-5 w-5" />
              Browse Courses
            </button>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <p className="text-gray-400 mb-8">Trusted by great learners</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold">Chulbul</div>
            <div className="text-2xl font-bold">Addu defaulter</div>
            <div className="text-2xl font-bold">Troyy</div>
            <div className="text-2xl font-bold">Dharampal</div>
            <div className="text-2xl font-bold">Gajodhar</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <p className="text-gray-300 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
              <div>
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-gray-400 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { HeroSection, FeaturesSection, ProductPreview, CtaSection }