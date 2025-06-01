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
} from '@/utils/context/serviceContextUtils';

// Import common questions functionality
import {
  handleCommonQuestions,
  formatResponseForDisplay,
  generateServicesResponse,
  generatePricingResponse as generateCommonPricingResponse,
  generateMethodologyResponse,
  generateMoreInfoResponse
} from '@/utils/context/common-questions/index';

import { 
  calculateIntentStrength,
  getSuggestedAction,
  calculateIntentConfidence,
  generateContextualFollowUp,
  generateServiceElaboration,
  generatePricingElaboration,
  generateGeneralGuidance
} from "./helpers"

import {
  analyzeMessageIntent,
  detectQuestionType
} from "./intent";

export {analyzeMessageIntent};

import { analyzeCasualInteraction, generateCasualResponse } from '../casual/casualInteractionUtils';

/**
 * Generate contextual response based on service detection and user intent
 * Enhanced with common questions functionality
 * @param {string} userMessage - User's message
 * @param {Object} serviceDetection - Service detection result
 * @param {Object} intentAnalysis - Message intent analysis
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @param {Object} serviceContext - Current service context
 * @param {Object} pricingData - Pricing information
 * @returns {Object} Generated response
 */
export function generateContextualResponse({
  userMessage, 
  serviceDetection, 
  intentAnalysis, 
  chatbotData, 
  language, 
  serviceContext, 
  pricingData
}) {
  // Priority 0: Handle casual interactions (greetings, goodbyes, appreciation)
  const casualAnalysis = analyzeCasualInteraction(userMessage, language);
  if (casualAnalysis.isCasualInteraction) {
    return generateCasualResponse(casualAnalysis, serviceContext, language);
  }

  // Priority 0.5: Handle common questions using the dedicated handler
  const commonQuestionResponse = handleCommonQuestions(userMessage, language);
  if (commonQuestionResponse.questionType !== 'unknown' && commonQuestionResponse.confidence > 0.6) {
    return formatCommonQuestionResponse(commonQuestionResponse, serviceContext, language);
  }

  // Priority 1: Handle contextual follow-ups (yes/no, tell me more)
  if (intentAnalysis.isContextualResponse) {
    const contextualResponse = generateContextualFollowUp(serviceContext, intentAnalysis, chatbotData, language);
    if (contextualResponse) {
      return contextualResponse;
    }
  }

  // Priority 2: Handle contact requests
  if (intentAnalysis.isContactRequest) {
    return generateContactResponse(serviceContext, chatbotData, language);
  }
  
  // Priority 3: Handle pricing inquiries (enhanced with common questions)
  if (intentAnalysis.isPricingInquiry) {
    return generateEnhancedPricingResponse(serviceDetection.service, language, pricingData, serviceContext);
  }
  
  // Priority 4: Handle service-specific inquiries
  if (serviceDetection.service && serviceDetection.confidence > 0.5) {
    return generateServiceResponse(serviceDetection, chatbotData, language, serviceContext);
  }
  
  // Priority 5: Handle FAQ matches
  const faqResponse = generateFaqResponse(userMessage, chatbotData, language);
  if (faqResponse.matched) {
    return faqResponse;
  }
  
  // Priority 6: Handle conversation insights
  const insightsResponse = generateInsightsResponse(serviceContext, language);
  if (insightsResponse.hasInsights) {
    return insightsResponse;
  }
  
  // Priority 7: Generate fallback response
  return generateFallbackResponse(userMessage, intentAnalysis, chatbotData, language, serviceContext);
}

/**
 * Format common question response for the chatbot system
 * @param {Object} commonQuestionResponse - Response from handleCommonQuestions
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @returns {Object} Formatted response object
 */
function formatCommonQuestionResponse(commonQuestionResponse, serviceContext, language) {
  const formattedText = formatResponseForDisplay(commonQuestionResponse, language);
  
  // Enhance with service context if available
  let enhancedText = formattedText;
  
  // Add contextual notes based on conversation history
  if (serviceContext.conversationDepth > 2 && commonQuestionResponse.questionType === 'pricing') {
    const contextNote = language === 'sw' ? 
      `\n\n💡 Kwa bei maalum kulingana na mazungumzo yetu, wasiliana nasi moja kwa moja.` :
      `\n\n💡 For personalized pricing based on our discussion, contact us directly.`;
    enhancedText += contextNote;
  }
  
  if (serviceContext.serviceHistory.length > 1 && commonQuestionResponse.questionType === 'services') {
    const historyNote = language === 'sw' ? 
      `\n\n📋 Tumeongea kuhusu: ${serviceContext.serviceHistory.join(', ')}.` :
      `\n\n📋 We've discussed: ${serviceContext.serviceHistory.join(', ')}.`;
    enhancedText += historyNote;
  }

  return {
    text: enhancedText,
    type: 'common_question',
    questionType: commonQuestionResponse.questionType,
    confidence: commonQuestionResponse.confidence,
    serviceContext: commonQuestionResponse.serviceContext,
    suggestedActions: commonQuestionResponse.suggestedActions,
    metadata: {
      originalQuestionType: commonQuestionResponse.questionType,
      detectedService: commonQuestionResponse.serviceContext,
      conversationDepth: serviceContext.conversationDepth,
      serviceHistory: serviceContext.serviceHistory
    }
  };
}

