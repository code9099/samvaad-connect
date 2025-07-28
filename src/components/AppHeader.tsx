/**
 * SamvaadCop Header Component
 * Government-grade header with tricolor theme and BHASHINI status
 */

import React, { useState, useEffect } from 'react';
import { IndianEmblem } from './IndianEmblem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accessibility, Type, Wifi, WifiOff } from 'lucide-react';
import { healthCheck } from '../services/bhashiniClient';

interface BhashiniStatus {
  status: 'online' | 'offline' | 'checking';
  responseTime: number;
  lastChecked: Date;
}

export const AppHeader: React.FC = () => {
  const [bhashiniStatus, setBhashiniStatus] = useState<BhashiniStatus>({
    status: 'checking',
    responseTime: 0,
    lastChecked: new Date()
  });
  
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('samvaadcop-high-contrast') === 'true';
    const savedLargeText = localStorage.getItem('samvaadcop-large-text') === 'true';
    
    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    
    // Apply settings to document
    if (savedHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    if (savedLargeText) {
      document.documentElement.classList.add('large-text');
    }
  }, []);

  // Check BHASHINI status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await healthCheck();
        setBhashiniStatus({
          status: result.status as 'online' | 'offline',
          responseTime: result.responseTime,
          lastChecked: new Date()
        });
      } catch (error) {
        setBhashiniStatus(prev => ({
          ...prev,
          status: 'offline',
          lastChecked: new Date()
        }));
      }
    };

    // Initial check
    checkStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('samvaadcop-high-contrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem('samvaadcop-large-text', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  };

  const getStatusColor = () => {
    switch (bhashiniStatus.status) {
      case 'online': return 'bg-green text-green-foreground';
      case 'offline': return 'bg-destructive text-destructive-foreground';
      case 'checking': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (bhashiniStatus.status) {
      case 'online': return <Wifi className="w-3 h-3" />;
      case 'offline': return <WifiOff className="w-3 h-3" />;
      case 'checking': return <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />;
      default: return <WifiOff className="w-3 h-3" />;
    }
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      <header className="relative bg-header border-b-2 border-green shadow-elegant">
        <div className="absolute inset-0 bg-header opacity-90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section - Logo and Title */}
            <div className="flex items-center space-x-4">
              <IndianEmblem size={48} className="flex-shrink-0" />
              
              <div className="flex flex-col">
                <h1 className="text-xl font-pt-sans font-bold text-navy leading-tight">
                  SamvaadCop
                </h1>
                <span className="text-sm text-navy-light font-inter">
                  संवाद कॉप
                </span>
              </div>
            </div>

            {/* Center Section - BHASHINI Status */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor()} status-pulse border-0 px-3 py-1.5 cursor-help`}
                  >
                    {getStatusIcon()}
                    <span className="ml-2 font-medium">
                      Powered by BHASHINI
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="bg-card border-border shadow-elegant"
                  aria-live="polite"
                >
                  <div className="text-sm">
                    <div className="font-medium">
                      Status: {bhashiniStatus.status.charAt(0).toUpperCase() + bhashiniStatus.status.slice(1)}
                    </div>
                    {bhashiniStatus.responseTime > 0 && (
                      <div className="text-muted-foreground">
                        Response time: {bhashiniStatus.responseTime}ms
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      Last checked: {bhashiniStatus.lastChecked.toLocaleTimeString()}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Right Section - Accessibility Controls */}
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleHighContrast}
                      className={`btn-ripple focus-ring ${highContrast ? 'bg-accent text-accent-foreground' : ''}`}
                      aria-label="Toggle high contrast mode"
                      aria-pressed={highContrast}
                    >
                      <Accessibility className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>High Contrast {highContrast ? 'On' : 'Off'}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLargeText}
                      className={`btn-ripple focus-ring ${largeText ? 'bg-accent text-accent-foreground' : ''}`}
                      aria-label="Toggle large text mode"
                      aria-pressed={largeText}
                    >
                      <Type className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>Large Text {largeText ? 'On' : 'Off'}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>
      
    </>
  );
};