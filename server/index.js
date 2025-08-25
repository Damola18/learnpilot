import express from 'express'
import cors from 'cors'
import { AgentBuilder } from '@iqai/adk'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { directStorage } from './directStorage.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = express()
app.use(cors())
app.use(express.json())

export async function agent() {
    return await AgentBuilder.create('curriculum_designer')
        .withModel('gemini-2.5-flash')
        .withInstruction(
            'You are an expert curriculum designer AI that creates personalized learning paths. Always return valid JSON objects for learning paths.',
        )
        .build()
}

app.post('/generate-learning-path', async (req, res) => {
    try {
        const { learnerProfile, goals, timeConstraints } = req.body || {}

        console.log('Server: creating LlmAgent curriculum designer')

        console.log('Server: LlmAgent created successfully')

        const instruction = `You are an expert curriculum designer AI that creates personalized learning paths.

Please create a comprehensive learning path JSON object based on the following information:

LEARNER PROFILE:
${JSON.stringify(learnerProfile, null, 2)}

LEARNING GOALS:
${JSON.stringify(goals, null, 2)}

TIME CONSTRAINTS:
${JSON.stringify(timeConstraints, null, 2)}

Instructions:
1. Analyze the learner's profile, goals, and time constraints
2. Create a detailed learning path with modules, resources, and assessments
3. For resources, ONLY include well-known, freely available resources with real URLs that exist online
4. Do NOT invent or hallucinate URLs - if you don't know a specific real URL, omit the "url" field entirely
5. Focus on reputable sources like official documentation, established educational platforms, and widely-known resources
6. Return ONLY a valid JSON object with the following structure:
{
  "id": "unique_path_id",
  "title": "Learning Path Title",
  "description": "Path description",
  "totalDuration": "estimated total time",
  "difficulty": "beginner|intermediate|advanced",
  "modules": [
    {
      "id": "module_id",
      "title": "Module Title",
      "description": "Module description",
      "duration": "estimated time",
      "difficulty": "beginner|intermediate|advanced",
      "competencies": ["skill1", "skill2"],
      "resources": [
        {
          "type": "video|article|exercise|project",
          "title": "Resource Title",
          "estimatedTime": "time estimate"
        }
      ],
      "assessments": [
        {
          "type": "quiz|project|assignment",
          "title": "Assessment Title",
          "description": "Assessment description"
        }
      ]
    }
  ],
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "outcomes": ["outcome1", "outcome2"]
}

IMPORTANT: Only include resource URLs if you are absolutely certain they exist. When in doubt, omit the URL field. Focus on creating high-quality, realistic learning paths with genuine resource recommendations.

Make sure the learning path is tailored to the specific learner profile and goals provided.`

        console.log('Server: running agent with comprehensive instruction')

        // Run the agent with the instruction

        const { runner } = await agent()
        const response = await runner.ask(instruction)

        console.log('Server: agent response received')
        console.log('Server: response type:', typeof response)
        console.log(response)
        console.log(
            'Server: response content preview:',
            JSON.stringify(response).substring(0, 200) + '...',
        )

        const raw =
            typeof response === 'string'
                ? response
                : response?.content ||
                  response?.text ||
                  JSON.stringify(response)

        console.log('Server: sending response, length:', raw.length)

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ raw })
    } catch (err) {
        console.error('generate-learning-path handler error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// Save learning path endpoint
app.post('/save-learning-path', async (req, res) => {
    try {
        const { learningPath, learnerProfile, userId } = req.body || {}

        if (!learningPath) {
            return res
                .status(400)
                .json({ error: 'Learning path data is required' })
        }

        console.log('Server: saving learning path using direct storage')

        // Prepare metadata from learner profile
        const metadata = {
            userId: userId || 'anonymous',
            generatedBy: 'ai',
            domain: learnerProfile?.domain || 'general',
            tags: learnerProfile?.domain ? [learnerProfile.domain] : [],
        }

        // Use direct storage
        const result = await directStorage.saveLearningPath(
            learningPath,
            metadata,
        )

        console.log(
            'Server: learning path saved successfully with direct storage',
        )

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(result)
    } catch (err) {
        console.error('save-learning-path error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// Get learning path by ID endpoint
app.get('/learning-path/:id', async (req, res) => {
    try {
        const { id } = req.params

        console.log(
            'Server: retrieving learning path using direct storage:',
            id,
        )

        const result = await directStorage.getLearningPath(id)

        if (!result.success) {
            return res.status(404).json(result)
        }

        console.log('Server: learning path retrieved from direct storage')

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(result)
    } catch (err) {
        console.error('get-learning-path error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// List learning paths endpoint
app.get('/learning-paths', async (req, res) => {
    try {
        const { difficulty, domain, userId, limit, status } = req.query

        console.log(
            'Server: listing learning paths using direct storage with filters:',
            {
                difficulty,
                domain,
                userId,
                limit,
                status,
            },
        )

        const filters = {}
        if (difficulty) filters.difficulty = difficulty
        if (domain) filters.domain = domain
        if (status) filters.status = status
        if (limit) filters.limit = limit

        const result = await directStorage.listLearningPaths(filters)

        console.log(
            'Server: learning paths retrieved from direct storage, count:',
            result.count,
        )

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(result)
    } catch (err) {
        console.error('list-learning-paths error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// Resource analytics endpoint - simplified without ADK dependency
app.get('/resource-analytics', async (req, res) => {
    try {
        const { pathId, resourceType } = req.query

        console.log(
            'Server: generating resource analytics using direct storage',
        )

        // Get learning paths and analyze resource usage
        const pathsResult = await directStorage.listLearningPaths()

        if (!pathsResult.success) {
            return res
                .status(500)
                .json({ error: 'Failed to retrieve learning paths' })
        }

        const paths = pathsResult.paths
        let filteredPaths = paths

        if (pathId) {
            filteredPaths = paths.filter((p) => p.id === pathId)
        }

        // Analyze resources across all paths or specific path
        const analytics = {
            totalPaths: filteredPaths.length,
            totalResources: 0,
            resourcesByType: {},
            averageResourcesPerPath: 0,
            pathAnalytics: [],
        }

        filteredPaths.forEach((path) => {
            const pathResources = []
            const pathResourceTypes = {}

            if (path.curriculum && path.curriculum.modules) {
                path.curriculum.modules.forEach((module) => {
                    if (module.resources) {
                        module.resources.forEach((resource) => {
                            if (
                                !resourceType ||
                                resource.type === resourceType
                            ) {
                                pathResources.push(resource)
                                pathResourceTypes[resource.type] =
                                    (pathResourceTypes[resource.type] || 0) + 1
                                analytics.resourcesByType[resource.type] =
                                    (analytics.resourcesByType[resource.type] ||
                                        0) + 1
                                analytics.totalResources++
                            }
                        })
                    }
                })
            }

            analytics.pathAnalytics.push({
                pathId: path.id,
                title: path.title,
                totalResources: pathResources.length,
                resourcesByType: pathResourceTypes,
            })
        })

        if (filteredPaths.length > 0) {
            analytics.averageResourcesPerPath =
                analytics.totalResources / filteredPaths.length
        }

        console.log('Server: resource analytics generated')

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            success: true,
            analytics: analytics,
        })
    } catch (err) {
        console.error('resource-analytics error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// Update learning path endpoint
app.patch('/learning-path/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { updates } = req.body || {}

        if (!updates) {
            return res.status(400).json({ error: 'Updates data is required' })
        }

        console.log('Server: updating learning path using direct storage:', id)

        const result = await directStorage.updateLearningPath(id, updates)

        if (!result.success) {
            return res.status(404).json(result)
        }

        console.log('Server: learning path updated successfully')

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(result)
    } catch (err) {
        console.error('update-learning-path error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`IQAI local server listening on http://localhost:${port}`)
    console.log('Ready to accept learning path generation requests')
})
