import { useState } from "react";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Plus,
  PlayCircle,
  Calendar,
  Award,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const mockLearningPaths = [
  {
    id: 1,
    title: "React Advanced Concepts",
    description: "Master hooks, context, and performance optimization",
    progress: 65,
    totalModules: 12,
    completedModules: 8,
    difficulty: "Intermediate",
    estimatedTime: "24 hours",
    category: "Frontend Development",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML algorithms and data science",
    progress: 30,
    totalModules: 16,
    completedModules: 5,
    difficulty: "Beginner",
    estimatedTime: "32 hours",
    category: "Data Science",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "UX Design Principles",
    description: "Learn user-centered design and prototyping",
    progress: 90,
    totalModules: 8,
    completedModules: 7,
    difficulty: "Intermediate",
    estimatedTime: "16 hours",
    category: "Design",
    color: "bg-purple-500",
  },
];

const mockAchievements = [
  { name: "First Steps", icon: Target, unlocked: true },
  { name: "Week Warrior", icon: Calendar, unlocked: true },
  { name: "Quick Learner", icon: Zap, unlocked: true },
  { name: "Master Mind", icon: Brain, unlocked: false },
];

const mockRecentActivity = [
  {
    type: "completed",
    title: "React Hooks Deep Dive",
    time: "2 hours ago",
    path: "React Advanced Concepts",
  },
  {
    type: "started",
    title: "Linear Regression Basics",
    time: "1 day ago",
    path: "Machine Learning Fundamentals",
  },
  {
    type: "achievement",
    title: "Earned Week Warrior badge",
    time: "2 days ago",
    path: null,
  },
];

export default function Dashboard() {
  const [currentTime] = useState(new Date());
  const greeting = 
    currentTime.getHours() < 12 
      ? "Good morning" 
      : currentTime.getHours() < 17 
      ? "Good afternoon" 
      : "Good evening";

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="space-y-4">
        {/* <div className="w-full flex flex-col md:flex-row items-center justify-between"> */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {greeting}, Damola! 👋
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="shadow-learning">
              <Link to="/dashboard/create-path">
                <Plus className="w-4 h-4 mr-2" />
                Create New Path
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard/mentor">
                <Brain className="w-4 h-4 mr-2" />
                Ask AI Mentor
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-card bg-gradient-primary text-white">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 text-foreground">Learning Streak</p>
                  <p className="text-2xl font-bold text-foreground">7 Days</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">12.5h</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Paths</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <BookOpen className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills Gained</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                </div>
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Learning Paths */}
          <Card className="border shadow-card rounded-md ">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Active Learning Paths
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/paths">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockLearningPaths.map((path) => (
                <div
                  key={path.id}
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${path.color}`} />
                        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                          {path.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {path.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {path.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{path.completedModules}/{path.totalModules} modules</span>
                        <span>•</span>
                        <span>{path.estimatedTime} total</span>
                        <span>•</span>
                        <span>{path.category}</span>
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      {activity.type === "completed" && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                      {activity.type === "started" && (
                        <PlayCircle className="w-4 h-4 text-primary" />
                      )}
                      {activity.type === "achievement" && (
                        <Award className="w-4 h-4 text-warning" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-card-foreground">
                        {activity.title}
                      </p>
                      {activity.path && (
                        <p className="text-sm text-muted-foreground">
                          in {activity.path}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 px-0 lg:px-3 ">
          {/* Weekly Goal */}
          <Card className="border shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">12.5h</div>
                <div className="text-sm text-muted-foreground">of 15h target</div>
              </div>
              <Progress value={83} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">2.5h remaining</span>
                <span className="text-success font-medium">83%</span>
              </div>
              <Button className="w-full" size="sm">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 pb-3">
                {mockAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-lg border text-center transition-all ${
                      achievement.unlocked
                        ? "border-success/20 bg-success-muted"
                        : "border-border bg-muted/50"
                    }`}
                  >
                    <achievement.icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        achievement.unlocked ? "text-success" : "text-muted-foreground"
                      }`}
                    />
                    <p
                      className={`text-xs font-medium ${
                        achievement.unlocked ? "text-success-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                <Link to="/achievements">
                  View All Achievements
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Mentor Quick Chat */}
          <Card className="border-0 shadow-card bg-gradient-hero text-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5" />
                AI Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm opacity-90">
                "Great progress on React! Ready to tackle advanced patterns like compound components?"
              </p>
              <Button variant="secondary" className="w-full" size="sm" asChild>
                <Link to="/mentor">
                  Chat with Mentor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}