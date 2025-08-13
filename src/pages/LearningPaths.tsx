import { useState } from "react";
import {
  BookOpen,
  Clock,
  Target,
  Filter,
  Search,
  Plus,
  PlayCircle,
  MoreVertical,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Download,
  Edit,
  Eye,
  Archive,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LearningPath {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  difficulty: string;
  estimatedTime: string;
  category: string;
  status: "active" | "completed" | "not_started";
  rating: number;
  enrollments: number;
  color: string;
  tags: string[];
  lastAccessed: string;
}

interface EditFormData {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  category: string;
}

const mockPaths: LearningPath[] = [
  {
    id: 1,
    title: "React Advanced Concepts",
    description: "Master hooks, context, performance optimization, and advanced patterns",
    progress: 65,
    totalModules: 12,
    completedModules: 8,
    difficulty: "Intermediate",
    estimatedTime: "24 hours",
    category: "Frontend Development",
    status: "active",
    rating: 4.8,
    enrollments: 1250,
    color: "bg-blue-500",
    tags: ["React", "JavaScript", "Hooks"],
    lastAccessed: "2 hours ago",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Complete introduction to ML algorithms, data preprocessing, and model evaluation",
    progress: 30,
    totalModules: 16,
    completedModules: 5,
    difficulty: "Beginner",
    estimatedTime: "32 hours",
    category: "Data Science",
    status: "active",
    rating: 4.9,
    enrollments: 2100,
    color: "bg-green-500",
    tags: ["Python", "ML", "Data Science"],
    lastAccessed: "1 day ago",
  },
  {
    id: 3,
    title: "UX Design Principles",
    description: "Learn user-centered design, prototyping, and usability testing",
    progress: 90,
    totalModules: 8,
    completedModules: 7,
    difficulty: "Intermediate",
    estimatedTime: "16 hours",
    category: "Design",
    status: "active",
    rating: 4.7,
    enrollments: 890,
    color: "bg-purple-500",
    tags: ["Design", "UX", "Figma"],
    lastAccessed: "3 days ago",
  },
  {
    id: 4,
    title: "Full-Stack JavaScript Development",
    description: "Build complete web applications with Node.js, Express, and MongoDB",
    progress: 0,
    totalModules: 20,
    completedModules: 0,
    difficulty: "Advanced",
    estimatedTime: "40 hours",
    category: "Full-Stack Development",
    status: "not_started",
    rating: 4.9,
    enrollments: 1560,
    color: "bg-yellow-500",
    tags: ["JavaScript", "Node.js", "MongoDB"],
    lastAccessed: "Never",
  },
  {
    id: 5,
    title: "DevOps with Docker & Kubernetes",
    description: "Master containerization and orchestration for modern applications",
    progress: 100,
    totalModules: 14,
    completedModules: 14,
    difficulty: "Advanced",
    estimatedTime: "28 hours",
    category: "DevOps",
    status: "completed",
    rating: 4.8,
    enrollments: 750,
    color: "bg-indigo-500",
    tags: ["Docker", "Kubernetes", "DevOps"],
    lastAccessed: "1 week ago",
  },
  {
    id: 6,
    title: "Mobile Development with React Native",
    description: "Build cross-platform mobile apps with React Native and Expo",
    progress: 45,
    totalModules: 18,
    completedModules: 8,
    difficulty: "Intermediate",
    estimatedTime: "36 hours",
    category: "Mobile Development",
    status: "active",
    rating: 4.6,
    enrollments: 980,
    color: "bg-pink-500",
    tags: ["React Native", "Mobile", "JavaScript"],
    lastAccessed: "5 hours ago",
  },
];

const categories = [
  "All Categories",
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "Data Science",
  "DevOps",
  "Design",
  "Full-Stack Development",
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const statuses = ["All Statuses", "Active", "Completed", "Not Started"];

export default function LearningPaths() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    description: "",
    difficulty: "",
    estimatedTime: "",
    category: "",
  });
  const { toast } = useToast();

  const filteredPaths = mockPaths.filter((path) => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Categories" || path.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All Levels" || path.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "All Statuses" || 
      (selectedStatus === "Active" && path.status === "active") ||
      (selectedStatus === "Completed" && path.status === "completed") ||
      (selectedStatus === "Not Started" && path.status === "not_started");

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleViewDetails = (path: LearningPath) => {
    setSelectedPath(path);
    setIsViewModalOpen(true);
  };

  const handleEditPath = (path: LearningPath) => {
    setSelectedPath(path);
    setEditFormData({
      title: path.title,
      description: path.description,
      difficulty: path.difficulty,
      estimatedTime: path.estimatedTime,
      category: path.category,
    });
    setIsEditModalOpen(true);
  };

  const handleDownloadProgress = (path: LearningPath) => {
    // Simulate download progress
    toast({
      title: "Download Started",
      description: `Progress report for "${path.title}" is being downloaded...`,
    });

    // Simulate download completion after 2 seconds
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `Progress report for "${path.title}" has been downloaded successfully.`,
      });
    }, 2000);
  };

  const handleArchivePath = (path: LearningPath) => {
    // Simulate archiving
    toast({
      title: "Path Archived",
      description: `"${path.title}" has been archived successfully.`,
    });
  };

  const handleSaveEdit = () => {
    // Simulate saving changes
    toast({
      title: "Changes Saved",
      description: `"${selectedPath?.title}" has been updated successfully.`,
    });
    setIsEditModalOpen(false);
  };

  const getStatusBadge = (status: string, progress: number) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case "active":
        return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = (path: LearningPath) => {
    switch (path.status) {
      case "completed":
        return (
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Review
          </Button>
        );
      case "active":
        return (
          <Button size="sm">
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue
          </Button>
        );
      case "not_started":
        return (
          <Button variant="outline" size="sm">
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Learning Paths</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Continue your learning journey or explore new paths
          </p>
        </div>
        <Button asChild size="lg" className="shadow-learning">
          <Link to="/create-path">
            <Plus className="w-4 h-4 mr-2" />
            Create New Path
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paths</p>
                <p className="text-2xl font-bold text-foreground">{mockPaths.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Paths</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockPaths.filter(p => p.status === "active").length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockPaths.filter(p => p.status === "completed").length}
                </p>
              </div>
              <Target className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockPaths.reduce((acc, path) => acc + parseInt(path.estimatedTime), 0)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-0 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search learning paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPaths.map((path) => (
          <Card
            key={path.id}
            className="border shadow-card hover:shadow-learning transition-all duration-200 group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${path.color}`} />
                    <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    {getStatusBadge(path.status, path.progress)}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {path.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {path.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleViewDetails(path)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditPath(path)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Path
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadProgress(path)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Progress
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleArchivePath(path)} className="text-destructive">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive Path
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Section */}
              {path.status !== "not_started" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{path.completedModules}/{path.totalModules} modules</span>
                    <span>Last accessed: {path.lastAccessed}</span>
                  </div>
                </div>
              )}

              {/* Path Info */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{path.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{path.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{path.enrollments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-warning" />
                    <span>{path.rating}</span>
                  </div>
                </div>

                {getActionButton(path)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPaths.length === 0 && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No learning paths found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or create a new learning path to get started.
            </p>
            <Button asChild>
              <Link to="/create-path">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Path
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPath?.title}</DialogTitle>
            <DialogDescription>
              {selectedPath?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <h4 className="text-sm font-semibold">Status:</h4>
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedPath?.status || "", selectedPath?.progress || 0)}
              </div>
              <h4 className="text-sm font-semibold">Progress:</h4>
              <div className="flex items-center gap-2">
                <Progress value={selectedPath?.progress || 0} className="h-2 flex-1" />
                <span className="text-sm font-medium">{selectedPath?.progress || 0}%</span>
              </div>
              <h4 className="text-sm font-semibold">Modules:</h4>
              <span className="text-sm">{selectedPath?.completedModules}/{selectedPath?.totalModules}</span>
              <h4 className="text-sm font-semibold">Last Accessed:</h4>
              <span className="text-sm">{selectedPath?.lastAccessed}</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPath?.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Learning Path</DialogTitle>
            <DialogDescription>
              Make changes to your learning path.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={editFormData.difficulty} onValueChange={(value) => setEditFormData({ ...editFormData, difficulty: value })}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select a difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                type="text"
                value={editFormData.estimatedTime}
                onChange={(e) => setEditFormData({ ...editFormData, estimatedTime: e.target.value })}
                placeholder="e.g., 24 hours"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={editFormData.category} onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                  <SelectItem value="Backend Development">Backend Development</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Full-Stack Development">Full-Stack Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}