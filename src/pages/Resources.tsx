import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  Code, 
  Download, 
  Search, 
  Filter, 
  Star, 
  Clock,
  Users,
  ExternalLink,
  Play
} from "lucide-react";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const courses = [
    {
      id: 1,
      title: "Complete JavaScript Course",
      description: "Master JavaScript from basics to advanced concepts",
      author: "Damola Olutoke",
      duration: "12 hours",
      rating: 4.8,
      students: 2400,
      type: "video",
      level: "Beginner",
      tags: ["JavaScript", "Fundamentals"]
    },
    {
      id: 2,
      title: "React Development Masterclass",
      description: "Build modern web applications with React",
      author: "Jane Smith",
      duration: "18 hours",
      rating: 4.9,
      students: 1800,
      type: "video",
      level: "Intermediate",
      tags: ["React", "Frontend"]
    },
    {
      id: 3,
      title: "Node.js Backend Development",
      description: "Server-side JavaScript with Node.js and Express",
      author: "Mike Johnson",
      duration: "15 hours",
      rating: 4.7,
      students: 1200,
      type: "video",
      level: "Intermediate",
      tags: ["Node.js", "Backend"]
    }
  ];

  const books = [
    {
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      description: "A handbook of agile software craftsmanship",
      pages: 464,
      rating: 4.9,
      format: "PDF, EPUB",
      tags: ["Best Practices", "Programming"]
    },
    {
      id: 2,
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      description: "Essential patterns for modern JavaScript development",
      pages: 176,
      rating: 4.6,
      format: "PDF, EPUB",
      tags: ["JavaScript", "Fundamentals"]
    }
  ];

  const tools = [
    {
      id: 1,
      name: "VS Code",
      description: "Lightweight but powerful source code editor",
      category: "IDE",
      price: "Free",
      tags: ["Editor", "Development"]
    },
    {
      id: 2,
      name: "Figma",
      description: "Collaborative interface design tool",
      category: "Design",
      price: "Free/Paid",
      tags: ["Design", "UI/UX"]
    },
    {
      id: 3,
      name: "GitHub",
      description: "Version control and collaboration platform",
      category: "Version Control",
      price: "Free/Paid",
      tags: ["Git", "Collaboration"]
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-satoshi font-bold text-foreground">Learning Resources</h1>
        <p className="text-muted-foreground mt-2">Discover courses, books, tools, and materials to enhance your learning</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Downloads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      
                      <p className="text-muted-foreground">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students.toLocaleString()} students
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-warning" />
                          {course.rating}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Course
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <p className="text-muted-foreground">{book.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{book.pages} pages</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-warning" />
                        {book.rating}
                      </div>
                      <span>{book.format}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {book.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <Badge variant="outline">{tool.category}</Badge>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">{tool.price}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {tool.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Downloads</CardTitle>
              <CardDescription>Cheat sheets, templates, and reference materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No downloads available yet</h3>
                <p className="text-muted-foreground">Check back later for downloadable resources</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;