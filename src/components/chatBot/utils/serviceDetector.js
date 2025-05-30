// File: app/components/layout/ChatBot/utils/serviceDetector.js

import {serviceKeywords} from '@/data/chat/serviceKeywords';
import { serviceDescriptions } from '@/data/chat/serviceDescriptions';

import { detectServiceFromMessage, updateServiceContext } from '@/utils/serviceContextUtils';
import { findMatchingService } from '@/utils/ChatBotUtils';

/**
 * Enhanced service detection with confidence scoring using both keywords and descriptions
 * @param {string} userMessage - User's message
 * @param {string} language - Current language
 * @param {Object} serviceKeywords - Service keyword mappings
 * @param {Object} serviceDescriptions - Service description mappings  
 * @param {Object} previousContext - Previous service context
 * @returns {Object} Enhanced service detection result
 */
export function detectServiceWithConfidence(userMessage, language, serviceKeywords, serviceDescriptions, previousContext = null) {
  // Use existing utility for base detection
  const baseDetection = detectServiceFromMessage(userMessage, language);
  
  // Enhanced keyword matching with scoring
  const keywordResults = enhancedKeywordMatching(userMessage, language, serviceKeywords);
  
  // Description-based semantic matching
  const descriptionResults = descriptionBasedMatching(userMessage, language, serviceDescriptions);
  
  // Context-aware detection
  const contextualResults = contextAwareDetection(userMessage, previousContext, language);
  
  // Combine all results with weighted scoring
  const combinedResult = combineAllDetectionResults(
    baseDetection, 
    keywordResults, 
    descriptionResults, 
    contextualResults
  );
  
  return {
    service: combinedResult.service,
    confidence: combinedResult.confidence,
    matchedTerms: combinedResult.matchedTerms,
    alternativeServices: combinedResult.alternatives,
    contextInfluence: contextualResults.influence,
    detectionMethod: combinedResult.method,
    detectionBreakdown: combinedResult.breakdown
  };
}

/**
 * Enhanced keyword matching with weighted scoring
 * @param {string} message - User message
 * @param {string} language - Current language
 * @param {Object} serviceKeywords - Service keyword mappings
 * @returns {Object} Enhanced keyword matching results
 */
function enhancedKeywordMatching(message, language, serviceKeywords) {
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
  
  // Get services for the specified language
  const languageKeywords = serviceKeywords[language] || serviceKeywords['en'] || {};
  
  Object.keys(languageKeywords).forEach(service => {
    const keywords = languageKeywords[service] || [];
    serviceScores[service] = 0;
    matchedTerms[service] = [];
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const weight = determineKeywordWeight(keyword, service);
      
      // Exact phrase matching
      if (messageText.includes(keywordLower)) {
        const score = keywordWeights[weight];
        serviceScores[service] += score;
        matchedTerms[service].push({ 
          term: keyword, 
          type: 'exact_phrase', 
          weight, 
          score 
        });
      }
      
      // Individual word matching with partial scoring
      const keywordWords = keywordLower.split(/\s+/);
      const matchedWords = keywordWords.filter(word => 
        words.some(msgWord => 
          msgWord.includes(word) || 
          word.includes(msgWord) ||
          calculateSimilarity(msgWord, word) > 0.7
        )
      );
      
      if (matchedWords.length > 0 && matchedWords.length < keywordWords.length) {
        const partialScore = (matchedWords.length / keywordWords.length) * keywordWeights[weight] * 0.6;
        serviceScores[service] += partialScore;
        matchedTerms[service].push({ 
          term: keyword, 
          type: 'partial_match', 
          weight, 
          matchedWords,
          score: partialScore 
        });
      }
    });
  });
  
  return formatMatchingResults(serviceScores, matchedTerms, 'keyword');
}

/**
 * Description-based semantic matching
 * @param {string} message - User message
 * @param {string} language - Current language  
 * @param {Object} serviceDescriptions - Service description mappings
 * @returns {Object} Description-based matching results
 */
