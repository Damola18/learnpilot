import { runAllAgentTests } from '../agents/test-agents'

// Add a simple component to test the agents
export function TestAgentsPage() {
    const handleRunTests = async () => {
        console.log('🚀 Starting AI Agents tests...')

        try {
            const results = await runAllAgentTests()
            console.log('✅ Tests completed:', results)
        } catch (error) {
            console.error('❌ Tests failed:', error)
        }
    }

    return (
        <div className='p-6 max-w-4xl mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>AI Agents Test Suite</h1>

            <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                <h2 className='text-lg font-semibold mb-2'>Available Tests:</h2>
                <ul className='list-disc list-inside space-y-1'>
                    <li>
                        Agent Basics - Test agent creation and initialization
                    </li>
                    <li>
                        Curriculum Designer - Test curriculum design
                        functionality
                    </li>
                </ul>
            </div>

            <button
                onClick={handleRunTests}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'
            >
                Run Agent Tests
            </button>

            <div className='mt-6 text-sm text-gray-600'>
                <p>Open the browser console to see test results.</p>
                <p>
                    Tests will verify that the AI agents can be created and
                    initialized properly.
                </p>
            </div>
        </div>
    )
}
