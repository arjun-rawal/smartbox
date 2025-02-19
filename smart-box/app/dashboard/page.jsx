"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Lock, Loader2, Check, AlertCircle, Timer, Github } from 'lucide-react';

const GOOGLE_CLIENT_ID = '467737252696-80e6gu77bf52db4hkehrlmojnb3i0pj4.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/dashboard';  // Update with your redirect URI
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me'
].join(' ');

const SmartboxOnboarding = () => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [requiredIntegrations, setRequiredIntegrations] = useState({
    calendar: false,
    github: false,
    timer: false
  });
  const [lockCode, setLockCode] = useState('');
  const [progress, setProgress] = useState(0);
  const [isClassroomConnected, setIsClassroomConnected] = useState(false);
  useEffect(() => {
    // Check if we're handling the OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleGoogleCallback(code);
    }
  }, []);
  
  const handleGoogleCallback = async (code) => {
    try {
      const response = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (response.ok) {
        setIsClassroomConnected(true);
        setRequiredIntegrations(prev => ({...prev, classroom: true}));
      } else {
        console.error('Failed to exchange code for tokens');
      }
    } catch (error) {
      console.error('Error handling Google callback:', error);
    }
  };

  const initiateGoogleAuth = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: SCOPES,
      access_type: 'offline',
      prompt: 'consent'
    })}`;
    
    window.location.href = authUrl;
  };

  const handleGoalSubmission = () => {
    setIsProcessing(true);
    // Simulate LLM processing
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate LLM determining required integrations
      setRequiredIntegrations({
        calendar: true,
        github: true,
        timer: true
      });
      setStep(2);
    }, 2000);
  };

  const startSession = () => {
    setLockCode('1234-5678');
    setStep(4);
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 2000);
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl">Welcome to Smartbox</CardTitle>
              <CardDescription>Let's get you started with your productivity journey</CardDescription>
            </div>
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => setStep(1)}
              >
                Try Demo
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
              >
                Connect Your Box
              </Button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle>Describe Your Goal</CardTitle>
              <CardDescription>Tell us what you want to accomplish and we'll help you stay focused</CardDescription>
            </div>
            <Textarea
              placeholder="e.g., I need to complete my thesis chapter by 5pm today without getting distracted by social media"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="h-32"
            />
            <Button 
              className="w-full"
              onClick={handleGoalSubmission}
              disabled={!goal || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing your goal...
                </>
              ) : 'Next'}
            </Button>
          </div>
        );

        case 2:
            return (
              <div className="space-y-6">
                <div className="space-y-2">
                  <CardTitle>Required Integrations</CardTitle>
                  <CardDescription>Connect these services to help you stay on track</CardDescription>
                </div>
                <div className="space-y-4">
                  {requiredIntegrations.calendar && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => {
                        setRequiredIntegrations(prev => ({...prev, calendar: true}));
                      }}
                    >
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Connect Google Calendar
                      </div>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-between"
                    onClick={initiateGoogleAuth}
                    disabled={isClassroomConnected}
                  >
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Connect Google Classroom
                    </div> 
                    {isClassroomConnected && <Check className="h-4 w-4 text-green-500" />}
                  </Button>
    
                  <Button 
                    className="w-full"
                    onClick={() => setStep(3)}
                    disabled={!isClassroomConnected}
                  >
                    Next
                  </Button>
                </div>
              </div>
            );

      case 3:
        
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle>Ready to Start</CardTitle>
              <CardDescription>Your lock session is ready to begin</CardDescription>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Session Details</p>
                  <p className="text-sm text-muted-foreground">Your phone will be locked until your thesis chapter is submitted or until 5pm today.</p>
                </div>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={startSession}
            >
              Start Session
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle>Session Active</CardTitle>
              <CardDescription>Your phone is now locked</CardDescription>
            </div>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="text-sm font-medium mb-2">Lock Code</p>
                <code className="text-lg font-mono">{lockCode}</code>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Progress</p>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {progress === 100 && (
                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900">
                  <p className="text-sm font-medium mb-2">Unlock Code</p>
                  <code className="text-lg font-mono">8765-4321</code>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg ring-2 ring-[#a18496] hover:ring-4 transition-all duration-300">
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartboxOnboarding;