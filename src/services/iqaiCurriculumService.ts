// Note: Do NOT import or initialize the ADK in the browser. Use the server API to run the curriculum designer.
// import { createCurriculumDesigner } from '../agents/curriculum-designer' // intentionally commented out

// Types for the learning path generation
export interface LearnerProfile {
    id: string
    title: string
    description: string
    domain: string
    experienceLevel: 'beginner' | 'intermediate' | 'advanced'
    timeCommitment: number // hours per week
    motivationLevel: number // 1-10 scale
}

export interface TimeConstraints {
    timeline: string
    weeklyHours: number
    preferredPace: 'slow' | 'moderate' | 'fast'
}

export interface LearningGoal {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    targetCompetencies: string[]
}

export interface GeneratedModule {
    id: string
    title: string
    description: string
    duration: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    competencies: string[]
    resources: {
        type: 'video' | 'article' | 'exercise' | 'project'
        title: string
        url?: string
        estimatedTime: string
    }[]
    assessments: {
        type: 'quiz' | 'project' | 'assignment'
        title: string
        description: string
    }[]
}

export interface GeneratedLearningPath {
    id: string
    title: string
    description: string
    totalDuration: string
    difficulty: string
    modules: GeneratedModule[]
    prerequisites: string[]
    outcomes: string[]
}

class IQAICurriculumService {
    private agent: any = null
    private runner: any = null
    private session: any = null

    async initialize() {
        // No client-side ADK initialization when using server API
        return
    }

    async generateLearningPath(
        learnerProfile: LearnerProfile,
        goals: LearningGoal[],
        timeConstraints: TimeConstraints,
    ): Promise<GeneratedLearningPath> {
        try {
            // Call server endpoint that runs the curriculum designer in Node
            const res = await fetch(
                'http://localhost:3001/generate-learning-path',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        learnerProfile,
                        goals,
                        timeConstraints,
                    }),
                },
            )

            if (!res.ok) {
                const text = await res.text()
                throw new Error(`Server responded ${res.status}: ${text}`)
            }

            const json = await res.json()
            const raw = json.raw || JSON.stringify(json)

            return this.parseAgentResponse(
                raw,
                learnerProfile,
                timeConstraints,
                goals,
            )
        } catch (error) {
            console.error(
                'Error generating learning path with IQAI (client->server):',
                error,
            )
            return this.generateMockLearningPath(
                learnerProfile,
                goals,
                timeConstraints,
            )
        }
    }

    private async parseAgentResponse(
        response: any,
        learnerProfile: LearnerProfile,
        timeConstraints: TimeConstraints,
        goals?: LearningGoal[],
    ): Promise<GeneratedLearningPath> {
        // Normalize response to string
        const raw =
            typeof response === 'string'
                ? response
                : response?.content ||
                  response?.text ||
                  JSON.stringify(response)

        // Attempt to locate the first JSON object in the response
        const jsonMatch = raw.match(/\{[\s\S]*\}/)

        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0])

                // Validate basic shape and provide defaults where needed
                const id = parsed.id || `path-${Date.now()}`
                const title = parsed.title || learnerProfile.title
                const description =
                    parsed.description ||
                    `AI-generated learning path for ${learnerProfile.domain}`
                const totalDuration =
                    parsed.totalDuration || timeConstraints.timeline
                const difficulty =
                    parsed.difficulty || learnerProfile.experienceLevel

                // If modules provided by agent, use them (normalize each module)
                let modules: GeneratedModule[] = []
                if (
                    Array.isArray(parsed.modules) &&
                    parsed.modules.length > 0
                ) {
                    modules = parsed.modules.map((m: any, idx: number) => ({
                        id: m.id || `module-${idx + 1}`,
                        title: m.title || `Module ${idx + 1}`,
                        description:
                            m.description ||
                            `Module ${idx + 1} for ${learnerProfile.domain}`,
                        duration:
                            m.duration ||
                            this.getModuleDuration(
                                timeConstraints.weeklyHours,
                                Math.max(parsed.modules.length, 1),
                            ),
                        difficulty:
                            (m.difficulty as any) ||
                            this.getModuleDifficulty(
                                learnerProfile.experienceLevel,
                                idx,
                                Math.max(parsed.modules.length, 1),
                            ),
                        competencies:
                            Array.isArray(m.competencies) &&
                            m.competencies.length > 0
                                ? m.competencies
                                : m.competency
                                ? [m.competency]
                                : this.getModuleCompetencies(
                                      learnerProfile.domain,
                                      idx + 1,
                                  ),
                        resources: Array.isArray(m.resources)
                            ? m.resources.map((r: any) => ({
                                  type: r.type || 'article',
                                  title:
                                      r.title ||
                                      `${learnerProfile.domain} Resource ${
                                          idx + 1
                                      }`,
                                  url: r.url,
                                  estimatedTime:
                                      r.estimatedTime || '30 minutes',
                              }))
                            : this.generateResources(
                                  learnerProfile.domain,
                                  idx + 1,
                              ),
                        assessments: Array.isArray(m.assessments)
                            ? m.assessments.map((a: any) => ({
                                  type: a.type || 'quiz',
                                  title:
                                      a.title || `Module ${idx + 1} Assessment`,
                                  description: a.description || 'Assessment',
                              }))
                            : this.generateAssessments(idx + 1),
                    }))
                } else {
                    // No modules returned -> fall back to goal-driven generation
                    modules = this.generateModulesFromProfile(
                        learnerProfile,
                        timeConstraints,
                        goals,
                    )
                }

                const prerequisites =
                    Array.isArray(parsed.prerequisites) &&
                    parsed.prerequisites.length > 0
                        ? parsed.prerequisites
                        : this.getPrerequisites(
                              learnerProfile.domain,
                              learnerProfile.experienceLevel,
                          )
                const outcomes =
                    Array.isArray(parsed.outcomes) && parsed.outcomes.length > 0
                        ? parsed.outcomes
                        : this.getLearningOutcomes(
                              learnerProfile.domain,
                              learnerProfile.experienceLevel,
                          )

                return {
                    id,
                    title,
                    description,
                    totalDuration,
                    difficulty,
                    modules,
                    prerequisites,
                    outcomes,
                }
            } catch (err) {
                console.warn(
                    'iqaiCurriculumService: failed to parse agent JSON output, falling back to generated path',
                    err,
                )
                // fall through to fallback
            }
        } else {
            console.warn(
                'iqaiCurriculumService: no JSON object found in agent response, using fallback generation',
            )
        }

        // Fallback: use goal-driven generation but treat it as authoritative for now
        const fallbackModules = this.generateModulesFromProfile(
            learnerProfile,
            timeConstraints,
            goals,
        )
        return {
            id: `path-${Date.now()}`,
            title: learnerProfile.title,
            description: `AI-generated learning path for ${learnerProfile.domain}`,
            totalDuration: timeConstraints.timeline,
            difficulty: learnerProfile.experienceLevel,
            modules: fallbackModules,
            prerequisites: this.getPrerequisites(
                learnerProfile.domain,
                learnerProfile.experienceLevel,
            ),
            outcomes: this.getLearningOutcomes(
                learnerProfile.domain,
                learnerProfile.experienceLevel,
            ),
        }
    }

    private generateModulesFromProfile(
        learnerProfile: LearnerProfile,
        timeConstraints: TimeConstraints,
        goals?: LearningGoal[],
    ): GeneratedModule[] {
        const moduleCount = this.getModuleCount(timeConstraints.timeline)
        const modules: GeneratedModule[] = []

        // If goals are provided, generate modules that map to goals dynamically
        if (goals && goals.length > 0) {
            // Create a simple progression per goal: intro, practice, project/assessment
            const modulesPerGoal = Math.max(
                1,
                Math.floor(moduleCount / goals.length),
            )
            let idx = 0

            for (const goal of goals) {
                for (
                    let step = 0;
                    step < modulesPerGoal && idx < moduleCount;
                    step++, idx++
                ) {
                    const stepName =
                        step === 0
                            ? `Intro to ${goal.title}`
                            : step === modulesPerGoal - 1
                            ? `Project: ${goal.title}`
                            : `${goal.title} Practice ${step}`

                    modules.push({
                        id: `module-${idx + 1}`,
                        title: stepName,
                        description: `${goal.title}: ${
                            goal.description
                        }. This module focuses on ${goal.targetCompetencies.join(
                            ', ',
                        )}.`,
                        duration: this.getModuleDuration(
                            timeConstraints.weeklyHours,
                            moduleCount,
                        ),
                        difficulty: this.getModuleDifficulty(
                            learnerProfile.experienceLevel,
                            idx,
                            moduleCount,
                        ),
                        competencies: goal.targetCompetencies.length
                            ? goal.targetCompetencies
                            : this.getModuleCompetencies(
                                  learnerProfile.domain,
                                  idx + 1,
                              ),
                        resources: this.generateResources(
                            learnerProfile.domain,
                            idx + 1,
                        ),
                        assessments: this.generateAssessments(idx + 1),
                    })
                }
            }

            // If we still need more modules, fill with domain-based modules
            while (modules.length < moduleCount) {
                const i = modules.length
                modules.push({
                    id: `module-${i + 1}`,
                    title: this.getModuleTitle(
                        learnerProfile.domain,
                        i + 1,
                        learnerProfile.experienceLevel,
                    ),
                    description: this.getModuleDescription(
                        learnerProfile.domain,
                        i + 1,
                    ),
                    duration: this.getModuleDuration(
                        timeConstraints.weeklyHours,
                        moduleCount,
                    ),
                    difficulty: this.getModuleDifficulty(
                        learnerProfile.experienceLevel,
                        i,
                        moduleCount,
                    ),
                    competencies: this.getModuleCompetencies(
                        learnerProfile.domain,
                        i + 1,
                    ),
                    resources: this.generateResources(
                        learnerProfile.domain,
                        i + 1,
                    ),
                    assessments: this.generateAssessments(i + 1),
                })
            }
        } else {
            for (let i = 0; i < moduleCount; i++) {
                modules.push({
                    id: `module-${i + 1}`,
                    title: this.getModuleTitle(
                        learnerProfile.domain,
                        i + 1,
                        learnerProfile.experienceLevel,
                    ),
                    description: this.getModuleDescription(
                        learnerProfile.domain,
                        i + 1,
                    ),
                    duration: this.getModuleDuration(
                        timeConstraints.weeklyHours,
                        moduleCount,
                    ),
                    difficulty: this.getModuleDifficulty(
                        learnerProfile.experienceLevel,
                        i,
                        moduleCount,
                    ),
                    competencies: this.getModuleCompetencies(
                        learnerProfile.domain,
                        i + 1,
                    ),
                    resources: this.generateResources(
                        learnerProfile.domain,
                        i + 1,
                    ),
                    assessments: this.generateAssessments(i + 1),
                })
            }
        }

        return modules
    }

    private getModuleCount(timeline: string): number {
        const timelineMap: { [key: string]: number } = {
            '1-week': 3,
            '2-weeks': 5,
            '1-month': 8,
            '3-months': 12,
            '6-months': 16,
        }
        return timelineMap[timeline] || 8
    }

    private getModuleTitle(
        domain: string,
        moduleNumber: number,
        level: string,
    ): string {
        const domainModules: { [key: string]: string[] } = {
            'Frontend Development': [
                'HTML & CSS Fundamentals',
                'JavaScript Essentials',
                'React Basics',
                'Component Architecture',
                'State Management',
                'API Integration',
                'Testing & Debugging',
                'Performance Optimization',
            ],
            'Data Science': [
                'Data Analysis Fundamentals',
                'Python for Data Science',
                'Statistical Methods',
                'Data Visualization',
                'Machine Learning Basics',
                'Advanced ML Algorithms',
                'Data Engineering',
                'Model Deployment',
            ],
            'Machine Learning': [
                'ML Fundamentals',
                'Supervised Learning',
                'Unsupervised Learning',
                'Deep Learning Basics',
                'Neural Networks',
                'Computer Vision',
                'Natural Language Processing',
                'MLOps & Deployment',
            ],
        }

        const modules = domainModules[domain] || [
            'Foundation Concepts',
            'Core Principles',
            'Practical Applications',
            'Advanced Techniques',
            'Real-world Projects',
            'Best Practices',
            'Industry Standards',
            'Professional Development',
        ]

        return modules[moduleNumber - 1] || `${domain} Module ${moduleNumber}`
    }

    private getModuleDescription(domain: string, moduleNumber: number): string {
        return `Comprehensive module covering essential concepts and practical skills in ${domain}. Build hands-on experience through projects and exercises.`
    }

    private getModuleDuration(
        weeklyHours: number,
        totalModules: number,
    ): string {
        const hoursPerModule = Math.ceil((weeklyHours / totalModules) * 4) // Assuming 4 weeks spread
        return `${hoursPerModule} hours`
    }

    private getModuleDifficulty(
        baseLevel: string,
        moduleIndex: number,
        totalModules: number,
    ): 'beginner' | 'intermediate' | 'advanced' {
        const progression = moduleIndex / totalModules

        if (baseLevel === 'beginner') {
            return progression < 0.4
                ? 'beginner'
                : progression < 0.8
                ? 'intermediate'
                : 'advanced'
        } else if (baseLevel === 'intermediate') {
            return progression < 0.3 ? 'intermediate' : 'advanced'
        } else {
            return 'advanced'
        }
    }

    private getModuleCompetencies(
        domain: string,
        moduleNumber: number,
    ): string[] {
        const baseCompetencies = [
            'Problem-solving skills',
            'Critical thinking',
            'Technical proficiency',
        ]

        const domainSpecific: { [key: string]: string[] } = {
            'Frontend Development': [
                'HTML/CSS mastery',
                'JavaScript programming',
                'React development',
            ],
            'Data Science': [
                'Data analysis',
                'Statistical modeling',
                'Python programming',
            ],
            'Machine Learning': [
                'Algorithm understanding',
                'Model development',
                'Data preprocessing',
            ],
        }

        return [...baseCompetencies, ...(domainSpecific[domain] || [])]
    }

    private generateResources(domain: string, moduleNumber: number) {
        return [
            {
                type: 'video' as const,
                title: `${domain} Video Tutorial ${moduleNumber}`,
                estimatedTime: '45 minutes',
            },
            {
                type: 'article' as const,
                title: `Essential Reading: ${domain} Concepts`,
                estimatedTime: '30 minutes',
            },
            {
                type: 'exercise' as const,
                title: `Hands-on Practice ${moduleNumber}`,
                estimatedTime: '2 hours',
            },
            {
                type: 'project' as const,
                title: `Module ${moduleNumber} Project`,
                estimatedTime: '4 hours',
            },
        ]
    }

    private generateAssessments(moduleNumber: number) {
        return [
            {
                type: 'quiz' as const,
                title: `Module ${moduleNumber} Knowledge Check`,
                description: 'Test your understanding of key concepts',
            },
            {
                type: 'project' as const,
                title: `Module ${moduleNumber} Practical Assessment`,
                description: 'Apply your skills in a real-world scenario',
            },
        ]
    }

    private getPrerequisites(domain: string, level: string): string[] {
        if (level === 'beginner')
            return ['Basic computer skills', 'Willingness to learn']
        if (level === 'intermediate')
            return [
                'Foundational knowledge in ' + domain,
                'Previous coding experience',
            ]
        return [
            'Advanced understanding of ' + domain,
            'Professional experience',
        ]
    }

    private getLearningOutcomes(domain: string, level: string): string[] {
        return [
            `Proficiency in ${domain} fundamentals`,
            'Ability to build real-world projects',
            'Industry-ready skills and knowledge',
            'Problem-solving capabilities',
            'Professional portfolio development',
        ]
    }

    private generateMockLearningPath(
        learnerProfile: LearnerProfile,
        goals: LearningGoal[],
        timeConstraints: TimeConstraints,
    ): GeneratedLearningPath {
        // Fallback mock implementation
        return {
            id: `mock-path-${Date.now()}`,
            title: `${learnerProfile.title} (Mock)`,
            description: `Mock learning path for ${learnerProfile.domain}`,
            totalDuration: timeConstraints.timeline,
            difficulty: learnerProfile.experienceLevel,
            modules: this.generateModulesFromProfile(
                learnerProfile,
                timeConstraints,
            ),
            prerequisites: ['Basic understanding of the subject'],
            outcomes: [
                'Complete understanding of core concepts',
                'Practical application skills',
            ],
        }
    }
}

export const iqaiCurriculumService = new IQAICurriculumService()