function descriptionBasedMatching(message, language, serviceDescriptions) {
  const messageText = message.toLowerCase();
  const words = messageText.split(/\s+/).filter(word => word.length > 2);
  const serviceScores = {};
  const matchedTerms = {};
  
  // Get descriptions for the specified language
  const languageDescriptions = serviceDescriptions[language] || serviceDescriptions['en'] || {};
  
  Object.keys(languageDescriptions).forEach(service => {
    const description = languageDescriptions[service];
    serviceScores[service] = 0;
    matchedTerms[service] = [];
    
    if (!description) return;
    
    // Extract searchable text from description
    const searchableTexts = [
      description.title,
      description.shortDescription,
      description.fullDescription,
      ...(description.keyBenefits || []),
      description.targetAudience
    ].filter(Boolean);
    
    const allDescriptionText = searchableTexts.join(' ').toLowerCase();
    const descriptionWords = allDescriptionText.split(/\s+/).filter(word => word.length > 2);
    
    // Calculate semantic similarity
    let totalMatches = 0;
    let significantMatches = 0;
    
    words.forEach(messageWord => {
      const exactMatch = descriptionWords.find(descWord => descWord === messageWord);
      if (exactMatch) {
        totalMatches += 1;
        significantMatches += 1;
        matchedTerms[service].push({
          term: messageWord,
          type: 'description_exact',
          context: 'semantic_match',
          score: 0.8
        });
        return;
      }
      
      // Partial word matching
      const partialMatch = descriptionWords.find(descWord => 
        descWord.includes(messageWord) || 
        messageWord.includes(descWord) ||
        calculateSimilarity(messageWord, descWord) > 0.75
      );
      
      if (partialMatch) {
        totalMatches += 0.6;
        matchedTerms[service].push({
          term: messageWord,
          matchedWith: partialMatch,
          type: 'description_partial',
          context: 'semantic_match',
          score: 0.6
        });
      }
      
      // Context-based matching (benefits, audience, etc.)
      if (description.keyBenefits && description.keyBenefits.some(benefit => 
        benefit.toLowerCase().includes(messageWord))) {
        totalMatches += 0.7;
        significantMatches += 0.5;
        matchedTerms[service].push({
          term: messageWord,
          type: 'benefit_match',
          context: 'key_benefits',
          score: 0.7
        });
      }
    });
    
    // Calculate overall description match score
    if (totalMatches > 0) {
      const baseScore = Math.min(totalMatches / words.length, 1.0);
      const significanceBoost = Math.min(significantMatches / words.length, 0.3);
      serviceScores[service] = Math.min(baseScore + significanceBoost, 1.0);
    }
  });
  
  return formatMatchingResults(serviceScores, matchedTerms, 'description');
}

/**
 * Calculate string similarity using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity ratio (0-1)
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Format matching results into consistent structure
 * @param {Object} serviceScores - Service scores object
 * @param {Object} matchedTerms - Matched terms object
 * @param {string} matchType - Type of matching performed
 * @returns {Object} Formatted results
 */
