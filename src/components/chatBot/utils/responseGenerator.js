// File: app/components/layout/ChatBot/utils/responseGenerator.js

import { 
  getServiceResponse,
  findFaqMatch,
  isAskingForContact,
  getContactResponse
} from '@/utils/ChatBotUtils';

import { 
  generatePricingResponse,
  isPricingInquiry,
  getConversationInsights
} from '@/utils/serviceContextUtils';

/**
 * Generate contextual response based on service detection and user intent
 * @param {string} userMessage - User's message
 * @param {Object} serviceDetection - Service detection result
 * @param {Object} intentAnalysis - Message intent analysis
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @param {Object} serviceContext - Current service context
 * @param {Object} pricingData - Pricing information
 * @returns {Object} Generated response
 */
export function generateContextualResponse(
  userMessage, 
  serviceDetection, 
  intentAnalysis, 
  chatbotData, 
  language, 
  serviceContext, 
  pricingData
) {
  // Priority 1: Handle contact requests
  if (intentAnalysis.isContactRequest) {
    return generateContactResponse(serviceContext, chatbotData, language);
  }
  
  // Priority 2: Handle pricing inquiries
  if (intentAnalysis.isPricingInquiry && serviceDetection.service) {
    return generateEnhancedPricingResponse(serviceDetection.service, language, pricingData, serviceContext);
  }
  
  // Priority 3: Handle service-specific inquiries
  if (serviceDetection.service && serviceDetection.confidence > 0.5) {
    return generateServiceResponse(serviceDetection, chatbotData, language, serviceContext);
  }
  
  // Priority 4: Handle FAQ matches
  const faqResponse = generateFaqResponse(userMessage, chatbotData, language);
  if (faqResponse.matched) {
    return faqResponse;
  }
  
  // Priority 5: Handle conversation insights
  const insightsResponse = generateInsightsResponse(serviceContext, language);
  if (insightsResponse.hasInsights) {
    return insightsResponse;
  }
  
  // Priority 6: Generate fallback response
  return generateFallbackResponse(userMessage, intentAnalysis, chatbotData, language, serviceContext);
}

/**
 * Generate enhanced contact response with service context
 * @param {Object} serviceContext - Current service context
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @returns {Object} Contact response
 */
function generateContactResponse(serviceContext, chatbotData, language) {
  let contactResponse = getContactResponse(chatbotData.contactInfo, language);
  
  // Add service-specific contact note
  if (serviceContext.currentService) {
    const serviceNote = language === 'sw' ? 
      `\n\n📋 Kwa maswali maalum kuhusu ${serviceContext.currentService}, wasiliana nasi moja kwa moja.` :
      `\n\n📋 For specific questions about ${serviceContext.currentService}, contact us directly.`;
    contactResponse += serviceNote;
  }
  
  // Add conversation summary if deep engagement
  if (serviceContext.conversationDepth > 3) {
    const summaryNote = language === 'sw' ? 
      `\n\n💬 Tumeongea mengi kuhusu huduma zetu. Mtaalamu wetu atakusaidia zaidi.` :
      `\n\n💬 We've discussed a lot about our services. Our specialist can help you further.`;
    contactResponse += summaryNote;
  }
  
  return {
    text: contactResponse,
    type: 'contact',
    serviceContext: serviceContext.currentService,
    metadata: {
      conversationDepth: serviceContext.conversationDepth,
      servicesDiscussed: serviceContext.serviceHistory
    }
  };
}

/**
 * Generate enhanced pricing response with context
 * @param {string} service - Detected service
 * @param {string} language - Current language
 * @param {Object} pricingData - Pricing information
 * @param {Object} serviceContext - Service context
 * @returns {Object} Pricing response
 */
function generateEnhancedPricingResponse(service, language, pricingData, serviceContext) {
  const basePricingResponse = generatePricingResponse(service, language, pricingData);
  
  // Add contextual pricing notes based on conversation history
  let enhancedResponse = basePricingResponse;
  
  if (serviceContext.conversationDepth > 2) {
    const contextNote = language === 'sw' ? 
      `\n\n💡 Kwa bei maalum na mipango ya malipo, wasiliana nasi kwa mazungumzo ya kibinafsi.` :
      `\n\n💡 For custom pricing and payment plans, contact us for a personal consultation.`;
    enhancedResponse += contextNote;
  }
  
  // Add comparison note if multiple services discussed
  if (serviceContext.serviceHistory.length > 1) {
    const comparisonNote = language === 'sw' ? 
      `\n\n📊 Tunaweza kutengeneza mfurushi wa huduma kwa bei bora zaidi.` :
      `\n\n📊 We can create a service package for better value.`;
    enhancedResponse += comparisonNote;
  }
  
  return {
    text: enhancedResponse,
    type: 'pricing',
    service: service,
    metadata: {
      conversationDepth: serviceContext.conversationDepth,
      multipleServices: serviceContext.serviceHistory.length > 1
    }
  };
}

