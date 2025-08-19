/**
 * AI Agents Test Suite
 *
 * This file tests the implementation of our educational AI agents
 * to ensure they work correctly with the ADK framework.
 */

import { createCurriculumDesigner } from './curriculum-designer'

// Test data for curriculum design
const sampleLearnerProfile = {
    id: 'student_001',
    demographics: {
        age: 16,
        gradeLevel: 10,
        learningStyle: 'visual' as const,
    },
    currentCompetencies: {
        mathematics: 0.75,
        science: 0.68,
        writing: 0.55,
    },
    learningGoals: [
        {
            goal: 'Improve algebra skills',
            priority: 'high' as const,
            timeframe: '6 months',
            measurableOutcomes: [
                'Solve quadratic equations',
                'Graph linear functions',
            ],
        },
    ],
    assessmentHistory: [
        {
            subject: 'Mathematics',
            score: 85,
            date: '2024-01-15',
            strengths: ['Problem solving', 'Logical reasoning'],
            weaknesses: ['Complex equations', 'Word problems'],
        },
    ],
    preferences: {
        contentTypes: ['videos', 'interactive'],
        pacing: 'structured' as const,
        interactionStyle: 'guided' as const,
    },
}

/**
 * Test the Curriculum Designer Agent
 */
export async function testCurriculumDesigner() {
    console.log('📚 Testing Curriculum Designer Agent...')

    try {
        // Create the curriculum designer agent
        const { agent, runner, session } = await createCurriculumDesigner()

        console.log('✅ Curriculum Designer Agent created successfully')
        console.log('Agent name:', agent.name)
        console.log('Agent description:', agent.description)
        console.log(
            'Available methods on runner:',
            Object.getOwnPropertyNames(runner).filter(
                (name) => typeof runner[name] === 'function',
            ),
        )

        return { success: true, agent, runner, session }
    } catch (error) {
        console.error('❌ Curriculum Designer test failed:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Test agent creation and basic functionality
 */
export async function testAgentBasics() {
    console.log('🛠️ Testing Agent Basics...')

    try {
        const { agent, runner, session } = await createCurriculumDesigner()

        console.log('✅ Agent creation successful')
        console.log('Agent details:', {
            name: agent.name,
            description: agent.description,
            hasRunner: !!runner,
            hasSession: !!session,
        })

        return { success: true, agent, runner, session }
    } catch (error) {
        console.error('❌ Agent basics test failed:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Run all tests
 */
export async function runAllAgentTests() {
    console.log('🚀 Starting AI Agents Test Suite...\n')

    const results = {
        agentBasics: await testAgentBasics(),
        curriculumDesigner: await testCurriculumDesigner(),
    }

    console.log('\n📋 Test Summary:')
    console.log(
        'Agent Basics:',
        results.agentBasics.success ? '✅ PASSED' : '❌ FAILED',
    )
    console.log(
        'Curriculum Designer:',
        results.curriculumDesigner.success ? '✅ PASSED' : '❌ FAILED',
    )

    return results
}

// Export test functions for external use
export { sampleLearnerProfile }
