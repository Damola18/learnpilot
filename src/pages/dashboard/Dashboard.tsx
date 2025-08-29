import { useState } from "react";
import {
  BookOpen,
  Clock,
  Zap,
  Plus,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningPaths } from "@/contexts/LearningPathsContext";
import { usePathProgress } from "@/contexts/PathProgressContext";
import { formatSlug } from "@/utils/slugUtils";

export default function Dashboard() {
  const [currentTime] = useState(new Date());
  const { user } = useAuth();
  const {
    paths,
  } = useLearningPaths() 

  const {
    getPathProgress,
    calculateProgress
  } = usePathProgress();

  const greeting =
    currentTime.getHours() < 12
      ? "Good morning"
      : currentTime.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  const calculateLearningStreak = () => {
    const today = new Date();
    const completionDates = new Set<string>();

    paths.forEach(path => {
      const pathSlug = formatSlug(path.title)
      
      const pathProgress = getPathProgress(path.id, pathSlug);
      
      if (pathProgress) {
        Object.values(pathProgress.items).forEach(item => {
          if (item.status === 'done' && item.completedAt) {
            const completionDate = new Date(item.completedAt);
            const dateStr = completionDate.toISOString().split('T')[0];
            completionDates.add(dateStr);
          }
        });
      }
    });


    let streak = 0;
    const currentDate = new Date(today);
    

    const todayStr = today.toISOString().split('T')[0];
    const checkingToday = completionDates.has(todayStr);
    
    if (!checkingToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (completionDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const learningStreak = calculateLearningStreak();

  const weeklyStudyTime = paths.reduce((total, path) => {
    const pathSlug = formatSlug(path.title)
    
    const { progress } = calculateProgress(path.id, pathSlug);
    const timeStr = path.estimatedTime || "0 hours";
    const hours = parseInt(timeStr.match(/(\d+)/)?.[1] || "0");
    
    return total + (hours * progress / 100);
  }, 0);

  const completedPaths = paths.filter(path => {
    const pathSlug = formatSlug(path.title)
    
    const { progress } = calculateProgress(path.id, pathSlug);
    return progress === 100;
  }).length;

  

  return (
    <div className="p-6 space-y-8 mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {greeting}, {user?.user_metadata?.name.split(' ')[0]}👋
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
            <Button variant="outline" size="lg" asChild className="disabled:opacity-50">
              <Link to="/dashboard/mentor">
                <Brain className="w-4 h-4 mr-2" />
                Ask AI Mentor
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-card bg-cyan-200/10 ">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Learning Streak</p>
                  <p className="text-2xl font-bold">
                    {learningStreak} {learningStreak === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStudyTime.toFixed(1)}h</p>
                </div>
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6 rounded-md border border--neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Paths</p>
                  <p className="text-2xl font-bold text-foreground">{completedPaths}</p>
                </div>
                <BookOpen className="w-6 h-6 text-slate-400" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <div className="grid">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border shadow-card rounded-md ">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Current Learning Paths
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard/paths">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {paths.length > 0 ? paths.map((path) => (
                <div
                  key={path.id}
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-xl text-card-foreground group-hover:text-primary transition-colors">
                          {path.title}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {path.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm lg:text-base text-muted-foreground mb-3">
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
                  </div>
                </div>
              )) : (
                <div className="p-4 rounded-lg border border-border bg-card text-center">
                  <h3 className="font-medium text-foreground mb-2">No Active Learning Paths</h3>
                  <p className="text-muted-foreground mb-4">Start your learning journey by creating a new path</p>
                  <Button asChild>
                    <Link to="/dashboard/create-path">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Path
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
