import express from 'express'
import cors from 'cors'
import { AgentBuilder } from '@iqai/adk'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createLearningPathStorageAgent } from './learningPathStorage.js'

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

        console.log('Server: saving learning path with storage agent')

        const { runner, session } = await createLearningPathStorageAgent(userId)

        // Prepare metadata from learner profile
        const metadata = {
            userId: userId || 'anonymous',
            generatedBy: 'ai',
            domain: learnerProfile?.domain || 'general',
            tags: learnerProfile?.domain ? [learnerProfile.domain] : [],
        }

        // Since the agent tools aren't being recognized properly, let's implement a simple storage solution
        // Store the learning path data directly in session state for now
        try {
            const learningPaths = session?.state?.get('learning_paths') || []

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
                curriculum: learningPath, // Store full curriculum
                ...metadata,
            }

            learningPaths.push(pathRecord)
            session?.state?.set('learning_paths', learningPaths)

            console.log('Server: learning path saved successfully')
            console.log('Server: total paths stored:', learningPaths.length)

            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({
                success: true,
                pathId: learningPath.id,
                message: `Learning path '${learningPath.title}' saved successfully`,
            })
        } catch (directError) {
            console.error('Direct storage error:', directError)
            // Fallback to in-memory storage
            global.learningPaths = global.learningPaths || []

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
                curriculum: learningPath,
                ...metadata,
            }

            global.learningPaths.push(pathRecord)

            console.log('Server: learning path saved to fallback storage')
            console.log(
                'Server: total paths in fallback:',
                global.learningPaths.length,
            )

            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({
                success: true,
                pathId: learningPath.id,
                message: `Learning path '${learningPath.title}' saved successfully (fallback)`,
            })
        }
    } catch (err) {
        console.error('save-learning-path error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// Get learning path by ID endpoint
app.get('/learning-path/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.query

        console.log('Server: retrieving learning path:', id)

        // Try to get path from session storage first, then fallback to global storage
        let learningPaths = []

        try {
            const { session } = await createLearningPathStorageAgent(userId)
            learningPaths = session?.state?.get('learning_paths') || []
        } catch (sessionError) {
            learningPaths = global.learningPaths || []
        }

        const pathMetadata = learningPaths.find((p) => p.id === id)

        if (!pathMetadata) {
            return res.status(404).json({
                success: false,
                message: `Learning path '${id}' not found`,
            })
        }

        console.log('Server: learning path retrieved')

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            success: true,
            metadata: pathMetadata,
            learningPath: pathMetadata.curriculum,
        })
    } catch (err) {
        console.error('get-learning-path error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// List learning paths endpoint
app.get('/learning-paths', async (req, res) => {
    try {
        const { difficulty, domain, userId, limit, status } = req.query

        console.log('Server: listing learning paths with filters:', {
            difficulty,
            domain,
            userId,
            limit,
            status,
        })

        // Try to get paths from session storage first, then fallback to global storage
        let learningPaths = []

        try {
            const { session } = await createLearningPathStorageAgent(userId)
            learningPaths = session?.state?.get('learning_paths') || []
            console.log(
                'Server: loaded paths from session storage:',
                learningPaths.length,
            )
        } catch (sessionError) {
            console.log('Session storage not available, using fallback storage')
            learningPaths = global.learningPaths || []
            console.log(
                'Server: loaded paths from fallback storage:',
                learningPaths.length,
            )
        }

        // Apply filters
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
        const limitNum = parseInt(limit) || 20
        filteredPaths = filteredPaths.slice(0, limitNum)

        console.log(
            'Server: learning paths listed, filtered count:',
            filteredPaths.length,
        )

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
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
                status: path.status,
                curriculum: path.curriculum, // Include full curriculum for frontend
            })),
        })
    } catch (err) {
        console.error('list-learning-paths error:', err)
        return res.status(500).json({ error: err?.message || String(err) })
    }
})

// Resource analytics endpoint
app.get('/resource-analytics', async (req, res) => {
    try {
        const { pathId, resourceType, userId } = req.query

        console.log('Server: generating resource analytics')

        const { runner } = await createLearningPathStorageAgent(userId)

        let instruction = `Generate resource analytics`
        if (pathId) instruction += ` for learning path: ${pathId}`
        if (resourceType)
            instruction += ` filtered by resource type: ${resourceType}`
        instruction += `\n\nUse the get_resource_analytics tool to analyze resource usage patterns.`

        const response = await runner.ask(instruction)

        console.log('Server: resource analytics generated')

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            success: true,
            result: response,
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
        const { updates, userId } = req.body || {}

        if (!updates) {
            return res.status(400).json({ error: 'Updates data is required' })
        }

        console.log('Server: updating learning path:', id)

        const { runner } = await createLearningPathStorageAgent(userId)

        const instruction = `Update learning path ${id} with these changes:
${JSON.stringify(updates, null, 2)}

Use the update_learning_path tool to apply these updates.`

        const response = await runner.ask(instruction)

        console.log('Server: learning path updated')

        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({
            success: true,
            result: response,
        })
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
