import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Target, TrendingUp, BookOpen, Award } from "lucide-react";
import { useLearningPaths } from "@/contexts/LearningPathsContext";
import { usePathProgress } from "@/contexts/PathProgressContext";
export interface ProgressData {
  subject: string;
  progress: number;
  timeSpent: string;
  badge: string;
}

const Progress = () => {
  const { paths } = useLearningPaths()

  const {
    getPathProgress,
    calculateProgress
  } = usePathProgress();

  const progressData: ProgressData[] = paths.map((path) => {
    const progress = Math.round((path.completedModules / path.totalModules) * 100) || 0;
    return {
      subject: path.title,
      progress: progress,
      timeSpent: path.estimatedTime,
      badge: path.difficulty,
    };
  });

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    
    const hoursForDay = paths.reduce((total, path) => {
      if (!path.lastAccessed) return total;
      
      const accessDate = new Date(path.lastAccessed);

      if (
        accessDate.getDate() === date.getDate() &&
        accessDate.getMonth() === date.getMonth() &&
        accessDate.getFullYear() === date.getFullYear()
      ) {

        const hours = extractHours(path.estimatedTime || "0 hours");
        
        const currentProgress = path.progress || 0;
        const previousProgress = path.previousProgress || 0;
        const progressIncrement = Math.max(0, currentProgress - previousProgress);
        
        const studyTime = (hours * progressIncrement) / 100;
        console.log(`Day ${date.toDateString()}: Progress from ${previousProgress}% to ${currentProgress}% = ${studyTime}h`);
        
        return total + studyTime;
      }
      return total;
    }, 0);

    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      hours: Number(hoursForDay.toFixed(1)) 
    };
  });



  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-satoshi font-bold text-foreground">Learning Progress</h1>
        <p className="text-muted-foreground mt-2">Track your learning journey and achievements</p>
      </div>

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
              <p className="text-xs">
                Progress:{" "}
                <span className="text-sm font-medium text-primary">{item.progress}%</span>
              </p>
              <div className="flex items-center gap-3">
                <ProgressBar value={item.progress} className="flex-1 h-2 " />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
                  className="w-full bg-primary rounded-sm"
                  style={{
                    height: `${(stat.hours / Math.max(...weeklyStats.map(s => s.hours))) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs font-medium">{stat.day}</span>
                <span className="text-xs text-muted-foreground">{stat.hours.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;


const extractHours = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)\s*hours?/);
  return match ? parseInt(match[1]) : 0;
};