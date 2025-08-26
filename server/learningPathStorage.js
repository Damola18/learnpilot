import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    AgentBuilder,
    createDatabaseSessionService,
    InMemoryArtifactService,
    LoadArtifactsTool,
    createTool,
    DatabaseSessionService,
} from '@iqai/adk'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const APP_NAME = 'learning-path-storage'

// Helper function to get SQLite connection string
// function getSqliteConnectionString(dbName) {
//     const dataDir = path.join(__dirname, 'data')
//     const dbPath = path.join(dataDir, `${dbName}.db`)

//     // Ensure the data directory exists with proper permissions
//     if (!fs.existsSync(dataDir)) {
//         fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
//         console.log(`Created database directory: ${dataDir}`)
//     }

//     // Verify the directory is writable
//     try {
//         fs.accessSync(dataDir, fs.constants.W_OK)
//         console.log(`Database directory is writable: ${dataDir}`)
//     } catch (error) {
//         console.error(`Database directory is not writable: ${dataDir}`, error)
//         throw new Error(`Cannot write to database directory: ${dataDir}`)
//     }

//     console.log(`Using database path: ${dbPath}`)

//     // Use file: protocol for SQLite connection
//     return `sqlite:///${dbPath}`
// }

function getSqliteConnectionString(dbName) {
    const dbPath = path.join(__dirname, 'data', `${dbName}.db`)
    if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    }
    return `sqlite:///${dbPath}`
}

// Learning Path Storage Tools
const saveLearningPathTool = createTool({
    name: 'save_learning_path',
    description: 'Save a generated learning path to persistent storage',
    schema: z.object({
        learningPath: z.object({
            id: z.string().describe('Unique learning path ID'),
            title: z.string().describe('Learning path title'),
            description: z.string().describe('Path description'),
            totalDuration: z.string().describe('Total estimated duration'),
            difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
            modules: z.array(z.any()).describe('Array of learning modules'),
            prerequisites: z.array(z.string()).describe('Prerequisites'),
            outcomes: z.array(z.string()).describe('Learning outcomes'),
        }),
        metadata: z
            .object({
                userId: z
                    .string()
                    .optional()
                    .describe('User who created the path'),
                generatedBy: z
                    .string()
                    .default('ai')
                    .describe('Generation method'),
                tags: z
                    .array(z.string())
                    .default([])
                    .describe('Tags for categorization'),
                domain: z
                    .string()
                    .optional()
                    .describe('Learning domain/subject'),
            })
            .optional(),
    }),
    fn: async ({ learningPath, metadata = {} }, context) => {
        try {
            // Store learning path metadata in session state
            const learningPaths = context.state.get('learning_paths', [])

            const pathRecord = {
                id: learningPath.id,
                title: learningPath.title,
                description: learningPath.description,
                difficulty: learningPath.difficulty,
                totalDuration: learningPath.totalDuration,
                moduleCount: learningPath.modules?.length || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                ...metadata,
            }

            learningPaths.push(pathRecord)
            context.state.set('learning_paths', learningPaths)

            // Save full learning path as artifact for detailed retrieval
            const pathContent = JSON.stringify(learningPath, null, 2)
            const artifactFilename = `learning-paths/${learningPath.id}.json`
            const version = await context.saveArtifact(artifactFilename, {
                text: pathContent,
            })

            // Track resources separately for analytics
            const resources = context.state.get('resources', [])
            if (learningPath.modules) {
                learningPath.modules.forEach((module, moduleIndex) => {
                    if (module.resources) {
                        module.resources.forEach((resource, resourceIndex) => {
                            resources.push({
                                id: `${learningPath.id}_m${moduleIndex}_r${resourceIndex}`,
                                pathId: learningPath.id,
                                moduleId: module.id,
                                type: resource.type,
                                title: resource.title,
                                hasUrl: !!resource.url,
                                estimatedTime: resource.estimatedTime,
                                createdAt: new Date().toISOString(),
                            })
                        })
                    }
                })
            }
            context.state.set('resources', resources)

            return {
                success: true,
                pathId: learningPath.id,
                version,
                resourceCount:
                    learningPath.modules?.reduce(
                        (count, module) =>
                            count + (module.resources?.length || 0),
                        0,
                    ) || 0,
                message: `✅ Learning path '${learningPath.title}' saved successfully`,
            }
        } catch (error) {
            return {
                success: false,
                message: `❌ Failed to save learning path: ${error.message}`,
            }
        }
    },
})

