"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { APTITUDE_QUESTIONS } from "@/lib/constants";

interface AptitudeTestStepProps {
  data: {
    answers: string[];
    agreesToTerms: boolean;
    digitalSignature: string;
  };
  onUpdate: (field: string, value: string[] | boolean | string) => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function AptitudeTestStep({ data, onUpdate, errors, isLoading }: AptitudeTestStepProps) {
  const handleAnswerChange = (questionId: number, answer: string) => {
    const currentAnswers = [...(data.answers || [])];
    currentAnswers[questionId - 1] = answer;
    onUpdate('answers', currentAnswers);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">General Aptitude Test</h3>
        <p className="text-gray-600">Please answer all 10 questions. Select the best answer for each question.</p>
      </div>
      
      <div className="space-y-6">
        {APTITUDE_QUESTIONS.map((question) => (
          <Card key={question.id} className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium">
                {question.id}. {question.question}
              </h4>
              <RadioGroup 
                value={data.answers?.[question.id - 1] || ''} 
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                disabled={isLoading}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`q${question.id}-${index}`} />
                    <Label htmlFor={`q${question.id}-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        ))}
      </div>

      {/* Terms and Agreement Section */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-800 mb-4">Agreement and Terms</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="digitalSignature">*Full Name (Digital Signature)</Label>
              <Input
                id="digitalSignature"
                value={data.digitalSignature || ""}
                onChange={(e) => onUpdate('digitalSignature', e.target.value.toUpperCase())}
                placeholder="TYPE YOUR FULL NAME HERE"
                className={`uppercase ${errors.digitalSignature ? 'border-red-500' : ''}`}
                disabled={isLoading}
                required
              />
              {errors.digitalSignature && (
                <p className="text-red-500 text-sm mt-1">{errors.digitalSignature}</p>
              )}
            </div>

            <div className="bg-white p-4 rounded border text-sm">
              <p className="mb-4">
                I <strong>{data.digitalSignature || '_____________________'}</strong> have filled this employment form by myself and all the information provided in this form is correct & up to date to the best of my knowledge, & all the supporting documents provided are authentic and I understand that any misrepresentation may disqualify me from employment or may lead to legal action, if needed. I have properly read & I agree to abide by all the listed terms and conditions of employment with TalentCore Staffing.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="agreesToTerms"
                checked={data.agreesToTerms || false}
                onCheckedChange={(checked) => onUpdate('agreesToTerms', checked)}
                className="mt-1"
                disabled={isLoading}
              />
              <Label htmlFor="agreesToTerms" className="text-sm">
                *I agree to the above statement and all terms and conditions of employment with TalentCore Staffing.
              </Label>
            </div>
            {errors.agreesToTerms && (
              <p className="text-red-500 text-sm">{errors.agreesToTerms}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review all your answers and agreement before submitting. Once submitted, you cannot modify your responses.
        </AlertDescription>
      </Alert>
    </div>
  );
}