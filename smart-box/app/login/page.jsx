"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import womanWorking from "../../media/womanWorking.jpg";
import Image from "next/image";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const LoginForm = ({ className, ...props }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const recaptchaVerifiedRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
              router.push("/dashboard");
          }
          else {
            setUser(0)
            console.log("No user found")
          }
        }
        else{
          setUser(0)
          console.log("No user found")
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    return () => {
      if (recaptchaVerifiedRef.currnet) {
        recaptchaVerifiedRef.current.clear();
        recaptchaVerifiedRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Watch for the dynamic button's presence in the DOM
    const observer = new MutationObserver(() => {
      const button = document.getElementById(auth, "phone-sign-in-button");
      if (button && !window.recaptchaVerifier) {
        try {
          // Initialize RecaptchaVerifier when the button is present
          window.recaptchaVerifier = new RecaptchaVerifier(
            "phone-sign-in-button",
            {
              size: "invisible",
              callback: (response) => {
                console.log("reCAPTCHA verified:", response);
              },
            }
          );
          window.recaptchaVerifier.render().then((widgetId) => {
            console.log("reCAPTCHA rendered with widget ID:", widgetId);
          });
        } catch (error) {
          console.error("RecaptchaVerifier initialization error:", error);
        }
      }
    });

    // Observe changes in the DOM for the button
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up
    return () => {
      observer.disconnect();
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      // Make sure we have a valid reCAPTCHA verifier
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "phone-sign-in-button",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA verified", response);
            },
          }
        );
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setIsVerificationSent(true);

      toast({
        title: "Verification code sent",
        description: "Please check your phone for the code.",
      });
    } catch (error) {
      console.error("Phone auth error:", error);
      toast({
        variant: "destructive",
        title: "Phone Authentication Error",
        description: error.message,
      });

      // Reset the reCAPTCHA verifier
      if (recaptchaVerifiedRef.current) {
        await recaptchaVerifiedRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };
  // ... existing code ...

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        // Validate password length
        if (password.length < 6) {
          toast({
            variant: "destructive",
            title: "Invalid Password",
            description: "Password must be at least 6 characters long",
          });
          return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Password Mismatch",
            description: "Passwords do not match. Please try again.",
          });
          return;
        }

        // Sign up
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(userCredential);
        toast({
          title: "Account created successfully!",
          description: "Welcome to Smart Box.",
        });
      } else {
        // Sign in
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(userCredential);
        toast({
          title: "Signed in successfully!",
          description: "Welcome back!",
        });
      }
      if (userCredential && userCredential.user) {
        console.log("HERE", userCredential);

        const idToken = await userCredential._tokenResponse.idToken;
        console.log("IDTOKEN:", idToken);
        const response = await fetch("/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to authenticate with the server");
        }
        setUser(userCredential.user);
        router.push("/dashboard");
      } else {
        console.error("Authentication failed");
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An unexpected error ocurred",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      // Handle specific Firebase auth errors
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please try logging in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email. Please sign up first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      const idToken = await result._tokenResponse.idToken;
      const response = await fetch("/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with the server");
      }

      toast({
        title: "Signed in successfully!",
        description: "Welcome to Smart Box.",
      });
      router.push("/dashboard");
    } catch (error) {
      // Check if the error is due to popup being closed
      if (error.code === "auth/popup-closed-by-user") {
        // Just reset loading state if user closed the popup
        setIsLoading(false);
        toast({
          title: "Sign in cancelled",
          description: "You closed the Google sign-in window",
        });
      } else {
        // Handle other errors
        console.error("Google sign-in error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to sign in with Google.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneCode = async () => {
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      const idToken = await result._tokenResponse.idToken;
      const response = await fetch("/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with the server");
      }
      toast({
        title: "Phone verified successfully!",
        description: "Welcome to Smart Box.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Invalid verification code.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneAuth = () => (
    <div className="grid gap-6">
      {!isVerificationSent ? (
        <>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (123) 456 7890"
              value={phoneNumber}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "");
                const match = cleaned.match(
                  /^(1|)?(\d{0,3})?(\d{0,3})?(\d{0,4})?$/
                );
                const formatted = !match[2]
                  ? "+1 "
                  : `+1 (${match[2]}${match[3] ? `) ${match[3]}` : ""}${
                      match[4] ? ` ${match[4]}` : ""
                    }`;
                setPhoneNumber(formatted);
              }}
              required
            />
          </div>
          <Button
            id="phone-sign-in-button"
            onClick={handlePhoneAuth}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </>
      ) : (
        <>
          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <InputOTP
              required
              maxLength={6}
              value={verificationCode}
              onChange={(value) => setVerificationCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            onClick={verifyPhoneCode}
            className="w-full"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsVerificationSent(false);
              setVerificationCode("");
            }}
            className="w-full"
          >
            Change Phone Number
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
  {(user===null) ? 
        <div className="flex items-center justify-center min-h-screen">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg> 
  </div>
  : 

    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-2xl shadow-lg ring-2 ring-[#a18496] hover:ring-4 transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isPhoneLogin
              ? "Phone Login"
              : isSignUp
              ? "Create Account"
              : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isPhoneLogin
              ? "Login with your phone number"
              : isSignUp
              ? "Sign up with your email or Google account"
              : "Login with your email or Google account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPhoneLogin ? (
            renderPhoneAuth()
          ) : (
            <form onSubmit={handleEmailPasswordAuth}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsPhoneLogin(true);
                      setIsVerificationSent(false);
                      setVerificationCode("");
                    }}
                    type="button"
                    disabled={isLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Continue with Phone
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>

                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      {!isSignUp && (
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {isSignUp && (
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      {isPhoneLogin && (
        <div className="text-balance text-center text-xs text-muted-foreground">
          <button
            onClick={() => {
              setIsPhoneLogin(!isPhoneLogin);
              setIsVerificationSent(false);
              setVerificationCode("");
            }}
            className="hover:text-primary"
          >
            {"Use email instead"}
          </button>
        </div>
      )}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="hover:text-primary"
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </button>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  }
  </>
  );
};

const LoginPage = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          alt="WomanWorking"
          src={womanWorking}
          layout="fill"
          objectFit="cover"
          priority
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start"></div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