const getLearningPathTool = createTool({
    name: 'get_learning_path',
    description: 'Retrieve a specific learning path by ID',
    schema: z.object({
        pathId: z.string().describe('Learning path ID to retrieve'),
    }),
    fn: async ({ pathId }, context) => {
        try {
            // Get metadata from session state
            console.log('===')
            const learningPaths = await context.state.get('learning_paths', [])
            const pathMetadata = learningPaths.find((p) => p.id === pathId)

            if (!pathMetadata) {
                return {
                    success: false,
                    message: `❌ Learning path '${pathId}' not found`,
                }
            }

            // Load full path from artifacts
            const artifactFilename = `learning-paths/${pathId}.json`
            const artifacts = await context.loadArtifacts([artifactFilename])

            if (!artifacts || artifacts.length === 0) {
                return {
                    success: false,
                    message: `❌ Learning path content for '${pathId}' not found`,
                }
            }

            const fullPath = JSON.parse(artifacts[0].text)

            return {
                success: true,
                metadata: pathMetadata,
                learningPath: fullPath,
                message: `📚 Retrieved learning path '${pathMetadata.title}'`,
            }
        } catch (error) {
            return {
                success: false,
                message: `❌ Error retrieving learning path: ${error.message}`,
            }
        }
    },
})

const listLearningPathsTool = createTool({
    name: 'list_learning_paths',
    description: 'List all stored learning paths with optional filtering',
    schema: z.object({
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        domain: z.string().optional(),
        userId: z.string().optional(),
        limit: z.number().default(20).describe('Maximum number of results'),
        status: z.string().default('active').describe('Path status filter'),
    }),
    fn: async ({ difficulty, domain, userId, limit, status }, context) => {
        try {
            const learningPaths = context.state.get('learning_paths', [])

            let filteredPaths = learningPaths.filter((path) => {
                if (status && path.status !== status) return false
                if (difficulty && path.difficulty !== difficulty) return false
                if (domain && path.domain !== domain) return false
                if (userId && path.userId !== userId) return false
                return true
            })

            // Sort by creation date (newest first)
            filteredPaths.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            )

            // Apply limit
            filteredPaths = filteredPaths.slice(0, limit)

            return {
                success: true,
                count: filteredPaths.length,
                totalStored: learningPaths.length,
                paths: filteredPaths.map((path) => ({
                    id: path.id,
                    title: path.title,
                    description: path.description,
                    difficulty: path.difficulty,
                    totalDuration: path.totalDuration,
                    moduleCount: path.moduleCount,
                    createdAt: path.createdAt,
                    domain: path.domain,
                    tags: path.tags,
                })),
                message: `📋 Found ${filteredPaths.length} learning paths`,
            }
        } catch (error) {
            return {
                success: false,
                message: `❌ Error listing learning paths: ${error.message}`,
            }
        }
    },
})

const getResourceAnalyticsTool = createTool({
    name: 'get_resource_analytics',
    description: 'Analyze resources across learning paths',
    schema: z.object({
        pathId: z
            .string()
            .optional()
            .describe('Specific path ID for focused analysis'),
        resourceType: z.string().optional().describe('Filter by resource type'),
    }),
    fn: async ({ pathId, resourceType }, context) => {
        try {
            const resources = context.state.get('resources', [])

            let filteredResources = resources
            if (pathId) {
                filteredResources = resources.filter((r) => r.pathId === pathId)
            }
            if (resourceType) {
                filteredResources = filteredResources.filter(
                    (r) => r.type === resourceType,
                )
            }

            const analytics = {
                totalResources: filteredResources.length,
                resourcesWithUrls: filteredResources.filter((r) => r.hasUrl)
                    .length,
                resourcesWithoutUrls: filteredResources.filter((r) => !r.hasUrl)
                    .length,
                byType: {},
                averageEstimatedTime: 0,
                pathCoverage: pathId
                    ? 1
                    : new Set(filteredResources.map((r) => r.pathId)).size,
            }

            // Calculate resource type distribution
            filteredResources.forEach((resource) => {
                analytics.byType[resource.type] =
                    (analytics.byType[resource.type] || 0) + 1
            })

            // Calculate URL availability percentage
            const urlAvailabilityPercent =
                filteredResources.length > 0
                    ? Math.round(
                          (analytics.resourcesWithUrls /
                              analytics.totalResources) *
                              100,
                      )
                    : 0

            return {
                success: true,
                pathId: pathId || 'all',
                analytics: {
                    ...analytics,
                    urlAvailabilityPercent,
                    mostCommonType: Object.keys(analytics.byType).reduce(
                        (a, b) =>
                            analytics.byType[a] > analytics.byType[b] ? a : b,
                        'none',
                    ),
                },
                message: `📊 Resource analytics: ${analytics.totalResources} resources analyzed`,
            }
        } catch (error) {
            return {
                success: false,
                message: `❌ Error generating analytics: ${error.message}`,
            }
        }
    },
})

