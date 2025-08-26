import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, Clock, Brain, Target, ArrowRight, RotateCcw, Code, Smartphone, Server, Palette, BarChart3, Shield } from "lucide-react";
import { questionSets, type Category, type Difficulty, type Question } from "./data";

type AssessmentStep = 'category' | 'difficulty' | 'questions' | 'results';

const Assessment = () => {
  const [step, setStep] = useState<AssessmentStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const categories = [
    { id: 'frontend', name: 'Frontend Development', icon: Code, description: 'HTML, CSS, JavaScript, React, Vue' },
    { id: 'backend', name: 'Backend Development', icon: Server, description: 'Node.js, Python, APIs, Databases' },
    { id: 'mobile', name: 'Mobile Development', icon: Smartphone, description: 'React Native, Flutter, iOS, Android' },
    { id: 'ux-design', name: 'UX/UI Design', icon: Palette, description: 'User Experience, Interface Design' },
    { id: 'data-science', name: 'Data Science', icon: BarChart3, description: 'Analytics, Machine Learning, Statistics' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield, description: 'Security, Encryption, Threat Analysis' },
  ];

  const difficulties = [
    { id: 'beginner', name: 'Beginner', description: 'Basic concepts and fundamentals' },
    { id: 'intermediate', name: 'Intermediate', description: 'Applied knowledge and best practices' },
    { id: 'advanced', name: 'Advanced', description: 'Complex scenarios and expert-level topics' },
  ];

  // Load questions based on category and difficulty
  const loadQuestions = async (category: Category, difficulty: Difficulty) => {
    const categoryQuestions = questionSets[category];
    const difficultyQuestions = categoryQuestions?.[difficulty] || [];
    setQuestions(difficultyQuestions);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep('difficulty');
  };

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    if (selectedCategory) {
      await loadQuestions(selectedCategory, difficulty);
      setStep('questions');
    }
  };

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
    setStep('category');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuestions([]);
  };

  // Category Selection Step
  if (step === 'category') {
    return (
      <div className="p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-satoshi font-bold text-foreground">Skill Assessment</h1>
          <p className="text-muted-foreground mt-2">Choose a category to evaluate your knowledge</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-sm transition-shadow border-2 hover:border-primary/50"
                onClick={() => handleCategorySelect(category.id as Category)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Difficulty Selection Step
  if (step === 'difficulty') {
    const selectedCat = categories.find(cat => cat.id === selectedCategory);
    return (
      <div className="p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-satoshi font-bold text-foreground">Choose Difficulty Level</h1>
          <p className="text-muted-foreground mt-2">
            Selected: <Badge variant="secondary">{selectedCat?.name}</Badge>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {difficulties.map((difficulty) => (
            <Card 
              key={difficulty.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
              onClick={() => handleDifficultySelect(difficulty.id as Difficulty)}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{difficulty.name}</CardTitle>
                <CardDescription>{difficulty.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => setStep('category')}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  // Questions Step
  if (step === 'questions') {
    return (
      <div className="p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-satoshi font-bold text-foreground">Assessment Questions</h1>
          <p className="text-muted-foreground mt-2">
            <Badge variant="secondary" className="mr-2">{categories.find(c => c.id === selectedCategory)?.name}</Badge>
            <Badge variant="outline">{selectedDifficulty}</Badge>
          </p>
        </div>

        {/* Results Dialog */}
        <Dialog open={showResults} onOpenChange={setShowResults}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Assessment Complete!</DialogTitle>
              <DialogDescription className="text-center">Here's how you performed</DialogDescription>
            </DialogHeader>
            
            {showResults && (() => {
              const results = calculateResults();
              return (
                <div className="space-y-6 pt-4">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{results.score}%</div>
                    <p className="text-muted-foreground">
                      {results.correct} out of {results.total} questions correct
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Category: {categories.find(c => c.id === selectedCategory)?.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Difficulty Level</span>
                        <Badge variant="secondary">{selectedDifficulty}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Score</span>
                        <Badge variant={results.score >= 70 ? "secondary" : "destructive"}>
                          {results.score >= 70 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={resetAssessment} variant="outline" className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Take Another Assessment
                    </Button>
                    <Button className="flex-1" onClick={() => setShowResults(false)}>
                      View Recommended Paths
                    </Button>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>

      {/* Progress */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Knowledge Assessment</CardTitle>
            </div>
            <Badge variant="outline">
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-4" />
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
            <p className="text-2xl font-bold">{questions.length}</p>
            <p className="text-xs text-muted-foreground">Questions available</p>
          </CardContent>
        </Card>
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => setStep('difficulty')}>
            Change Difficulty
          </Button>
        </div>
      </div>
    );
  }

  // Default return (should not reach here)
  return null;
};

export default Assessment;