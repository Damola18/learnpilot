import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  MapPin, 
  Calendar, 
  Trophy, 
  BookOpen, 
  Clock, 
  Target,
  Flame,
  Star,
  Edit,
  Award,
  TrendingUp,
  Mail,
  Phone
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  
  const userData = {
    name: user?.name || "Damola Olutoke",
    email: user?.email || "damola@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    joinDate: "January 2024",
    bio: "Passionate learner exploring new technologies and building amazing things.",
    avatar: user?.avatar || "/placeholder-avatar.jpg"
  };

  const stats = {
    totalHours: 124.5,
    completedPaths: 3,
    currentStreak: 15,
    totalBadges: 8,
    skillPoints: 2850,
  };

  const currentPaths = [
    {
      id: 1,
      name: "React Development",
      progress: 60,
      modules: { completed: 12, total: 20 }
    },
    {
      id: 2,
      name: "Node.js Backend",
      progress: 25,
      modules: { completed: 5, total: 20 }
    }
  ];

  const topSkills = [
    { name: "JavaScript", level: 85 },
    { name: "React", level: 70 },
    { name: "HTML/CSS", level: 90 },
    { name: "Git", level: 75 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={userData.avatar} alt="Profile" />
                <AvatarFallback className="text-lg font-semibold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              {!isEditing ? (
                <>
                  <div>
                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                    <p className="text-muted-foreground">{userData.bio}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {userData.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {userData.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {userData.joinDate}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/5">
                      <div className="text-lg font-bold text-primary">{stats.totalHours}h</div>
                      <div className="text-xs text-muted-foreground">Learning Time</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-success/5">
                      <div className="text-lg font-bold text-success">{stats.completedPaths}</div>
                      <div className="text-xs text-muted-foreground">Completed Paths</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-warning/5">
                      <div className="text-lg font-bold text-warning">{stats.currentStreak}</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent">
                      <div className="text-lg font-bold">{stats.totalBadges}</div>
                      <div className="text-xs text-muted-foreground">Badges</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={userData.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={userData.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue={userData.location} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" defaultValue={userData.bio} />
                  </div>
                  <Button onClick={() => setIsEditing(false)}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Current Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPaths.map((path) => (
            <div key={path.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{path.name}</h4>
                <span className="text-sm text-primary">{path.progress}%</span>
              </div>
              <Progress value={path.progress} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{path.modules.completed}/{path.modules.total} modules</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSkills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-primary">{skill.level}%</span>
                </div>
                <Progress value={skill.level} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;