/**
 * SamvaadCop Translation API Route
 * Orchestrates ASR → NMT → TTS pipeline with BHASHINI
 */

import { transcribeAudio, translateText, synthesizeSpeech, healthCheck } from '../../services/bhashiniClient.js';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 1,
  retryDelay: 1000 // 1 second
};

/**
 * Delay function for retry logic
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper for API calls
 */
async function withRetry(apiCall, retries = RETRY_CONFIG.maxRetries) {
  try {
    return await apiCall();
  } catch (error) {
    if (retries > 0) {
      console.log(`API call failed, retrying... (${retries} attempts left)`);
      await delay(RETRY_CONFIG.retryDelay);
      return withRetry(apiCall, retries - 1);
    }
    throw error;
  }
}

/**
 * Main translation API handler
 * Accepts: { audioBase64?, text?, sourceLang, targetLang }
 * Returns: { transcript?, translation, audioBase64Out?, provider, confidences, errors? }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  let { audioBase64, text, sourceLang, targetLang } = req.body;

  // Validation
  if (!sourceLang || !targetLang) {
    return res.status(400).json({ 
      error: 'Missing required parameters: sourceLang and targetLang' 
    });
  }

  if (!audioBase64 && !text) {
    return res.status(400).json({ 
      error: 'Either audioBase64 or text must be provided' 
    });
  }

  const result = {
    provider: 'BHASHINI',
    confidences: {},
    errors: [],
    processingTime: 0
  };

  try {
    // Step 1: Audio to Text (ASR) if audio is provided
    if (audioBase64) {
      console.log('Starting ASR for language:', sourceLang);
      const asrResult = await withRetry(() => 
        transcribeAudio(audioBase64, sourceLang)
      );
      
      result.transcript = asrResult.transcript;
      result.confidences.asr = asrResult.confidence;
      text = asrResult.transcript; // Use transcribed text for translation
      
      console.log('ASR completed:', { 
        transcript: result.transcript, 
        confidence: asrResult.confidence 
      });
    }

    // Step 2: Text Translation (NMT)
    if (text && sourceLang !== targetLang) {
      console.log('Starting translation:', { text, sourceLang, targetLang });
      const translationResult = await withRetry(() => 
        translateText(text, sourceLang, targetLang)
      );
      
      result.translation = translationResult.translation;
      result.confidences.translation = translationResult.confidence;
      
      console.log('Translation completed:', { 
        translation: result.translation, 
        confidence: translationResult.confidence 
      });
    } else {
      // No translation needed
      result.translation = text;
      result.confidences.translation = 1.0;
    }

    // Step 3: Text to Speech (TTS) for translated text
    if (result.translation) {
      console.log('Starting TTS for language:', targetLang);
      const ttsResult = await withRetry(() => 
        synthesizeSpeech(result.translation, targetLang)
      );
      
      result.audioBase64Out = ttsResult.audioBase64;
      result.duration = ttsResult.duration;
      
      console.log('TTS completed:', { 
        duration: result.duration 
      });
    }

    // Calculate processing time
    result.processingTime = Date.now() - startTime;

    // Success response
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Translation pipeline error:', error);
    
    result.errors.push({
      message: error.message,
      stage: getErrorStage(error),
      timestamp: new Date().toISOString()
    });

    result.processingTime = Date.now() - startTime;

    // Partial success - return what we have
    if (result.transcript || result.translation) {
      res.status(206).json({
        success: false,
        partial: true,
        data: result,
        error: error.message
      });
    } else {
      // Complete failure
      res.status(500).json({
        success: false,
        data: result,
        error: error.message
      });
    }
  }
}

/**
 * Determine which stage of the pipeline failed based on error message
 */
function getErrorStage(error) {
  const message = error.message.toLowerCase();
  if (message.includes('asr')) return 'asr';
  if (message.includes('translation')) return 'translation';
  if (message.includes('tts')) return 'tts';
  return 'unknown';
}

/**
 * Health check endpoint
 */
export async function healthHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = await healthCheck();
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'offline',
      error: error.message
    });
  }
}