/**
 * BHASHINI API Client for SamvaadCop
 * Handles ASR (Audio to Text), NMT (Translation), and TTS (Text to Speech)
 */

const BHASHINI_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BHASHINI_BASE_URL || 'https://dhruva-api.bhashini.gov.in/services',
  apiKey: process.env.NEXT_PUBLIC_BHASHINI_API_KEY || '',
  userId: process.env.NEXT_PUBLIC_BHASHINI_USER_ID || '',
  
  // Pipeline configurations
  pipelines: {
    asr: {
      taskType: 'asr',
      config: {
        language: {
          sourceLanguage: 'hi' // Default to Hindi
        },
        serviceId: '',
        audioFormat: 'wav',
        samplingRate: 16000
      }
    },
    translation: {
      taskType: 'translation',
      config: {
        language: {
          sourceLanguage: 'hi',
          targetLanguage: 'en'
        },
        serviceId: ''
      }
    },
    tts: {
      taskType: 'tts',
      config: {
        language: {
          sourceLanguage: 'en'
        },
        serviceId: '',
        audioFormat: 'wav',
        samplingRate: 22050
      }
    }
  }
};

/**
 * Get available compute services for a task type
 */
async function getComputeServices(taskType, sourceLanguage, targetLanguage = null) {
  try {
    const payload = {
      pipelineTasks: [{
        taskType,
        config: {
          language: targetLanguage 
            ? { sourceLanguage, targetLanguage }
            : { sourceLanguage }
        }
      }],
      pipelineRequestConfig: {
        pipelineId: "64392f96daac500b55c543cd"
      }
    };

    const response = await fetch(`${BHASHINI_CONFIG.baseUrl}/inference/pipeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userID': BHASHINI_CONFIG.userId,
        'ulcaApiKey': BHASHINI_CONFIG.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`BHASHINI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.pipelineResponseConfig[0];
  } catch (error) {
    console.error('Error getting compute services:', error);
    throw error;
  }
}

/**
 * Transcribe audio to text using BHASHINI ASR
 * @param {string} audioBase64 - Base64 encoded audio
 * @param {string} sourceLanguage - Source language code (hi, en, ta, te, ur, mr, bn)
 * @returns {Promise<{transcript: string, confidence: number}>}
 */
export async function transcribeAudio(audioBase64, sourceLanguage = 'hi') {
  try {
    // Get compute service for ASR
    const computeService = await getComputeServices('asr', sourceLanguage);
    
    const payload = {
      pipelineTasks: [{
        taskType: 'asr',
        config: {
          language: { sourceLanguage },
          serviceId: computeService.config[0].serviceId,
          audioFormat: 'wav',
          samplingRate: 16000
        }
      }],
      inputData: {
        audio: [{
          audioContent: audioBase64
        }]
      }
    };

    const response = await fetch(computeService.inferenceApiKey.inferenceEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': computeService.inferenceApiKey.value
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`ASR API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.pipelineResponse[0];
    
    return {
      transcript: result.output[0].source,
      confidence: result.output[0].confidence || 0.8
    };
  } catch (error) {
    console.error('Error in transcribeAudio:', error);
    throw error;
  }
}

/**
 * Translate text using BHASHINI NMT
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<{translation: string, confidence: number}>}
 */
export async function translateText(text, sourceLanguage, targetLanguage) {
  try {
    // Get compute service for translation
    const computeService = await getComputeServices('translation', sourceLanguage, targetLanguage);
    
    const payload = {
      pipelineTasks: [{
        taskType: 'translation',
        config: {
          language: { sourceLanguage, targetLanguage },
          serviceId: computeService.config[0].serviceId
        }
      }],
      inputData: {
        input: [{
          source: text
        }]
      }
    };

    const response = await fetch(computeService.inferenceApiKey.inferenceEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': computeService.inferenceApiKey.value
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.pipelineResponse[0];
    
    return {
      translation: result.output[0].target,
      confidence: result.output[0].confidence || 0.8
    };
  } catch (error) {
    console.error('Error in translateText:', error);
    throw error;
  }
}

/**
 * Synthesize speech from text using BHASHINI TTS
 * @param {string} text - Text to synthesize
 * @param {string} language - Target language code
 * @returns {Promise<{audioBase64: string, duration: number}>}
 */
export async function synthesizeSpeech(text, language) {
  try {
    // Get compute service for TTS
    const computeService = await getComputeServices('tts', language);
    
    const payload = {
      pipelineTasks: [{
        taskType: 'tts',
        config: {
          language: { sourceLanguage: language },
          serviceId: computeService.config[0].serviceId,
          audioFormat: 'wav',
          samplingRate: 22050
        }
      }],
      inputData: {
        input: [{
          source: text
        }]
      }
    };

    const response = await fetch(computeService.inferenceApiKey.inferenceEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': computeService.inferenceApiKey.value
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.pipelineResponse[0];
    
    return {
      audioBase64: result.audio[0].audioContent,
      duration: result.audio[0].duration || 0
    };
  } catch (error) {
    console.error('Error in synthesizeSpeech:', error);
    throw error;
  }
}

/**
 * Health check for BHASHINI services
 * @returns {Promise<{status: string, responseTime: number}>}
 */
export async function healthCheck() {
  const startTime = Date.now();
  try {
    const response = await fetch(`${BHASHINI_CONFIG.baseUrl}/inference/pipeline`, {
      method: 'HEAD',
      headers: {
        'userID': BHASHINI_CONFIG.userId,
        'ulcaApiKey': BHASHINI_CONFIG.apiKey
      }
    });
    
    const responseTime = Date.now() - startTime;
    return {
      status: response.ok ? 'online' : 'offline',
      responseTime
    };
  } catch (error) {
    return {
      status: 'offline',
      responseTime: Date.now() - startTime
    };
  }
}

/**
 * Get supported languages
 */
export const SUPPORTED_LANGUAGES = {
  hi: 'हिन्दी',
  en: 'English',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  ur: 'اردو',
  mr: 'मराठी',
  bn: 'বাংলা'
};