import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, Zap, BookOpen, Users, TrendingUp, ChevronDown, Play, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Index() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How does LearnPilot AI create personalized learning paths?",
      answer: "Our AI analyzes your learning goals, current skill level, preferred learning style, and available time to create a completely customized roadmap. It continuously adapts based on your progress and performance."
    },
    {
      question: "Is LearnPilot suitable for beginners?",
      answer: "Absolutely! LearnPilot is designed for learners at all levels. The AI assesses your starting point and creates appropriate content, whether you're a complete beginner or looking to advance existing skills."
    },
    {
      question: "How does the AI mentor feature work?",
      answer: "The AI mentor provides 24/7 support through contextual guidance, answers to your questions, motivation when you need it, and suggestions for overcoming learning obstacles. It learns your patterns to offer increasingly personalized help."
    },
    {
      question: "Can I track my learning progress?",
      answer: "Yes! LearnPilot provides detailed analytics including completion rates, time spent learning, skill assessments, and milestone achievements. You'll always know exactly where you stand and what to focus on next."
    },
    {
      question: "What subjects and topics are available?",
      answer: "LearnPilot covers a wide range of subjects including technology, business, creative skills, languages, and more. Our AI can create learning paths for virtually any topic you want to master."
    },
    {
      question: "Is there a free version available?",
      answer: "Yes! You can get started with LearnPilot for free. Our free tier includes basic learning path creation and limited AI mentor interactions. Premium features unlock advanced analytics and unlimited AI support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="font-satoshi font-bold text-xl">LearnPilot</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user ?
              <Link to="/dashboard">
                <Button className="bg-gradient-primary text-white">
                  Go to Dashboard
                </Button>
              </Link> : <><Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Sign In
                </Button>
              </Link>
                <Link to="/login">
                  <Button className="bg-gradient-primary text-white">
                    Get Started
                  </Button>
                </Link></>}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="font-[700] text-5xl md:text-7xl text-foreground leading-tight">
              AI Smart Learning
              <br />
              Path Analyser
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Create Personalized Learning Journeys and Build Your Ultimate AI Learning Agent — Powered by Intelligence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              {user ? <Link to="/Dashboard">
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 px-8 py-7 text-lg font-medium rounded-xl"
                >
                  Continue Learning <ArrowRight />
                </Button>
              </Link> : <Link to="/login">
                <Button
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90 px-8 py-7 text-lg font-medium rounded-xl"
                >
                  Get Started - It's free
                </Button>
              </Link>}
            </div>

            {/* Hero Visual */}
            <div className="pt-16 max-w-6xl mx-auto">
              <div className="relative bg-gradient-to-br rounded-3xl p-1">
                <div className="bg-background rounded-3xl p-8 md:p-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    <div className="flex flex-col bg-slate-200/20 pt-8 pb-12 px-12 rounded-2xl items-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-3xl text-nowrap font-satoshi">Goal Assessment</h3>
                      <p className="text-muted-foreground text-center">AI analyzes your learning objectives and creates personalized roadmaps</p>
                    </div>

                    <div className="flex flex-col bg-slate-200/20 pt-8 pb-12 px-12 rounded-2xl items-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-3xl text-nowrap font-satoshi">Smart Learning</h3>
                      <p className="text-muted-foreground text-center">Adaptive algorithms that evolve with your progress and preferences</p>
                    </div>

                    <div className="flex flex-col bg-slate-200/20 pt-8 pb-12 px-12 rounded-2xl items-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-3xl text-nowrap font-satoshi">Progress Tracking</h3>
                      <p className="text-muted-foreground text-center">Real-time analytics with detailed insights and milestone tracking</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-satoshi font-bold text-4xl md:text-5xl mb-6">
              How LearnPilot Works
            </h2>
            <p className="text-xl text-muted-foreground leading-normal">
              Get started in minutes with our simple 4-step process that creates your personalized learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative">
                <Play className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
                  1
                </div>
              </div>
              <h3 className="font-satoshi font-semibold text-xl">Tell Us Your Goals</h3>
              <p className="text-muted-foreground">
                Share what you want to learn, your current skill level, and your preferred learning style
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative">
                <Brain className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
                  2
                </div>
              </div>
              <h3 className="font-satoshi font-semibold text-xl">AI Creates Your Path</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your input and generates a completely personalized learning roadmap
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative">
                <BookOpen className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
                  3
                </div>
              </div>
              <h3 className="font-satoshi font-semibold text-xl">Start Learning</h3>
              <p className="text-muted-foreground">
                Begin your journey with curated content, interactive exercises, and AI-powered guidance
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative">
                <CheckCircle className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
                  4
                </div>
              </div>
              <h3 className="font-satoshi font-semibold text-xl">Track & Adapt</h3>
              <p className="text-muted-foreground">
                Monitor your progress while the AI continuously optimizes your learning experience
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary text-white">
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="bg-gradient-primary text-white">
                  Start Your Learning Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-6xl mx-auto ">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-satoshi font-bold text-4xl md:text-5xl mb-6">
              Intelligent Learning Platform
            </h2>
            <p className="text-xl text-muted-foreground leading-normal">
              LearnPilot AI transforms how you learn by creating personalized educational experiences
              that adapt to your unique learning style, pace, and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-satoshi font-semibold text-xl mb-3">AI-Powered Path Creation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our advanced AI analyzes your learning objectives, current skills, and preferences
                    to create completely personalized learning paths that evolve with your progress.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-satoshi font-semibold text-xl mb-3">Adaptive Learning Engine</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dynamic content delivery that adjusts difficulty, pacing, and learning methods
                    based on your performance and engagement patterns.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-satoshi font-semibold text-xl mb-3">AI Mentor Guidance</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    24/7 intelligent mentoring with contextual support, motivation, and guidance
                    tailored to your learning journey and personal goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm border border-primary/20">
                <div className="bg-card rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Web Development Path</div>
                      <div className="text-sm text-muted-foreground">Progress: 73%</div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-primary rounded-full" />
                  </div>
                </div>

                <div className="bg-card rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">AI Mentor</div>
                      <div className="text-sm text-muted-foreground">Ready to help</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    "Great progress on React! Ready to tackle advanced hooks today?"
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 max-w-6xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative h-[90%] ">
              <div className="bg-gradient-to-tr h-full from-secondary/20 to-primary/20 rounded-2xl p-8 backdrop-blur-sm border border-secondary/20">
                <div className="grid grid-cols-2 h-full gap-4">
                  <div className="bg-card rounded-xl flex items-center flex-col justify-center h-full p-4 text-center">
                    <div className="text-4xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Learners</div>
                  </div>
                  <div className="bg-card rounded-xl flex items-center flex-col justify-center h-full p-4 text-center">
                    <div className="text-4xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Learning Paths</div>
                  </div>
                  <div className="bg-card rounded-xl flex items-center flex-col justify-center h-full p-4 text-center">
                    <div className="text-4xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="bg-card rounded-xl flex items-center flex-col justify-center h-full p-4 text-center">
                    <div className="text-4xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">AI Support</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-satoshi font-bold text-4xl md:text-5xl">
                Revolutionizing Education with AI
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                LearnPilot AI is more than just a learning platform—it's your personal educational
                companion that understands how you learn best and guides you toward mastery.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Personalized Learning Paths</div>
                    <div className="text-muted-foreground text-sm">
                      Every path is uniquely crafted based on your goals, skills, and learning preferences
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Intelligent Progress Tracking</div>
                    <div className="text-muted-foreground text-sm">
                      Advanced analytics provide insights into your learning patterns and suggest optimizations
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Continuous Adaptation</div>
                    <div className="text-muted-foreground text-sm">
                      The AI learns from your interactions and continuously improves your learning experience
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/login">
                <Button size="lg" className="bg-gradient-primary mt-8 text-white group">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-8 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-6xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-satoshi font-bold text-4xl md:text-5xl mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground leading-normal">
              Everything you need to know about LearnPilot AI
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-border/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-satoshi font-semibold text-lg">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 border-t border-border/40">
                    <p className="text-muted-foreground leading-relaxed pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 p-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl ">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="font-satoshi font-bold text-4xl md:text-5xl mb-6">
              Ready to start learning?
            </h2>
            <p className="text-muted-foreground mb-4">
               Create Personalized Learning Journeys and Build Your Ultimate AI Learning Agent — Powered by Intelligence
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-primary text-white">
                  Continue Learning
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-primary text-white">
                  Get Started Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-satoshi font-bold text-lg">LearnPilot</span>
            </div>

            <nav className="flex gap-6 mb-4 md:mb-0">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
            </nav>

            <p className="text-muted-foreground text-sm">
              © 2024 LearnPilot. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
}