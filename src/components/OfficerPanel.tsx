/**
 * Officer Panel Component
 * Reply input with text/voice, Legal Assistant and FIR Checklist buttons
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Mic, 
  Scale, 
  FileText, 
  Shield, 
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/bhashiniClient';

interface OfficerPanelProps {
  onSubmit: (data: { text?: string; audioBase64?: string; language: string }) => void;
  onOpenLegalAssistant: () => void;
  onOpenFIRChecklist: () => void;
  isProcessing: boolean;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const OfficerPanel: React.FC<OfficerPanelProps> = ({
  onSubmit,
  onOpenLegalAssistant,
  onOpenFIRChecklist,
  isProcessing,
  selectedLanguage,
  onLanguageChange
}) => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = () => {
    if (textInput.trim()) {
      onSubmit({
        text: textInput.trim(),
        language: selectedLanguage
      });
      setTextInput('');
    }
  };

  const canSubmit = textInput.trim() && !isProcessing;

  // Quick response templates
  const quickResponses = [
    {
      text: "Please provide more details",
      hindi: "कृपया अधिक विवरण प्रदान करें"
    },
    {
      text: "I understand your concern",
      hindi: "मैं आपकी चिंता समझता हूं"
    },
    {
      text: "Let me help you with this",
      hindi: "मैं इसमें आपकी सहायता करूंगा"
    },
    {
      text: "Please wait while I check",
      hindi: "कृपया प्रतीक्षा करें जब तक मैं जांच करता हूं"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-green/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-pt-sans font-semibold text-foreground">
            अधिकारी पैनल • Officer Panel
          </h2>
          <Badge variant="outline" className="text-green border-green">
            <Shield className="w-3 h-3 mr-1" />
            On Duty
          </Badge>
        </div>
        
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="focus-ring">
            <SelectValue placeholder="Response Language" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]: [string, string]) => (
              <SelectItem key={code} value={code}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            onClick={onOpenLegalAssistant}
            className="btn-ripple focus-ring justify-start"
            aria-label="Open Legal Assistant"
          >
            <Scale className="w-4 h-4 mr-2" />
            Legal Assistant
          </Button>
          
          <Button
            variant="outline"
            onClick={onOpenFIRChecklist}
            className="btn-ripple focus-ring justify-start"
            aria-label="Open FIR Checklist"
          >
            <FileText className="w-4 h-4 mr-2" />
            FIR Checklist
          </Button>
        </div>
      </div>

      {/* Quick Responses */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Quick Responses</h3>
        <div className="space-y-2">
          {quickResponses.map((response, index) => (
            <Card 
              key={index}
              className="p-3 cursor-pointer tricolor-hover transition-all duration-200 hover:shadow-sm"
              onClick={() => setTextInput(selectedLanguage === 'hi' ? response.hindi : response.text)}
              role="button"
              tabIndex={0}
              aria-label={`Quick response: ${response.text}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setTextInput(selectedLanguage === 'hi' ? response.hindi : response.text);
                }
              }}
            >
              <div className="text-sm text-foreground">
                {selectedLanguage === 'hi' ? response.hindi : response.text}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Reply Input Section */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-sm font-medium text-foreground mb-3">Response</h3>
        
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={`Type your response in ${SUPPORTED_LANGUAGES[selectedLanguage]}...`}
          className="flex-1 resize-none focus-ring text-base"
          disabled={isProcessing}
          aria-label="Officer response input"
        />

        {/* Character count and voice recording */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{textInput.length} characters</span>
          
          <Button
            variant="ghost"
            size="sm"
            disabled={isProcessing}
            className="btn-ripple focus-ring"
            aria-label="Record voice response"
          >
            <Mic className="w-4 h-4 mr-1" />
            Voice
          </Button>
        </div>
      </div>

      {/* Submit Section */}
      <div className="p-4 border-t border-border bg-saffron/5">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          className="w-full btn-ripple focus-ring bg-saffron hover:bg-saffron-dark text-white shadow-saffron"
          aria-label="Send officer response"
        >
          <Send className="w-5 h-5 mr-2" />
          {isProcessing ? 'Sending...' : 'Send Response'}
        </Button>
      </div>

      {/* Status Indicators */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Last response: 2m ago</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-success" />
            <span className="text-success text-xs">System Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};