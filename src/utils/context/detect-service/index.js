import {preprocessMessage} from '../helpers';
import {calculateKeywordScore} from '../helpers';
import {serviceDetectionPatterns} from '../patterns';


/**
 * Enhanced service detection with improved accuracy and confidence scoring
 * @param {string} userMessage - The user's message
 * @param {string} language - Current language (en/sw)
 * @returns {Object} - Detection result with service, confidence, and detailed match info
 */
export const detectServiceFromMessage = (userMessage, language = 'en') => {
  if (!userMessage || typeof userMessage !== 'string') {
    return { 
      service: null, 
      confidence: 0, 
      matchedTerms: [], 
      patterns: [],
      details: { method: 'none', reason: 'Invalid input' }
    };
  }

  const originalMessage = userMessage.trim();
  const processedMessage = preprocessMessage(userMessage, language);
  const detectedServices = [];

  // Check each service for matches
  Object.entries(serviceDetectionPatterns).forEach(([serviceName, serviceData]) => {
    const langData = serviceData[language] || serviceData.en;
    const { keywords, patterns, negativePatterns = [] } = langData;

    // Check for negative patterns first (exclusion logic)
    const hasNegativeMatch = negativePatterns.some(pattern => 
      pattern.test(originalMessage) || pattern.test(processedMessage)
    );
    
    if (hasNegativeMatch) {
      return; // Skip this service if negative pattern matches
    }

    // Calculate keyword matches with improved scoring
    const keywordAnalysis = calculateKeywordScore(processedMessage, keywords, language);
    
    // Check pattern matches
    let patternMatches = 0;
    const matchedPatterns = [];
    
    patterns.forEach(pattern => {
      if (pattern.test(originalMessage) || pattern.test(processedMessage)) {
        patternMatches++;
        matchedPatterns.push(pattern.source);
      }
    });

    // Enhanced confidence calculation
    const baseConfidence = keywordAnalysis.relevanceScore + (patternMatches * 5);
    const densityBonus = Math.min(keywordAnalysis.densityScore * 0.1, 2);
    const exactMatchBonus = keywordAnalysis.exactMatches * 2;
    
    const finalConfidence = baseConfidence + densityBonus + exactMatchBonus;

    if (finalConfidence > 0) {
      detectedServices.push({
        service: serviceName,
        confidence: Math.round(finalConfidence * 100) / 100, // Round to 2 decimal places
        matchedTerms: keywordAnalysis.matchedKeywords,
        patterns: matchedPatterns,
        details: {
          keywordMatches: keywordAnalysis.totalMatches,
          exactMatches: keywordAnalysis.exactMatches,
          patternMatches,
          densityScore: Math.round(keywordAnalysis.densityScore * 100) / 100,
          method: patternMatches > 0 ? 'pattern+keyword' : 'keyword-only'
        }
      });
    }
  });

  // Sort by confidence score (highest first)
  detectedServices.sort((a, b) => b.confidence - a.confidence);

  // Return the best match or null result
  if (detectedServices.length > 0) {
    const bestMatch = detectedServices[0];
    
    // Add additional context if confidence is low
    if (bestMatch.confidence < 3) {
      bestMatch.details.confidence_level = 'low';
      bestMatch.details.suggestion = 'Consider asking for clarification';
    } else if (bestMatch.confidence < 7) {
      bestMatch.details.confidence_level = 'medium';
    } else {
      bestMatch.details.confidence_level = 'high';
    }
    
    return bestMatch;
  }

  return {
    service: null,
    confidence: 0,
    matchedTerms: [],
    patterns: [],
    details: { 
      method: 'no-match', 
      reason: 'No service patterns or keywords detected',
      processedMessage: processedMessage.substring(0, 100) + (processedMessage.length > 100 ? '...' : '')
    }
  };
};