const updateLearningPathTool = createTool({
    name: 'update_learning_path',
    description: 'Update an existing learning path',
    schema: z.object({
        pathId: z.string().describe('Learning path ID to update'),
        updates: z
            .object({
                title: z.string().optional(),
                description: z.string().optional(),
                status: z.string().optional(),
                tags: z.array(z.string()).optional(),
            })
            .describe('Fields to update'),
    }),
    fn: async ({ pathId, updates }, context) => {
        try {
            const learningPaths = context.state.get('learning_paths', [])
            const pathIndex = learningPaths.findIndex((p) => p.id === pathId)

            if (pathIndex === -1) {
                return {
                    success: false,
                    message: `❌ Learning path '${pathId}' not found`,
                }
            }

            // Update metadata
            learningPaths[pathIndex] = {
                ...learningPaths[pathIndex],
                ...updates,
                updatedAt: new Date().toISOString(),
            }

            context.state.set('learning_paths', learningPaths)

            return {
                success: true,
                pathId,
                updatedFields: Object.keys(updates),
                message: `📝 Learning path '${pathId}' updated successfully`,
            }
        } catch (error) {
            return {
                success: false,
                message: `❌ Error updating learning path: ${error.message}`,
            }
        }
    },
})

export async function createLearningPathStorageAgent(userId = null) {
    try {
        // Ensure data directory exists before creating session service
        const dataDir = path.join(__dirname, 'data')
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
            console.log(`Created database directory: ${dataDir}`)
        }

        // Get the connection string
        const connectionString = getSqliteConnectionString('learning_paths')
        console.log(
            `Creating session service with connection: ${connectionString}`,
        )

        const sessionService = createDatabaseSessionService(connectionString)
        console.log('Session service created successfully')

        const artifactService = new InMemoryArtifactService()
        console.log('Artifact service created successfully')

        console.log('Creating agent with tools...')

        const tools = [
            saveLearningPathTool,
            getLearningPathTool,
            listLearningPathsTool,
            getResourceAnalyticsTool,
            updateLearningPathTool,
            new LoadArtifactsTool(),
        ]

        console.log(
            'Tools being added:',
            tools.map((t) => t.name || t.constructor.name),
        )

        const { runner, session } = await AgentBuilder.create(
            'learning_path_storage',
        )
            .withModel('gemini-2.5-flash')
            .withDescription(
                'A specialized agent for storing and managing learning paths and resources',
            )
            .withInstruction(
                `
            You are a Learning Path Storage Manager that handles persistent storage of generated learning paths.
            
            Your capabilities:
            1. Save complete learning paths with full metadata and content using save_learning_path
            2. Retrieve specific learning paths by ID using get_learning_path
            3. List and filter learning paths by various criteria using list_learning_paths
            4. Generate analytics on resources and usage patterns using get_resource_analytics
            5. Update learning path metadata and status using update_learning_path
            
            You maintain both:
            - Session state: For quick metadata queries and analytics
            - Artifacts: For full learning path content storage
            
            Always provide clear feedback on storage operations and helpful analytics.
            
            When asked to save a learning path, use the save_learning_path tool with the provided learning path and metadata objects.
        `,
            )
            .withTools(...tools)
            .withSessionService(sessionService, {
                userId: userId || uuidv4(),
                appName: APP_NAME,
            })
            .withArtifactService(artifactService)
            .build()

        console.log('Learning path storage agent created successfully')
        console.log(
            'Available tools in runner:',
            runner?.tools ? Object.keys(runner.tools) : 'No tools property',
        )
        return { runner, session }
    } catch (error) {
        console.error('Error creating learning path storage agent:', error)
        console.error('Error stack:', error.stack)

        // Try using a simpler approach - in-memory only for now
        console.log('Attempting fallback to in-memory storage...')

        try {
            // const artifactService = new DatabaseSessionService({
            //     db: database, // Your configured Kysely instance
            //     skipTableCreation: false, // Let service create tables automatically
            // })
            const artifactService = new InMemoryArtifactService()

            const { runner, session } = await AgentBuilder.create(
                'learning_path_storage_fallback',
            )
                .withModel('gemini-2.5-flash')
                .withDescription(
                    'A specialized agent for storing and managing learning paths and resources (in-memory)',
                )
                .withInstruction(
                    `
                You are a Learning Path Storage Manager that handles storage of generated learning paths.
                
                Your capabilities:
                1. Save complete learning paths with full metadata and content
                2. Retrieve specific learning paths by ID
                3. List and filter learning paths by various criteria
                4. Generate analytics on resources and usage patterns
                5. Update learning path metadata and status
                
                Note: This is running in fallback mode with in-memory storage only.
                
                Always provide clear feedback on storage operations and helpful analytics.
            `,
                )
                .withTools(
                    saveLearningPathTool,
                    getLearningPathTool,
                    listLearningPathsTool,
                    getResourceAnalyticsTool,
                    updateLearningPathTool,
                    new LoadArtifactsTool(),
                )
                .withArtifactService(artifactService)
                .build()

            console.log(
                'Learning path storage agent created successfully (fallback mode)',
            )
            return { runner, session }
        } catch (fallbackError) {
            console.error('Fallback agent creation also failed:', fallbackError)
            throw fallbackError
        }
    }
}
