"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface DocumentUploadData {
  documents?: Array<{
    id?: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    documentType: string;
  }>;
}

interface DocumentUploadStepProps {
  data: DocumentUploadData;
  onUpdate: (field: string, value: unknown) => void;
  isLoading?: boolean;
}

export default function DocumentUploadStep({ data, onUpdate, isLoading }: DocumentUploadStepProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocs = files.map(file => ({
      id: Date.now() + Math.random(),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file), // This would be replaced with actual upload
      fileType: file.type,
      fileSize: file.size,
      documentType: "other",
    }));
    
    const currentDocs = data.documents || [];
    onUpdate('documents', [...currentDocs, ...newDocs]);
  };

  const removeDocument = (index: number) => {
    const currentDocs = data.documents || [];
    const updatedDocs = currentDocs.filter((_, i: number) => i !== index);
    onUpdate('documents', updatedDocs);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
      <p className="text-gray-600 mb-6">
        Please upload any supporting documents such as your resume, references, certifications, or other relevant documents.
      </p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">Drop files here or click to browse</p>
          <p className="text-sm text-gray-500">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
          </p>
        </div>
        <Input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
          id="documentUpload"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => document.getElementById('documentUpload')?.click()}
          disabled={isLoading}
        >
          Select Files
        </Button>
      </div>

      {data.documents && data.documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploaded Documents:</h4>
          {data.documents.map((doc, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{doc.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeDocument(index)}
                disabled={isLoading}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Document upload is optional but recommended. You can always submit additional documents later if needed.
        </AlertDescription>
      </Alert>
    </div>
  );
}