/**
 * Generate service-specific response with confidence scoring
 * @param {Object} serviceDetection - Service detection result
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @param {Object} serviceContext - Service context
 * @returns {Object} Service response
 */
function generateServiceResponse(serviceDetection, chatbotData, language, serviceContext) {
  const baseServiceResponse = getServiceResponse(serviceDetection.service, chatbotData, language);
  
  let enhancedResponse = baseServiceResponse;
  
  // Add confidence-based messaging
  if (serviceDetection.confidence < 0.7) {
    const clarificationNote = language === 'sw' ? 
      `\n\n🤔 Je, unamaanisha huduma ya ${serviceDetection.service}? Kama hapana, niambie zaidi.` :
      `\n\n🤔 Did you mean ${serviceDetection.service} service? If not, please tell me more.`;
    enhancedResponse += clarificationNote;
  }
  
  // Add alternative suggestions if available
  if (serviceDetection.alternativeServices && serviceDetection.alternativeServices.length > 0) {
    const alternatives = serviceDetection.alternativeServices
      .slice(0, 2)
      .map(alt => alt.service)
      .join(', ');
    
    const alternativeNote = language === 'sw' ? 
      `\n\n🔍 Huduma zingine unazoweza kuwa unahitaji: ${alternatives}` :
      `\n\n🔍 Other services you might need: ${alternatives}`;
    enhancedResponse += alternativeNote;
  }
  
  // Add context-based follow-up
  if (serviceContext.conversationDepth === 0) {
    const followUpNote = language === 'sw' ? 
      `\n\n❓ Je, una maswali yoyote maalum kuhusu huduma hii?` :
      `\n\n❓ Do you have any specific questions about this service?`;
    enhancedResponse += followUpNote;
  }
  
  return {
    text: enhancedResponse,
    type: 'service',
    service: serviceDetection.service,
    confidence: serviceDetection.confidence,
    metadata: {
      matchedTerms: serviceDetection.matchedTerms,
      alternatives: serviceDetection.alternativeServices,
      detectionMethod: serviceDetection.detectionMethod
    }
  };
}

/**
 * Generate FAQ response with context awareness
 * @param {string} userMessage - User's message
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @returns {Object} FAQ response
 */
function generateFaqResponse(userMessage, chatbotData, language) {
  const faqAnswer = findFaqMatch(userMessage, chatbotData.faqs, language);
  
  if (faqAnswer) {
    return {
      text: faqAnswer,
      type: 'faq',
      matched: true,
      metadata: {
        trigger: 'faq_match',
        originalQuery: userMessage
      }
    };
  }
  
  return { matched: false };
}

/**
 * Generate response based on conversation insights
 * @param {Object} serviceContext - Service context
 * @param {string} language - Current language
 * @returns {Object} Insights response
 */
function generateInsightsResponse(serviceContext, language) {
  const insights = getConversationInsights(serviceContext);
  
  if (insights.insights.includes('Deep engagement detected')) {
    const engagementResponse = language === 'sw' ? 
      '💡 Ninaona una maswali mengi. Je, ungependa kuongea na mtaalamu wetu moja kwa moja?' :
      '💡 I can see you have many questions. Would you like to speak with our specialist directly?';
    
    return {
      text: engagementResponse,
      type: 'insights',
      hasInsights: true,
      metadata: {
        insights: insights.insights,
        conversationDepth: serviceContext.conversationDepth
      }
    };
  }
  
  if (insights.insights.includes('Multiple services explored')) {
    const multiServiceResponse = language === 'sw' ? 
      '🔄 Umeuliza kuhusu huduma nyingi. Je, ungependa mfurushi wa huduma?' :
      '🔄 You\'ve asked about multiple services. Would you like a service package?';
    
    return {
      text: multiServiceResponse,
      type: 'insights',
      hasInsights: true,
      metadata: {
        insights: insights.insights,
        servicesDiscussed: serviceContext.serviceHistory
      }
    };
  }
  
  return { hasInsights: false };
}

/**
 * Generate fallback response when no specific match is found
 * @param {string} userMessage - User's message
 * @param {Object} intentAnalysis - Intent analysis result
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @param {Object} serviceContext - Service context
 * @returns {Object} Fallback response
 */
function generateFallbackResponse(userMessage, intentAnalysis, chatbotData, language, serviceContext) {
  // Use existing fallback from base processing
  const baseFallback = chatbotData.fallback && chatbotData.fallback[language] ? 
    chatbotData.fallback[language] : 
    (language === 'sw' ? 
      'Samahani, sijaelewa vizuri. Je, unaweza kueleza zaidi?' : 
      'I\'m sorry, I didn\'t understand that well. Could you please explain more?');
  
  let enhancedFallback = baseFallback;
  
  // Add helpful context based on conversation history
  if (serviceContext.serviceHistory.length > 0) {
    const historyNote = language === 'sw' ? 
      `\n\nTumeongea kuhusu: ${serviceContext.serviceHistory.join(', ')}. Je, unahitaji msaada zaidi kwa mojawapo ya hizi?` :
      `\n\nWe've discussed: ${serviceContext.serviceHistory.join(', ')}. Do you need more help with any of these?`;
    enhancedFallback += historyNote;
  }
  
  // Add service exploration suggestion
  if (serviceContext.conversationDepth === 0) {
    const explorationNote = language === 'sw' ? 
      `\n\n🔍 Unaweza kuuliza kuhusu huduma zetu kama vile: uongozaji wa biashara, ukuzaji wa mtandao, au ubunifu wa tovuti.` :
      `\n\n🔍 You can ask about our services like: business consulting, digital marketing, or web development.`;
    enhancedFallback += explorationNote;
  }
  
  return {
    text: enhancedFallback,
    type: 'fallback',
    metadata: {
      originalMessage: userMessage,
      intentAnalysis: intentAnalysis,
      conversationDepth: serviceContext.conversationDepth,
      serviceHistory: serviceContext.serviceHistory
    }
  };
}

