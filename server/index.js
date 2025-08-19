import express from 'express'
import cors from 'cors'
import { AgentBuilder } from '@iqai/adk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

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
3. Return ONLY a valid JSON object with the following structure:
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
          "url": "optional_url",
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

Make sure the learning path is tailored to the specific learner profile and goals provided.`

        console.log('Server: running agent with comprehensive instruction')

        // Run the agent with the instruction

        const { runner } = await agent()
        const response = await runner.ask(instruction)

        console.log('Server: agent response received')
        console.log('Server: response type:', typeof response)
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

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`IQAI local server listening on http://localhost:${port}`)
    console.log('Ready to accept learning path generation requests')
})
