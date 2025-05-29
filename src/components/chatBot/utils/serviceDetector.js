// File: app/components/layout/ChatBot/utils/serviceDetector.js

import { detectServiceFromMessage, updateServiceContext } from '@/utils/serviceContextUtils';
import { findMatchingService } from '@/utils/ChatBotUtils';

/**
 * Enhanced service detection with confidence scoring
 * @param {string} userMessage - User's message
 * @param {string} language - Current language
 * @param {Object} serviceKeywords - Service keyword mappings
 * @param {Object} previousContext - Previous service context
 * @returns {Object} Enhanced service detection result
 */
export function detectServiceWithConfidence(userMessage, language, serviceKeywords, previousContext = null) {
  // Use existing utility for base detection
  const baseDetection = detectServiceFromMessage(userMessage, language);
  
  // Enhanced keyword matching with scoring
  const enhancedResults = enhancedServiceMatching(userMessage, language, serviceKeywords);
  
  // Context-aware detection
  const contextualResults = contextAwareDetection(userMessage, previousContext, language);
  
  // Combine results with weighted scoring
  const combinedResult = combineDetectionResults(baseDetection, enhancedResults, contextualResults);
  
  return {
    service: combinedResult.service,
    confidence: combinedResult.confidence,
    matchedTerms: combinedResult.matchedTerms,
    alternativeServices: combinedResult.alternatives,
    contextInfluence: contextualResults.influence,
    detectionMethod: combinedResult.method
  };
}

/**
 * Enhanced service matching with weighted keyword scoring
 * @param {string} message - User message
 * @param {string} language - Current language
 * @param {Object} serviceKeywords - Service keyword mappings
 * @returns {Object} Enhanced matching results
 */
