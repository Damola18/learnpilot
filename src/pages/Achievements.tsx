import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  BookOpen, 
  Clock, 
  Users,
  Zap,
  Crown,
  Medal
} from "lucide-react";

const Achievements = () => {
  const earnedBadges = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first learning module",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      earnedDate: "2024-01-15",
      category: "Beginner"
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "Maintain a 7-day learning streak",
      icon: Flame,
      color: "text-warning",
      bgColor: "bg-warning/10",
      earnedDate: "2024-01-22",
      category: "Streak"
    },
    {
      id: 3,
      name: "JavaScript Explorer",
      description: "Complete JavaScript Fundamentals path",
      icon: BookOpen,
      color: "text-success",
      bgColor: "bg-success/10",
      earnedDate: "2024-02-10",
      category: "Completion"
    },
    {
      id: 4,
      name: "Night Owl",
      description: "Study for 10 hours in a week",
      icon: Clock,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
      earnedDate: "2024-02-18",
      category: "Time"
    }
  ];

  const upcomingBadges = [
    {
      id: 5,
      name: "React Master",
      description: "Complete React Development path",
      icon: Crown,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      progress: 60,
      requirement: "Complete 8 more modules",
      category: "Completion"
    },
    {
      id: 6,
      name: "Consistency King",
      description: "Maintain a 30-day learning streak",
      icon: Trophy,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      progress: 50,
      requirement: "Continue streak for 15 more days",
      category: "Streak"
    },
    {
      id: 7,
      name: "Speed Learner",
      description: "Complete 3 assessments with 90+ score",
      icon: Zap,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      progress: 33,
      requirement: "Complete 2 more assessments",
      category: "Performance"
    },
    {
      id: 8,
      name: "Community Helper",
      description: "Help 5 fellow learners in discussions",
      icon: Users,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      progress: 20,
      requirement: "Help 4 more learners",
      category: "Social"
    }
  ];

  const stats = {
    totalBadges: earnedBadges.length,
    totalPoints: 2850,
    currentStreak: 15,
    bestStreak: 23,
    rank: "Advanced Learner",
    nextRank: "Expert"
  };

  const categories = [
    { name: "All", count: earnedBadges.length + upcomingBadges.length },
    { name: "Completion", count: 2 },
    { name: "Streak", count: 2 },
    { name: "Time", count: 1 },
    { name: "Performance", count: 1 },
    { name: "Social", count: 1 }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-satoshi font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground mt-2">Track your learning milestones and badges</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBadges}</div>
            <p className="text-xs text-success">+2 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-primary">+180 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Best: {stats.bestStreak} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.rank}</div>
            <p className="text-xs text-primary">Next: {stats.nextRank}</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Tabs */}
      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="earned" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Earned ({earnedBadges.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Upcoming ({upcomingBadges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <Card key={badge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${badge.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${badge.color}`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {badge.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <p className="text-xs text-success font-medium">
                          Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <Card key={badge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${badge.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${badge.color}`} />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-muted-foreground">{badge.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {badge.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Categories</CardTitle>
          <CardDescription>Your progress across different achievement types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div key={category.name} className="text-center p-3 rounded-lg border bg-card">
                <div className="text-lg font-bold text-primary">{category.count}</div>
                <div className="text-sm text-muted-foreground">{category.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;