import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GeneratedLearningPath } from "@/services/iqaiCurriculumService";
import { parseDurationToHours } from "@/utils/durationUtils";

interface LearningPath {
  id: string;
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
  createdAt: string;
  generatedPath?: GeneratedLearningPath;
  generatedSlug?: string;
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
  const [paths, setPaths] = useState<LearningPath[]>(() => {

    const saved = localStorage.getItem('learningPaths');
    return saved ? JSON.parse(saved) : [];
  });


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
    setPaths(prev => prev.map(path => 
      path.id === id ? { ...path, ...updates } : path
    ));
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