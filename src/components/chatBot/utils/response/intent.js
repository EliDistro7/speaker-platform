import { analyzeCasualInteraction } from "../casual/casualInteractionUtils";
import { calculateIntentStrength, getSuggestedAction } from "./helpers";
import { detectQuestionType } from "@/utils/context/common-questions/helpers";

import {
     contactIndicators,
     elaborationIndicators,
     locationIndicators,
     pricingIndicators,
     infoIndicators,
     serviceIndicators,
     bookingIndicators,
     urgencyIndicators,
     confirmationIndicators,
} from "./indicators"

import {
   servicePatterns,
   locationContactPatterns,
} from "./patterns";

/**
 * Analyze message intent for better response generation with enhanced question type detection
 * @param {string} message - User message
 * @param {string} language - Current language
 * @returns {Object} Intent analysis result
 */
export function analyzeMessageIntent(message, language) {
  const messageText = message.toLowerCase().trim();
  const casualAnalysis = analyzeCasualInteraction(message, language);
  
  // Detect question type using your existing detector
  const questionTypeAnalysis = detectQuestionType(message, language);
  const isQuestion = questionTypeAnalysis.type !== null || message.includes('?');
  
  // Get language-specific indicators
  const langContactIndicators = contactIndicators[language] || contactIndicators['en'];
  const langLocationIndicators = locationIndicators[language] || locationIndicators['en'];
  const langPricingIndicators = pricingIndicators[language] || pricingIndicators['en'];
  const langInfoIndicators = infoIndicators[language] || infoIndicators['en'];
  const langServiceIndicators = serviceIndicators[language] || serviceIndicators['en'];
  const langBookingIndicators = bookingIndicators[language] || bookingIndicators['en'];
  const langUrgencyIndicators = urgencyIndicators[language] || urgencyIndicators['en'];
  const langConfirmationIndicators = confirmationIndicators[language] || confirmationIndicators['en'];
  const langElaborationIndicators = elaborationIndicators[language] || elaborationIndicators['en'];

  // Basic intent detection
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

  // Pattern matching
  const langLocationPatterns = locationContactPatterns[language] || locationContactPatterns['en'];
  const langServicePatterns = servicePatterns[language] || servicePatterns['en'];
  
  const matchesLocationContactPattern = langLocationPatterns.some(pattern => pattern.test(messageText));
  const matchesServicePattern = langServicePatterns.some(pattern => pattern.test(messageText));
  
  // Enhanced intent detection using question type analysis
  let enhancedIntentFlags = {
    isContactRequest: isContactRequest || isLocationRequest || matchesLocationContactPattern || isBookingRequest,
    isPricingInquiry: isPricingInquiry,
    isServiceInquiry: isServiceInquiry || matchesServicePattern,
    isInfoSeeking: isInfoSeeking,
    isBookingRequest: isBookingRequest
  };

  // Override or enhance based on question type detection
  if (questionTypeAnalysis.type && questionTypeAnalysis.confidence > 50) {
    switch (questionTypeAnalysis.type) {
      case 'services':
        enhancedIntentFlags.isServiceInquiry = true;
        enhancedIntentFlags.isInfoSeeking = true;
        break;
      case 'pricing':
        enhancedIntentFlags.isPricingInquiry = true;
        break;
      case 'methodology':
        enhancedIntentFlags.isInfoSeeking = true;
        enhancedIntentFlags.isServiceInquiry = true; // Methodology is service-related
        break;
      case 'moreInfo':
        enhancedIntentFlags.isInfoSeeking = true;
        // If it's asking for more info about something specific, check context
        if (messageText.includes('service') || messageText.includes('huduma')) {
          enhancedIntentFlags.isServiceInquiry = true;
        }
        if (messageText.includes('price') || messageText.includes('cost') || messageText.includes('bei')) {
          enhancedIntentFlags.isPricingInquiry = true;
        }
        break;
    }
  }

  // Determine primary intent with enhanced logic
  let primaryIntent = 'general';
  let confidence = 0.5;
  
  if (casualAnalysis.isCasualInteraction) {
    primaryIntent = 'casual';
    confidence = 0.9;
  } else if (questionTypeAnalysis.type && questionTypeAnalysis.confidence > 70) {
    // High confidence question type detection takes priority
    primaryIntent = questionTypeAnalysis.type;
    confidence = Math.min(questionTypeAnalysis.confidence / 100, 0.95);
  } else if (enhancedIntentFlags.isContactRequest) {
    primaryIntent = 'contact';
    confidence = 0.85;
  } else if (enhancedIntentFlags.isPricingInquiry) {
    primaryIntent = 'pricing';
    confidence = 0.8;
  } else if (enhancedIntentFlags.isServiceInquiry || matchesServicePattern) {
    primaryIntent = 'services';
    confidence = 0.8;
  } else if (enhancedIntentFlags.isBookingRequest) {
    primaryIntent = 'booking';
    confidence = 0.85;
  } else if (enhancedIntentFlags.isInfoSeeking || isQuestion) {
    primaryIntent = 'information';
    confidence = 0.7;
  }
  
  // Boost confidence for urgent requests
  if (isUrgent) {
    confidence = Math.min(confidence + 0.1, 1.0);
  }

  // Boost confidence if question type analysis aligns with detected intent
  if (questionTypeAnalysis.type && 
      ((questionTypeAnalysis.type === 'services' && enhancedIntentFlags.isServiceInquiry) ||
       (questionTypeAnalysis.type === 'pricing' && enhancedIntentFlags.isPricingInquiry) ||
       (questionTypeAnalysis.type === 'methodology' && enhancedIntentFlags.isInfoSeeking))) {
    confidence = Math.min(confidence + 0.15, 1.0);
  }
  
  // Calculate intent strength based on multiple indicators
  const intentStrength = calculateIntentStrength({
    isContactRequest: enhancedIntentFlags.isContactRequest,
    isLocationRequest,
    isPricingInquiry: enhancedIntentFlags.isPricingInquiry,
    isInfoSeeking: enhancedIntentFlags.isInfoSeeking,
    isServiceInquiry: enhancedIntentFlags.isServiceInquiry,
    isBookingRequest: enhancedIntentFlags.isBookingRequest,
    isUrgent,
    matchesLocationContactPattern,
    matchesServicePattern,
    questionTypeConfidence: questionTypeAnalysis.confidence
  });

  return {
    // Core intent flags (enhanced)
    isContactRequest: enhancedIntentFlags.isContactRequest,
    isLocationRequest,
    isPricingInquiry: enhancedIntentFlags.isPricingInquiry,
    isInfoSeeking: enhancedIntentFlags.isInfoSeeking,
    isServiceInquiry: enhancedIntentFlags.isServiceInquiry,
    isBookingRequest: enhancedIntentFlags.isBookingRequest,
    isUrgent,
    isQuestion,
    
    // Question type analysis results
    questionType: questionTypeAnalysis.type,
    questionTypeConfidence: questionTypeAnalysis.confidence,
    questionMatches: questionTypeAnalysis.matches,
    
    // Casual interaction analysis
    isCasualInteraction: casualAnalysis.isCasualInteraction,
    casualType: casualAnalysis.interactionType,
    
    // Primary classification
    primaryIntent,
    confidence,
    intentStrength,
    
    // Contextual responses
    isConfirmation,
    isElaborationRequest,
    isContextualResponse: isConfirmation || isElaborationRequest,
    
    // Pattern matching results
    matchedLocationPattern: matchesLocationContactPattern,
    matchedServicePattern: matchesServicePattern,
    
    // Additional context
    requiresImmediateAttention: isUrgent || (enhancedIntentFlags.isBookingRequest && isUrgent),
    suggestedAction: getSuggestedAction(primaryIntent, isUrgent, enhancedIntentFlags.isBookingRequest),
    
    // Enhanced metadata for analytics
    metadata: {
      language,
      messageLength: message.length,
      hasMultipleIntents: [
        enhancedIntentFlags.isContactRequest, 
        enhancedIntentFlags.isPricingInquiry, 
        enhancedIntentFlags.isServiceInquiry, 
        enhancedIntentFlags.isBookingRequest
      ].filter(Boolean).length > 1,
      detectedPatterns: {
        location: matchesLocationContactPattern,
        service: matchesServicePattern,
        casual: casualAnalysis.isCasualInteraction,
        questionType: questionTypeAnalysis.type
      },
      questionTypeAnalysis: {
        type: questionTypeAnalysis.type,
        confidence: questionTypeAnalysis.confidence,
        matches: questionTypeAnalysis.matches
      },
      intentAlignment: {
        questionTypeMatchesIntent: questionTypeAnalysis.type && 
          ((questionTypeAnalysis.type === 'services' && enhancedIntentFlags.isServiceInquiry) ||
           (questionTypeAnalysis.type === 'pricing' && enhancedIntentFlags.isPricingInquiry) ||
           (questionTypeAnalysis.type === 'methodology' && enhancedIntentFlags.isInfoSeeking)),
        confidenceBoostApplied: questionTypeAnalysis.confidence > 50
      }
    }
  };
}