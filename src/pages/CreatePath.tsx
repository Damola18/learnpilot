import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Target,
  Clock,
  BookOpen,
  Brain,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const createPathSchema = z.object({
  title: z.string().min(1, "Goal title is required").max(100, "Title too long"),
  description: z.string().min(10, "Please provide a detailed description"),
  domain: z.string().min(1, "Please select a domain"),
  timeline: z.string().min(1, "Please set a target timeline"),
  timeCommitment: z.array(z.number()).length(1),
  motivationLevel: z.array(z.number()).length(1),
  experienceLevel: z.string().min(1, "Please select your experience level"),
});

const domains = [
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "UX/UI Design",
  "Product Management",
  "Digital Marketing",
  "Cybersecurity",
];

const experienceLevels = [
  { value: "beginner", label: "Beginner - New to this area" },
  { value: "intermediate", label: "Intermediate - Some experience" },
  { value: "advanced", label: "Advanced - Experienced learner" },
];

const timelineOptions = [
  { value: "1-week", label: "1 Week - Quick Sprint" },
  { value: "2-weeks", label: "2 Weeks - Focused Learning" },
  { value: "1-month", label: "1 Month - Comprehensive" },
  { value: "3-months", label: "3 Months - Deep Dive" },
  { value: "6-months", label: "6 Months - Master Path" },
];

export default function CreatePath() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 3;

  const form = useForm<z.infer<typeof createPathSchema>>({
    resolver: zodResolver(createPathSchema),
    defaultValues: {
      title: "",
      description: "",
      domain: "",
      timeline: "",
      timeCommitment: [10],
      motivationLevel: [8],
      experienceLevel: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createPathSchema>) => {
    setIsGenerating(true);
    // Simulate AI path generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsGenerating(false);
    console.log(values);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (step === currentStep) return <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{step}</div>;
    return <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">{step}</div>;
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 shadow-card">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Creating Your Learning Path</h3>
              <p className="text-muted-foreground">
                Our AI is analyzing your goals and crafting a personalized learning journey...
              </p>
            </div>
            <Progress value={65} className="h-2" />
            <div className="text-sm text-muted-foreground">
              Analyzing learning patterns and optimizing content...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-success/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Create Your Learning Path
          </h1>
          <p className="text-lg text-muted-foreground">
            Let's build a personalized learning journey tailored just for you
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStepIcon(1)}
                <div className="hidden sm:block">
                  <div className="font-medium">Define Goals</div>
                  <div className="text-sm text-muted-foreground">What do you want to learn?</div>
                </div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="h-1 bg-muted rounded-full">
                  <div 
                    className="h-1 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {getStepIcon(2)}
                <div className="hidden sm:block">
                  <div className="font-medium">Set Preferences</div>
                  <div className="text-sm text-muted-foreground">Time & motivation</div>
                </div>
              </div>

              <div className="flex-1 mx-4">
                <div className="h-1 bg-muted rounded-full">
                  <div 
                    className="h-1 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${currentStep >= 3 ? 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {getStepIcon(3)}
                <div className="hidden sm:block">
                  <div className="font-medium">Generate Path</div>
                  <div className="text-sm text-muted-foreground">AI creates your path</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Define Goals */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Define Your Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What do you want to learn?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Master React Development, Learn Data Science..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your learning objectives</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide details about what you want to achieve, specific skills you want to develop, or projects you want to build..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more specific you are, the better we can tailor your learning path
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Domain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your domain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {domains.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Set Preferences */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    Set Your Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Timeline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How long do you want to spend?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timelineOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeCommitment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Time Commitment</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              value={field.value}
                              onValueChange={field.onChange}
                              max={40}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>1 hour/week</span>
                              <span className="font-medium text-primary">
                                {field.value[0]} hours/week
                              </span>
                              <span>40 hours/week</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          How many hours per week can you dedicate to learning?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motivationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivation Level</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              value={field.value}
                              onValueChange={field.onChange}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>Low motivation</span>
                              <span className="font-medium text-primary">
                                {field.value[0]}/10
                              </span>
                              <span>Highly motivated</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          This helps us adjust the pace and difficulty of your learning path
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 3: Preview & Generate */}
            {currentStep === 3 && (
              <Card className="border-0 shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    Ready to Generate Your Path
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 rounded-lg bg-muted/50 space-y-4">
                    <h3 className="font-semibold text-lg">Learning Path Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="font-medium">Goal:</span>
                        </div>
                        <p className="text-muted-foreground ml-6">
                          {form.getValues("title") || "Not specified"}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="font-medium">Domain:</span>
                        </div>
                        <p className="text-muted-foreground ml-6">
                          {form.getValues("domain") || "Not selected"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium">Timeline:</span>
                        </div>
                        <p className="text-muted-foreground ml-6">
                          {form.getValues("timeline") || "Not selected"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="font-medium">Weekly Commitment:</span>
                        </div>
                        <p className="text-muted-foreground ml-6">
                          {form.getValues("timeCommitment")?.[0] || 0} hours/week
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-hero text-white p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-6 h-6" />
                      <h3 className="font-semibold text-lg">AI-Powered Personalization</h3>
                    </div>
                    <p className="opacity-90 mb-4">
                      Our AI will create a personalized learning path based on your goals, 
                      experience level, and preferences. This includes:
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Customized module sequence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Difficulty progression</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Practical projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Assessment checkpoints</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-primary"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Learning Path
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}