import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";

export default function ConfirmEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a confirmation link to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Please check your email inbox and click the confirmation link to activate your account.
                If you don't see the email, check your spam folder.
              </p>
            </div>
          
          </div>
          
          <div className="space-y-3">
            <Link to="/login" className="w-full">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
            
            <p className="text-center text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button className="text-primary hover:underline font-medium">
                Resend confirmation
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}