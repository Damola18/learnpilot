// CURRICULUM DESIGNER (dynamic import of ADK to avoid client-side bundling)
export async function createCurriculumDesigner() {
    // dynamically import the ADK in Node runtime only
    // console.log('createCurriculumDesigner: dynamic importing @iqai/adk')
    const { AgentBuilder, createTool } = await import('@iqai/adk')

    // Define tools using createTool after the dynamic import
    const assessmentAnalyzerTool = createTool({
        name: 'analyze_assessment_results',
        description:
            'Analyze assessment data to identify learning gaps and strengths',
        fn: async () => {
            return {
                student_id: 'mock_student',
                strengths: ['Problem solving', 'Critical thinking'],
                gaps: ['Advanced algebra', 'Data interpretation'],
                competency_scores: [
                    {
                        competency: 'Math',
                        score: 85,
                        mastery_level: 'proficient',
                    },
                    {
                        competency: 'Science',
                        score: 72,
                        mastery_level: 'developing',
                    },
                ],
                recommendations: [
                    'Focus on algebraic concepts',
                    'Practice data visualization',
                    'Review foundational math skills',
                ],
            }
        },
    })

    const learningPathGeneratorTool = createTool({
        name: 'generate_learning_path',
        description:
            'Create personalized learning sequences based on goals and current level',
        fn: async () => {
            return {
                path_id: `path_${Date.now()}`,
                modules: [
                    {
                        module_id: 'module_1',
                        title: 'Foundation Concepts',
                        sequence: 1,
                        estimated_duration: '2 weeks',
                        prerequisites: [],
                        learning_objectives: [
                            'Understand basic concepts',
                            'Apply fundamental principles',
                            'Demonstrate core skills',
                        ],
                    },
                ],
                total_estimated_time: '2 weeks',
                difficulty_progression: 'gradual',
            }
        },
    })

    const competencyMapperTool = createTool({
        name: 'map_competencies',
        description: 'Create detailed competency maps with skill dependencies',
        fn: async () => {
            return {
                domain: 'Technology',
                grade_level: 10,
                subject: 'Computer Science',
                competency_map: {
                    domains: ['Technology'],
                    skills: [],
                    progression_rules: [],
                },
            }
        },
    })

    // Build the agent and return the runtime objects
    // console.log(
    //     'createCurriculumDesigner: building agent (curriculum_designer)',
    // )
    let agent
    try {
        // Try the standard AgentBuilder pattern first
        agent = AgentBuilder.create('curriculum_designer')
            .withModel('gemini-2.5-flash')
            .withDescription(
                'AI Curriculum Designer for creating personalized learning paths',
            )
            .withInstruction(
                `
                You are an expert curriculum designer AI that creates personalized learning paths.

                Your responsibilities:
                1. Analyze learner profiles and assessment data to understand current competencies
                2. Design comprehensive curricula aligned with learning goals and standards
                3. Map competencies and create logical skill progression sequences
                4. Recommend appropriate learning resources based on learner preferences
                5. Adapt curricula dynamically based on progress and feedback

                Always prioritize:
                - Learner-centered design principles
                - Evidence-based educational practices
                - Clear learning objectives and outcomes
                - Appropriate scaffolding and differentiation
                - Regular assessment and feedback loops

                Use the provided tools to analyze, design, and adapt learning experiences.
            `,
            )
            .withTools(
                assessmentAnalyzerTool,
                learningPathGeneratorTool,
                competencyMapperTool,
            )
            .build()
    } catch (builderError) {
        // console.log(
        //     'createCurriculumDesigner: AgentBuilder.create failed, trying new AgentBuilder():',
        //     builderError.message,
        // )
        // Fallback: try direct constructor if create() doesn't exist
        agent = new (AgentBuilder as any)({ name: 'curriculum_designer' })
            .withModel('gemini-2.5-flash')
            .withDescription(
                'AI Curriculum Designer for creating personalized learning paths',
            )
            .withInstruction(
                `
                You are an expert curriculum designer AI that creates personalized learning paths.

                Your responsibilities:
                1. Analyze learner profiles and assessment data to understand current competencies
                2. Design comprehensive curricula aligned with learning goals and standards
                3. Map competencies and create logical skill progression sequences
                4. Recommend appropriate learning resources based on learner preferences
                5. Adapt curricula dynamically based on progress and feedback

                Always prioritize:
                - Learner-centered design principles
                - Evidence-based educational practices
                - Clear learning objectives and outcomes
                - Appropriate scaffolding and differentiation
                - Regular assessment and feedback loops

                Use the provided tools to analyze, design, and adapt learning experiences.
            `,
            )
            .withTools(
                assessmentAnalyzerTool,
                learningPathGeneratorTool,
                competencyMapperTool,
            )
            .build()
    }

    const runner = agent.runner()
    const session = agent.createSession({})

    return { agent, runner, session }
}
