import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GeneratedLearningPath, iqaiCurriculumService } from "@/services/iqaiCurriculumService";
import { parseDurationToHours } from "@/utils/durationUtils";
import { usePathProgress } from '@/contexts/PathProgressContext';  

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  difficulty: string;
  estimatedTime: string;
  category: string;
  status: "not_started" | "active" | "completed";
  rating: number;
  enrollments: number;
  color: string;
  tags: string[];
  lastAccessed: string;
  createdAt: string;
  generatedPath?: GeneratedLearningPath;
}

interface LearningPathsContextType {
  paths: LearningPath[];
  addPath: (generatedPath: GeneratedLearningPath, formData: any) => void;
  updatePath: (id: string, updates: Partial<LearningPath>) => void;
  getPath: (id: string) => LearningPath | undefined;
  getTotalPaths: () => number;
  getActivePaths: () => number;
  getCompletedPaths: () => number;
  getTotalHours: () => number;
}

const LearningPathsContext = createContext<LearningPathsContextType | undefined>(undefined);

const difficultyColors = {
  "Beginner": "bg-green-500",
  "Intermediate": "bg-blue-500",
  "Advanced": "bg-purple-500"
};

const generateTags = (domain: string, experienceLevel: string): string[] => {
  const tags = [experienceLevel];
  
  // Add domain-specific tags
  switch (domain) {
    case "Frontend Development":
      tags.push("Frontend", "JavaScript", "React");
      break;
    case "Backend Development":
      tags.push("Backend", "API", "Database");
      break;
    case "Mobile Development":
      tags.push("Mobile", "React Native", "iOS", "Android");
      break;
    case "Data Science":
      tags.push("Python", "ML", "Data Science");
      break;
    case "Machine Learning":
      tags.push("Python", "ML", "AI");
      break;
    case "DevOps":
      tags.push("Docker", "Kubernetes", "DevOps");
      break;
    case "UX/UI Design":
      tags.push("Design", "UX", "Figma");
      break;
    default:
      tags.push(domain.split(" ")[0]);
  }
  
  return tags;
};