function enhancedServiceMatching(message, language, serviceKeywords) {
  const messageText = message.toLowerCase();
  const words = messageText.split(/\s+/);
  const serviceScores = {};
  const matchedTerms = {};
  
  // Define keyword weights based on importance
  const keywordWeights = {
    exact: 1.0,      // Exact service name match
    primary: 0.8,    // Primary keywords
    secondary: 0.6,  // Secondary keywords
    contextual: 0.4, // Context-related terms
    generic: 0.2     // Generic business terms
  };
  
  Object.keys(serviceKeywords).forEach(service => {
    const keywords = serviceKeywords[service][language] || serviceKeywords[service]['en'] || [];
    serviceScores[service] = 0;
    matchedTerms[service] = [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const weight = determineKeywordWeight(keyword, service);
      
      // Exact phrase matching
      if (messageText.includes(keywordLower)) {
        serviceScores[service] += keywordWeights[weight];
        matchedTerms[service].push({ term: keyword, type: 'phrase', weight });
      }
      
      // Individual word matching
      const keywordWords = keywordLower.split(/\s+/);
      const matchedWords = keywordWords.filter(word => 
        words.some(msgWord => msgWord.includes(word) || word.includes(msgWord))
      );
      
      if (matchedWords.length > 0) {
        const partialScore = (matchedWords.length / keywordWords.length) * keywordWeights[weight] * 0.7;
        serviceScores[service] += partialScore;
        matchedTerms[service].push({ 
          term: keyword, 
          type: 'partial', 
          weight, 
          matchedWords,
          score: partialScore 
        });
      }
    });
  });
  
  // Find best match
  const sortedServices = Object.entries(serviceScores)
    .filter(([service, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);
  
  const bestMatch = sortedServices[0];
  const alternatives = sortedServices.slice(1, 4); // Top 3 alternatives
  
  return {
    service: bestMatch ? bestMatch[0] : null,
    confidence: bestMatch ? Math.min(bestMatch[1], 1.0) : 0,
    matchedTerms: bestMatch ? matchedTerms[bestMatch[0]] : [],
    alternatives: alternatives.map(([service, score]) => ({
      service,
      confidence: Math.min(score, 1.0),
      matchedTerms: matchedTerms[service]
    })),
    allScores: serviceScores
  };
}

/**
 * Determine keyword weight based on its characteristics
 * @param {string} keyword - The keyword
 * @param {string} service - Service name
 * @returns {string} Weight category
 */
function determineKeywordWeight(keyword, service) {
  const keywordLower = keyword.toLowerCase();
  const serviceLower = service.toLowerCase();
  
  // Exact service name
  if (keywordLower === serviceLower) {
    return 'exact';
  }
  
  // Primary service-specific terms
  const primaryTerms = ['consultation', 'strategy', 'development', 'design', 'marketing', 'analysis'];
  if (primaryTerms.some(term => keywordLower.includes(term))) {
    return 'primary';
  }
  
  // Secondary descriptive terms
  const secondaryTerms = ['business', 'digital', 'online', 'professional', 'expert', 'solution'];
  if (secondaryTerms.some(term => keywordLower.includes(term))) {
    return 'secondary';
  }
  
  // Contextual terms
  const contextualTerms = ['help', 'need', 'want', 'looking', 'interested', 'cost', 'price'];
  if (contextualTerms.some(term => keywordLower.includes(term))) {
    return 'contextual';
  }
  
  // Default to generic
  return 'generic';
}

/**
 * Context-aware service detection based on conversation history
 * @param {string} message - Current user message
 * @param {Object} previousContext - Previous service context
 * @param {string} language - Current language
 * @returns {Object} Context-aware detection results
 */
function contextAwareDetection(message, previousContext, language) {
  if (!previousContext) {
    return { service: null, influence: 0, reasoning: 'No previous context' };
  }
  
  const messageText = message.toLowerCase();
  
  // Context indicators that suggest continuing current service discussion
  const continuationIndicators = {
    en: ['more about', 'tell me more', 'what else', 'also', 'additionally', 'furthermore', 'and what about'],
    sw: ['zaidi kuhusu', 'niambie zaidi', 'nini kingine', 'pia', 'kwa kuongeza', 'na nini kuhusu']
  };
  
  // Context indicators that suggest switching services
  const switchingIndicators = {
    en: ['instead', 'rather', 'actually', 'different', 'change to', 'what about', 'switch to'],
    sw: ['badala', 'hasa', 'kweli', 'tofauti', 'badilisha', 'je nini kuhusu', 'hamisha']
  };
  
  const langIndicators = continuationIndicators[language] || continuationIndicators['en'];
  const langSwitchIndicators = switchingIndicators[language] || switchingIndicators['en'];
  
  // Check for continuation indicators
  const hasContinuation = langIndicators.some(indicator => messageText.includes(indicator));
  if (hasContinuation && previousContext.currentService) {
    return {
      service: previousContext.currentService,
      influence: 0.7,
      reasoning: 'Continuation of current service discussion detected'
    };
  }
  
  // Check for switching indicators
  const hasSwitching = langSwitchIndicators.some(indicator => messageText.includes(indicator));
  if (hasSwitching) {
    return {
      service: null,
      influence: -0.3,
      reasoning: 'Service switching intent detected'
    };
  }
  
  // Default context influence based on conversation depth
  const contextInfluence = Math.min(previousContext.conversationDepth * 0.1, 0.5);
  
  return {
    service: previousContext.currentService,
    influence: contextInfluence,
    reasoning: `Context influence based on conversation depth: ${previousContext.conversationDepth}`
  };
}

/**
 * Combine detection results from multiple sources with weighted scoring
 * @param {Object} baseDetection - Base detection from existing utility
 * @param {Object} enhancedResults - Enhanced keyword matching results
 * @param {Object} contextualResults - Context-aware detection results
 * @returns {Object} Combined detection result
 */
function combineDetectionResults(baseDetection, enhancedResults, contextualResults) {
  // Define weights for different detection methods
  const weights = {
    base: 0.4,      // Existing utility weight
    enhanced: 0.5,  // Enhanced keyword matching weight
    context: 0.1    // Context influence weight
  };
  
  // Calculate combined confidence scores for each potential service
  const combinedScores = {};
  const allServices = new Set();
  
  // Add services from base detection
  if (baseDetection.service) {
    allServices.add(baseDetection.service);
    combinedScores[baseDetection.service] = (baseDetection.confidence || 0.5) * weights.base;
  }
  
  // Add services from enhanced detection
  if (enhancedResults.service) {
    allServices.add(enhancedResults.service);
    combinedScores[enhancedResults.service] = 
      (combinedScores[enhancedResults.service] || 0) + (enhancedResults.confidence * weights.enhanced);
  }
  
  // Add alternative services from enhanced detection
  enhancedResults.alternatives.forEach(alt => {
    allServices.add(alt.service);
    combinedScores[alt.service] = 
      (combinedScores[alt.service] || 0) + (alt.confidence * weights.enhanced * 0.5);
  });
  
  // Apply contextual influence
  if (contextualResults.service && contextualResults.influence > 0) {
    allServices.add(contextualResults.service);
    combinedScores[contextualResults.service] = 
      (combinedScores[contextualResults.service] || 0) + (contextualResults.influence * weights.context);
  }
  
  // Find best combined result
  const sortedCombined = Object.entries(combinedScores)
    .sort(([, a], [, b]) => b - a);
  
  const bestCombined = sortedCombined[0];
  const alternatives = sortedCombined.slice(1, 3);
  
  // Determine detection method used
  let detectionMethod = 'combined';
  if (enhancedResults.confidence > 0.7) {
    detectionMethod = 'enhanced_keywords';
  } else if (baseDetection.confidence > 0.6) {
    detectionMethod = 'base_detection';
  } else if (contextualResults.influence > 0.5) {
    detectionMethod = 'contextual';
  }
  
  return {
    service: bestCombined ? bestCombined[0] : null,
    confidence: bestCombined ? Math.min(bestCombined[1], 1.0) : 0,
    matchedTerms: enhancedResults.matchedTerms,
    alternatives: alternatives.map(([service, score]) => ({
      service,
      confidence: Math.min(score, 1.0)
    })),
    method: detectionMethod,
    breakdown: {
      base: baseDetection,
      enhanced: enhancedResults,
      contextual: contextualResults,
      combinedScores
    }
  };
}

/**
 * Validate service detection result
 * @param {Object} detectionResult - Service detection result to validate
 * @returns {boolean} Whether the result is valid
 */
export function validateServiceDetection(detectionResult) {
  if (!detectionResult || typeof detectionResult !== 'object') {
    return false;
  }
  
  const requiredFields = ['service', 'confidence', 'matchedTerms', 'alternativeServices', 'detectionMethod'];
  return requiredFields.every(field => detectionResult.hasOwnProperty(field));
}

/**
 * Get service detection summary for debugging
 * @param {Object} detectionResult - Service detection result
 * @returns {string} Human-readable summary
 */
export function getDetectionSummary(detectionResult) {
  if (!validateServiceDetection(detectionResult)) {
    return 'Invalid detection result';
  }
  
  const { service, confidence, detectionMethod, alternativeServices } = detectionResult;
  
  let summary = `Detected: ${service || 'None'} (${Math.round(confidence * 100)}% confidence)`;
  summary += `\nMethod: ${detectionMethod}`;
  
  if (alternativeServices && alternativeServices.length > 0) {
    summary += `\nAlternatives: ${alternativeServices.map(alt => 
      `${alt.service} (${Math.round(alt.confidence * 100)}%)`
    ).join(', ')}`;
  }
  
  return summary;
}