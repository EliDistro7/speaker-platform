// File: utils/serviceContextUtils.js

import { pricingData } from '@/data/chat/pricingData';
import { serviceKeywords } from '@/data/chat/serviceKeywords';
import { serviceDescriptions } from '@/data/chat/serviceDescriptions';
import {serviceDetectionPatterns } from './patterns'
import { stopWords } from './stopwords';
import { preprocessMessage } from './helpers';
import { calculateKeywordScore } from './helpers';
import {detectServiceFromMessage} from './detect-service/index';

export {detectServiceFromMessage};





/**
 * Get multiple service suggestions with confidence scores
 * @param {string} userMessage - The user's message
 * @param {string} language - Current language (en/sw)
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} - Array of detection results
 */
export const getMultipleServiceSuggestions = (userMessage, language = 'en', maxResults = 3) => {
  if (!userMessage || typeof userMessage !== 'string') {
    return [];
  }

  const processedMessage = preprocessMessage(userMessage, language);
  const detectedServices = [];

  Object.entries(serviceDetectionPatterns).forEach(([serviceName, serviceData]) => {
    const langData = serviceData[language] || serviceData.en;
    const { keywords, patterns, negativePatterns = [] } = langData;

    const hasNegativeMatch = negativePatterns.some(pattern => 
      pattern.test(userMessage) || pattern.test(processedMessage)
    );
    
    if (hasNegativeMatch) return;

    const keywordAnalysis = calculateKeywordScore(processedMessage, keywords, language);
    
    let patternMatches = 0;
    patterns.forEach(pattern => {
      if (pattern.test(userMessage) || pattern.test(processedMessage)) {
        patternMatches++;
      }
    });

    const confidence = keywordAnalysis.relevanceScore + (patternMatches * 5);

    if (confidence > 0) {
      detectedServices.push({
        service: serviceName,
        confidence: Math.round(confidence * 100) / 100,
        matchedTerms: keywordAnalysis.matchedKeywords,
        details: {
          keywordMatches: keywordAnalysis.totalMatches,
          patternMatches,
          method: patternMatches > 0 ? 'pattern+keyword' : 'keyword-only'
        }
      });
    }
  });

  return detectedServices
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxResults);
};

/**
 * Validate service detection result
 * @param {Object} detectionResult - Result from detectServiceFromMessage
 * @returns {boolean} - Whether the detection is reliable
 */
export const isDetectionReliable = (detectionResult) => {
  if (!detectionResult || !detectionResult.service) {
    return false;
  }
  
  const { confidence, details } = detectionResult;
  
  // Consider reliable if:
  // - High confidence score (> 5)
  // - Has pattern matches
  // - Has multiple keyword matches or exact matches
  return confidence > 5 || 
         details.patternMatches > 0 || 
         details.exactMatches > 0 ||
         details.keywordMatches > 2;
};

/**
 * Update service context based on detected service and conversation history
 * @param {Object} currentContext - Current service context
 * @param {string} detectedService - Newly detected service
 * @param {string} userMessage - User's message
 * @returns {Object} - Updated service context
 */
export const updateServiceContext = (currentContext, detectedService, userMessage) => {
  const newContext = { ...currentContext };
  const timestamp = new Date().toISOString();

  if (detectedService) {
    // New service detected
    newContext.currentService = detectedService;
    newContext.lastServiceMention = timestamp;
    
    // Add to history if not already present
    if (!newContext.serviceHistory.includes(detectedService)) {
      newContext.serviceHistory.push(detectedService);
    }
    
    // Reset or increment conversation depth
    if (newContext.currentService !== detectedService) {
      newContext.conversationDepth = 1;
    } else {
      newContext.conversationDepth = Math.min(newContext.conversationDepth + 1, 10);
    }
  } else if (newContext.currentService) {
    // Continue with current service context
    newContext.conversationDepth = Math.min(newContext.conversationDepth + 1, 10);
  }

  // Add interaction to conversation flow
  newContext.conversationFlow = newContext.conversationFlow || [];
  newContext.conversationFlow.push({
    timestamp,
    userMessage: userMessage.substring(0, 100), // Truncate for storage
    detectedService,
    contextService: newContext.currentService
  });

  // Keep only last 20 interactions
  if (newContext.conversationFlow.length > 20) {
    newContext.conversationFlow = newContext.conversationFlow.slice(-20);
  }

  return newContext;
};

