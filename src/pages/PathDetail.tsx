import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  Users,
  CheckCircle,
  Circle,
  Pause,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Loader2,
  Brain,
  NotebookPen,
  NotebookText,
  XCircle,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLearningPaths } from '@/contexts/LearningPathsContext';
import { slugToTitle } from '@/utils/slugUtils';
import { GeneratedLearningPath } from '@/services/iqaiCurriculumService';
import { usePathProgress } from "@/contexts/PathProgressContext";
import { formatPathDuration } from "@/utils/timeFormatUtils";
import { LearningPath } from "./LearningPaths";

interface PathItem {
  id: string;
  title: string;
  duration: string;
  status: "pending" | "done" | "in-progress" | "skip";
  type: "lesson" | "quiz" | "role-play" | "resource" | "assessment";
  description?: string;
}

interface PathSection {
  id: string;
  title: string;
  items: PathItem[];
  totalDuration: string;
  isExpanded: boolean;
  description?: string;
}

interface PathData {
  id: string;
  title: string;
  slug: string;
  description: string;
  sections: PathSection[];
  totalProgress: number;
  completedItems: number;
  totalItems: number;
  difficulty?: string;
  estimatedTime?: string;
}

export default function PathDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { paths: learningPaths, updatePath } = useLearningPaths();
  const { getPathProgress, updateItemStatus, initializePathProgress, calculateProgress } = usePathProgress();

  const [pathData, setPathData] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPathData = async () => {
      if (!slug) {
        setError("No path slug provided");
        setLoading(false);
        return;
      }

      try {
        const matchingPath = learningPaths.find(path => {
          const pathSlug = path.title.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
          return pathSlug === slug;
        });

        if (!matchingPath) {
          setError("Learning path not found");
          setLoading(false);
          return;
        }

        const convertedData = convertToPathData(matchingPath, slug);


        initializePathProgress(matchingPath.id, slug, convertedData.totalItems);

        const savedProgress = getPathProgress(matchingPath.id, slug);

        if (savedProgress) {

          const sectionsWithProgress = convertedData.sections.map(section => ({
            ...section,
            isExpanded: section.isExpanded,
            items: section.items.map(item => ({
              ...item,
              status: savedProgress.items[item.id]?.status || item.status
            }))
          }));

          convertedData.sections = sectionsWithProgress;
          convertedData.totalProgress = savedProgress.totalProgress;
          convertedData.completedItems = savedProgress.completedItems;
        }

        setPathData(convertedData);
        updatePath(matchingPath.id, {
          lastAccessed: new Date().toLocaleString(),
          progress: convertedData.totalProgress,
          completedModules: convertedData.completedItems,
          status: convertedData.totalProgress === 100 ? 'completed' :
            convertedData.totalProgress > 0 ? 'active' : 'not_started'
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading path data:', err);
        setError("Failed to load learning path data");
        setLoading(false);
      }
    };

    loadPathData();
  });
  console.log(pathData)
  const convertToPathData = (learningPath: any, slug: string): PathData => {
    const generatedPath = learningPath.generatedPath as GeneratedLearningPath;

    if (!generatedPath) {
      return {
        id: learningPath.id,
        title: learningPath.title,
        slug: slug,
        description: learningPath.description,
        sections: [],
        totalProgress: learningPath.progress || 0,
        completedItems: learningPath.completedModules || 0,
        totalItems: learningPath.totalModules || 0,
        difficulty: learningPath.difficulty,
        estimatedTime: learningPath.estimatedTime
      };
    }

    // Convert modules to sections
    const sections: PathSection[] = generatedPath.modules.map((module, index) => ({
      id: module.id,
      title: `Section ${index + 1}: ${module.title}`,
      description: module.description,
      totalDuration: `${module.duration} min`,
      isExpanded: index === 0,
      items: [
        ...module.competencies.map((competency, compIndex) => ({
          id: `${module.id}-competency-${compIndex}`,
          title: competency,
          duration: `${Math.ceil(Number(module.duration) / (module.competencies.length + module.resources.length + module.assessments.length))} min`,
          status: "pending" as const,
          type: "lesson" as const,
          description: `Learn about ${competency}`
        })),
        ...module.resources.map((resource, resIndex) => ({
          id: `${module.id}-resource-${resIndex}`,
          title: resource.title,
          duration: "5 min",
          status: "pending" as const,
          type: "resource" as const,
          description: `Resource: ${resource.title}`
        })),

        ...module.assessments.map((assessment, assIndex) => ({
          id: `${module.id}-assessment-${assIndex}`,
          title: assessment.title,
          duration: "10 min",
          status: "pending" as const,
          type: assessment.type === 'quiz' ? "quiz" as const : "assessment" as const,
          description: assessment.description
        }))
      ]
    }));

    const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
    const completedItems = sections.reduce((sum, section) =>
      sum + section.items.filter(item => item.status === 'done').length, 0
    );

    return {
      id: generatedPath.id,
      title: generatedPath.title,
      slug: slug,
      description: generatedPath.description,
      sections: sections,
      totalProgress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      completedItems: completedItems,
      totalItems: totalItems,
      difficulty: generatedPath.difficulty,
      estimatedTime: `${generatedPath.totalDuration} min`
    };
  };

  const handleStatusChange = (sectionId: string, itemId: string, newStatus: string) => {
    if (!pathData) return;

    const matchingPath = learningPaths.find(path => {
      const pathSlug = path.title.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return pathSlug === slug;
    });

    if (matchingPath) {
      updateItemStatus(matchingPath.id, slug!, itemId, newStatus);

      const { progress, completed } = calculateProgress(matchingPath.id, slug!);

      setPathData(prevPathData => {
        if (!prevPathData) return null;

        const updatedSections = prevPathData.sections.map(section =>
          section.id === sectionId
            ? {
              ...section,
              items: section.items.map(item =>
                item.id === itemId
                  ? { ...item, status: newStatus as "pending" | "done" | "in-progress" | "skip" }
                  : item
              )
            }
            : section
        );

        return {
          ...prevPathData,
          sections: updatedSections,
          totalProgress: progress,
          completedItems: completed
        };
      });

      updatePath(matchingPath.id, {
        progress: progress,
        completedModules: completed,
        status: progress === 100 ? 'completed' : progress > 0 ? 'active' : 'not_started',
        lastAccessed: new Date().toLocaleString()
      });
    }
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setPathData(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        sections: prev.sections.map(s =>
          s.id === sectionId
            ? { ...s, isExpanded: !s.isExpanded }
            : s
        )
      };
      return updated;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-5 h-5 text-green-300 bg-green-500/20 rounded-full" />;
      case "in-progress":
        return <PlayCircle className="w-5 h-5 text-yellow-300 bg-yellow-500/20 rounded-full" />;
      case "skip":
        return <XCircle className="w-5 h-5 text-red-300 bg-red-500/20 rounded-full " />;
      default:
        return <Circle className="w-5 h-5 text-slate-300 bg-slate-500/5 rounded-full" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "role-play":
        return <Users className="w-4 h-4 text-primary" />;
      case "quiz":
        return <NotebookText className="w-4 h-4 text-orange-300" />;
      case "assessment":
        return <NotebookPen className="w-4 h-4 text-red-300" />;
      case "resource":
        return <Brain className="w-4 h-4 text-yellow-300" />;
      default:
        return <BookOpen className="w-4 h-4 text-green-300" />;
    }
  };


  const getTypeLabel = (type: string) => {
    switch (type) {
      case "role-play":
        return "Role Play";
      case "quiz":
        return "Quiz";
      case "assessment":
        return "Assessment";
      case "resource":
        return "Resource";
      default:
        return "Lesson";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading learning path...</p>
        </div>
      </div>
    );
  }

  if (error || !pathData) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Path Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The learning path you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link to="/dashboard/paths">Back to Learning Paths</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/paths">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Paths
          </Link>
        </Button>
      </div>

      {/* Path Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{pathData.description}</CardTitle>
              <p className="text-muted-foreground mb-4">Goal: {pathData.title}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {pathData.difficulty && (
                  <div className="flex items-center gap-1">
                    <Badge className="capitalize font-thin" variant="outline">{pathData.difficulty}</Badge>
                  </div>
                )}
                {pathData.estimatedTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatPathDuration(pathData.estimatedTime)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span>{pathData.completedItems}/{pathData.totalItems} completed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{pathData.totalProgress}%</span>
            </div>
            <Progress value={pathData.totalProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Sections */}
      <div className="space-y-4">
        {pathData.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSectionExpanded(section.id)
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatPathDuration(section.totalDuration)}</span>
                    </div>
                    <span>{section.items.filter(item => item.status === 'done').length}/{section.items.length} items completed</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {section.isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </CardHeader>

            {section.isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors, ${item.status === "done" && "bg-green-500/10 hover:bg-green-500/10"}`}>
                      <div className="flex-shrink-0">
                        {getStatusIcon(item.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(item.type)}
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          {getTypeLabel(item.type) && (
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(item.type)}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{item.duration !== "NaN min" ? item.duration : "5 min"}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Select
                          value={item.status}
                          onValueChange={(value) => handleStatusChange(section.id, item.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                            <SelectItem value="skip">Skip</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}