export function LearningPathsProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const {
    getPathProgress,
} = usePathProgress()

  // Load paths from server on mount
  useEffect(() => {
    const loadPaths = async () => {
        try {
            const response = await iqaiCurriculumService.getStoredLearningPaths();
            if (response && response.paths) {
                const formattedPaths = response.paths.map((path: any) => {
                    // Calculate initial completed modules count
                    let completedModuleCount = 0;
                    if (path.curriculum?.modules) {
                        const pathProgress = getPathProgress(path.id, path.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, ''));
                        
                        if (pathProgress) {
                            completedModuleCount = path.curriculum.modules.filter((module: any, index: number) => {
                                const sectionId = module.id || `section-${index}`;
                                const moduleItems = [
                                    ...(module.competencies || []).map(
                                        (_, compIndex: number) => `${sectionId}-competency-${compIndex}`,
                                    ),
                                    ...(module.resources || []).map(
                                        (_, resIndex: number) => `${sectionId}-resource-${resIndex}`,
                                    ),
                                    ...(module.assessments || []).map(
                                        (_, assIndex: number) => `${sectionId}-assessment-${assIndex}`,
                                    ),
                                ];

                                if (moduleItems.length === 0) {
                                    return false;
                                }

                                return moduleItems.every((itemId) => {
                                    const itemProgress = pathProgress.items[itemId];
                                    return itemProgress?.status === 'done';
                                });
                            }).length;
                        }
                    }

                    return {
                        id: path.id,
                        title: path.title,
                        description: path.description,
                        progress: 0,
                        totalModules: path.curriculum?.modules?.length || 0,
                        completedModules: completedModuleCount,
                        difficulty: path.difficulty || 'Intermediate',
                        estimatedTime: calculateDuration(path.curriculum),
                        category: path.domain || 'General',
                        status: path.status || 'not_started',
                        rating: 4.5,
                        enrollments: 1,
                        color: difficultyColors[path.difficulty || 'Intermediate'],
                        tags: path.curriculum?.tags || [],
                        lastAccessed: path.updated_at ? new Date(path.updated_at).toISOString() : 'Never',
                        createdAt: path.created_at ? new Date(path.created_at).toISOString() : new Date().toISOString(),
                        generatedPath: path.curriculum
                    };
                });
                setPaths(formattedPaths);
            }
        } catch (error) {
            console.error('Error loading paths:', error);
        }
    };

    loadPaths();
}, []);

  useEffect(() => {
    localStorage.setItem('learningPaths', JSON.stringify(paths));
  }, [paths]);

  const addPath = (generatedPath: GeneratedLearningPath, formData: any) => {
    const newPath: LearningPath = {
      id: `path-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      progress: 0,
      totalModules: generatedPath.modules.length,
      completedModules: 0,
      difficulty: formData.experienceLevel === 'beginner' ? 'Beginner' : 
                  formData.experienceLevel === 'intermediate' ? 'Intermediate' : 'Advanced',
      estimatedTime: `${Math.ceil(generatedPath.modules.reduce((acc: number, module) => acc + parseDurationToHours(module.duration), 0))} hours`,
      category: formData.domain,
      status: "not_started",
      rating: 0,
      enrollments: 1,
      color: difficultyColors[formData.experienceLevel === 'beginner' ? 'Beginner' : 
                             formData.experienceLevel === 'intermediate' ? 'Intermediate' : 'Advanced'],
      tags: generateTags(formData.domain, formData.experienceLevel),
      lastAccessed: "Never",
      createdAt: new Date().toISOString(),
      generatedPath
    };

    setPaths(prev => [newPath, ...prev]);
  };

  const updatePath = (id: string, updates: Partial<LearningPath>) => {
    setPaths(prev => prev.map(path => {
      if (path.id === id) {
        let newStatus = path.status;
        if (updates.progress !== undefined) {
          if (updates.progress === 100) {
            newStatus = "completed";
          } else if (updates.progress > 0) {
            newStatus = "active";
          } else if (!path.progress && !updates.progress) {
            newStatus = "not_started";
          }
        }
        
        return { 
          ...path, 
          ...updates,
          status: updates.status || newStatus 
        };
      }
      return path;
    }));
  };

  const getPath = (id: string) => {
    return paths.find(path => path.id === id);
  };

  const getTotalPaths = () => paths.length;
  
  const getActivePaths = () => paths.filter(p => p.status === "active").length;
  
  const getCompletedPaths = () => paths.filter(p => p.status === "completed").length;
  
  const getTotalHours = () => {
    return paths.reduce((acc, path) => {
      const hours = parseInt(path.estimatedTime.replace(' hours', '')) || 0;
      return acc + hours;
    }, 0);
  };

  return (
    <LearningPathsContext.Provider value={{
      paths,
      addPath,
      updatePath,
      getPath,
      getTotalPaths,
      getActivePaths,
      getCompletedPaths,
      getTotalHours
    }}>
      {children}
    </LearningPathsContext.Provider>
  );
}

export function useLearningPaths() {
  const context = useContext(LearningPathsContext);
  if (context === undefined) {
    throw new Error('useLearningPaths must be used within a LearningPathsProvider');
  }
  return context;
}

const calculateDuration = (curriculum: any): string => {
  if (!curriculum?.modules) return '2 hours';

  if (curriculum.totalDuration) {
    const totalDurationStr = curriculum.totalDuration.toString();

    const hoursInParenMatch = totalDurationStr.match(/\(~?(\d+)\s*hours?\)/i);
    if (hoursInParenMatch) {
      const hours = parseInt(hoursInParenMatch[1]);
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }

    const directHoursMatch = totalDurationStr.match(/^(\d+)\s*hours?$/i);
    if (directHoursMatch) {
      return curriculum.totalDuration;
    }

    const weeksMatch = totalDurationStr.match(/(\d+)\s*weeks?/i);
    if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      const estimatedHours = weeks * 10; 
      return `${estimatedHours} hours`;
    }

    return curriculum.totalDuration;
  }

  let totalMinutes = 0;
  curriculum.modules.forEach((module: any) => {
    if (module.duration) {
      const durationStr = module.duration.toString();
      const hoursMatch = durationStr.match(/(\d+)\s*hours?/i);
      const minutesMatch = durationStr.match(/(\d+)\s*min/i);

      if (hoursMatch) {
        totalMinutes += parseInt(hoursMatch[1]) * 60;
      } else if (minutesMatch) {
        totalMinutes += parseInt(minutesMatch[1]);
      } else {
        const duration = parseInt(durationStr) || 30;
        totalMinutes += duration;
      }
    } else {
      totalMinutes += 30;
    }
  });

  const hours = Math.max(1, Math.ceil(totalMinutes / 60));
  return hours === 1 ? '1 hour' : `${hours} hours`;
};