/**
 * Generate contextual prompts based on service and conversation depth
 * @param {string} serviceName - Current service
 * @param {number} conversationDepth - Depth of current conversation
 * @param {string} language - Current language
 * @param {Object} serviceContext - Full service context
 * @returns {Array} - Array of contextual prompts
 */
export const generateContextualPrompts = (serviceName, conversationDepth = 0, language = 'en', serviceContext = {}) => {
  if (!serviceName) {
    // Return general prompts if no service context
    return language === 'sw' ? [
      'Je, mnatoa huduma gani?',
      'Ni bei gani za huduma zenu?',
      'Je, mnaweza kunieleza zaidi?',
      'Ni jinsi gani ya kuwasiliana nanyi?'
    ] : [
      'What services do you offer?',
      'What are your pricing options?',
      'Can you tell me more?',
      'How can I contact you?'
    ];
  }

  const contextualPrompts = [];
  const serviceData = pricingData[language] && pricingData[language][serviceName];

  // Generate prompts based on conversation depth
  switch (conversationDepth) {
    case 0:
    case 1:
      // Initial inquiry prompts
      contextualPrompts.push(
        ...(language === 'sw' ? [
          `Je, ni bei gani za ${serviceName}?`,
          `Ni vifurushi gani mnavyo kwa ${serviceName}?`,
          `Je, mnaweza kunieleza zaidi kuhusu ${serviceName}?`,
          `${serviceName} inajumuisha nini?`
        ] : [
          `What are the pricing options for ${serviceName}?`,
          `What packages do you offer for ${serviceName}?`,
          `Can you tell me more about ${serviceName}?`,
          `What does ${serviceName} include?`
        ])
      );
      break;

    case 2:
    case 3:
      // Follow-up questions
      if (serviceData && serviceData.packages) {
        const packageNames = serviceData.packages.map(pkg => pkg.name);
        contextualPrompts.push(
          ...(language === 'sw' ? [
            `Je, tofauti ni nini kati ya ${packageNames[0]} na ${packageNames[1] || 'vifurushi vingine'}?`,
            `Ni kifurushi gani kinachofaa kwa biashara ndogo?`,
            `Je, mnatoa punguzo kwa mipango ya muda mrefu?`,
            'Je, mnaweza kubadilisha mipango?'
          ] : [
            `What's the difference between ${packageNames[0]} and ${packageNames[1] || 'other packages'}?`,
            `Which package is best for small businesses?`,
            `Do you offer discounts for long-term commitments?`,
            'Can you customize the packages?'
          ])
        );
      }
      break;

    default:
      // Deep conversation - implementation questions
      contextualPrompts.push(
        ...(language === 'sw' ? [
          'Je, mchakato wa kuanza ni upi?',
          'Je, mnaweza kutoa mifano ya kazi zilizofanywa?',
          'Ni nini kinahitajika kutoka kwangu?',
          'Je, mnaweza kuongea na wateja wengine wenu?',
          'Je, mnatoa dhamana ya huduma?'
        ] : [
          `What's the process to get started?`,
          'Can you provide examples of past work?',
          'What do you need from me to begin?',
          'Can I speak with some of your other clients?',
          'Do you offer any guarantees?'
        ])
      );
  }

  // Add service-specific contextual prompts
  const serviceSpecificPrompts = getServiceSpecificPrompts(serviceName, language, conversationDepth);
  contextualPrompts.push(...serviceSpecificPrompts);

  // Remove duplicates and return limited number
  const uniquePrompts = [...new Set(contextualPrompts)];
  return uniquePrompts.slice(0, 4);
};

/**
 * Get service-specific contextual prompts
 * @param {string} serviceName - Service name
 * @param {string} language - Language
 * @param {number} depth - Conversation depth
 * @returns {Array} - Service-specific prompts
 */