function formatMatchingResults(serviceScores, matchedTerms, matchType) {
  const sortedServices = Object.entries(serviceScores)
    .filter(([service, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);
  
  const bestMatch = sortedServices[0];
  const alternatives = sortedServices.slice(1, 4);
  
  return {
    service: bestMatch ? bestMatch[0] : null,
    confidence: bestMatch ? Math.min(bestMatch[1], 1.0) : 0,
    matchedTerms: bestMatch ? matchedTerms[bestMatch[0]] : [],
    alternatives: alternatives.map(([service, score]) => ({
      service,
      confidence: Math.min(score, 1.0),
      matchedTerms: matchedTerms[service] || []
    })),
    allScores: serviceScores,
    matchType
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
  if (keywordLower === serviceLower || keywordLower.includes(serviceLower)) {
    return 'exact';
  }
  
  // Primary service-specific terms
  const primaryTerms = [
    'consultation', 'strategy', 'development', 'design', 'marketing', 
    'analysis', 'training', 'coaching', 'assessment', 'leadership',
    'management', 'planning', 'optimization', 'implementation'
  ];
  if (primaryTerms.some(term => keywordLower.includes(term))) {
    return 'primary';
  }
  
  // Secondary descriptive terms
  const secondaryTerms = [
    'business', 'digital', 'online', 'professional', 'expert', 
    'solution', 'service', 'program', 'workshop', 'seminar'
  ];
  if (secondaryTerms.some(term => keywordLower.includes(term))) {
    return 'secondary';
  }
  
  // Contextual terms
  const contextualTerms = [
    'help', 'need', 'want', 'looking', 'interested', 'cost', 
    'price', 'support', 'assistance', 'guidance'
  ];
  if (contextualTerms.some(term => keywordLower.includes(term))) {
    return 'contextual';
  }
  
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
    en: ['more about', 'tell me more', 'what else', 'also', 'additionally', 'furthermore', 'and what about', 'details', 'explain'],
    sw: ['zaidi kuhusu', 'niambie zaidi', 'nini kingine', 'pia', 'kwa kuongeza', 'na nini kuhusu', 'maelezo', 'eleza']
  };
  
  // Context indicators that suggest switching services
  const switchingIndicators = {
    en: ['instead', 'rather', 'actually', 'different', 'change to', 'what about', 'switch to', 'other', 'alternative'],
    sw: ['badala', 'hasa', 'kweli', 'tofauti', 'badilisha', 'je nini kuhusu', 'hamisha', 'nyingine', 'mbadala']
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
 * Combine all detection results with weighted scoring
 * @param {Object} baseDetection - Base detection from existing utility
 * @param {Object} keywordResults - Enhanced keyword matching results
 * @param {Object} descriptionResults - Description-based matching results
 * @param {Object} contextualResults - Context-aware detection results
 * @returns {Object} Combined detection result
 */
function combineAllDetectionResults(baseDetection, keywordResults, descriptionResults, contextualResults) {
  // Define weights for different detection methods
  const weights = {
    base: 0.25,        // Existing utility weight
    keyword: 0.35,     // Keyword matching weight
    description: 0.3,  // Description matching weight
    context: 0.1       // Context influence weight
  };
  
  // Calculate combined confidence scores for each potential service
  const combinedScores = {};
  const allServices = new Set();
  const combinedMatchedTerms = {};
  
  // Add services from base detection
  if (baseDetection.service) {
    allServices.add(baseDetection.service);
    combinedScores[baseDetection.service] = (baseDetection.confidence || 0.5) * weights.base;
    combinedMatchedTerms[baseDetection.service] = [
      { source: 'base', terms: baseDetection.matchedTerms || [] }
    ];
  }
  
  // Add services from keyword detection
  if (keywordResults.service) {
    allServices.add(keywordResults.service);
    combinedScores[keywordResults.service] = 
      (combinedScores[keywordResults.service] || 0) + (keywordResults.confidence * weights.keyword);
    
    if (!combinedMatchedTerms[keywordResults.service]) {
      combinedMatchedTerms[keywordResults.service] = [];
    }
    combinedMatchedTerms[keywordResults.service].push({
      source: 'keyword',
      terms: keywordResults.matchedTerms
    });
  }
  
  // Add alternative services from keyword detection
  keywordResults.alternatives.forEach(alt => {
    allServices.add(alt.service);
    combinedScores[alt.service] = 
      (combinedScores[alt.service] || 0) + (alt.confidence * weights.keyword * 0.6);
    
    if (!combinedMatchedTerms[alt.service]) {
      combinedMatchedTerms[alt.service] = [];
    }
    combinedMatchedTerms[alt.service].push({
      source: 'keyword_alt',
      terms: alt.matchedTerms
    });
  });
  
  // Add services from description detection
  if (descriptionResults.service) {
    allServices.add(descriptionResults.service);
    combinedScores[descriptionResults.service] = 
      (combinedScores[descriptionResults.service] || 0) + (descriptionResults.confidence * weights.description);
    
    if (!combinedMatchedTerms[descriptionResults.service]) {
      combinedMatchedTerms[descriptionResults.service] = [];
    }
    combinedMatchedTerms[descriptionResults.service].push({
      source: 'description',
      terms: descriptionResults.matchedTerms
    });
  }
  
  // Add alternative services from description detection
  descriptionResults.alternatives.forEach(alt => {
    allServices.add(alt.service);
    combinedScores[alt.service] = 
      (combinedScores[alt.service] || 0) + (alt.confidence * weights.description * 0.6);
    
    if (!combinedMatchedTerms[alt.service]) {
      combinedMatchedTerms[alt.service] = [];
    }
    combinedMatchedTerms[alt.service].push({
      source: 'description_alt',
      terms: alt.matchedTerms
    });
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
  
  // Determine primary detection method used
  let detectionMethod = 'combined';
  if (keywordResults.confidence > 0.7) {
    detectionMethod = 'keyword_primary';
  } else if (descriptionResults.confidence > 0.6) {
    detectionMethod = 'description_primary';
  } else if (baseDetection.confidence > 0.6) {
    detectionMethod = 'base_primary';
  } else if (contextualResults.influence > 0.5) {
    detectionMethod = 'context_primary';
  }
  
  return {
    service: bestCombined ? bestCombined[0] : null,
    confidence: bestCombined ? Math.min(bestCombined[1], 1.0) : 0,
    matchedTerms: bestCombined ? combinedMatchedTerms[bestCombined[0]] : [],
    alternatives: alternatives.map(([service, score]) => ({
      service,
      confidence: Math.min(score, 1.0),
      matchedTerms: combinedMatchedTerms[service] || []
    })),
    method: detectionMethod,
    breakdown: {
      base: baseDetection,
      keyword: keywordResults,
      description: descriptionResults,
      contextual: contextualResults,
      combinedScores,
      weights
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
 * Get comprehensive service detection summary for debugging
 * @param {Object} detectionResult - Service detection result
 * @returns {string} Human-readable summary
 */
export function getDetectionSummary(detectionResult) {
  if (!validateServiceDetection(detectionResult)) {
    return 'Invalid detection result';
  }
  
  const { service, confidence, detectionMethod, alternativeServices, detectionBreakdown } = detectionResult;
  
  let summary = `🎯 Detected Service: ${service || 'None'} (${Math.round(confidence * 100)}% confidence)`;
  summary += `\n📊 Primary Method: ${detectionMethod}`;
  
  if (detectionBreakdown) {
    summary += '\n\n🔍 Detection Breakdown:';
    if (detectionBreakdown.keyword?.confidence > 0) {
      summary += `\n  • Keyword Match: ${Math.round(detectionBreakdown.keyword.confidence * 100)}%`;
    }
    if (detectionBreakdown.description?.confidence > 0) {
      summary += `\n  • Description Match: ${Math.round(detectionBreakdown.description.confidence * 100)}%`;
    }
    if (detectionBreakdown.base?.confidence > 0) {
      summary += `\n  • Base Detection: ${Math.round(detectionBreakdown.base.confidence * 100)}%`;
    }
    if (detectionBreakdown.contextual?.influence > 0) {
      summary += `\n  • Contextual Influence: ${Math.round(detectionBreakdown.contextual.influence * 100)}%`;
    }
  }
  
  if (alternativeServices && alternativeServices.length > 0) {
    summary += `\n\n🔀 Alternatives: ${alternativeServices.map(alt => 
      `${alt.service} (${Math.round(alt.confidence * 100)}%)`
    ).join(', ')}`;
  }
  
  return summary;
}