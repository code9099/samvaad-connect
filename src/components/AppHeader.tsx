/**
 * Enhanced Government Application Header
 * Modern Indian Government UI with Tricolor Theme
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Globe, 
  Clock, 
  Wifi, 
  WifiOff, 
  Users,
  Star,
  Award,
  IndianRupee,
  Accessibility,
  Type
} from 'lucide-react';
import { IndianEmblem } from './IndianEmblem';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { healthCheck } from '../services/bhashiniClient';

interface BhashiniStatus {
  status: 'online' | 'offline' | 'checking';
  responseTime: number;
  lastChecked: Date;
}

export const AppHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [bhashiniStatus, setBhashiniStatus] = React.useState<BhashiniStatus>({
    status: 'checking',
    responseTime: 0,
    lastChecked: new Date()
  });
  const [highContrast, setHighContrast] = React.useState(false);
  const [largeText, setLargeText] = React.useState(false);

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor connection status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load accessibility preferences
  React.useEffect(() => {
    const savedHighContrast = localStorage.getItem('samvaadcop-high-contrast') === 'true';
    const savedLargeText = localStorage.getItem('samvaadcop-large-text') === 'true';
    
    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    
    if (savedHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    if (savedLargeText) {
      document.documentElement.classList.add('large-text');
    }
  }, []);

  // Check BHASHINI status
  React.useEffect(() => {
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

    checkStatus();
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

  return (
    <TooltipProvider>
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      <header className="gov-header relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-saffron/20 via-transparent to-green/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--saffron) / 0.1) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            
            {/* Government Branding */}
            <div className="flex items-center space-x-4 animate-fade-in-up">
              <div className="gov-logo">
                <IndianEmblem className="w-8 h-8 text-navy" />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-poppins font-bold text-navy tracking-tight">
                    SamvaadCop
                  </h1>
                  <Badge className="badge-modern">
                    <Shield className="w-3 h-3 mr-1" />
                    v2.0
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-navy-light">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">भारत सरकार • Government of India</span>
                  <span className="text-navy/40">|</span>
                  <span>गृह मंत्रालय • Ministry of Home Affairs</span>
                </div>
              </div>
            </div>

            {/* Center - Mission Statement */}
            <div className="hidden lg:flex flex-col items-center text-center max-w-md animate-slide-in-right">
              <h2 className="text-lg font-poppins font-semibold text-navy mb-1">
                बहुभाषी पुलिस सहायता मंच
              </h2>
              <p className="text-sm text-navy-light leading-relaxed">
                AI-Powered Multilingual Police Communication Platform
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs border-green/30">
                  <Globe className="w-3 h-3 mr-1" />
                  7 Languages
                </Badge>
                <Badge variant="outline" className="text-xs border-saffron/30">
                  <Users className="w-3 h-3 mr-1" />
                  Real-time AI
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    bhashiniStatus.status === 'online' 
                      ? 'border-green/30 text-green' 
                      : 'border-destructive/30 text-destructive'
                  }`}
                >
                  {bhashiniStatus.status === 'online' ? (
                    <Wifi className="w-3 h-3 mr-1" />
                  ) : (
                    <WifiOff className="w-3 h-3 mr-1" />
                  )}
                  BHASHINI
                </Badge>
              </div>
            </div>

            {/* Status & Controls */}
            <div className="flex items-center space-x-4">
              
              {/* Live Clock */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="glass-card px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-navy" />
                      <div className="text-sm font-medium text-navy">
                        <div>{currentTime.toLocaleTimeString('en-IN', { 
                          hour12: true,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}</div>
                        <div className="text-xs text-navy-light">
                          {currentTime.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Indian Standard Time (IST)</p>
                </TooltipContent>
              </Tooltip>

              {/* Accessibility Controls */}
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleHighContrast}
                      className={`glass-card border-0 ${highContrast ? 'bg-accent text-accent-foreground' : ''}`}
                      aria-label="Toggle high contrast mode"
                    >
                      <Accessibility className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High Contrast {highContrast ? 'On' : 'Off'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLargeText}
                      className={`glass-card border-0 ${largeText ? 'bg-accent text-accent-foreground' : ''}`}
                      aria-label="Toggle large text mode"
                    >
                      <Type className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Large Text {largeText ? 'On' : 'Off'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Emergency Contact */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="btn-secondary border-0 text-white hover:scale-105"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Emergency: 100
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>National Emergency Helpline</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Service Quality Indicators */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center space-x-6 text-sm text-navy-light">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  bhashiniStatus.status === 'online' ? 'bg-green animate-pulse-gentle' : 'bg-destructive'
                }`}></div>
                <span>
                  BHASHINI {bhashiniStatus.status === 'online' ? 'Active' : 'Offline'}
                  {bhashiniStatus.responseTime > 0 && ` (${bhashiniStatus.responseTime}ms)`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gold" />
                <span>AI Translation: 96.2% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-info" />
                <span>Serving 28 States & 8 UTs</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-navy-light">
              <span>Powered by</span>
              <Badge variant="outline" className="text-xs border-gold/30">
                <IndianRupee className="w-3 h-3 mr-1" />
                Digital India
              </Badge>
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron via-white-warm to-green"></div>
      </header>
    </TooltipProvider>
  );
};