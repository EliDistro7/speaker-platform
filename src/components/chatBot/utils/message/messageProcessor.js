// File: app/components/layout/ChatBot/utils/messageProcessor.js

import { 
  detectLanguage, 
  processUserMessage, 
  findMatchingService, 
  getServiceResponse,
  findFaqMatch,
  isAskingForContact,
  getContactResponse 
} from '@/utils/ChatBotUtils';

import { 
  detectServiceFromMessage,
  updateServiceContext,
  isPricingInquiry,
  generatePricingResponse,
  getConversationInsights
} from '@/utils/context/serviceContextUtils';

/**
 * Process incoming user message and generate appropriate response
 * @param {string} userMessage - The user's message
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @param {Object} pricingData - Pricing information
 * @returns {Object} Processed message result
 */
export function processIncomingMessage(userMessage, chatbotData, serviceContext, language, pricingData) {
  // Detect language from user message
  const detectedLang = detectLanguage(userMessage, null, language);
  
  // Enhanced service detection
  const serviceDetection = detectServiceFromMessage(userMessage, detectedLang);
  const detectedService = serviceDetection.service;
  
  // Update service context
  const updatedServiceContext = updateServiceContext(
    serviceContext, 
    detectedService, 
    userMessage
  );
  
  // Create user message object with metadata
  const userMessageObj = {
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString(),
    language: detectedLang,
    detectedService: detectedService,
    serviceContext: updatedServiceContext.currentService,
    confidence: serviceDetection.confidence,
    matchedTerms: serviceDetection.matchedTerms
  };
  
  return {
    userMessage: userMessageObj,
    detectedLanguage: detectedLang,
    detectedService: detectedService,
    updatedServiceContext: updatedServiceContext,
    serviceDetection: serviceDetection
  };
}

/**
 * Generate bot response based on processed message
 * @param {Object} processedMessage - Result from processIncomingMessage
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {Object} pricingData - Pricing information
 * @returns {Object} Bot response object
 */
export function generateBotResponse(processedMessage, chatbotData, pricingData) {
  const { 
    userMessage, 
    detectedLanguage, 
    detectedService, 
    updatedServiceContext 
  } = processedMessage;
  
  // Process the message using existing utility
  let responseData = processUserMessage(userMessage.content, chatbotData, detectedLanguage);
  let finalResponse = responseData.text;
  let responseType = 'general';
  
  // Handle pricing inquiries
  if (detectedService && isPricingInquiry(userMessage.content, detectedLanguage)) {
    const pricingResponse = generatePricingResponse(detectedService, detectedLanguage, pricingData);
    finalResponse = pricingResponse;
    responseType = 'pricing';
  } 
  // Handle service-specific inquiries
  else if (detectedService && !isPricingInquiry(userMessage.content, detectedLanguage)) {
    const serviceResponse = getServiceResponse(detectedService, chatbotData, detectedLanguage);
    if (serviceResponse && serviceResponse !== responseData.text) {
      finalResponse = serviceResponse;
      responseType = 'service';
    }
  }
  // Handle contact requests
  else if (isAskingForContact(userMessage.content)) {
    finalResponse = getContactResponse(chatbotData.contactInfo, detectedLanguage);
    responseType = 'contact';
  }
  
  // Add conversation insights for high engagement
  const insights = getConversationInsights(updatedServiceContext);
  if (insights.insights.includes('Deep engagement detected')) {
    const engagementNote = detectedLanguage === 'sw' ? 
      '\n\n💡 Ninaona una maswali mengi. Je, ungependa kuongea na mtaalamu wetu moja kwa moja?' :
      '\n\n💡 I can see you have many questions. Would you like to speak with our specialist directly?';
    finalResponse += engagementNote;
  }
  
  // Create bot response object
  const botResponse = {
    role: 'bot',
    content: finalResponse,
    timestamp: new Date().toISOString(),
    language: detectedLanguage,
    serviceContext: updatedServiceContext.currentService,
    conversationDepth: updatedServiceContext.conversationDepth,
    insights: insights,
    responseType: responseType,
    suggestions: responseData.suggestions || []
  };
  
  return {
    botResponse: botResponse,
    suggestions: responseData.suggestions || [],
    insights: insights
  };
}

/**
 * Handle FAQ lookup requests
 * @param {string} question - FAQ question
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @returns {Object} FAQ response
 */
