import { useState, useEffect } from 'react'
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
    RefreshCw,
    AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import { usePathProgress } from '@/contexts/PathProgressContext'
import { useToast } from '@/hooks/use-toast'
import { iqaiCurriculumService } from '@/services/iqaiCurriculumService'
import { useLearningPaths } from '@/contexts/LearningPathsContext'

interface LearningPath {
    id: number
    title: string
    description: string
    progress: number
    totalModules: number
    completedModules: number
    difficulty: string
    estimatedTime: string
    category: string
    status: 'active' | 'completed' | 'not_started'
    rating: number
    enrollments: number
    color: string
    tags: string[]
    lastAccessed: string
}

interface EditFormData {
    title: string
    description: string
    difficulty: string
    estimatedTime: string
    category: string
}

const categories = [
    'All Categories',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Data Science',
    'DevOps',
    'Design',
    'Full-Stack Development',
]

const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const statuses = ['All Statuses', 'Active', 'Completed', 'Not Started']

export default function LearningPaths() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All Categories')
    const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels')
    const [selectedStatus, setSelectedStatus] = useState('All Statuses')
    const [sortBy, setSortBy] = useState('recent')
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editFormData, setEditFormData] = useState<EditFormData>({
        title: '',
        description: '',
        difficulty: '',
        estimatedTime: '',
        category: '',
    })

    const [learningPaths, setLearningPaths] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { toast } = useToast()
    const { getPathProgress, calculateProgress, loadProgressFromServer } =
        usePathProgress()

    // Load saved learning paths on component mount
    useEffect(() => {
        loadLearningPaths()
    }, [])

    const loadLearningPaths = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response =
                await iqaiCurriculumService.getStoredLearningPaths()

            if (response && response.paths) {
                // Load progress from server for each path
                const pathsWithServerProgress = await Promise.all(
                    response.paths.map(async (path) => {
                        const pathSlug = path.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '')

                        // Load progress from server first
                        await loadProgressFromServer(path.id, pathSlug)
                        return path
                    }),
                )

                const formattedPaths = pathsWithServerProgress.map((path) => {
                    // Generate slug for progress lookup
                    const pathSlug = path.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')

                    // Get actual progress from PathProgressContext
                    const { progress, completed } = calculateProgress(
                        path.id,
                        pathSlug,
                    )

                    // Debug localStorage and progress data
                    console.log('=== PATH PROGRESS DEBUG ===', {
                        pathTitle: path.title,
                        pathId: path.id,
                        pathSlug,
                        progress,
                        completed,
                        localStorageKey: `${path.id}-${pathSlug}`,
                    })

                    // Check what's in localStorage
                    const savedProgresses =
                        localStorage.getItem('pathProgresses')
                    if (savedProgresses) {
                        const parsed = JSON.parse(savedProgresses)
                        console.log('All saved progresses:', parsed)
                        const thisPathProgress =
                            parsed[`${path.id}-${pathSlug}`]
                        console.log('This path progress:', thisPathProgress)
                    }

                    // Calculate completed modules (not just completed items)
                    let completedModuleCount = 0
                    if (path.curriculum?.modules) {
                        const pathProgress = getPathProgress(path.id, pathSlug)
                        console.log(
                            'Module completion debug for:',
                            path.title,
                            {
                                pathId: path.id,
                                pathSlug,
                                hasPathProgress: !!pathProgress,
                                progressItems: pathProgress
                                    ? Object.keys(pathProgress.items)
                                    : [],
                                modulesCount: path.curriculum.modules.length,
                            },
                        )

                        if (pathProgress) {
                            completedModuleCount =
                                path.curriculum.modules.filter(
                                    (module, index) => {
                                        // Create the same sectionId as used in PathDetail
                                        const sectionId =
                                            module.id || `section-${index}`

                                        // Get all items for this module using the same pattern as PathDetail
                                        const moduleItems = [
                                            ...(module.competencies || []).map(
                                                (_, compIndex) =>
                                                    `${sectionId}-competency-${compIndex}`,
                                            ),
                                            ...(module.resources || []).map(
                                                (_, resIndex) =>
                                                    `${sectionId}-resource-${resIndex}`,
                                            ),
                                            ...(module.assessments || []).map(
                                                (_, assIndex) =>
                                                    `${sectionId}-assessment-${assIndex}`,
                                            ),
                                        ]

                                        console.log(
                                            `Module ${index} (${module.title}) debug:`,
                                            {
                                                sectionId,
                                                moduleItems,
                                                hasCompetencies: (
                                                    module.competencies || []
                                                ).length,
                                                hasResources: (
                                                    module.resources || []
                                                ).length,
                                                hasAssessments: (
                                                    module.assessments || []
                                                ).length,
                                                itemStatuses: moduleItems.map(
                                                    (itemId) => ({
                                                        itemId,
                                                        status: pathProgress
                                                            .items[itemId]
                                                            ?.status,
                                                    }),
                                                ),
                                            },
                                        )

                                        // Module is completed if it has items and all are done
                                        if (moduleItems.length === 0) {
                                            console.log(
                                                `Module ${index} has no items, marking as incomplete`,
                                            )
                                            return false
                                        }

                                        const allDone = moduleItems.every(
                                            (itemId) => {
                                                const itemProgress =
                                                    pathProgress.items[itemId]
                                                return (
                                                    itemProgress?.status ===
                                                    'done'
                                                )
                                            },
                                        )

                                        console.log(
                                            `Module ${index} completion:`,
                                            allDone,
                                        )
                                        return allDone
                                    },
                                ).length
                        }

                        console.log(
                            'Final completed module count:',
                            completedModuleCount,
                        )
                    }

                    // Determine status based on progress
                    let status = path.status || 'not_started'
                    if (progress === 100) {
                        status = 'completed'
                    } else if (progress > 0) {
                        status = 'active'
                    }

                    return {
                        id: path.id,
                        title: path.title,
                        description: path.description,
                        category: path.domain || 'General',
                        difficulty: path.difficulty || 'Intermediate',
                        duration: calculateDuration(path.curriculum),
                        lessons: path.curriculum?.modules?.length || 0,
                        tags: path.curriculum?.tags || [],
                        status: status,
                        progress: progress,
                        completedModules: completedModuleCount,
                        totalModules: path.curriculum?.modules?.length || 0,
                        rating: 4.5, // Default rating
                        author: 'AI Generated',
                        thumbnail: '/placeholder.svg',
                        learningOutcomes: path.curriculum?.objectives || [],
                        startedDate: path.created_at
                            ? new Date(path.created_at)
                            : null,
                        lastAccessed:
                            progress > 0
                                ? getPathProgress(path.id, pathSlug)
                                      ?.lastAccessed || path.updated_at
                                : path.updated_at,
                        curriculum: path.curriculum,
                    }
                })
                setLearningPaths(formattedPaths)
            } else {
                setLearningPaths([])
            }
        } catch (error) {
            console.error('Error loading learning paths:', error)
            setError('Failed to load learning paths')
            toast({
                title: 'Error',
                description:
                    'Failed to load your learning paths. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const calculateDuration = (curriculum) => {
        if (!curriculum?.modules) return '2 hours'

        if (curriculum.totalDuration) {
            const totalDurationStr = curriculum.totalDuration.toString()

            // Handle formats like "2 weeks (~20 hours)" or "72 hours"
            const hoursInParenMatch =
                totalDurationStr.match(/\(~?(\d+)\s*hours?\)/i)
            if (hoursInParenMatch) {
                const hours = parseInt(hoursInParenMatch[1])
                return hours === 1 ? '1 hour' : `${hours} hours`
            }

            // Handle direct hours format like "72 hours"
            const directHoursMatch = totalDurationStr.match(/^(\d+)\s*hours?$/i)
            if (directHoursMatch) {
                return curriculum.totalDuration
            }

            // Handle weeks format like "2 weeks"
            const weeksMatch = totalDurationStr.match(/(\d+)\s*weeks?/i)
            if (weeksMatch) {
                const weeks = parseInt(weeksMatch[1])
                const estimatedHours = weeks * 10 // Rough estimate: 10 hours per week
                return `${estimatedHours} hours`
            }

            // If we can't parse it, return as-is
            return curriculum.totalDuration
        }

        // Calculate based on actual module durations if available
        let totalMinutes = 0
        curriculum.modules.forEach((module) => {
            if (module.duration) {
                // Parse duration string like "10 hours" or "30 min"
                const durationStr = module.duration.toString()
                const hoursMatch = durationStr.match(/(\d+)\s*hours?/i)
                const minutesMatch = durationStr.match(/(\d+)\s*min/i)

                if (hoursMatch) {
                    totalMinutes += parseInt(hoursMatch[1]) * 60
                } else if (minutesMatch) {
                    totalMinutes += parseInt(minutesMatch[1])
                } else {
                    // Fallback: try to parse as number and assume minutes
                    const duration = parseInt(durationStr) || 30
                    totalMinutes += duration
                }
            } else {
                totalMinutes += 30 // Default 30 min per module
            }
        })

        const hours = Math.max(1, Math.ceil(totalMinutes / 60))
        return hours === 1 ? '1 hour' : `${hours} hours`
    }

    const refreshPaths = async () => {
        setIsRefreshing(true)
        await loadLearningPaths()
        setIsRefreshing(false)
        toast({
            title: 'Refreshed',
            description: 'Learning paths have been updated.',
        })
    }

    // Helper functions for statistics
    const getTotalPaths = () => learningPaths.length
    const getActivePaths = () =>
        learningPaths.filter((p) => p.status === 'active').length
    const getCompletedPaths = () =>
        learningPaths.filter((p) => p.status === 'completed').length
    const getTotalHours = () => {
        return learningPaths.reduce((total, path) => {
            // Handle duration formats like "72 hours", "20 hours", "2 weeks (~20 hours)"
            if (!path.duration) return total

            const durationStr = path.duration.toString()

            // First try to extract hours from parentheses like "(~20 hours)"
            const hoursInParenMatch = durationStr.match(/\(~?(\d+)\s*hours?\)/i)
            if (hoursInParenMatch) {
                return total + parseInt(hoursInParenMatch[1])
            }

            // Then try direct hours match like "72 hours"
            const hoursMatch = durationStr.match(/(\d+)\s*hours?/i)
            if (hoursMatch) {
                return total + parseInt(hoursMatch[1])
            }

            // Fallback: get first number
            const numberMatch = durationStr.match(/(\d+)/)
            const hours = numberMatch ? parseInt(numberMatch[1]) : 2

            return total + hours
        }, 0)
    }

    const filteredPaths = learningPaths.filter((path) => {
        const matchesSearch =
            path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            path.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase()),
            )

        const matchesCategory =
            selectedCategory === 'All Categories' ||
            path.category === selectedCategory
        const matchesDifficulty =
            selectedDifficulty === 'All Levels' ||
            path.difficulty === selectedDifficulty
        const matchesStatus =
            selectedStatus === 'All Statuses' ||
            (selectedStatus === 'Active' && path.status === 'active') ||
            (selectedStatus === 'Completed' && path.status === 'completed') ||
            (selectedStatus === 'Not Started' && path.status === 'not_started')

        return (
            matchesSearch &&
            matchesCategory &&
            matchesDifficulty &&
            matchesStatus
        )
    })

    const handleViewDetails = (path: LearningPath) => {
        setSelectedPath(path)
        setIsViewModalOpen(true)
    }


    const handleDownloadProgress = (path: LearningPath) => {
        // Simulate download progress
        toast({
            title: 'Download Started',
            description: `Progress report for "${path.title}" is being downloaded...`,
        })

        // Simulate download completion after 2 seconds
        setTimeout(() => {
            toast({
                title: 'Download Complete',
                description: `Progress report for "${path.title}" has been downloaded successfully.`,
            })
        }, 2000)
    }

    const handleArchivePath = (path: LearningPath) => {
        // Simulate archiving
        toast({
            title: 'Path Archived',
            description: `"${path.title}" has been archived successfully.`,
        })
    }

    const handleSaveEdit = () => {
        // Simulate saving changes
        toast({
            title: 'Changes Saved',
            description: `"${selectedPath?.title}" has been updated successfully.`,
        })
        setIsEditModalOpen(false)
    }

    const getStatusBadge = (status: string, progress: number) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge className='bg-success text-success-foreground'>
                        Completed
                    </Badge>
                )
            case 'active':
                return (
                    <Badge className='bg-primary text-primary-foreground'>
                        In Progress
                    </Badge>
                )
            case 'not_started':
                return <Badge variant='outline'>Not Started</Badge>
            default:
                return null
        }
    }

    const getActionButton = (path: LearningPath) => {
        const pathSlug = path.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        switch (path.status) {
            case 'completed':
                return (
                    <Button variant='outline' size='sm' asChild>
                        <Link to={`/dashboard/paths/${pathSlug}`}>
                            <Star className='w-4 h-4 mr-2' />
                            Review
                        </Link>
                    </Button>
                )
            case 'active':
                return (
                    <Button size='sm' asChild>
                        <Link to={`/dashboard/paths/${pathSlug}`}>
                            <PlayCircle className='w-4 h-4 mr-2' />
                            Continue
                        </Link>
                    </Button>
                )
            case 'not_started':
                return (
                    <Button variant='outline' size='sm' asChild>
                        <Link to={`/dashboard/paths/${pathSlug}`}>
                            <PlayCircle className='w-4 h-4 mr-2' />
                            Start Learning
                        </Link>
                    </Button>
                )
            default:
                return null
        }
    }

    return (
        <div className='p-6 space-y-8  mx-auto'>
            {/* Header */}
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-bold text-foreground'>
                        My Learning Paths
                    </h1>
                    <p className='text-lg text-muted-foreground mt-1'>
                        Continue your learning journey or explore new paths
                    </p>
                </div>
                <div className='flex gap-4'>
                    <Button asChild size='lg' className='shadow-learning'>
                        <Link to='/dashboard/create-path'>
                            <Plus className='w-4 h-4 mr-2' />
                            Create New Path
                        </Link>
                    </Button>
                    <Button
                        variant='outline'
                        size='lg'
                        onClick={refreshPaths}
                        disabled={isRefreshing}
                        className='shadow-card'
                    >
                        <RefreshCw
                            className={`w-4 h-4 mr-2 ${
                                isRefreshing ? 'animate-spin' : ''
                            }`}
                        />
                        Refresh
                    </Button>
                </div>
                
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <Card className='border shadow-card'>
                    <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-muted-foreground'>
                                    Total Paths
                                </p>
                                <p className='text-2xl font-bold text-foreground'>
                                    {getTotalPaths()}
                                </p>
                            </div>
                            <BookOpen className='w-8 h-8 text-primary' />
                        </div>
                    </CardContent>
                </Card>

                <Card className='border shadow-card'>
                    <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-muted-foreground'>
                                    Active Paths
                                </p>
                                <p className='text-2xl font-bold text-foreground'>
                                    {getActivePaths()}
                                </p>
                            </div>
                            <TrendingUp className='w-8 h-8 text-warning' />
                        </div>
                    </CardContent>
                </Card>

                <Card className='border shadow-card'>
                    <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-muted-foreground'>
                                    Completed
                                </p>
                                <p className='text-2xl font-bold text-foreground'>
                                    {getCompletedPaths()}
                                </p>
                            </div>
                            <Target className='w-8 h-8 text-success' />
                        </div>
                    </CardContent>
                </Card>

                <Card className='border shadow-card'>
                    <CardContent className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-muted-foreground'>
                                    Total Hours
                                </p>
                                <p className='text-2xl font-bold text-foreground'>
                                    {getTotalHours()}h
                                </p>
                            </div>
                            <Clock className='w-8 h-8 text-primary' />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className='border-0 shadow-card'>
                <CardContent className='p-0 space-y-4'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        {/* Search */}
                        <div className='relative flex-1'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                            <Input
                                placeholder='Search learning paths...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pl-10'
                            />
                        </div>

                        {/* Filters */}
                        <div className='flex flex-wrap gap-3'>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className='w-[200px]'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedDifficulty}
                                onValueChange={setSelectedDifficulty}
                            >
                                <SelectTrigger className='w-[150px]'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulties.map((difficulty) => (
                                        <SelectItem
                                            key={difficulty}
                                            value={difficulty}
                                        >
                                            {difficulty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className='w-[150px]'>
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
            {!isLoading && !error && (
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {filteredPaths.map((path) => (
                        <Card
                            key={path.id}
                            className='border shadow-card hover:shadow-learning transition-all duration-200 group'
                        >
                            <CardHeader className='pb-4'>
                                <div className='flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-3 mb-2'>
                                            <div className='w-3 h-3 rounded-full bg-primary' />
                                            <h3 className='font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors'>
                                                {path.title}
                                            </h3>
                                            {getStatusBadge(
                                                path.status,
                                                path.progress,
                                            )}
                                        </div>
                                        <p className='text-muted-foreground text-sm mb-3'>
                                            {path.description}
                                        </p>
                                        <div className='flex flex-wrap gap-2 mb-3'>
                                            {path.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant='outline'
                                                    className='text-xs'
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' size='sm'>
                                                <MoreVertical className='w-4 h-4' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuLabel>
                                                Actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleViewDetails({
                                                        ...path,
                                                        id: Number(path.id),
                                                    })
                                                }
                                            >
                                                <Eye className='w-4 h-4 mr-2' />
                                                View Details
                                            </DropdownMenuItem>
                                           
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDownloadProgress({
                                                        ...path,
                                                        id: Number(path.id),
                                                    })
                                                }
                                            >
                                                <Download className='w-4 h-4 mr-2' />
                                                Download Progress
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleArchivePath({
                                                        ...path,
                                                        id: Number(path.id),
                                                    })
                                                }
                                                className='text-destructive'
                                            >
                                                <Archive className='w-4 h-4 mr-2' />
                                                Archive Path
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className='space-y-4'>
                                {/* Progress Section */}
                                {path.status !== 'not_started' && (
                                    <div className='space-y-2'>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span className='text-muted-foreground'>
                                                Progress
                                            </span>
                                            <span className='font-medium'>
                                                {path.progress}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={path.progress}
                                            className='h-2'
                                        />
                                        <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                            <span>
                                                {path.completedModules}/
                                                {path.totalModules ||
                                                    path.lessons}{' '}
                                                modules
                                            </span>
                                            <span>
                                                Last accessed:{' '}
                                                {path.lastAccessed
                                                    ? typeof path.lastAccessed ===
                                                      'string'
                                                        ? path.lastAccessed
                                                        : path.lastAccessed.toLocaleString()
                                                    : 'Never'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Path Info */}
                                <div className='flex items-center justify-between pt-4 border-t border-border'>
                                    <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                                        <div className='flex items-center gap-1'>
                                            <Clock className='w-4 h-4' />
                                            <span>{path.duration}</span>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <Target className='w-4 h-4' />
                                            <span>{path.difficulty}</span>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <Users className='w-4 h-4' />
                                            <span>{path.lessons} lessons</span>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <Star className='w-4 h-4 fill-current text-warning' />
                                            <span>{path.rating}</span>
                                        </div>
                                    </div>

                                    {getActionButton({
                                        ...path,
                                        id: Number(path.id),
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className='border shadow-card'>
                            <CardContent className='p-6'>
                                <div className='animate-pulse'>
                                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                                    <div className='h-3 bg-gray-200 rounded w-full mb-4'></div>
                                    <div className='h-3 bg-gray-200 rounded w-1/2 mb-4'></div>
                                    <div className='flex gap-2 mb-4'>
                                        <div className='h-6 bg-gray-200 rounded w-16'></div>
                                        <div className='h-6 bg-gray-200 rounded w-20'></div>
                                    </div>
                                    <div className='h-8 bg-gray-200 rounded w-full'></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <Card className='border-0 shadow-card'>
                    <CardContent className='p-12 text-center'>
                        <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold mb-2'>
                            Error Loading Learning Paths
                        </h3>
                        <p className='text-muted-foreground mb-6'>{error}</p>
                        <Button onClick={refreshPaths} disabled={isRefreshing}>
                            <RefreshCw
                                className={`w-4 h-4 mr-2 ${
                                    isRefreshing ? 'animate-spin' : ''
                                }`}
                            />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredPaths.length === 0 && (
                <Card className='border-0 shadow-card'>
                    <CardContent className='p-12 text-center'>
                        <BookOpen className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
                        <h3 className='text-xl font-semibold mb-2'>
                            No learning paths found
                        </h3>
                        <p className='text-muted-foreground mb-6'>
                            Try adjusting your filters or create a new learning
                            path to get started.
                        </p>
                        <Button asChild>
                            <Link to='/dashboard/create-path'>
                                <Plus className='w-4 h-4 mr-2' />
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
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-2 items-center gap-4'>
                            <h4 className='text-sm font-semibold'>Status:</h4>
                            <div className='flex items-center gap-2'>
                                {getStatusBadge(
                                    selectedPath?.status || '',
                                    selectedPath?.progress || 0,
                                )}
                            </div>
                            <h4 className='text-sm font-semibold'>Progress:</h4>
                            <div className='flex items-center gap-2'>
                                <Progress
                                    value={selectedPath?.progress || 0}
                                    className='h-2 flex-1'
                                />
                                <span className='text-sm font-medium'>
                                    {selectedPath?.progress || 0}%
                                </span>
                            </div>
                            <h4 className='text-sm font-semibold'>Modules:</h4>
                            <span className='text-sm'>
                                {selectedPath?.completedModules}/
                                {selectedPath?.totalModules}
                            </span>
                            <h4 className='text-sm font-semibold'>
                                Last Accessed:
                            </h4>
                            <span className='text-sm'>
                                {selectedPath?.lastAccessed}
                            </span>
                        </div>
                        <div className='space-y-2'>
                            <h4 className='text-sm font-semibold'>Tags:</h4>
                            <div className='flex flex-wrap gap-2'>
                                {selectedPath?.tags?.map((tag: string) => (
                                    <Badge
                                        key={tag}
                                        variant='outline'
                                        className='text-xs'
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setIsViewModalOpen(false)}
                        >
                            Close
                        </Button>
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
                    <div className='grid gap-4 py-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='title'>Title</Label>
                            <Input
                                id='title'
                                value={editFormData.title}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                                id='description'
                                value={editFormData.description}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='difficulty'>Difficulty</Label>
                            <Select
                                value={editFormData.difficulty}
                                onValueChange={(value) =>
                                    setEditFormData({
                                        ...editFormData,
                                        difficulty: value,
                                    })
                                }
                            >
                                <SelectTrigger id='difficulty'>
                                    <SelectValue placeholder='Select a difficulty' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='Beginner'>
                                        Beginner
                                    </SelectItem>
                                    <SelectItem value='Intermediate'>
                                        Intermediate
                                    </SelectItem>
                                    <SelectItem value='Advanced'>
                                        Advanced
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='estimatedTime'>
                                Estimated Time
                            </Label>
                            <Input
                                id='estimatedTime'
                                type='text'
                                value={editFormData.estimatedTime}
                                onChange={(e) =>
                                    setEditFormData({
                                        ...editFormData,
                                        estimatedTime: e.target.value,
                                    })
                                }
                                placeholder='e.g., 24 hours'
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='category'>Category</Label>
                            <Select
                                value={editFormData.category}
                                onValueChange={(value) =>
                                    setEditFormData({
                                        ...editFormData,
                                        category: value,
                                    })
                                }
                            >
                                <SelectTrigger id='category'>
                                    <SelectValue placeholder='Select a category' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='Frontend Development'>
                                        Frontend Development
                                    </SelectItem>
                                    <SelectItem value='Backend Development'>
                                        Backend Development
                                    </SelectItem>
                                    <SelectItem value='Mobile Development'>
                                        Mobile Development
                                    </SelectItem>
                                    <SelectItem value='Data Science'>
                                        Data Science
                                    </SelectItem>
                                    <SelectItem value='DevOps'>
                                        DevOps
                                    </SelectItem>
                                    <SelectItem value='Design'>
                                        Design
                                    </SelectItem>
                                    <SelectItem value='Full-Stack Development'>
                                        Full-Stack Development
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}