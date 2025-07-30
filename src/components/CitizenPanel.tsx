/**
 * Citizen Panel Component
 * Live audio recorder with waveform, multilingual text input
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Square, Send, Volume2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/bhashiniClient';

interface CitizenPanelProps {
  onSubmit: (data: { text?: string; audioBase64?: string; language: string }) => void;
  isProcessing: boolean;
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioBase64: string | null;
}

export const CitizenPanel: React.FC<CitizenPanelProps> = ({ onSubmit, isProcessing }) => {
  const [selectedLanguageForText, setSelectedLanguageForText] = useState('hi'); // For text input only
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null); // For detected audio language
  const [textInput, setTextInput] = useState('');
  const [recording, setRecording] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioBase64: null
  });
  const [waveformData, setWaveformData] = useState<number[]>(new Array(20).fill(0));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Update waveform visualization
  const updateWaveform = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Convert to normalized values for visualization
    const newWaveformData = [];
    const step = Math.floor(bufferLength / 20);
    
    for (let i = 0; i < 20; i++) {
      const start = i * step;
      const end = start + step;
      let sum = 0;
      
      for (let j = start; j < end; j++) {
        sum += dataArray[j];
      }
      
      const average = sum / step;
      newWaveformData.push(Math.min(average / 255, 1));
    }

    setWaveformData(newWaveformData);
  };

  const startRecording = async () => {
    console.log('Start recording button clicked');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      console.log('Media stream obtained successfully');
      streamRef.current = stream;

      // Set up audio analysis for waveform
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioBase64 = await blobToBase64(audioBlob);
        
        console.log('Audio processed, base64 length:', audioBase64.length);
        
        setRecording(prev => ({
          ...prev,
          audioBlob,
          audioBase64,
          isRecording: false
        }));
      };

      mediaRecorderRef.current.start();
      console.log('MediaRecorder started');

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setRecording(prev => ({
          ...prev,
          duration: prev.duration + 0.1
        }));
      }, 100);

      // Start waveform updates
      waveformIntervalRef.current = setInterval(updateWaveform, 100);

      setRecording(prev => ({
        ...prev,
        isRecording: true,
        duration: 0
      }));

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    console.log('Stop recording button clicked');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Stopping media recorder');
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      console.log('Stopping media stream');
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (waveformIntervalRef.current) {
      clearInterval(waveformIntervalRef.current);
      waveformIntervalRef.current = null;
    }

    setWaveformData(new Array(20).fill(0));
    console.log('Recording cleanup completed');
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:audio/webm;base64,
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = () => {
    console.log('Submit button clicked');
    console.log('canSubmit:', canSubmit);
    console.log('textInput:', textInput);
    console.log('recording.audioBase64:', !!recording.audioBase64);
    console.log('isProcessing:', isProcessing);
    
    if (!canSubmit) {
      console.log('Submit blocked by canSubmit condition');
      return;
    }

    // Determine which data to send and language
    let submissionData: { text?: string; audioBase64?: string; language: string };
    
    if (recording.audioBase64) {
      console.log('Using audio data for submission');
      submissionData = {
        audioBase64: recording.audioBase64,
        language: detectedLanguage || 'hi' // Use detected language or default to Hindi
      };
    } else if (textInput.trim()) {
      console.log('Using text data for submission:', textInput.trim());
      submissionData = {
        text: textInput.trim(),
        language: selectedLanguageForText
      };
    } else {
      console.log('No valid input to submit');
      return;
    }

    console.log('Calling onSubmit with data:', submissionData);
    onSubmit(submissionData);

    // Reset form after submission
    setTextInput('');
    setDetectedLanguage(null);
    setRecording({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioBase64: null
    });
  };

  const canSubmit = (textInput.trim() || recording.audioBase64) && !isProcessing;

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-saffron/5">
        <h2 className="text-lg font-pt-sans font-semibold text-foreground mb-2">
          नागरिक पैनल • Citizen Panel
        </h2>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            🎤 Voice: Auto-detect language • 🖊️ Text: Select language
          </div>
          <Select value={selectedLanguageForText} onValueChange={setSelectedLanguageForText}>
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder="भाषा चुनें • Select Language for Text" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]: [string, string]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {detectedLanguage && (
            <Badge variant="outline" className="text-xs">
              🎤 Detected: {SUPPORTED_LANGUAGES[detectedLanguage]}
            </Badge>
          )}
        </div>
      </div>

      {/* Audio Recording Section */}
      <div className="p-4 border-b border-border">
        <Card className="p-4 bg-gradient-to-br from-saffron/10 to-green/10 border-saffron/20">
          <div className="flex flex-col items-center space-y-4">
            
            {/* Waveform Visualization */}
            <div className="flex items-end justify-center space-x-1 h-16 w-full">
              {waveformData.map((amplitude, index) => (
                <div
                  key={index}
                  className={`waveform-bar w-2 bg-primary transition-all duration-100 ${
                    recording.isRecording ? '' : 'opacity-30'
                  }`}
                  style={{
                    height: `${Math.max(4, amplitude * 60)}px`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant={recording.isRecording ? "destructive" : "default"}
                size="lg"
                onClick={recording.isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className="btn-ripple focus-ring w-16 h-16 rounded-full"
                aria-label={recording.isRecording ? "Stop recording" : "Start recording"}
              >
                {recording.isRecording ? (
                  <Square className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </Button>

              {recording.duration > 0 && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {recording.duration.toFixed(1)}s
                </Badge>
              )}
            </div>

            {recording.audioBase64 && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Audio recorded • Ready to submit</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Text Input Section */}
      <div className="flex-1 p-4 flex flex-col">
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={`यहाँ टाइप करें... • Type here in ${SUPPORTED_LANGUAGES[selectedLanguageForText]}...`}
          className="flex-1 resize-none focus-ring text-base"
          disabled={isProcessing || recording.isRecording}
          aria-label="Text input for your message"
        />
      </div>

      {/* Submit Section */}
      <div className="p-4 border-t border-border bg-green/5">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          className="w-full btn-ripple focus-ring bg-green hover:bg-green-dark text-white shadow-green"
          aria-label="Submit your message"
        >
          <Send className="w-5 h-5 mr-2" />
          {isProcessing ? 'प्रसंस्करण... • Processing...' : 'भेजें • Submit'}
        </Button>
      </div>
    </div>
  );
};