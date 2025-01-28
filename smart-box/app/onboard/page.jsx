"use client"

import React, { useState } from 'react';
import { 
  GraduationCap, Baby, School, User, ChevronLeft,
  Users, Hash, Search, Store, Briefcase
} from 'lucide-react';

const UserTypeSelection = () => {
  const [userType, setUserType] = useState(null);
  const [ageRange, setAgeRange] = useState(null);
  const [referralSource, setReferralSource] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fadeDirection, setFadeDirection] = useState('out');

  const handleNext = (stateUpdater, value, nextScreen) => {
    setFadeDirection('out');
    setIsAnimating(true);
    stateUpdater(value);
    
    setTimeout(() => {
      setCurrentScreen(nextScreen);
      setFadeDirection('in');
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const handleBack = (prevScreen) => {
    setFadeDirection('out');
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentScreen(prevScreen);
      setFadeDirection('in');
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  const getAnimationClass = () => {
    if (!isAnimating) return 'opacity-100';
    return fadeDirection === 'out' ? 'opacity-0' : 'opacity-100';
  };

  const renderOptions = () => {
    switch (currentScreen) {
      case 1:
        return [
          { id: 'student', label: 'Student', icon: <GraduationCap className="w-12 h-12 mb-2" /> },
          { id: 'parent', label: 'Parent', icon: <Baby className="w-12 h-12 mb-2" /> },
          { id: 'teacher', label: 'Teacher', icon: <School className="w-12 h-12 mb-2" /> },
          { id: 'adult', label: 'Adult', icon: <User className="w-12 h-12 mb-2" /> }
        ];
      case 2:
        return [
          { id: '4-13', label: '4-13', icon: <Baby className="w-12 h-12 mb-2" /> },
          { id: '14-18', label: '14-18', icon: <User className="w-12 h-12 mb-2" /> },
          { id: '18-25', label: 'College', icon: <GraduationCap className="w-12 h-12 mb-2" /> },
          { id: '25+', label: 'Professional', icon: <Briefcase className="w-12 h-12 mb-2" /> }
        ];
      case 3:
        return [
          { id: 'friend', label: 'Friend', icon: <Users className="w-12 h-12 mb-2" /> },
          { id: 'social', label: 'Social Media', icon: <Hash className="w-12 h-12 mb-2" /> },
          { id: 'google', label: 'Google Search', icon: <Search className="w-12 h-12 mb-2" /> },
          { id: 'retail', label: 'Retail Store', icon: <Store className="w-12 h-12 mb-2" /> }
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
    3: setReferralSource
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div 
        className={`flex flex-col items-center w-full max-w-md transition-opacity duration-300 ${getAnimationClass()}`}
      >
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl font-bold">{getScreenTitle()}</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {renderOptions().map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleNext(
                stateSetters[currentScreen],
                id,
                currentScreen < 3 ? currentScreen + 1 : currentScreen
              )}
              className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {icon}
              <span className="text-xl">{label}</span>
            </button>
          ))}
        </div>

        {currentScreen > 1 && (
          <button 
            onClick={() => handleBack(currentScreen - 1)}
            className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserTypeSelection;