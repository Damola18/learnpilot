import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Target } from "lucide-react";
import { useLearningPaths } from "@/contexts/LearningPathsContext";
import { usePathProgress } from "@/contexts/PathProgressContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PathProgress {
  items: Record<string, { status: string; completedAt?: string }>;
  lastAccessed?: string;
}

interface ProgressData {
  subject: string;
  progress: number;
  timeSpent: string;
  badge: string;
}

interface WeeklyStat {
  day: string;
  hours: number;
  date: string;
}

const Progress = () => {
  const { paths } = useLearningPaths();
  const { getPathProgress, calculateProgress } = usePathProgress();

  const pathsProgressData: ProgressData[] = paths.map((path) => {
    const pathSlug = path.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const { progress } = calculateProgress(path.id, pathSlug);
    
    return {
      subject: path.title,
      progress: progress,
      timeSpent: path.estimatedTime || '0 hours',
      badge: path.difficulty,
    };
  });

  // Helper function to extract hours from duration strings
  const extractHours = (timeStr: string): number => {
    const hoursMatch = timeStr.match(/(\d+)\s*hours?/i);
    if (hoursMatch) {
      return parseInt(hoursMatch[1]);
    }
    const minutesMatch = timeStr.match(/(\d+)\s*min/i);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]) / 60;
    }
    const numberMatch = timeStr.match(/(\d+)/);
    return numberMatch ? parseInt(numberMatch[1]) : 0;
  };

  // Calculate weekly stats based on individual item completions
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyStats: WeeklyStat[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    
    const hoursForDay = paths.reduce((total, path) => {
      const pathSlug = path.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const pathProgress = getPathProgress(path.id, pathSlug);
      if (!pathProgress || !pathProgress.items) return total;

      // Get total hours for this path
      const pathHours = extractHours(path.estimatedTime || "0 hours");
      
      // Calculate current progress percentage
      const { progress } = calculateProgress(path.id, pathSlug);
      
      // Only count hours if there's actual progress
      if (progress === 0) return total;
      

      const completedItemsOnDate = Object.values(pathProgress.items).filter(item => {
        if (item.status !== 'done' || !item.completedAt) return false;
        
        const completedDate = new Date(item.completedAt);
        return (
          completedDate.getDate() === date.getDate() &&
          completedDate.getMonth() === date.getMonth() &&
          completedDate.getFullYear() === date.getFullYear()
        );
      }).length;

      const totalItems = Object.keys(pathProgress.items).length;
      if (totalItems > 0 && completedItemsOnDate > 0) {
        const actualHoursInvested = (pathHours * progress) / 100;
        const totalCompletedItems = Object.values(pathProgress.items).filter(item => item.status === 'done').length;
        const hoursPerCompletedItem = totalCompletedItems > 0 ? actualHoursInvested / totalCompletedItems : 0;
        const dayHours = hoursPerCompletedItem * completedItemsOnDate;
        
        console.log(`${path.title} on ${date.toDateString()}:`, {
          pathHours,
          progress: `${progress}%`,
          actualHoursInvested,
          totalCompletedItems,
          completedItemsOnDate,
          hoursPerCompletedItem,
          dayHours
        });
        
        return total + dayHours;
      }
      
      return total;
    }, 0);

    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
      hours: Math.round(hoursForDay * 10) / 10,
      date: date.toISOString()
    };
  });

  console.log('Weekly Stats (based on item completions):', weeklyStats);


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-primary">
            {`Hours: ${payload[0].value}h`}
          </p>
        </div>
      );
    }
    return null;
  };

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
          {pathsProgressData.map((item, index) => (
            <div key={index} className="space-y-2 p-3 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-medium">{item.subject}</h4>
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
                <ProgressBar value={item.progress} className="flex-1 h-2" />
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
          <CardDescription>Hours spent learning this week (based on completed items)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyStats}
                margin={{
                  top: 0,
                  right: 30,
                  left: 20,
                  bottom: 0,
                }}
                maxBarSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-sm text-muted-foreground"
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="hours" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  minPointSize={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;