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


import { analyzeCasualInteraction, generateCasualResponse } from './casualInteractionUtils';

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
  // Priority 0: Handle casual interactions (greetings, goodbyes, appreciation)
const casualAnalysis = analyzeCasualInteraction(userMessage, language);
if (casualAnalysis.isCasualInteraction) {
  return generateCasualResponse(casualAnalysis, serviceContext, language);
  }

// Priority 0.5: Handle contextual follow-ups (yes/no, tell me more)
if (intentAnalysis.isContextualResponse) {
  const contextualResponse = generateContextualFollowUp(serviceContext, intentAnalysis, chatbotData, language);
  if (contextualResponse) {
    return contextualResponse;
  }
}


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


// Enhanced contact response generator that includes address information
function generateContactResponse(serviceContext, chatbotData, language) {
  let contactResponse = getContactResponse(chatbotData.contactInfo, language);
  
  // Add location/address information prominently for location-based queries
  if (serviceContext.isLocationQuery || serviceContext.matchedLocationPattern) {
    const locationInfo = language === 'sw' ? 
      `📍 MAHALI YETU:\n${chatbotData.contactInfo.address || 'Anwani itatolewa baadaye'}\n\n` :
      `📍 OUR LOCATION:\n${chatbotData.contactInfo.address || 'Address will be provided'}\n\n`;
    contactResponse = locationInfo + contactResponse;
  }
  
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
      servicesDiscussed: serviceContext.serviceHistory,
      isLocationQuery: serviceContext.isLocationQuery,
      locationPattern: serviceContext.matchedLocationPattern
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
      `\n\n📊 Tunaweza kutengeneza kifurushi cha huduma kwa bei bora zaidi.` :
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
      `\n\n🔍 Unaweza kuuliza kuhusu huduma zetu kama vile: Leadership course, Executive Coaching, or Keynote speaking.` :
      `\n\n🔍 You can ask about our services like: Leadership course, Executive Coaching, or Keynote speaking.`;
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

// Enhanced intent analysis to better handle location/contact queries
export function analyzeMessageIntent(message, language) {
  const messageText = message.toLowerCase().trim();
  const casualAnalysis = analyzeCasualInteraction(message, language);
  
  // Enhanced contact intent indicators
  const contactIndicators = {
    en: [
      'contact', 'call', 'email', 'phone', 'reach', 'speak', 'talk', 'meet', 
      'find you', 'get you', 'locate you', 'get in touch', 'reach out',
      'communicate', 'connect', 'appointment', 'schedule', 'book'
    ],
    sw: [
      'wasiliana', 'piga', 'barua pepe', 'simu', 'fikia', 'ongea', 'zungumza', 
      'kutana', 'kupata', 'mahali', 'miadi', 'ratiba', 'hifadhi',
      'unganisha', 'kufikiana', 'mazungumzo'
    ]
  };
  
  // Enhanced location/address specific indicators
  const locationIndicators = {
    en: [
      'where', 'location', 'address', 'office', 'find', 'visit', 'come to', 
      'directions', 'map', 'navigate', 'situated', 'based', 'headquarters',
      'branch', 'premises', 'building', 'area', 'region', 'place'
    ],
    sw: [
      'wapi', 'mahali', 'anwani', 'ofisi', 'pata', 'tembelea', 'kuja', 
      'mwelekeo', 'ramani', 'elekea', 'iko', 'makao', 'tawi',
      'jengo', 'eneo', 'mkoa', 'sehemu', 'kiwanda'
    ]
  };
  
  // Enhanced pricing intent indicators
  const pricingIndicators = {
    en: [
      'price', 'cost', 'fee', 'charge', 'rate', 'budget', 'expensive', 'cheap', 
      'affordable', 'pricing', 'quote', 'estimate', 'bill', 'payment',
      'money', 'dollar', 'currency', 'value', 'worth', 'discount'
    ],
    sw: [
      'bei', 'gharama', 'ada', 'malipo', 'kiwango', 'bajeti', 'ghali', 'rahisi', 
      'nafuu', 'kipimo', 'hesabu', 'bili', 'pesa', 'dola',
      'thamani', 'punguzo', 'ongezeko', 'kiasi'
    ]
  };
  
  // Enhanced information seeking indicators
  const infoIndicators = {
    en: [
      'what', 'how', 'why', 'when', 'tell me', 'explain', 'describe',
      'information', 'details', 'about', 'regarding', 'concerning',
      'help', 'assist', 'guide', 'show', 'demonstrate'
    ],
    sw: [
      'nini', 'jinsi', 'kwa nini', 'lini', 'niambie', 'eleza', 'elezea',
      'habari', 'maelezo', 'kuhusu', 'juu ya', 'kuhusiana',
      'msaada', 'kusaidia', 'mwongozo', 'onyesha', 'dhihirisha'
    ]
  };

  // Service inquiry indicators
  const serviceIndicators = {
    en: [
      'service', 'services', 'offer', 'provide', 'do you have', 'available',
      'can you', 'do you do', 'specialise', 'expertise', 'capability'
    ],
    sw: [
      'huduma', 'kutoa', 'una', 'unapatikana', 'unaweza', 'unafanya',
      'utaalamu', 'uwezo', 'kipengele'
    ]
  };

  // Booking/scheduling indicators
  const bookingIndicators = {
    en: [
      'book', 'schedule', 'appointment', 'reserve', 'arrange', 'plan',
      'meeting', 'consultation', 'session', 'slot', 'available time'
    ],
    sw: [
      'hifadhi', 'ratiba', 'miadi', 'panga', 'mpango', 'mkutano',
      'mazungumzo', 'kipindi', 'nafasi', 'wakati'
    ]
  };

  // Urgency indicators
  const urgencyIndicators = {
    en: [
      'urgent', 'emergency', 'asap', 'quickly', 'immediately', 'now',
      'soon', 'fast', 'rush', 'priority'
    ],
    sw: [
      'haraka', 'dharura', 'sasa hivi', 'upesi', 'mara moja',
      'kipaumbele', 'mbio'
    ]
  };

  // Add to existing indicator objects around line 350-400
const confirmationIndicators = {
  en: [
    'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'alright', 'definitely',
    'absolutely', 'of course', 'please', 'go ahead', 'continue'
  ],
  sw: [
    'ndiyo', 'ndio', 'sawa', 'haya', 'kabisa', 'bila shaka', 
    'endelea', 'karibu', 'haya basi'
  ]
};

const elaborationIndicators = {
  en: [
    'tell me more', 'more details', 'explain more', 'elaborate', 
    'go deeper', 'what else', 'continue', 'more info', 'expand',
    'tell me about', 'how can i start', 'how do i begin', 'what next'
  ],
  sw: [
    'niambie zaidi', 'maelezo zaidi', 'eleza zaidi', 'endelea',
    'nini kingine', 'habari zaidi', 'jinsi ya kuanza', 'nitaanzaje',
    'hatua ya kwanza', 'nini kifuatacho'
  ]
};
  
  const langContactIndicators = contactIndicators[language] || contactIndicators['en'];
  const langLocationIndicators = locationIndicators[language] || locationIndicators['en'];
  const langPricingIndicators = pricingIndicators[language] || pricingIndicators['en'];
  const langInfoIndicators = infoIndicators[language] || infoIndicators['en'];
  const langServiceIndicators = serviceIndicators[language] || serviceIndicators['en'];
  const langBookingIndicators = bookingIndicators[language] || bookingIndicators['en'];
  const langUrgencyIndicators = urgencyIndicators[language] || urgencyIndicators['en'];

    const langConfirmationIndicators = confirmationIndicators[language] || confirmationIndicators['en'];
const langElaborationIndicators = elaborationIndicators[language] || elaborationIndicators['en'];

  
  const isContactRequest = langContactIndicators.some(indicator => messageText.includes(indicator));
  const isLocationRequest = langLocationIndicators.some(indicator => messageText.includes(indicator));
  const isPricingInquiry = langPricingIndicators.some(indicator => messageText.includes(indicator));
  const isInfoSeeking = langInfoIndicators.some(indicator => messageText.includes(indicator));
  const isServiceInquiry = langServiceIndicators.some(indicator => messageText.includes(indicator));
  const isBookingRequest = langBookingIndicators.some(indicator => messageText.includes(indicator));
  const isUrgent = langUrgencyIndicators.some(indicator => messageText.includes(indicator));


const isConfirmation = langConfirmationIndicators.some(indicator => 
  messageText === indicator || messageText.startsWith(indicator)
);
const isElaborationRequest = langElaborationIndicators.some(indicator => 
  messageText.includes(indicator)
);
  
  // Enhanced specific patterns for location/contact queries
  const locationContactPatterns = {
    en: [
      /where.*can.*i.*(get|find|reach|contact).*you/i,
      /where.*are.*you.*located/i,
      /where.*is.*your.*(office|location|address)/i,
      /how.*to.*find.*you/i,
      /your.*(location|address|office)/i,
      /directions.*to.*you/i,
      /where.*to.*meet/i,
      /find.*your.*place/i
    ],
    sw: [
      /wapi.*naweza.*kupata/i,
      /wapi.*mko/i,
      /mahali.*yenu/i,
      /anwani.*yenu/i,
      /ofisi.*yenu.*iko.*wapi/i,
      /mwelekeo.*wenu/i,
      /mahali.*pa.*kukutana/i
    ]
  };

  // Service-specific inquiry patterns
  const servicePatterns = {
    en: [
      /what.*do.*you.*do/i,
      /what.*services.*do.*you.*offer/i,
      /can.*you.*help.*with/i,
      /do.*you.*provide/i,
      /are.*you.*able.*to/i
    ],
    sw: [
      /mnafanya.*nini/i,
      /huduma.*gani.*mnatoa/i,
      /mnaweza.*kusaidia/i,
      /mnatoa/i,
      /mnaweza/i
    ]
  };
  
  const langLocationPatterns = locationContactPatterns[language] || locationContactPatterns['en'];
  const langServicePatterns = servicePatterns[language] || servicePatterns['en'];
  
  const matchesLocationContactPattern = langLocationPatterns.some(pattern => pattern.test(messageText));
  const matchesServicePattern = langServicePatterns.some(pattern => pattern.test(messageText));
  
  // Enhanced contact detection - location requests should be treated as contact requests
  const isEnhancedContactRequest = isContactRequest || isLocationRequest || matchesLocationContactPattern || isBookingRequest;
  
  // Check if it's a question (using expanded question patterns)
  const isQuestion = casualAnalysis.isQuestion;
  
  // Determine primary intent with better prioritization
  let primaryIntent = 'general';
  let confidence = 0.5;
  
  if (casualAnalysis.isCasualInteraction) {
    primaryIntent = 'casual';
    confidence = 0.9;
  } else if (isEnhancedContactRequest) {
    primaryIntent = 'contact';
    confidence = 0.85;
  } else if (isPricingInquiry) {
    primaryIntent = 'pricing';
    confidence = 0.8;
  } else if (isServiceInquiry || matchesServicePattern) {
    primaryIntent = 'service';
    confidence = 0.8;
  } else if (isBookingRequest) {
    primaryIntent = 'booking';
    confidence = 0.85;
  } else if (isInfoSeeking || isQuestion) {
    primaryIntent = 'information';
    confidence = 0.7;
  }
  
  // Boost confidence for urgent requests
  if (isUrgent) {
    confidence = Math.min(confidence + 0.1, 1.0);
  }
  
  // Calculate intent strength based on multiple indicators
  const intentStrength = calculateIntentStrength({
    isContactRequest,
    isLocationRequest,
    isPricingInquiry,
    isInfoSeeking,
    isServiceInquiry,
    isBookingRequest,
    isUrgent,
    matchesLocationContactPattern,
    matchesServicePattern
  });

  return {
    // Core intent flags
    isContactRequest: isEnhancedContactRequest,
    isLocationRequest,
    isPricingInquiry,
    isInfoSeeking,
    isServiceInquiry,
    isBookingRequest,
    isUrgent,
    isQuestion,
    
    // Casual interaction analysis
    isCasualInteraction: casualAnalysis.isCasualInteraction,
    casualType: casualAnalysis.interactionType,
    
    // Primary classification
    primaryIntent,
    confidence,
    intentStrength,
    

    isConfirmation,
    isElaborationRequest,
    isContextualResponse: isConfirmation || isElaborationRequest,
    
    // Pattern matching results
    matchedLocationPattern: matchesLocationContactPattern,
    matchedServicePattern: matchesServicePattern,
    
    // Additional context
    requiresImmediateAttention: isUrgent || (isBookingRequest && isUrgent),
    suggestedAction: getSuggestedAction(primaryIntent, isUrgent, isBookingRequest),
    
    // Metadata for analytics
    metadata: {
      language,
      messageLength: message.length,
      hasMultipleIntents: [isContactRequest, isPricingInquiry, isServiceInquiry, isBookingRequest].filter(Boolean).length > 1,
      detectedPatterns: {
        location: matchesLocationContactPattern,
        service: matchesServicePattern,
        casual: casualAnalysis.isCasualInteraction
      }
    }
  };
}



/**
 * Calculate intent strength based on multiple indicators
 * @param {Object} indicators - Various intent indicators
 * @returns {number} Intent strength score (0-1)
 */
function calculateIntentStrength(indicators) {
  const weights = {
    isContactRequest: 0.2,
    isLocationRequest: 0.15,
    isPricingInquiry: 0.15,
    isInfoSeeking: 0.1,
    isServiceInquiry: 0.15,
    isBookingRequest: 0.2,
    isUrgent: 0.1,
    matchesLocationContactPattern: 0.25,
    matchesServicePattern: 0.2
  };
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  Object.entries(indicators).forEach(([key, value]) => {
    if (weights[key]) {
      maxPossibleScore += weights[key];
      if (value) {
        totalScore += weights[key];
      }
    }
  });
  
  return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
}

/**
 * Get suggested action based on intent analysis
 * @param {string} primaryIntent - Primary detected intent
 * @param {boolean} isUrgent - Whether request is urgent
 * @param {boolean} isBooking - Whether it's a booking request
 * @returns {string} Suggested action
 */
function getSuggestedAction(primaryIntent, isUrgent, isBooking) {
  if (isUrgent && isBooking) return 'immediate_booking';
  if (isUrgent) return 'priority_response';
  if (isBooking) return 'schedule_appointment';
  
  switch (primaryIntent) {
    case 'contact': return 'provide_contact_info';
    case 'pricing': return 'provide_pricing';
    case 'service': return 'explain_services';
    case 'casual': return 'engage_casually';
    case 'information': return 'provide_information';
    default: return 'general_assistance';
  }
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
 * Generate contextual follow-up response based on previous conversation
 * @param {Object} serviceContext - Current service context
 * @param {Object} intentAnalysis - Intent analysis result
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @returns {Object} Contextual response
 */
function generateContextualFollowUp(serviceContext, intentAnalysis, chatbotData, language) {
  const { lastResponse, currentService, conversationDepth } = serviceContext;
  
  if (intentAnalysis.isConfirmation && lastResponse?.type) {
    // Handle "yes" responses based on last response type
    switch (lastResponse.type) {
      case 'service':
        return generateServiceElaboration(currentService, chatbotData, language);
      case 'pricing':
        return generatePricingElaboration(currentService, language);
      case 'contact':
        return generateContactElaboration(chatbotData, language);
      default:
        return generateGeneralElaboration(serviceContext, language);
    }
  }
  
  if (intentAnalysis.isElaborationRequest) {
    if (currentService) {
      return generateServiceElaboration(currentService, chatbotData, language);
    }
    return generateGeneralGuidance(serviceContext, language);
  }
  
  return null;
}

/**
 * Generate detailed service information
 */
function generateServiceElaboration(service, chatbotData, language) {
  const elaborationContent = language === 'sw' ? 
    `📚 MAELEZO ZAIDI KUHUSU ${service.toUpperCase()}:\n\n` +
    `🎯 Lengo: Kukuwezesha kupata ujuzi wa uongozi wa hali ya juu\n` +
    `⏱️ Muda: Kulingana na mahitaji yako\n` +
    `👥 Kwa: Viongozi na wanaotaka kuongoza\n\n` +
    `💡 Je, ungependa kujua zaidi kuhusu:\n` +
    `• Jinsi ya kuanza\n• Bei na mipango ya malipo\n• Mfumo wa masomo` :
    
    `📚 MORE DETAILS ABOUT ${service.toUpperCase()}:\n\n` +
    `🎯 Purpose: To help you develop high-level leadership skills\n` +
    `⏱️ Duration: Based on your needs\n` +
    `👥 For: Current and aspiring leaders\n\n` +
    `💡 Would you like to know more about:\n` +
    `• How to get started\n• Pricing and payment plans\n• Course structure`;

  return {
    text: elaborationContent,
    type: 'service_elaboration',
    service: service,
    metadata: { elaborationType: 'service_details' }
  };
}

/**
 * Generate pricing elaboration
 */
function generatePricingElaboration(service, language) {
  const pricingDetails = language === 'sw' ? 
    `💰 MAELEZO ZAIDI YA BEI:\n\n` +
    `📊 Tunayo mipango tofauti:\n` +
    `• Mafunzo ya binafsi\n• Vikundi vidogo\n• Mipango ya kampuni\n\n` +
    `💳 Malipo:\n` +
    `• Malipo ya mara moja\n• Malipo kwa awamu\n• Mipango maalum\n\n` +
    `📞 Wasiliana nasi kwa bei maalum yako.` :
    
    `💰 DETAILED PRICING INFORMATION:\n\n` +
    `📊 We offer different packages:\n` +
    `• Individual training\n• Small groups\n• Corporate packages\n\n` +
    `💳 Payment options:\n` +
    `• One-time payment\n• Installment plans\n• Custom arrangements\n\n` +
    `📞 Contact us for your personalized quote.`;

  return {
    text: pricingDetails,
    type: 'pricing_elaboration',
    service: service,
    metadata: { elaborationType: 'pricing_details' }
  };
}

/**
 * Generate general guidance for getting started
 */
function generateGeneralGuidance(serviceContext, language) {
  const guidanceContent = language === 'sw' ? 
    `🚀 JINSI YA KUANZA:\n\n` +
    `1️⃣ Chagua huduma unayohitaji\n` +
    `2️⃣ Wasiliana nasi kwa mazungumzo\n` +
    `3️⃣ Tupange mfumo unaokufaa\n` +
    `4️⃣ Anza safari yako ya maendeleo\n\n` +
    `📋 Huduma zetu kuu:\n` +
    `• Leadership courses\n• Executive coaching\n• Keynote speaking\n\n` +
    `❓ Je, ungependa kujua zaidi kuhusu huduma fulani?` :
    
    `🚀 HOW TO GET STARTED:\n\n` +
    `1️⃣ Choose the service you need\n` +
    `2️⃣ Contact us for consultation\n` +
    `3️⃣ We'll design a plan that fits you\n` +
    `4️⃣ Begin your development journey\n\n` +
    `📋 Our main services:\n` +
    `• Leadership courses\n• Executive coaching\n• Keynote speaking\n\n` +
    `❓ Would you like to know more about a specific service?`;

  return {
    text: guidanceContent,
    type: 'guidance',
    metadata: { elaborationType: 'getting_started' }
  };
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