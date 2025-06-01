// File: app/components/layout/ChatBot/hooks/sender/useMessageSender.js
import { useCallback } from 'react';
import { chatbotData } from '@/data/chat/index';
import {
  detectLanguage,
  processUserMessage,
  isPricingQuery as isPricingInquiry,
  getServiceResponse
} from '@/utils/ChatBotUtils';
import {
  detectServiceFromMessage,
  updateServiceContext,
  generatePricingResponse,
  getConversationInsights,
  createFreshServiceContext
} from '@/utils/context/serviceContextUtils';
import {
  generateContextualResponse,
  analyzeMessageIntent,
  validateResponse
} from '../../utils/response/responseGenerator';
import {
  detectServiceWithConfidence,
  validateServiceDetection,
  getDetectionSummary
} from '../../utils/detector/serviceDetector';
import {
  generateSmartSuggestions,
  generateFollowUpSuggestions
} from '../../utils/suggestion/suggestionEngine';
import {
  saveConversationState,
  addMessageToConversation,
  getConversationStats,
  detectConversationPatterns,
  pruneConversation
} from '../../utils/convo/conversationManager';

export const useMessageSender = (
  language,
  message,
  setMessage,
  isClosing,
  serviceContext,
  setServiceContext,
  chatMessages,
  setChatMessages,
  setIsTyping,
  setSuggestions,
  setActiveService,
  detectionHistory,
  setDetectionHistory,
  setCurrentDetectionResult,
  setConversationStats,
  setConversationPatterns,
  maxMessages,
  chatEndRef,
  pricingData
) => {
  const handleMessageSend = useCallback(() => {
    if (!message.trim() || isClosing) return;
    
    const userMessage = message.trim();
    
    // Use detectLanguage utility to detect language from user message
    const detectedLang = detectLanguage(userMessage, null, language);
    
    // Enhanced service detection with confidence scoring
    const enhancedServiceDetection = detectServiceWithConfidence(
      userMessage, 
      detectedLang, 
      chatbotData.serviceKeywords,
      serviceContext
    );
    
    // Validate the enhanced detection result
    if (!validateServiceDetection(enhancedServiceDetection)) {
      console.warn('Enhanced service detection failed, falling back to basic detection');
      const basicDetection = detectServiceFromMessage(userMessage, detectedLang);
      enhancedServiceDetection.service = basicDetection.service;
      enhancedServiceDetection.confidence = basicDetection.confidence || 0.5;
      enhancedServiceDetection.matchedTerms = basicDetection.matchedTerms || [];
      enhancedServiceDetection.alternativeServices = [];
      enhancedServiceDetection.detectionMethod = 'fallback_basic';
    }
    
    // Update detection history
    const detectionRecord = {
      message: userMessage,
      timestamp: new Date().toISOString(),
      detection: enhancedServiceDetection,
      language: detectedLang
    };
    
    setDetectionHistory(prev => [...prev.slice(-9), detectionRecord]);
    setCurrentDetectionResult(enhancedServiceDetection);
    
    // Enhanced debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Enhanced Service Detection Result:', {
        summary: getDetectionSummary(enhancedServiceDetection),
        fullResult: enhancedServiceDetection,
        detectionHistory: detectionHistory.length
      });
    }
    
    // Analyze message intent
    const intentAnalysis = analyzeMessageIntent(userMessage, detectedLang);
    
    // Enhanced service context update with confidence-based logic
    let updatedServiceContext;
    if (enhancedServiceDetection.confidence > 0.7) {
      updatedServiceContext = updateServiceContext(
        serviceContext, 
        enhancedServiceDetection.service, 
        userMessage
      );
    } else if (enhancedServiceDetection.confidence > 0.4) {
      updatedServiceContext = updateServiceContext(
        serviceContext, 
        enhancedServiceDetection.service, 
        userMessage,
        { preservePrevious: true, confidenceThreshold: 0.4 }
      );
    } else {
      updatedServiceContext = updateServiceContext(
        serviceContext, 
        null,
        userMessage
      );
    }
    
    setServiceContext(updatedServiceContext);
    
    // Create user message object with comprehensive metadata
    const userMessageObj = {
      role: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString(),
      language: detectedLang,
      enhancedDetection: enhancedServiceDetection,
      detectedService: enhancedServiceDetection.service,
      detectionConfidence: enhancedServiceDetection.confidence,
      detectionMethod: enhancedServiceDetection.detectionMethod,
      matchedTerms: enhancedServiceDetection.matchedTerms,
      alternativeServices: enhancedServiceDetection.alternativeServices,
      contextInfluence: enhancedServiceDetection.contextInfluence,
      serviceContext: updatedServiceContext.currentService,
      confidence: enhancedServiceDetection.confidence,
      intentAnalysis: intentAnalysis
    };
    
    // Add message using conversation manager utility
    setChatMessages(prev => addMessageToConversation(prev, userMessageObj));
    
    // Prune conversation if it gets too long
    setChatMessages(prev => pruneConversation(prev, maxMessages));
    
    setMessage('');
    setIsTyping(true);
    
    // Update conversation stats and patterns after user message
    setTimeout(() => {
      setChatMessages(currentMessages => {
        const updatedStats = getConversationStats(currentMessages, updatedServiceContext);
        const updatedPatterns = detectConversationPatterns(currentMessages);
        
        setConversationStats(updatedStats);
        setConversationPatterns(updatedPatterns);
        
        return currentMessages;
      });
    }, 100);
    
    // Scroll to bottom immediately after sending message
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
    
    // Enhanced response generation with confidence-aware processing
    setTimeout(() => {
      try {

         
 
        const generatedResponse = generateContextualResponse({
          userMessage,
          serviceDetection:enhancedServiceDetection,
          intentAnalysis,
          chatbotData,
          language:detectedLang,
          serviceContext:updatedServiceContext,
          pricingData:pricingData
        }
        );

        // Update service context with last response for contextual follow-ups
        const contextWithLastResponse = {
          ...updatedServiceContext,
          lastResponse: {
            type: generatedResponse.type,
            service: generatedResponse.service,
            text: generatedResponse.text,
            timestamp: new Date().toISOString()
          }
        };

        setServiceContext(contextWithLastResponse);
        
        // Validate the generated response
        if (!validateResponse(generatedResponse)) {
          console.warn('Generated response validation failed, falling back to enhanced processing');
          throw new Error('Invalid response structure');
        }
        
        // Use the generated response
        let finalResponse = generatedResponse.text;
        let responseMetadata = generatedResponse.metadata || {};
        
        // Enhanced metadata with detection details
        responseMetadata.enhancedDetection = enhancedServiceDetection;
        responseMetadata.detectionSummary = getDetectionSummary(enhancedServiceDetection);
        
        // Add confidence-based response enhancement
        if (enhancedServiceDetection.confidence > 0.8 && enhancedServiceDetection.service) {
          const confidenceNote = detectedLang === 'sw' ? 
            `\n\n✨ Nina uhakika wa ${Math.round(enhancedServiceDetection.confidence * 100)}% kuwa unahitaji msaada wa ${enhancedServiceDetection.service}.` :
            `\n\n✨ I'm ${Math.round(enhancedServiceDetection.confidence * 100)}% confident you need help with ${enhancedServiceDetection.service}.`;
          
          finalResponse += confidenceNote;
        }
        
        // Add alternative services suggestion for medium confidence
        if (enhancedServiceDetection.confidence > 0.4 && 
            enhancedServiceDetection.confidence < 0.7 && 
            enhancedServiceDetection.alternativeServices.length > 0) {
          
          const alternatives = enhancedServiceDetection.alternativeServices
            .slice(0, 2)
            .map(alt => alt.service)
            .join(', ');
          
          const alternativeNote = detectedLang === 'sw' ? 
            `\n\n🤔 Au labda unahitaji msaada wa: ${alternatives}?` :
            `\n\n🤔 Or perhaps you need help with: ${alternatives}?`;
          
          finalResponse += alternativeNote;
        }
        
        // Create bot message object with comprehensive metadata
        const botMessageObj = {
          role: 'bot', 
          content: finalResponse,
          timestamp: new Date().toISOString(),
          language: detectedLang,
          serviceContext: updatedServiceContext.currentService,
          conversationDepth: updatedServiceContext.conversationDepth,
          responseType: generatedResponse.type,
          responseMetadata: responseMetadata,
          insights: getConversationInsights(updatedServiceContext),
          enhancedDetection: enhancedServiceDetection,
          detectionSummary: getDetectionSummary(enhancedServiceDetection),
          confidenceLevel: enhancedServiceDetection.confidence > 0.8 ? 'high' : 
                          enhancedServiceDetection.confidence > 0.4 ? 'medium' : 'low'
        };
        
        // Add bot message using conversation manager and handle auto-save
        setChatMessages(prev => {
          const updatedMessages = addMessageToConversation(prev, botMessageObj);
          
          // Auto-save conversation after bot response
          saveConversationState(updatedMessages, updatedServiceContext, setActiveService, detectedLang);
          
          // Update stats after bot response
          const newStats = getConversationStats(updatedMessages, updatedServiceContext);
          const newPatterns = detectConversationPatterns(updatedMessages);
          
          setConversationStats(newStats);
          setConversationPatterns(newPatterns);
          
          return updatedMessages;
        });
        
        // Enhanced smart suggestion generation using the new suggestion engine
        const smartSuggestions = generateSmartSuggestions(
          updatedServiceContext,
          updatedServiceContext.conversationDepth,
          detectedLang,
          userMessage,
          chatMessages,
          Object.keys(chatbotData.services || {})
        );

        // Generate follow-up suggestions based on bot response
        let followUpSuggestions = [];
        if (finalResponse) {
          followUpSuggestions = generateFollowUpSuggestions(
            finalResponse,
            updatedServiceContext.currentService,
            detectedLang,
            updatedServiceContext.conversationDepth
          );
        }

        // Combine smart suggestions with follow-up suggestions
        const contextualPrompts = [
          ...smartSuggestions,
          ...followUpSuggestions.slice(0, 2)
        ].slice(0, 4);

        // Fallback to default if no suggestions generated
        const finalSuggestions = contextualPrompts.length > 0 ? 
          contextualPrompts : 
          chatbotData.prompts[detectedLang];

        setSuggestions(finalSuggestions);
        
        // Enhanced active service setting based on confidence
        if (generatedResponse.service) {
          setActiveService(generatedResponse.service);
        } else if (enhancedServiceDetection.confidence > 0.6 && enhancedServiceDetection.service) {
          setActiveService(enhancedServiceDetection.service);
        } else if (updatedServiceContext.currentService) {
          setActiveService(updatedServiceContext.currentService);
        }
        
        console.log('Enhanced response generated successfully:', {
          type: generatedResponse.type,
          service: generatedResponse.service,
          confidence: enhancedServiceDetection.confidence,
          method: enhancedServiceDetection.detectionMethod,
          alternatives: enhancedServiceDetection.alternativeServices.length,
          metadata: responseMetadata,
          conversationLength: chatMessages.length + 2,
        });
        
      } catch (error) {
        console.error('Error in enhanced response generation, falling back to basic processing:', error);
        
        // Enhanced fallback processing with detection results
        let responseData = processUserMessage(userMessage, chatbotData, detectedLang);
        let finalResponse = responseData.text;
        
        // Enhanced response with service context and pricing information (fallback)
        if (enhancedServiceDetection.service && isPricingInquiry(userMessage, detectedLang)) {
          const pricingResponse = generatePricingResponse(enhancedServiceDetection.service, detectedLang, pricingData);
          finalResponse = pricingResponse;
        } else if (enhancedServiceDetection.service && !isPricingInquiry(userMessage, detectedLang)) {
          const serviceResponse = getServiceResponse(enhancedServiceDetection.service, chatbotData, detectedLang);
          if (serviceResponse && serviceResponse !== responseData.text) {
            finalResponse = serviceResponse;
          }
        }
        
        // Add conversation insights for high engagement (fallback)
        const insights = getConversationInsights(updatedServiceContext);
        if (insights.insights.includes('Deep engagement detected')) {
          const engagementNote = detectedLang === 'sw' ? 
            '\n\n💡 Ninaona una maswali mengi. Je, ungependa kuongea na mtaalamu wetu moja kwa moja?' :
            '\n\n💡 I can see you have many questions. Would you like to speak with our specialist directly?';
          finalResponse += engagementNote;
        }
        
        // Update service context with fallback response info
        const fallbackContextWithLastResponse = {
          ...updatedServiceContext,
          lastResponse: {
            type: 'fallback',
            service: enhancedServiceDetection.service,
            text: finalResponse,
            timestamp: new Date().toISOString()
          }
        };

        setServiceContext(fallbackContextWithLastResponse);
        
        // Enhanced fallback message with detection info using conversation manager
        const fallbackBotMessageObj = {
          role: 'bot', 
          content: finalResponse,
          timestamp: new Date().toISOString(),
          language: detectedLang,
          serviceContext: updatedServiceContext.currentService,
          conversationDepth: updatedServiceContext.conversationDepth,
          insights: insights,
          fallbackUsed: true,
          enhancedDetection: enhancedServiceDetection,
          detectionSummary: getDetectionSummary(enhancedServiceDetection)
        };
        
        // Add fallback message using conversation manager
        setChatMessages(prev => {
          const updatedMessages = addMessageToConversation(prev, fallbackBotMessageObj);
          
          // Auto-save even on fallback
          saveConversationState(updatedMessages, updatedServiceContext, setActiveService, detectedLang);
          
          // Update stats after fallback response
          const newStats = getConversationStats(updatedMessages, updatedServiceContext);
          const newPatterns = detectConversationPatterns(updatedMessages);
          
          setConversationStats(newStats);
          setConversationPatterns(newPatterns);
          
          return updatedMessages;
        });
        
        // Smart suggestions even in fallback mode
        const fallbackSuggestions = generateSmartSuggestions(
          updatedServiceContext,
          updatedServiceContext.conversationDepth,
          detectedLang,
          userMessage,
          chatMessages,
          Object.keys(chatbotData.services || {})
        );

        setSuggestions(fallbackSuggestions.length > 0 ? 
          fallbackSuggestions : 
          (responseData.suggestions || chatbotData.prompts[detectedLang])
        );
        setActiveService(enhancedServiceDetection.service || updatedServiceContext.currentService);
      }
      
      setIsTyping(false);
    }, 1500);
    
  }, [
    message, isClosing, language, serviceContext, chatMessages, detectionHistory,
    setMessage, setServiceContext, setChatMessages, setIsTyping, setSuggestions,
    setActiveService, setDetectionHistory, setCurrentDetectionResult,
    setConversationStats, setConversationPatterns, maxMessages, chatEndRef, pricingData
  ]);

  return { handleMessageSend };
};

