import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, Brain, Target, ArrowRight, RotateCcw } from "lucide-react";

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is the main purpose of React hooks?",
      options: [
        "To replace class components entirely",
        "To manage state and side effects in functional components", 
        "To improve performance only",
        "To add styling to components"
      ],
      correct: 1,
      skill: "React Fundamentals"
    },
    {
      id: 2,
      question: "Which of the following is NOT a valid JavaScript data type?",
      options: [
        "undefined",
        "boolean", 
        "integer",
        "symbol"
      ],
      correct: 2,
      skill: "JavaScript Basics"
    },
    {
      id: 3,
      question: "What does the 'const' keyword do in JavaScript?",
      options: [
        "Creates a variable that cannot be reassigned",
        "Creates a constant function",
        "Makes variables faster",
        "Creates global variables"
      ],
      correct: 0,
      skill: "JavaScript Basics"
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (parseInt(answers[index]) === q.correct) {
        correct++;
      }
    });
    return {
      score: Math.round((correct / questions.length) * 100),
      correct,
      total: questions.length
    };
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-satoshi font-bold text-foreground">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">Your knowledge evaluation is complete</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{results.score}%</div>
              <p className="text-muted-foreground">
                {results.correct} out of {results.total} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Skill Breakdown:</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">JavaScript Basics</span>
                  <Badge variant="secondary">2/2 Correct</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">React Fundamentals</span>
                  <Badge variant={results.correct >= 1 ? "secondary" : "destructive"}>
                    1/1 Correct
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetAssessment} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Assessment
              </Button>
              <Button className="flex-1">
                View Recommended Paths
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-satoshi font-bold text-foreground">Skill Assessment</h1>
        <p className="text-muted-foreground mt-2">Evaluate your knowledge to get personalized recommendations</p>
      </div>

      {/* Progress */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Knowledge Assessment</CardTitle>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-4">
              {questions[currentQuestion].skill}
            </Badge>
            <h2 className="text-xl font-semibold">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <RadioGroup
            value={answers[currentQuestion] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Previous
            </Button>
            <Button 
              onClick={nextQuestion}
              disabled={!answers[currentQuestion]}
              className="flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Info */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Duration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">~5 min</p>
            <p className="text-xs text-muted-foreground">Quick assessment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{questions.length}</p>
            <p className="text-xs text-muted-foreground">Skill evaluation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Areas covered</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;