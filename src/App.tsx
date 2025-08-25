import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AuthProvider } from './contexts/AuthContext'
import { LearningPathsProvider } from '@/contexts/LearningPathsContext'
import { PathProgressProvider } from '@/contexts/PathProgressContext'
import Dashboard from './pages/Dashboard'
import CreatePath from './pages/CreatePath'
import LearningPaths from './pages/LearningPaths'
import PathDetail from './pages/PathDetail'
import Mentor from './pages/Mentor'
import Progress from './pages/Progress'
import Assessment from './pages/Assessment'
import Resources from './pages/Resources'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import Index from './pages/Index'

const queryClient = new QueryClient()

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <LearningPathsProvider>
                <PathProgressProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <Routes>
                                <Route path='/' element={<Index />} />

                                <Route path='/login' element={<Login />} />
                                <Route
                                    path='/register'
                                    element={<Register />}
                                />
                                <Route
                                    path='/forgot-password'
                                    element={<ForgotPassword />}
                                />

                                {/* Main app routes */}
                                <Route
                                    path='/dashboard'
                                    element={<AppLayout />}
                                >
                                    <Route index element={<Dashboard />} />
                                    <Route
                                        path='paths'
                                        element={<LearningPaths />}
                                    />
                                    <Route
                                        path='paths/:pathSlug'
                                        element={<PathDetail />}
                                    />
                                    <Route
                                        path='create-path'
                                        element={<CreatePath />}
                                    />
                                    <Route path='mentor' element={<Mentor />} />
                                    <Route
                                        path='progress'
                                        element={<Progress />}
                                    />
                                    <Route
                                        path='assessment'
                                        element={<Assessment />}
                                    />
                                    <Route
                                        path='resources'
                                        element={<Resources />}
                                    />
                                    <Route
                                        path='achievements'
                                        element={<Achievements />}
                                    />
                                    <Route
                                        path='settings'
                                        element={<Settings />}
                                    />
                                    <Route
                                        path='profile'
                                        element={<Profile />}
                                    />
                                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                                </Route>
                                <Route path='*' element={<NotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </PathProgressProvider>
            </LearningPathsProvider>
        </AuthProvider>
    </QueryClientProvider>
)

export default App