/**
 * Generate services overview response with context awareness
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @returns {Object} Services response
 */
function generateServicesOverviewResponse(serviceContext, language) {
  const servicesResponse = generateServicesResponse(language);
  let enhancedResponse = formatResponseForDisplay({ response: servicesResponse }, language);
  
  // Add context-based recommendations
  if (serviceContext.serviceHistory.length > 0) {
    const recommendationNote = language === 'sw' ? 
      `\n\n🎯 Kulingana na mazungumzo yetu, huduma hizi zinaweza kukufaa zaidi: ` :
      `\n\n🎯 Based on our conversation, these services might be most relevant for you: `;
    
    // Filter services based on history or context
    const relevantServices = serviceContext.serviceHistory.slice(0, 2);
    enhancedResponse += recommendationNote + relevantServices.join(', ');
  }
  
  return {
    text: enhancedResponse,
    type: 'services_overview',
    metadata: {
      servicesCount: servicesResponse.services ? servicesResponse.services.length : 0,
      hasContext: serviceContext.serviceHistory.length > 0
    }
  };
}

/**
 * Generate methodology response with service context
 * @param {string} service - Specific service (optional)
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @returns {Object} Methodology response
 */
function generateMethodologyOverviewResponse(service, serviceContext, language) {
  const methodologyResponse = generateMethodologyResponse(service, language);
  let enhancedResponse = formatResponseForDisplay({ response: methodologyResponse }, language);
  
  // Add service-specific methodology details if context available
  if (serviceContext.currentService && !service) {
    const contextualNote = language === 'sw' ? 
      `\n\n🔍 Kwa huduma ya ${serviceContext.currentService} ambayo tumeongea nayo, mbinu ni: ` :
      `\n\n🔍 For the ${serviceContext.currentService} service we discussed, the approach is: `;
    
    const specificMethodology = generateMethodologyResponse(serviceContext.currentService, language);
    if (specificMethodology.isSpecific) {
      enhancedResponse += contextualNote + specificMethodology.intro;
    }
  }
  
  return {
    text: enhancedResponse,
    type: 'methodology',
    service: service || serviceContext.currentService,
    metadata: {
      isServiceSpecific: !!service,
      contextualService: serviceContext.currentService
    }
  };
}

/**
 * Enhanced contact response generator that includes address information
 */
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
 * Enhanced with common questions pricing logic
 */
function generateEnhancedPricingResponse(service, language, pricingData, serviceContext) {
  // Use common questions pricing response as base
  const commonPricingResponse = generateCommonPricingResponse(service, language);
  let enhancedResponse = formatResponseForDisplay({ response: commonPricingResponse }, language);
  
  // Add contextual pricing notes based on conversation history
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
      multipleServices: serviceContext.serviceHistory.length > 1,
      usedCommonQuestions: true
    }
  };
}

/**
 * Generate service-specific response with confidence scoring
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
 * Enhanced with common questions suggestions
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
  
  // Add common questions suggestions
  if (serviceContext.conversationDepth === 0) {
    const suggestionsNote = language === 'sw' ? 
      `\n\n🔍 Unaweza kuuliza:\n• "Huduma gani mnazotoa?"\n• "Bei zenu ni ngapi?"\n• "Mnafanyaje mafunzo?"\n• "Nataka maelezo zaidi"` :
      `\n\n🔍 You can ask:\n• "What services do you offer?"\n• "What are your pricing rates?"\n• "How do you conduct training?"\n• "I need more information"`;
    enhancedFallback += suggestionsNote;
  }
  
  return {
    text: enhancedFallback,
    type: 'fallback',
    metadata: {
      originalMessage: userMessage,
      intentAnalysis: intentAnalysis,
      conversationDepth: serviceContext.conversationDepth,
      serviceHistory: serviceContext.serviceHistory,
      suggestedActions: ['show_services', 'show_pricing', 'book_consultation']
    }
  };
}

/**
 * Validate response object structure
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