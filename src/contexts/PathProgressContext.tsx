import { iqaiCurriculumService } from "@/services/iqaiCurriculumService";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PathItemProgress {
  id: string;
  status: "pending" | "done" | "in-progress" | "skip";
  completedAt?: string;
}

interface PathProgress {
  pathId: string;
  slug: string;
  items: Record<string, PathItemProgress>;
  lastAccessed: string;
  totalProgress: number;
  completedItems: number;
  totalItems: number;
}

interface PathProgressContextType {
  getPathProgress: (pathId: string, slug: string) => PathProgress | null;
  updateItemStatus: (pathId: string, slug: string, itemId: string, status: string) => void;
  initializePathProgress: (pathId: string, slug: string, totalItems: number) => void;
  calculateProgress: (pathId: string, slug: string) => { progress: number; completed: number };
  loadProgressFromServer: (pathId: string, slug: string) => Promise<void>
}

const PathProgressContext = createContext<PathProgressContextType | undefined>(undefined);

export function PathProgressProvider({ children }: { children: ReactNode }) {
  const [pathProgresses, setPathProgresses] = useState<Record<string, PathProgress>>(() => {
    const saved = localStorage.getItem('pathProgresses');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('pathProgresses', JSON.stringify(pathProgresses));
  }, [pathProgresses]);

  const getProgressKey = (pathId: string, slug: string) => `${pathId}-${slug}`;

  const loadProgressFromServer = async (pathId: string, slug: string) => {
        try {
            const result = await iqaiCurriculumService.getProgress(pathId, slug)
            if (result.success && result.progress) {
                const key = getProgressKey(pathId, slug)
                const serverProgress = {
                    pathId,
                    slug,
                    items: result.progress.items || {},
                    lastAccessed:
                        result.progress.lastAccessed ||
                        new Date().toISOString(),
                    totalProgress: result.progress.totalProgress || 0,
                    completedItems: result.progress.completedItems || 0,
                    totalItems: result.progress.totalItems || 0,
                }

                setPathProgresses((prev) => ({
                    ...prev,
                    [key]: serverProgress,
                }))

                // console.log('Progress loaded from server successfully')
            }
        } catch (error) {
            console.error('Failed to load progress from server:', error)
            // Continue with localStorage as fallback
        }
    }

  const getPathProgress = (pathId: string, slug: string): PathProgress | null => {
    const key = getProgressKey(pathId, slug);
    return pathProgresses[key] || null;
  };

  const initializePathProgress = (pathId: string, slug: string, totalItems: number) => {
    const key = getProgressKey(pathId, slug);
    if (!pathProgresses[key]) {
      setPathProgresses(prev => ({
        ...prev,
        [key]: {
          pathId,
          slug,
          items: {},
          lastAccessed: new Date().toISOString(),
          totalProgress: 0,
          completedItems: 0,
          totalItems
        }
      }));
    }
  };

  const updateItemStatus = (pathId: string, slug: string, itemId: string, status: string) => {
    const key = getProgressKey(pathId, slug);
    setPathProgresses(prev => {
      const currentProgress = prev[key] || {
        pathId,
        slug,
        items: {},
        lastAccessed: new Date().toISOString(),
        totalProgress: 0,
        completedItems: 0,
        totalItems: 0
      };

      const updatedItems = {
        ...currentProgress.items,
        [itemId]: {
          id: itemId,
          status: status as "pending" | "done" | "in-progress" | "skip",
          completedAt: status === 'done' ? new Date().toISOString() : undefined
        }
      };

      // Calculate completed items (excluding skipped items)
      const completedItems = Object.values(updatedItems).filter(item => item.status === 'done').length;
      const totalItems = Math.max(currentProgress.totalItems, Object.keys(updatedItems).length);
      
      // Calculate progress percentage (skipped items don't count towards progress)
      const totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      return {
        ...prev,
        [key]: {
          ...currentProgress,
          items: updatedItems,
          lastAccessed: new Date().toISOString(),
          totalProgress,
          completedItems,
          totalItems
        }
      };
    });
  };

  const calculateProgress = (pathId: string, slug: string) => {
    const progress = getPathProgress(pathId, slug);
    if (!progress) return { progress: 0, completed: 0 };
    
    return {
      progress: progress.totalProgress,
      completed: progress.completedItems
    };
  };

  return (
    <PathProgressContext.Provider value={{
      getPathProgress,
      updateItemStatus,
      initializePathProgress,
      calculateProgress,
      loadProgressFromServer,
      
    }}>
      {children}
    </PathProgressContext.Provider>
  );
}

export function usePathProgress() {
  const context = useContext(PathProgressContext);
  if (context === undefined) {
    throw new Error('usePathProgress must be used within a PathProgressProvider');
  }
  return context;
}