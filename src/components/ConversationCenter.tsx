/**
 * Conversation Center Component
 * Displays conversation bubbles with original and translated text
 */

import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Volume2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/bhashiniClient';

export interface ConversationMessage {
  id: string;
  timestamp: Date;
  sender: 'citizen' | 'officer';
  originalText: string;
  originalLanguage: string;
  translatedText?: string;
  translatedLanguage?: string;
  audioBase64?: string;
  confidence?: {
    asr?: number;
    translation?: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'offline';
  errors?: string[];
}

interface ConversationCenterProps {
  messages: ConversationMessage[];
  onPlayAudio: (audioBase64: string) => void;
  isPlayingAudio: boolean;
}

export const ConversationCenter: React.FC<ConversationCenterProps> = ({
  messages,
  onPlayAudio,
  isPlayingAudio
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getStatusIcon = (status: ConversationMessage['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'offline':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (message: ConversationMessage) => {
    switch (message.status) {
      case 'pending':
        return <Badge variant="outline" className="text-warning border-warning">🕒 Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-primary border-primary">⚡ Processing</Badge>;
      case 'completed':
        return null; // No badge for completed messages
      case 'failed':
        return <Badge variant="destructive">❌ Failed</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-muted-foreground border-muted">📡 Offline Queue</Badge>;
      default:
        return null;
    }
  };

  const formatConfidence = (confidence?: number) => {
    if (!confidence) return '';
    return `${Math.round(confidence * 100)}%`;
  };

  const MessageBubble: React.FC<{ message: ConversationMessage }> = ({ message }) => {
    const isCitizen = message.sender === 'citizen';
    
    return (
      <div className={`chat-bubble-enter flex ${isCitizen ? 'justify-start' : 'justify-end'} mb-4`}>
        <Card className={`max-w-[70%] p-4 shadow-sm tricolor-hover ${
          isCitizen 
            ? 'bg-saffron/5 border-saffron/20' 
            : 'bg-green/5 border-green/20'
        }`}>
          
          {/* Message Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">
                {isCitizen ? 'नागरिक • Citizen' : 'अधिकारी • Officer'}
              </span>
              {getStatusIcon(message.status)}
            </div>
            
            <div className="flex items-center space-x-2">
              {getStatusBadge(message)}
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Original Text */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {SUPPORTED_LANGUAGES[message.originalLanguage]} • Original
              </span>
              {message.confidence?.asr && (
                <Badge variant="outline" className="text-xs">
                  ASR: {formatConfidence(message.confidence.asr)}
                </Badge>
              )}
            </div>
            <p className="text-base text-foreground leading-relaxed">
              {message.originalText}
            </p>
          </div>

          {/* Translation */}
          {message.translatedText && message.translatedLanguage && (
            <>
              <Separator className="my-3" />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {SUPPORTED_LANGUAGES[message.translatedLanguage]} • Translation
                  </span>
                  {message.confidence?.translation && (
                    <Badge variant="outline" className="text-xs">
                      NMT: {formatConfidence(message.confidence.translation)}
                    </Badge>
                  )}
                </div>
                <p className="text-base text-foreground leading-relaxed font-medium">
                  {message.translatedText}
                </p>
              </div>
            </>
          )}

          {/* Audio Playback */}
          {message.audioBase64 && (
            <>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPlayAudio(message.audioBase64!)}
                  disabled={isPlayingAudio}
                  className="btn-ripple focus-ring text-muted-foreground hover:text-foreground"
                  aria-label="Play audio translation"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlayingAudio ? 'Playing...' : 'Play TTS'}
                </Button>
                
                <span className="text-xs text-muted-foreground">
                  Audio available
                </span>
              </div>
            </>
          )}

          {/* Error Messages */}
          {message.errors && message.errors.length > 0 && (
            <>
              <Separator className="my-3" />
              <div className="space-y-1">
                {message.errors.map((error, index) => (
                  <div key={index} className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <h2 className="text-lg font-pt-sans font-semibold text-foreground">
          वार्तालाप • Conversation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time multilingual communication
        </p>
      </div>

      {/* Messages Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        id="main-content"
        role="log"
        aria-live="polite"
        aria-label="Conversation messages"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gradient-to-br from-saffron/20 to-green/20 rounded-full p-8 mb-4">
              <div className="w-16 h-16 bg-tricolor rounded-full opacity-60" />
            </div>
            <h3 className="text-xl font-pt-sans font-semibold text-foreground mb-2">
              Welcome to SamvaadCop
            </h3>
            <p className="text-muted-foreground max-w-md">
              Start a conversation by speaking or typing in your preferred language. 
              All communication will be translated in real-time.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Conversation Stats */}
      {messages.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{messages.length} messages</span>
            <span>
              {messages.filter(m => m.status === 'completed').length} completed • 
              {messages.filter(m => m.status === 'pending').length} pending
            </span>
          </div>
        </div>
      )}
    </div>
  );
};