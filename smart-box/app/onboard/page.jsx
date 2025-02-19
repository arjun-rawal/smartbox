"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Baby,
  School,
  User,
  ChevronLeft,
  Users,
  Hash,
  Search,
  Store,
  Briefcase,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

const UserTypeSelection = () => {
  const [userType, setUserType] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [referralSource, setReferralSource] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeDirection, setFadeDirection] = useState("out");
  const [selectedOptions, setSelectedOptions] = useState({
    1: null,
    2: null,
    3: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const router = useRouter();
  const handleOptionSelect = (value) => {
    const stateUpdater = stateSetters[currentScreen];
    stateUpdater(value);
    setSelectedOptions((prev) => ({ ...prev, [currentScreen]: value }));
  };

  const handleNext = () => {
    if (currentScreen === 3) {
      // Handle form submission here
      setIsSubmitting(true);
       console.log(selectedOptions);
       setTimeout(() => {
        router.push("/dashboard");
      }, 300);
     return;
    }

    setFadeDirection("out");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentScreen((prev) => prev + 1);
      setFadeDirection("in");
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = (prevScreen) => {
    setFadeDirection("out");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentScreen(prevScreen);
      setFadeDirection("in");
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const getAnimationClass = () => {
    if (!isAnimating) return "opacity-100 translate-x-0";
    return fadeDirection === "out"
      ? "opacity-0 -translate-x-10"
      : "opacity-100 translate-x-0";
  };

  const renderOptions = () => {
    switch (currentScreen) {
      case 1:
        return [
          {
            id: "student",
            label: "Student",
            icon: <GraduationCap className="w-12 h-12 mb-2" />,
          },
          {
            id: "parent",
            label: "Parent",
            icon: <Baby className="w-12 h-12 mb-2" />,
          },
          {
            id: "teacher",
            label: "Teacher",
            icon: <School className="w-12 h-12 mb-2" />,
          },
          {
            id: "adult",
            label: "Adult",
            icon: <User className="w-12 h-12 mb-2" />,
          },
        ];
      case 2:
        return [
          {
            id: "4-13",
            label: "4-13",
            icon: <Baby className="w-12 h-12 mb-2" />,
          },
          {
            id: "14-18",
            label: "14-18",
            icon: <User className="w-12 h-12 mb-2" />,
          },
          {
            id: "18-25",
            label: "College",
            icon: <GraduationCap className="w-12 h-12 mb-2" />,
          },
          {
            id: "25+",
            label: "Professional",
            icon: <Briefcase className="w-12 h-12 mb-2" />,
          },
        ];
      case 3:
        return [
          {
            id: "friend",
            label: "Friend",
            icon: <Users className="w-12 h-12 mb-2" />,
          },
          {
            id: "social",
            label: "Social Media",
            icon: <Hash className="w-12 h-12 mb-2" />,
          },
          {
            id: "google",
            label: "Google Search",
            icon: <Search className="w-12 h-12 mb-2" />,
          },
          {
            id: "retail",
            label: "Retail Store",
            icon: <Store className="w-12 h-12 mb-2" />,
          },
        ];
      default:
        return [];
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 1:
        return "What describes you best?";
      case 2:
        return "Select your age range";
      case 3:
        return "How did you find us?";
      default:
        return "";
    }
  };

  const stateSetters = {
    1: setUserType,
    2: setAgeRange,
    3: setReferralSource,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#b09bda]/10 to-[#b09bda]/20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#b09bda]/20 rounded-full opacity-20 blur-xl animate-float"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#b09bda]/20 rounded-full opacity-20 blur-xl animate-float-delayed"></div>

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-2xl transition-all duration-500 ${getAnimationClass()}`}
      >
        {/* Progress bar */}
        <div className="w-full max-w-lg mb-8 space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  currentScreen >= step
                    ? "bg-[#a18496] w-12"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {getScreenTitle()}
            <span className="block mt-2 text-lg font-normal text-gray-500">
              {currentScreen === 1 && "Let's personalize your experience"}
              {currentScreen === 2 && "Help us tailor content for you"}
              {currentScreen === 3 && "We appreciate your feedback!"}
            </span>
          </h1>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
          {renderOptions().map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleOptionSelect(id)}
              className={`group relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 ${
                selectedOptions[currentScreen] === id
                  ? "border-[#a18496] bg-gradient-to-br from-[#a18496]/10 to-[#a18496]/20 scale-105 shadow-lg"
                  : "border-gray-100 hover:border-[#a18496]/50"
              }`}
            >
              {selectedOptions[currentScreen] === id && (
                <div className="absolute -top-2 -right-2 bg-[#a18496] w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pop-in">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="mb-4 flex justify-center">
                <div
                  className={`p-3 rounded-lg ${
                    selectedOptions[currentScreen] === id
                      ? "bg-[#a18496]"
                      : "bg-gray-100 group-hover:bg-[#a18496]/20"
                  }`}
                >
                  {React.cloneElement(icon, {
                    className: `w-8 h-8 ${
                      selectedOptions[currentScreen] === id
                        ? "text-white"
                        : "text-gray-600 group-hover:text-[#a18496]"
                    }`,
                  })}
                </div>
              </div>
              <span className="font-medium text-gray-700 relative inline-block">
                {label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a18496] transition-all duration-300 ${
                    selectedOptions[currentScreen] === id
                      ? "w-full"
                      : "group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center w-full max-w-lg mt-4">
        {(currentScreen > 1 && currentScreen <= 3) && (
          <button
            onClick={() => handleBack(currentScreen - 1)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#a18496] font-medium px-6 py-2 rounded-lg hover:bg-[#a18496]/10 transition-colors"
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>
        )}
        {currentScreen <= 3 && (
          <button
            onClick={handleNext}
            className="px-8 py-2.5 bg-[#a18496] hover:bg-[#a18496]/90 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50"
            disabled={!selectedOptions[currentScreen]}
          >
            {isSubmitting ? 
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
            : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserTypeSelection;