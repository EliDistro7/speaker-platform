// File: app/components/layout/ChatBot/hooks/useChatActions.js
import { useCallback } from 'react';
import { chatbotData } from '@/data/chat/index';
import {
  detectServiceFromMessage,
  updateServiceContext,
  generateContextualPrompts,
  generatePricingResponse,
  isPricingInquiry,
  getConversationInsights
} from '@/utils/serviceContextUtils';
import {
  detectLanguage,
  processUserMessage,
  findMatchingService,
  getServiceResponse,
  findFaqMatch,
  getContactResponse
} from '@/utils/ChatBotUtils';

/**
 * Custom hook to manage chat actions
 * Handles message sending, service lookup, FAQ lookup, and other user actions
 */
export function useChatActions({
  language,
  serviceContext,
  chatMessages,
  addMessage,
  setIsTyping,
  updateServiceContextState,
  updateSuggestions,
  setActiveService
}) {
  const pricingData = chatbotData.pricing;

  // Enhanced message processing with service context management
  const sendMessage = useCallback((userMessage) => {
    if (!userMessage.trim()) return;
    
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
    updateServiceContextState(updatedServiceContext);
    
    // Add user message with enhanced metadata
    addMessage({ 
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString(),
      language: detectedLang,
      detectedService: detectedService,
      serviceContext: updatedServiceContext.currentService,
      confidence: serviceDetection.confidence,
      matchedTerms: serviceDetection.matchedTerms
    });
    
    setIsTyping(true);
    
    // Process message and generate response
    setTimeout(() => {
      let responseData = processUserMessage(userMessage, chatbotData, detectedLang);
      let finalResponse = responseData.text;
      
      // Enhanced response with service context and pricing information
      if (detectedService && isPricingInquiry(userMessage, detectedLang)) {
        const pricingResponse = generatePricingResponse(detectedService, detectedLang, pricingData);
        finalResponse = pricingResponse;
      } else if (detectedService && !isPricingInquiry(userMessage, detectedLang)) {
        const serviceResponse = getServiceResponse(detectedService, chatbotData, detectedLang);
        if (serviceResponse && serviceResponse !== responseData.text) {
          finalResponse = serviceResponse;
        }
      }
      
      // Add conversation insights for high engagement
      const insights = getConversationInsights(updatedServiceContext);
      if (insights.insights.includes('Deep engagement detected')) {
        const engagementNote = detectedLang === 'sw' ? 
          '\n\n💡 Ninaona una maswali mengi. Je, ungependa kuongea na mtaalamu wetu moja kwa moja?' :
          '\n\n💡 I can see you have many questions. Would you like to speak with our specialist directly?';
        finalResponse += engagementNote;
      }
      
      addMessage({ 
        role: 'bot', 
        content: finalResponse,
        timestamp: new Date().toISOString(),
        language: detectedLang,
        serviceContext: updatedServiceContext.currentService,
        conversationDepth: updatedServiceContext.conversationDepth,
        insights: insights
      });
      
      // Generate enhanced contextual suggestions
      const contextualPrompts = generateContextualPrompts(
        updatedServiceContext.currentService, 
        updatedServiceContext.conversationDepth, 
        detectedLang,
        updatedServiceContext
      );
      
      updateSuggestions(contextualPrompts.length > 0 ? contextualPrompts : responseData.suggestions || []);
      setActiveService(updatedServiceContext.currentService);
      setIsTyping(false);
    }, 1500);
  }, [
    language, 
    serviceContext, 
    addMessage, 
    setIsTyping, 
    updateServiceContextState, 
    updateSuggestions, 
    setActiveService,
    pricingData
  ]);

  // Service lookup with advanced context management
  const lookupService = useCallback((serviceName) => {
    const matchedService = findMatchingService(serviceName, chatbotData.serviceKeywords, language);
    if (matchedService) {
      const serviceResponse = getServiceResponse(matchedService, chatbotData, language);
      
      // Update service context
      const updatedContext = updateServiceContext(serviceContext, matchedService, `Service lookup: ${serviceName}`);
      updateServiceContextState(updatedContext);
      
      addMessage({ 
        role: 'bot', 
        content: serviceResponse,
        timestamp: new Date().toISOString(),
        serviceContext: matchedService,
        trigger: 'service_lookup'
      });
      
      setActiveService(matchedService);
      
      // Generate contextual suggestions for the new service
      const contextualPrompts = generateContextualPrompts(matchedService, 0, language, updatedContext);
      updateSuggestions(contextualPrompts);
    }
  }, [language, serviceContext, addMessage, updateServiceContextState, setActiveService, updateSuggestions]);

  // FAQ lookup with context awareness
  const lookupFaq = useCallback((question) => {
    const faqAnswer = findFaqMatch(question, chatbotData.faqs, language);
    if (faqAnswer) {
      // Update context to track FAQ interaction
      const updatedContext = updateServiceContext(serviceContext, null, `FAQ: ${question}`);
      updateServiceContextState(updatedContext);
      
      addMessage({ 
        role: 'bot', 
        content: faqAnswer,
        timestamp: new Date().toISOString(),
        trigger: 'faq_lookup'
      });
    }
  }, [language, serviceContext, addMessage, updateServiceContextState]);

  // Enhanced contact information handler
  const requestContact = useCallback(() => {
    const contactResponse = getContactResponse(chatbotData.contactInfo, language);
    
    // Add personalized message based on service context
    let personalizedContact = contactResponse;
    if (serviceContext.currentService) {
      const serviceNote = language === 'sw' ? 
        `\n\n📋 Kwa maswali maalum kuhusu ${serviceContext.currentService}, wasiliana nasi moja kwa moja.` :
        `\n\n📋 For specific questions about ${serviceContext.currentService}, contact us directly.`;
      personalizedContact += serviceNote;
    }
    
    addMessage({ 
      role: 'bot', 
      content: personalizedContact,
      timestamp: new Date().toISOString(),
      trigger: 'contact_request',
      serviceContext: serviceContext.currentService
    });
  }, [language, serviceContext, addMessage]);

  return {
    sendMessage,
    lookupService,
    lookupFaq,
    requestContact
  };
}