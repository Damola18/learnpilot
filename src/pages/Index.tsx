import { Link } from "react-router-dom";
import { ArrowRight, Brain, Target, Zap, BookOpen, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
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
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-gradient-primary text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="font-satoshi font-bold text-5xl md:text-7xl text-foreground leading-tight">
              AI Smart Learning
              <br />
             Path Analyser
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
              Create Personalized Learning Journeys and Build Your Ultimate AI Learning Agent — Powered by Intelligence
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-foreground text-background hover:bg-foreground/90 px-8 py-4 text-lg font-medium rounded-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            
            {/* Hero Visual */}
            <div className="pt-16 max-w-5xl mx-auto">
              <div className="relative bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-1">
                <div className="bg-background rounded-3xl p-8 md:p-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl font-satoshi">Goal Assessment</h3>
                      <p className="text-muted-foreground text-center">AI analyzes your learning objectives and creates personalized roadmaps</p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Brain className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl font-satoshi">Smart Learning</h3>
                      <p className="text-muted-foreground text-center">Adaptive algorithms that evolve with your progress and preferences</p>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl font-satoshi">Progress Tracking</h3>
                      <p className="text-muted-foreground text-center">Real-time analytics with detailed insights and milestone tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-satoshi font-bold text-4xl md:text-5xl mb-6">
              Intelligent Learning Platform
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
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
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-secondary" />
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
      <section id="about" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-2xl p-8 backdrop-blur-sm border border-secondary/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Learners</div>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Learning Paths</div>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="bg-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">AI Support</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
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
                <Button size="lg" className="bg-gradient-primary text-white group">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
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
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
            </nav>
            
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} LearnPilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}