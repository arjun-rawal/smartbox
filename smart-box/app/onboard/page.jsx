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

  const handleOptionSelect = (value) => {
    const stateUpdater = stateSetters[currentScreen];
    stateUpdater(value);
    setSelectedOptions((prev) => ({ ...prev, [currentScreen]: value }));
  };

  const handleNext = () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-100 rounded-full opacity-20 blur-xl animate-float"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-100 rounded-full opacity-20 blur-xl animate-float-delayed"></div>
      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-2xl transition-all duration-500 ${getAnimationClass()}`}
      >
        <div className="w-full max-w-lg mb-8 space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  currentScreen >= step ? "bg-indigo-600 w-12" : "bg-gray-200"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
          {renderOptions().map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleOptionSelect(id)}
              className={`group relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 ${
                selectedOptions[currentScreen] === id
                  ? "border-indigo-500 bg-indigo-50 scale-105 shadow-lg"
                  : "border-gray-100 hover:border-indigo-200"
              }`}
            >
              {selectedOptions[currentScreen] === id && (
                <div className="absolute -top-2 -right-2 bg-indigo-500 w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pop-in">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="mb-4 flex justify-center">
                <div
                  className={`p-3 rounded-lg ${
                    selectedOptions[currentScreen] === id
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                      : "bg-gray-100 group-hover:bg-indigo-100"
                  }`}
                >
                  {React.cloneElement(icon, {
                    className: `w-8 h-8 ${
                      selectedOptions[currentScreen] === id
                        ? "text-white"
                        : "text-gray-600 group-hover:text-indigo-600"
                    }`,
                  })}
                </div>
              </div>
              <span className="font-medium text-gray-700 relative inline-block">
                {label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 ${
                    selectedOptions[currentScreen] === id
                      ? "w-full"
                      : "group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-between w-full max-w-lg">
          {currentScreen > 1 && (
            <button
              onClick={() => handleBack(currentScreen - 1)}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium px-6 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
          )}
          <div className="flex-1" />
          {currentScreen < 3 && (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              disabled={!selectedOptions[currentScreen]}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;