export function handleFaqLookup(question, chatbotData, serviceContext, language) {
  const faqAnswer = findFaqMatch(question, chatbotData.faqs, language);
  
  if (faqAnswer) {
    // Update context to track FAQ interaction
    const updatedContext = updateServiceContext(serviceContext, null, `FAQ: ${question}`);
    
    return {
      response: {
        role: 'bot',
        content: faqAnswer,
        timestamp: new Date().toISOString(),
        trigger: 'faq_lookup',
        language: language
      },
      updatedContext: updatedContext
    };
  }
  
  return null;
}

/**
 * Handle service lookup requests
 * @param {string} serviceName - Service name to lookup
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @returns {Object} Service response
 */
export function handleServiceLookup(serviceName, chatbotData, serviceContext, language) {
  const matchedService = findMatchingService(serviceName, chatbotData.serviceKeywords, language);
  
  if (matchedService) {
    const serviceResponse = getServiceResponse(matchedService, chatbotData, language);
    
    // Update service context
    const updatedContext = updateServiceContext(serviceContext, matchedService, `Service lookup: ${serviceName}`);
    
    return {
      response: {
        role: 'bot',
        content: serviceResponse,
        timestamp: new Date().toISOString(),
        serviceContext: matchedService,
        trigger: 'service_lookup',
        language: language
      },
      updatedContext: updatedContext,
      detectedService: matchedService
    };
  }
  
  return null;
}

/**
 * Generate personalized contact response
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {Object} serviceContext - Current service context
 * @param {string} language - Current language
 * @returns {Object} Contact response
 */
export function generateContactResponse(chatbotData, serviceContext, language) {
  let contactResponse = getContactResponse(chatbotData.contactInfo, language);
  
  // Add personalized message based on service context
  if (serviceContext.currentService) {
    const serviceNote = language === 'sw' ? 
      `\n\n📋 Kwa maswali maalum kuhusu ${serviceContext.currentService}, wasiliana nasi moja kwa moja.` :
      `\n\n📋 For specific questions about ${serviceContext.currentService}, contact us directly.`;
    contactResponse += serviceNote;
  }
  
  // Add conversation depth context
  if (serviceContext.conversationDepth >= 10) {
    const historyNote = language === 'sw' ?
      '\n\n📞 Kwa kuwa tumekuwa na mazungumzo ya kina, mtaalamu wetu atakusaidia zaidi.' :
      '\n\n📞 Since we\'ve had an in-depth conversation, our specialist can help you further.';
    contactResponse += historyNote;
  }
  
  // Add multi-service context
  if (serviceContext.serviceHistory.length > 1) {
    const multiServiceNote = language === 'sw' ?
      `\n\n🔗 Pia, tumezungumza kuhusu: ${serviceContext.serviceHistory.join(', ')}.` :
      `\n\n🔗 We've also discussed: ${serviceContext.serviceHistory.join(', ')}.`;
    contactResponse += multiServiceNote;
  }
  
  return {
    role: 'bot',
    content: contactResponse,
    timestamp: new Date().toISOString(),
    trigger: 'contact_request',
    serviceContext: serviceContext.currentService,
    language: language
  };
}

/**
 * Validate and sanitize user input
 * @param {string} userInput - Raw user input
 * @returns {Object} Validation result
 */
export function validateUserInput(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return { isValid: false, error: 'Invalid input type' };
  }
  
  const trimmed = userInput.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Empty input' };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, error: 'Input too long' };
  }
  
  // Basic sanitization - remove potentially harmful content
  const sanitized = trimmed
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .substring(0, 500); // Limit length
  
  return { 
    isValid: true, 
    sanitized: sanitized,
    original: trimmed 
  };
}

/**
 * Extract message metadata for analytics
 * @param {Object} userMessage - User message object
 * @param {Object} botResponse - Bot response object
 * @param {Object} serviceContext - Service context
 * @returns {Object} Message metadata
 */
export function extractMessageMetadata(userMessage, botResponse, serviceContext) {
  return {
    timestamp: new Date().toISOString(),
    userLanguage: userMessage.language,
    detectedService: userMessage.detectedService,
    responseType: botResponse.responseType,
    conversationDepth: serviceContext.conversationDepth,
    serviceHistory: serviceContext.serviceHistory,
    confidence: userMessage.confidence,
    insights: botResponse.insights?.insights || [],
    messageLength: userMessage.content.length,
    responseLength: botResponse.content.length
  };
}