const getServiceSpecificPrompts = (serviceName, language, depth) => {
  const prompts = [];

  switch (serviceName) {
    case 'Keynote Speaking':
      prompts.push(
        ...(language === 'sw' ? [
          'Je, mnaweza kufanya mazungumzo ya mbali?',
          'Ni muda gani mnahitaji kwa maandalizi?',
          'Je, mnatoa rekodi za mazungumzo?',
          'Je, mnaweza kufanya mazungumzo kwa lugha za kiafrika?'
        ] : [
          'Do you offer virtual keynote presentations?',
          'How much preparation time do you need?',
          'Do you provide recordings of presentations?',
          'Can you present in local African languages?'
        ])
      );
      break;

    case 'Executive Coaching':
      prompts.push(
        ...(language === 'sw' ? [
          'Je, ni mara ngapi tutakutana?',
          'Je, mafunzo yanaweza kufanywa mtandaoni?',
          'Je, mnatoa tathmini ya uongozi?',
          'Je, mnafuata mchakato wa siri?'
        ] : [
          'How often do we meet for coaching sessions?',
          'Can coaching be done virtually?',
          'Do you provide leadership assessments?',
          'Do you follow a confidentiality process?'
        ])
      );
      break;

    case 'Corporate Training':
      prompts.push(
        ...(language === 'sw' ? [
          'Je, mnaweza kufanya mafunzo kwenye ofisi yetu?',
          'Ni idadi gani ya wafanyakazi mnayoweza kufundisha?',
          'Je, mnatoa vifaa vya mafunzo?',
          'Je, mnatoa uthibitisho wa mafunzo?'
        ] : [
          'Can you conduct training at our office?',
          'How many employees can you train at once?',
          'Do you provide training materials?',
          'Do you provide training certificates?'
        ])
      );
      break;

    case 'Workshop Facilitation':
      prompts.push(
        ...(language === 'sw' ? [
          'Je, warsha inaweza kuwa ya siku ngapi?',
          'Je, mnahitaji vifaa maalum?',
          'Je, mnaweza kufanya warsha ya timu ndogo?',
          'Je, mnatoa mafuatilio baada ya warsha?'
        ] : [
          'How long can workshops be?',
          'Do you need special equipment?',
          'Can you facilitate small team workshops?',
          'Do you provide follow-up after workshops?'
        ])
      );
      break;

    case 'Virtual Speaking':
      prompts.push(
        ...(language === 'sw' ? [
          'Je, mnahakikisha ubora wa sauti na picha?',
          'Je, mnasaidia na mipango ya teknolojia?',
          'Je, mnaweza kushiriki skrini?',
          'Je, mnatoa msaada wa kiufundi wakati wa tukio?'
        ] : [
          'Do you ensure good audio and video quality?',
          'Do you help with technical setup?',
          'Can you do screen sharing presentations?',
          'Do you provide technical support during events?'
        ])
      );
      break;

    default:
      // General service prompts
      prompts.push(
        ...(language === 'sw' ? [
          'Je, mnaweza kuongea zaidi kuhusu hii?',
          'Je, mna experience gani katika hii?',
          'Je, mnaweza kutoa maelezo zaidi?'
        ] : [
          'Can we discuss this service more?',
          'What experience do you have with this?',
          'Can you provide more details?'
        ])
      );
  }

  return prompts;
};

/**
 * Check if user is asking about pricing
 * @param {string} userMessage - User's message
 * @param {string} language - Current language
 * @returns {boolean} - Whether user is asking about pricing
 */
export const isPricingInquiry = (userMessage, language = 'en') => {
  const pricingKeywords = language === 'sw' ? 
    ['bei', 'gharama', 'malipo', 'pesa', 'kiasi', 'ada', 'kodi'] : 
    ['price', 'cost', 'pricing', 'fee', 'rate', 'charge', 'expensive', 'cheap', 'affordable'];
    
  return pricingKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword.toLowerCase())
  );
};

/**
 * Generate pricing response for a service
 * @param {string} serviceName - Service name
 * @param {string} language - Language
 * @param {Object} customPricingData - Optional custom pricing data
 * @returns {string} - Formatted pricing response
 */
