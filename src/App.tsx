import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AuthProvider } from './contexts/AuthContext'
import { LearningPathsProvider } from '@/contexts/LearningPathsContext'
import { PathProgressProvider } from '@/contexts/PathProgressContext'
import Dashboard from './pages/dashboard/Dashboard'
import CreatePath from './pages/learning/CreatePath'
import LearningPaths from './pages/dashboard/LearningPaths'
import PathDetail from './pages/dashboard/PathDetail'
import Mentor from './pages/learning/Mentor'
import Progress from './pages/dashboard/Progress'
import Assessment from './pages/learning/Assessment'
import Achievements from './pages/user/Achievements'
import Settings from './pages/user/Settings'
import Profile from './pages/user/Profile'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ConfirmEmail from './pages/auth/ConfirmEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import NotFound from './pages/NotFound'
import Index from './pages/Index'

const queryClient = new QueryClient()

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <PathProgressProvider>
                <LearningPathsProvider>
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
                                    path='/confirm-email'
                                    element={<ConfirmEmail />}
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
                                </Route>
                                <Route path='*' element={<NotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </LearningPathsProvider>
            </PathProgressProvider>
        </AuthProvider>
    </QueryClientProvider>
)

export default App
