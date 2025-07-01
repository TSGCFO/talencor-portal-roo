"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Link2, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface ApplicationDocument {
  id: string;
  fileName: string;
  documentType: string;
  fileSize: number;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  sinNumber: string;
  status: string;
  aptitudeScore: number;
  submittedAt: string;
  workEligibility: string;
  hasReliableTransport: boolean;
  documents: ApplicationDocument[];
}

interface GeneratedToken {
  id: string;
  token: string;
  applicantEmail: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  application?: {
    id: string;
    fullName: string;
    status: string;
    submittedAt: string;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [generatedTokens, setGeneratedTokens] = useState<GeneratedToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [newLinkData, setNewLinkData] = useState({
    applicantEmail: "",
    expiresAt: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch applications
      const appsResponse = await fetch("/api/applications");
      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        setApplications(appsData.data?.applications || []);
      }

      // Fetch generated tokens
      const tokensResponse = await fetch("/api/generate-link");
      if (tokensResponse.ok) {
        const tokensData = await tokensResponse.json();
        setGeneratedTokens(tokensData.data?.tokens || []);
      }
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecureLink = async () => {
    setError("");
    setSuccess("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLinkData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Secure link generated and sent to ${newLinkData.applicantEmail}`);
        setNewLinkData({ applicantEmail: "", expiresAt: "" });
        fetchData(); // Refresh data
      } else {
        setError(data.error || "Failed to generate link");
      }
    } catch {
      setError("Failed to generate secure link");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const isTokenExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isTokenUsed = (token: GeneratedToken) => {
    return !!token.usedAt;
  };

  // Calculate stats
  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === "pending").length,
    approvedApplications: applications.filter(app => app.status === "approved").length,
    tokensGenerated: generatedTokens.length,
    tokensUsed: generatedTokens.filter(token => isTokenUsed(token)).length,
    tokensExpired: generatedTokens.filter(token => 
      isTokenExpired(token.expiresAt) && !isTokenUsed(token)
    ).length,
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approvedApplications}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.tokensGenerated}</div>
              <div className="text-sm text-gray-600">Links Generated</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.tokensUsed}</div>
              <div className="text-sm text-gray-600">Links Used</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.tokensExpired}</div>
              <div className="text-sm text-gray-600">Links Expired</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generate New Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Generate Secure Application Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="applicantEmail">Applicant Email</Label>
                <Input
                  id="applicantEmail"
                  type="email"
                  placeholder="applicant@example.com"
                  value={newLinkData.applicantEmail}
                  onChange={(e) => setNewLinkData({
                    ...newLinkData, 
                    applicantEmail: e.target.value
                  })}
                  disabled={isGenerating}
                />
              </div>
              <div>
                <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newLinkData.expiresAt}
                  onChange={(e) => setNewLinkData({
                    ...newLinkData, 
                    expiresAt: e.target.value
                  })}
                  disabled={isGenerating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for default 7-day expiry
                </p>
              </div>
              <Button 
                onClick={generateSecureLink}
                disabled={isGenerating || !newLinkData.applicantEmail}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner h-4 w-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Generate & Send Secure Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner h-6 w-6 mx-auto mb-2" />
                  <p className="text-gray-500">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No applications submitted yet
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {applications.slice(0, 5).map((app) => (
                    <Card key={app.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{app.fullName}</h4>
                          <p className="text-sm text-gray-600">{app.email}</p>
                          <p className="text-sm text-gray-600">{app.phoneNumber}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(app.aptitudeScore)}`}>
                              Score: {app.aptitudeScore}/10
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Links */}
        {generatedTokens.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Generated Application Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedTokens.map((token) => (
                  <div key={token.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{token.applicantEmail}</p>
                        <p className="text-sm text-gray-600 font-mono break-all">
                          {typeof window !== "undefined" && `${window.location.origin}/apply/${token.token}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Generated: {new Date(token.createdAt).toLocaleDateString()}
                        </p>
                        {token.application && (
                          <p className="text-xs text-green-600 mt-1">
                            Application submitted by {token.application.fullName}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <span 
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            isTokenUsed(token) 
                              ? "bg-green-100 text-green-800" 
                              : isTokenExpired(token.expiresAt)
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isTokenUsed(token) 
                            ? "Used" 
                            : isTokenExpired(token.expiresAt)
                            ? "Expired"
                            : "Active"
                          }
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Expires: {new Date(token.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {!isTokenUsed(token) && !isTokenExpired(token.expiresAt) && (
                      <div className="mt-3 pt-3 border-t">
                        <Link href={`/apply/${token.token}`} target="_blank">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Preview Application Form
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}