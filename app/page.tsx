import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TalentCore Staffing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Secure Employment Application Portal
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="mr-2 h-4 w-4" />
                Recruiter Dashboard
              </Button>
            </Link>
            <Link href="/apply/demo">
              <Button 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                Demo Application Form
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-hover fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-600" />
                Secure Portal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Token-based secure links ensure only authorized applicants can access forms.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                Complete Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive form with enhanced UX while maintaining all required fields.
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-purple-600" />
                Integrated Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built-in aptitude test with automatic scoring and evaluation.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome to TalentCore Staffing Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Our secure, streamlined application process helps connect talented individuals 
                with employment opportunities. Whether you're a recruiter managing applications 
                or an applicant completing your profile, our platform ensures a smooth, 
                secure experience.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">For Recruiters:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Generate secure application links</li>
                    <li>• Manage and review applications</li>
                    <li>• Track application status</li>
                    <li>• View aptitude test results</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">For Applicants:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Secure, one-time access links</li>
                    <li>• Multi-step guided application</li>
                    <li>• Document upload capability</li>
                    <li>• Built-in aptitude assessment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
