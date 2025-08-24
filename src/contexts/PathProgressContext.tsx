import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

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
  status?: 'active' | 'completed' | 'not_started';
  startedAt?: string;
  completedAt?: string;
  updatedAt?: string;
}

interface PathProgressContextType {
  getPathProgress: (pathId: string, slug: string) => PathProgress | null;
  updateItemStatus: (pathId: string, slug: string, itemId: string, status: string) => void;
  initializePathProgress: (pathId: string, slug: string, totalItems: number) => void;
  calculateProgress: (pathId: string, slug: string) => { progress: number; completed: number };
  loadPathProgress: (pathId: string, slug: string) => Promise<void>;
}

const PathProgressContext = createContext<PathProgressContextType | undefined>(undefined);

export function PathProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [pathProgresses, setPathProgresses] = useState<Record<string, PathProgress>>({});
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());

  const getProgressKey = (pathId: string, slug: string) => `${pathId}-${slug}`;

  const loadPathProgress = async (pathId: string, slug: string): Promise<void> => {
    const key = getProgressKey(pathId, slug);
    
    if (loadingPaths.has(key) || pathProgresses[key]) {
      return; 
    }

    setLoadingPaths(prev => new Set(prev).add(key));

    try {
      const response = await fetch(`http://localhost:3001/learning-path/${pathId}/progress?userId=${user?.id || ''}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.progress) {
          const serverProgress = result.progress;
          
          setPathProgresses(prev => ({
            ...prev,
            [key]: {
              pathId,
              slug,
              items: serverProgress.itemStatuses || {},
              lastAccessed: new Date().toISOString(),
              totalProgress: serverProgress.progress || 0,
              completedItems: serverProgress.completedItems || 0,
              totalItems: serverProgress.totalItems || 0,
              status: serverProgress.status,
              startedAt: serverProgress.startedAt,
              completedAt: serverProgress.completedAt,
              updatedAt: serverProgress.lastUpdated
            }
          }));
        }
      } else {
        console.warn('Failed to load progress from server, initializing empty progress');
        setPathProgresses(prev => ({
          ...prev,
          [key]: {
            pathId,
            slug,
            items: {},
            lastAccessed: new Date().toISOString(),
            totalProgress: 0,
            completedItems: 0,
            totalItems: 0
          }
        }));
      }
    } catch (error) {
      console.error('Error loading progress from server:', error);
      // Fallback to localStorage if server is unavailable
      const saved = localStorage.getItem('pathProgresses');
      if (saved) {
        const localData = JSON.parse(saved);
        if (localData[key]) {
          setPathProgresses(prev => ({ ...prev, [key]: localData[key] }));
        }
      }
    } finally {
      setLoadingPaths(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const saveProgressToServer = async (pathId: string, progressData: PathProgress): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3001/learning-path/${pathId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progressData: {
            completedItems: progressData.completedItems,
            totalItems: progressData.totalItems,
            itemStatuses: progressData.items,
            lastUpdated: new Date().toISOString()
          },
          userId: user?.id || ''
        }),
      });

      if (!response.ok) {
        console.error('Failed to save progress to server:', response.statusText);
        // Fallback to localStorage
        const saved = localStorage.getItem('pathProgresses');
        const localData = saved ? JSON.parse(saved) : {};
        localData[getProgressKey(pathId, progressData.slug)] = progressData;
        localStorage.setItem('pathProgresses', JSON.stringify(localData));
      }
    } catch (error) {
      console.error('Error saving progress to server:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('pathProgresses');
      const localData = saved ? JSON.parse(saved) : {};
      localData[getProgressKey(pathId, progressData.slug)] = progressData;
      localStorage.setItem('pathProgresses', JSON.stringify(localData));
    }
  };

  const getPathProgress = (pathId: string, slug: string): PathProgress | null => {
    const key = getProgressKey(pathId, slug);
    return pathProgresses[key] || null;
  };

  const initializePathProgress = async (pathId: string, slug: string, totalItems: number) => {
    const key = getProgressKey(pathId, slug);
    if (!pathProgresses[key]) {
      const newProgress: PathProgress = {
        pathId,
        slug,
        items: {},
        lastAccessed: new Date().toISOString(),
        totalProgress: 0,
        completedItems: 0,
        totalItems
      };
      
      setPathProgresses(prev => ({
        ...prev,
        [key]: newProgress
      }));
      
      // Save to server
      await saveProgressToServer(pathId, newProgress);
    } else {
      // Load existing progress from server
      await loadPathProgress(pathId, slug);
    }
  };

  const updateItemStatus = async (pathId: string, slug: string, itemId: string, status: string) => {
    const key = getProgressKey(pathId, slug);
    
    // Update local state first for immediate UI feedback
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
  
      const previousStatus = currentProgress.items[itemId]?.status;
      
      const updatedItems = {
        ...currentProgress.items,
        [itemId]: {
          id: itemId,
          status: status as "pending" | "done" | "in-progress" | "skip",
          completedAt: (status === 'done' || status === 'skip') ? new Date().toISOString() : undefined
        }
      };
  
      const completedItems = Object.values(updatedItems).filter(item => 
        item.status === 'done' || item.status === 'skip'
      ).length;
      
      const totalItems = Math.max(currentProgress.totalItems, Object.keys(updatedItems).length);
      const totalProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
      console.log(`📊 Progress Update:`, {
        itemId,
        previousStatus,
        newStatus: status,
        completedItems,
        totalItems,
        totalProgress: `${totalProgress}%`
      });

      const updatedProgress = {
        ...currentProgress,
        items: updatedItems,
        lastAccessed: new Date().toISOString(),
        totalProgress,
        completedItems,
        totalItems
      };

      // Save to server asynchronously
      updateItemStatusOnServer(pathId, itemId, status);
      saveProgressToServer(pathId, updatedProgress);
  
      return {
        ...prev,
        [key]: updatedProgress
      };
    });
  };

  // Update item status on server
  const updateItemStatusOnServer = async (pathId: string, itemId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/learning-path/${pathId}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          status,
          userId: user?.id || ''
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Item status updated on server:', result);
        
        // Update learning path status as well
        if (result.success) {
          updateLearningPathStatus(pathId, result.result.progress, result.result.completedItems, result.result.totalItems);
        }
      } else {
        console.error('❌ Failed to update item status on server:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error updating item status on server:', error);
    }
  };

  // Update learning path status on server
  const updateLearningPathStatus = async (pathId: string, progress: number, completedItems: number, totalItems: number) => {
    try {
       if (!user?.id) {
        console.warn('⚠️ Cannot update learning path status: User not authenticated');
        return;
      }
      const response = await fetch(`http://localhost:3001/learning-path/${pathId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress,
          completedItems,
          totalItems,
          userId: user.id 
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Learning path status updated:', result);
      } else {
        console.error('❌ Failed to update learning path status:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error updating learning path status:', error);
    }
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
      loadPathProgress
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