export const generatePricingResponse = (serviceName, language = 'en', customPricingData = null) => {
  const pricing = customPricingData || pricingData;
  
  if (!pricing[language] || !pricing[language][serviceName]) {
    return language === 'sw' ? 
      'Samahani, taarifa za bei hazipo kwa sasa. Tafadhali wasiliana nasi kwa maelezo.' :
      'Sorry, pricing information is not available right now. Please contact us for details.';
  }

  const serviceData = pricing[language][serviceName];
  const currency = serviceData.currency || (language === 'sw' ? 'TSH' : 'USD');
  const packages = serviceData.packages || [];

  let pricingResponse = language === 'sw' ? 
    `**💰 Bei za ${serviceName}**\n\n` :
    `**💰 ${serviceName} Pricing**\n\n`;

  packages.forEach((pkg, index) => {
    const price = typeof pkg.price === 'number' ? pkg.price.toLocaleString() : pkg.price;
    pricingResponse += language === 'sw' ? 
      `**${pkg.name}** - ${currency} ${price}${pkg.billingCycle ? ` ${pkg.billingCycle}` : ''}\n${pkg.description || ''}\n\n` :
      `**${pkg.name}** - ${currency} ${price}${pkg.billingCycle ? ` ${pkg.billingCycle}` : ''}\n${pkg.description || ''}\n\n`;
  });

  if (serviceData.customNote) {
    pricingResponse += language === 'sw' ? 
      `📋 **Taarifa za Ziada:** ${serviceData.customNote}\n\n` :
      `📋 **Additional Info:** ${serviceData.customNote}\n\n`;
  }

  // Add call to action
  pricingResponse += language === 'sw' ? 
    `Je, ungependa kujua zaidi kuhusu kifurushi fulani?` :
    `Would you like to know more about any specific package?`;

  return pricingResponse;
};

/**
 * Get conversation insights from service context
 * @param {Object} serviceContext - Service context object
 * @returns {Object} - Conversation insights
 */
export const getConversationInsights = (serviceContext) => {
  if (!serviceContext) return { insights: [], recommendations: [] };

  const insights = [];
  const recommendations = [];

  // Analyze conversation depth
  if (serviceContext.conversationDepth > 5) {
    insights.push('Deep engagement detected');
    recommendations.push('Consider providing contact information or scheduling consultation');
  }

  // Analyze service interest
  if (serviceContext.serviceHistory && serviceContext.serviceHistory.length > 2) {
    insights.push('Multiple services of interest');
    recommendations.push('Suggest package deals or bundled services');
  }

  // Analyze conversation flow
  if (serviceContext.conversationFlow && serviceContext.conversationFlow.length > 0) {
    const recentInteractions = serviceContext.conversationFlow.slice(-5);
    const pricingMentions = recentInteractions.filter(interaction => 
      isPricingInquiry(interaction.userMessage, 'en') || isPricingInquiry(interaction.userMessage, 'sw')
    ).length;

    if (pricingMentions > 2) {
      insights.push('Strong pricing interest');
      recommendations.push('Provide detailed pricing comparison or offer consultation');
    }
  }

  return { insights, recommendations };
};

/**
 * Reset service context
 * @returns {Object} - Fresh service context
 */
export const createFreshServiceContext = () => ({
  currentService: null,
  serviceHistory: [],
  lastServiceMention: null,
  contextualPrompts: [],
  conversationDepth: 0,
  conversationFlow: [],
  lastResponse: null, 
});

/**
 * Validate service context object
 * @param {Object} context - Service context to validate
 * @returns {boolean} - Whether context is valid
 */
export const validateServiceContext = (context) => {
  if (!context || typeof context !== 'object') return false;
  
  const requiredFields = ['currentService', 'serviceHistory', 'conversationDepth'];
  return requiredFields.every(field => context.hasOwnProperty(field));
};

// Export all utility functions
export default {
  serviceDetectionPatterns,
  detectServiceFromMessage,
  updateServiceContext,
  generateContextualPrompts,
  isPricingInquiry,
  generatePricingResponse,
  getConversationInsights,
  createFreshServiceContext,
  validateServiceContext
};