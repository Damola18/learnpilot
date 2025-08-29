import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Shuffle, Mail, MapPin, Calendar, Edit, Pen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    learningGoal: 'career'
  });
  const [avatarSeed, setAvatarSeed] = useState('');


  const userData = {
    name: user?.user_metadata?.name || user?.user_metadata?.firstName + ' ' + user?.user_metadata?.lastName || "User",
    email: user?.email || "", 
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }) : "Unknown",
  };


  const stats = {
    totalHours: 124.5,
    completedPaths: 3,
    currentStreak: 15,
    totalBadges: 8,
    skillPoints: 2850,
  };

  const generateAvatarUrl = (seed: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  };


  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setFormData({
        firstName: metadata.firstName || metadata.name?.split(' ')[0] || '',
        lastName: metadata.lastName || metadata.name?.split(' ')[1] || '',
        email: user.email || '',
        bio: metadata.bio || '',
        learningGoal: metadata.learningGoal || 'career'
      });
      setAvatarSeed(metadata.avatarSeed || user.email || 'default');
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateNewAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          bio: formData.bio,
          learningGoal: formData.learningGoal,
          avatarSeed: avatarSeed
        }
      });

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-satoshi font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile information and view your learning progress</p>
      </div>

      {/* User Data and Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile Overview</CardTitle>
          <CardDescription>Real-time view of your profile and learning statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage 
                  src={generateAvatarUrl(avatarSeed)} 
                  alt="Profile Avatar" 
                />
                <AvatarFallback className="text-lg font-semibold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{formData.bio || "No bio available"}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground justify-center md:justify-start">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {userData.joinDate}
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={generateAvatarUrl(avatarSeed)} 
                  alt="Profile Avatar" 
                />
                <AvatarFallback className="text-lg font-semibold">
                  {formData.firstName[0]}{formData.lastName[0]}
                </AvatarFallback>
              </Avatar>
             
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-background border-2 border-background shadow-md hover:bg-accent"
                onClick={generateNewAvatar}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </div>
          </div>
      

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="Enter your first name" 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Enter your last name" 
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={formData.email}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed from this page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input 
              id="bio" 
              placeholder="Tell us about yourself" 
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningGoal">Learning Goal</Label>
            <Select 
              value={formData.learningGoal} 
              onValueChange={(value) => handleInputChange('learningGoal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Career Advancement</SelectItem>
                <SelectItem value="hobby">Personal Interest</SelectItem>
                <SelectItem value="education">Academic Requirements</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;