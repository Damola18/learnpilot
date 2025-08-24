import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Target, TrendingUp, BookOpen, Award } from "lucide-react";
import { useLearningPaths } from "@/contexts/LearningPathsContext";


export interface ProgressData {
  subject: string;
  progress: number;
  timeSpent: string;
  badge: string;
}

const Progress = () => {
    const {
    paths,
  } = useLearningPaths()

const progressData: ProgressData[] = paths.map((path) => ({
  subject: path.description,
  progress: path.progress,
  timeSpent: path.estimatedTime,
  badge: path.difficulty,
}));

  const weeklyStats = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.5 },
    { day: "Wed", hours: 3.0 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 1.0 },
    { day: "Sat", hours: 4.0 },
    { day: "Sun", hours: 2.5 },
  ];


  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-satoshi font-bold text-foreground">Learning Progress</h1>
        <p className="text-muted-foreground mt-2">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62.5h</div>
            <p className="text-xs text-success">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-success">+1 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 days</div>
            <p className="text-xs text-primary">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Current Learning Paths
          </CardTitle>
          <CardDescription>Your progress in active learning paths</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressData.map((item, index) => (
            <div key={index} className="space-y-2 p-3 border border-slate-200 rounded-xl ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className=" text-lg font-medium">{item.subject}</h4>
                  <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {item.timeSpent}
                </div>
              </div>
              <p className="text-xs" >Progress:</p>
              <div className="flex items-center gap-3">
                <ProgressBar value={item.progress} className="flex-1 h-2 " />
                <span className="text-sm font-medium text-primary">{item.progress}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Hours spent learning this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 gap-2">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="bg-primary/20 hover:bg-primary/30 transition-colors rounded-t-md w-full"
                  style={{ height: `${(stat.hours / 4) * 100}%` }}
                />
                <div className="text-xs text-muted-foreground">{stat.day}</div>
                <div className="text-xs font-medium">{stat.hours}h</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;