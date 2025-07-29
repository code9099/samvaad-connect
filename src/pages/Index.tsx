/**
 * SamvaadCop Main Application
 * Police-kiosk style multilingual communication platform
 */

import React, { useState, useRef, useEffect } from 'react';
import { AppHeader } from '../components/AppHeader';
import { CitizenPanel } from '../components/CitizenPanel';
import { ConversationCenter, ConversationMessage } from '../components/ConversationCenter';
import { OfficerPanel } from '../components/OfficerPanel';
import { LegalAssistant } from '../components/LegalAssistant';
import { FIRChecklist } from '../components/FIRChecklist';
import { useToast } from '@/hooks/use-toast';
import { SUPPORTED_LANGUAGES } from '../services/bhashiniClient';

interface TranslationRequest {
  audioBase64?: string;
  text?: string;
  sourceLang: string;
  targetLang: string;
}

// Offline queue using IndexedDB simulation (would use real IndexedDB in production)
interface OfflineMessage {
  id: string;
  request: TranslationRequest;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [officerLanguage, setOfficerLanguage] = useState('en');
  const [citizenLanguage, setCitizenLanguage] = useState('hi');
  const [legalAssistantOpen, setLegalAssistantOpen] = useState(false);
  const [firChecklistOpen, setFirChecklistOpen] = useState(false);
  const [selectedLegalSection, setSelectedLegalSection] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState<OfflineMessage[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process offline queue when online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      processOfflineQueue();
    }
  }, [isOnline]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case 'v': // Alt+V for record
            e.preventDefault();
            // Would trigger recording in citizen panel
            toast({
              title: "Keyboard Shortcut",
              description: "Alt+V: Start/Stop Recording"
            });
            break;
          case 't': // Alt+T for play last
            e.preventDefault();
            if (messages.length > 0) {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage.audioBase64) {
                playAudio(lastMessage.audioBase64);
              }
            }
            break;
          case 'l': // Alt+L for legal assistant
            e.preventDefault();
            setLegalAssistantOpen(true);
            break;
          case 'd': // Alt+D for dashboard (would open admin dashboard)
            e.preventDefault();
            toast({
              title: "Keyboard Shortcut",
              description: "Alt+D: Admin Dashboard (Feature coming soon)"
            });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [messages]);

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const processTranslation = async (request: TranslationRequest, sender: 'citizen' | 'officer') => {
    const messageId = generateMessageId();
    
    // Create initial message
    const initialMessage: ConversationMessage = {
      id: messageId,
      timestamp: new Date(),
      sender,
      originalText: request.text || 'Audio message',
      originalLanguage: request.sourceLang,
      status: isOnline ? 'processing' : 'offline',
      confidence: {}
    };

    setMessages(prev => [...prev, initialMessage]);

    if (!isOnline) {
      // Add to offline queue
      const offlineMsg: OfflineMessage = {
        id: messageId,
        request,
        timestamp: new Date()
      };
      setOfflineQueue(prev => [...prev, offlineMsg]);
      
      toast({
        title: "Offline Mode",
        description: "Message queued for processing when connection is restored",
        variant: "default"
      });
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (result.success) {
        // Update message with results
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                originalText: result.data.transcript || request.text || '',
                originalLanguage: result.data.detectedLanguage || request.sourceLang, // Use detected language if available
                translatedText: result.data.translation,
                translatedLanguage: request.targetLang,
                audioBase64: result.data.audioBase64Out,
                confidence: result.data.confidences,
                status: 'completed'
              }
            : msg
        ));

        toast({
          title: result.data.detectedLanguage ? 
            `Language Detected: ${SUPPORTED_LANGUAGES[result.data.detectedLanguage]}` : 
            "Translation Complete",
          description: `Processed in ${result.data.processingTime}ms`,
          duration: 3000
        });

      } else {
        // Handle partial success or failure
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                status: 'failed',
                errors: [result.error],
                translatedText: result.partial ? result.data.translation : undefined,
                confidence: result.partial ? result.data.confidences : undefined
              }
            : msg
        ));

        toast({
          title: result.partial ? "Partial Success" : "Translation Failed",
          description: result.error,
          variant: "destructive",
          duration: 5000
        });
      }

    } catch (error) {
      console.error('Translation error:', error);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? {
              ...msg,
              status: 'failed',
              errors: ['Network error: Please check your connection']
            }
          : msg
      ));

      toast({
        title: "Network Error",
        description: "Failed to connect to translation service",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processOfflineQueue = async () => {
    for (const queuedMessage of offlineQueue) {
      await processTranslation(queuedMessage.request, 'citizen');
    }
    setOfflineQueue([]);
    
    toast({
      title: "Offline Queue Processed",
      description: `${offlineQueue.length} messages processed`,
      duration: 3000
    });
  };

  const handleCitizenSubmit = (data: { text?: string; audioBase64?: string; language: string }) => {
    const request: TranslationRequest = {
      ...data,
      sourceLang: data.language,
      targetLang: officerLanguage
    };
    
    setCitizenLanguage(data.language);
    processTranslation(request, 'citizen');
  };

  const handleOfficerSubmit = (data: { text?: string; audioBase64?: string; language: string }) => {
    const request: TranslationRequest = {
      ...data,
      sourceLang: data.language,
      targetLang: citizenLanguage
    };
    
    processTranslation(request, 'officer');
  };

  const playAudio = async (audioBase64: string) => {
    if (isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);
      
      // Convert base64 to blob
      const audioBlob = new Blob([Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))], {
        type: 'audio/wav'
      });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.onerror = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Audio Error",
            description: "Failed to play audio",
            variant: "destructive"
          });
        };
        
        await audioRef.current.play();
      }
    } catch (error) {
      setIsPlayingAudio(false);
      console.error('Audio playback error:', error);
      toast({
        title: "Audio Error",
        description: "Failed to play audio",
        variant: "destructive"
      });
    }
  };

  const handleGenerateFIR = (section: any) => {
    setSelectedLegalSection(section);
    setLegalAssistantOpen(false);
    setFirChecklistOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Header */}
      <AppHeader />
      
      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Citizen */}
        <div className="w-1/3 min-w-[350px]">
          <CitizenPanel 
            onSubmit={handleCitizenSubmit}
            isProcessing={isProcessing}
          />
        </div>
        
        {/* Center Panel - Conversation */}
        <div className="flex-1 min-w-[400px]">
          <ConversationCenter
            messages={messages}
            onPlayAudio={playAudio}
            isPlayingAudio={isPlayingAudio}
          />
        </div>
        
        {/* Right Panel - Officer */}
        <div className="w-1/3 min-w-[350px]">
          <OfficerPanel
            onSubmit={handleOfficerSubmit}
            onOpenLegalAssistant={() => setLegalAssistantOpen(true)}
            onOpenFIRChecklist={() => setFirChecklistOpen(true)}
            isProcessing={isProcessing}
            selectedLanguage={officerLanguage}
            onLanguageChange={setOfficerLanguage}
          />
        </div>
      </div>

      {/* Modals */}
      <LegalAssistant
        isOpen={legalAssistantOpen}
        onClose={() => setLegalAssistantOpen(false)}
        onGenerateFIR={handleGenerateFIR}
      />

      <FIRChecklist
        isOpen={firChecklistOpen}
        onClose={() => setFirChecklistOpen(false)}
        selectedSection={selectedLegalSection}
      />

      {/* Offline Status Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
          📡 Offline - Messages will be queued
        </div>
      )}

      {/* Queue Status */}
      {offlineQueue.length > 0 && (
        <div className="fixed bottom-4 left-4 bg-warning text-warning-foreground px-4 py-2 rounded-lg shadow-lg">
          🕒 {offlineQueue.length} messages queued
        </div>
      )}
    </div>
  );
};

export default Index;