/**
 * Analyze message intent for better response generation
 * @param {string} message - User message
 * @param {string} language - Current language
 * @returns {Object} Intent analysis result
 */
export function analyzeMessageIntent(message, language) {
  const messageText = message.toLowerCase();
  
  // Contact intent indicators
  const contactIndicators = {
    en: ['contact', 'call', 'email', 'phone', 'reach', 'speak', 'talk', 'meet'],
    sw: ['wasiliana', 'piga', 'barua pepe', 'simu', 'fikia', 'ongea', 'zungumza', 'kutana']
  };
  
  // Pricing intent indicators
  const pricingIndicators = {
    en: ['price', 'cost', 'fee', 'charge', 'rate', 'budget', 'expensive', 'cheap', 'affordable'],
    sw: ['bei', 'gharama', 'ada', 'malipo', 'kiwango', 'bajeti', 'ghali', 'rahisi', 'nafuu']
  };
  
  // Information seeking indicators
  const infoIndicators = {
    en: ['what', 'how', 'why', 'when', 'where', 'tell me', 'explain', 'describe'],
    sw: ['nini', 'jinsi', 'kwa nini', 'lini', 'wapi', 'niambie', 'eleza', 'elezea']
  };
  
  const langContactIndicators = contactIndicators[language] || contactIndicators['en'];
  const langPricingIndicators = pricingIndicators[language] || pricingIndicators['en'];
  const langInfoIndicators = infoIndicators[language] || infoIndicators['en'];
  
  const isContactRequest = langContactIndicators.some(indicator => messageText.includes(indicator));
  const isPricingInquiry = langPricingIndicators.some(indicator => messageText.includes(indicator));
  const isInfoSeeking = langInfoIndicators.some(indicator => messageText.includes(indicator));
  
  // Determine primary intent
  let primaryIntent = 'general';
  if (isContactRequest) primaryIntent = 'contact';
  else if (isPricingInquiry) primaryIntent = 'pricing';
  else if (isInfoSeeking) primaryIntent = 'information';
  
  return {
    isContactRequest,
    isPricingInquiry,
    isInfoSeeking,
    primaryIntent,
    confidence: calculateIntentConfidence(messageText, primaryIntent, language)
  };
}

/**
 * Calculate confidence score for intent detection
 * @param {string} messageText - Processed message text
 * @param {string} primaryIntent - Detected primary intent
 * @param {string} language - Current language
 * @returns {number} Confidence score (0-1)
 */
function calculateIntentConfidence(messageText, primaryIntent, language) {
  const words = messageText.split(/\s+/);
  let matchCount = 0;
  
  // Simple confidence calculation based on keyword matches
  const intentKeywords = {
    contact: {
      en: ['contact', 'call', 'email', 'phone', 'reach', 'speak', 'talk', 'meet'],
      sw: ['wasiliana', 'piga', 'barua pepe', 'simu', 'fikia', 'ongea', 'zungumza', 'kutana']
    },
    pricing: {
      en: ['price', 'cost', 'fee', 'charge', 'rate', 'budget', 'expensive', 'cheap'],
      sw: ['bei', 'gharama', 'ada', 'malipo', 'kiwango', 'bajeti', 'ghali', 'rahisi']
    },
    information: {
      en: ['what', 'how', 'why', 'when', 'where', 'tell', 'explain', 'describe'],
      sw: ['nini', 'jinsi', 'kwa nini', 'lini', 'wapi', 'ambia', 'eleza', 'elezea']
    }
  };
  
  const keywords = intentKeywords[primaryIntent] && intentKeywords[primaryIntent][language] ? 
    intentKeywords[primaryIntent][language] : [];
  
  keywords.forEach(keyword => {
    if (messageText.includes(keyword)) matchCount++;
  });
  
  return Math.min(matchCount / Math.max(words.length * 0.3, 1), 1.0);
}

/**
 * Validate response object structure
 * @param {Object} response - Generated response object
 * @returns {boolean} Whether response is valid
 */
export function validateResponse(response) {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  return response.hasOwnProperty('text') && 
         response.hasOwnProperty('type') && 
         typeof response.text === 'string' &&
         response.text.length > 0;
}