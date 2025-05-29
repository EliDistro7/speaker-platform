// utils/suggestionEngine.js
import { serviceDescriptions } from '@/data/serviceDescriptions';

/**
 * Smart Suggestion Engine for ChatBot
 * Generates contextual, intelligent suggestions based on conversation state,
 * user intent, service context, and conversation depth
 */

// Core service mappings for better suggestion targeting
const SERVICE_CATEGORIES = {
  'Leadership Development': ['leadership', 'management', 'executive', 'team-leading'],
  'Innovation Management': ['innovation', 'creativity', 'transformation', 'digital-change'],
  'Team Building': ['team', 'collaboration', 'communication', 'group-dynamics'],
  'Digital Transformation': ['digital', 'technology', 'automation', 'digitization'],
  'Entrepreneurship': ['business', 'startup', 'venture', 'entrepreneurial'],
  'Organizational Culture': ['culture', 'workplace', 'values', 'organizational'],
  'Corporate Training': ['training', 'development', 'skills', 'learning'],
  'Executive Coaching': ['coaching', 'personal-development', 'one-on-one', 'mentoring'],
  'Speaking Engagements': ['speaking', 'keynote', 'presentation', 'conference']
};

// Intent patterns for better suggestion matching
const INTENT_PATTERNS = {
  pricing: ['price', 'cost', 'fee', 'rate', 'budget', 'investment', 'pricing', 'bei', 'gharama'],
  duration: ['time', 'long', 'duration', 'period', 'schedule', 'muda', 'mrefu'],
  process: ['how', 'process', 'steps', 'approach', 'method', 'jinsi', 'namna'],
  benefits: ['benefit', 'advantage', 'value', 'outcome', 'result', 'faida', 'manufaa'],
  comparison: ['compare', 'difference', 'versus', 'vs', 'alternative', 'linganisha'],
  customization: ['custom', 'tailor', 'specific', 'personalize', 'maalum', 'mahsusi'],
  contact: ['contact', 'reach', 'speak', 'call', 'email', 'wasiliana', 'piga'],
  location: ['where', 'location', 'venue', 'place', 'wapi', 'mahali']
};

// Conversation depth-based suggestion strategies
const DEPTH_STRATEGIES = {
  initial: 'discovery', // Help user explore services
  shallow: 'exploration', // Dive deeper into specific areas
  moderate: 'specification', // Get specific about requirements
  deep: 'conversion', // Move towards action/contact
  expert: 'consultation' // Advanced questions and next steps
};

/**
 * Generate intelligent suggestions based on conversation context
 */
export const generateSmartSuggestions = (
  serviceContext,
  conversationDepth = 0,
  language = 'en',
  lastUserMessage = '',
  chatMessages = [],
  availableServices = []
) => {
  try {
    const suggestions = [];
    const currentService = serviceContext?.currentService;
    const serviceHistory = serviceContext?.serviceHistory || [];
    
    // Determine conversation strategy based on depth
    const strategy = getConversationStrategy(conversationDepth);
    
    // Analyze user intent from last message
    const detectedIntent = analyzeUserIntent(lastUserMessage, language);
    
    // Generate suggestions based on current context
    if (currentService) {
      // Service-specific suggestions
      suggestions.push(...generateServiceSpecificSuggestions(
        currentService, 
        strategy, 
        detectedIntent, 
        language,
        conversationDepth
      ));
    } else {
      // General discovery suggestions
      suggestions.push(...generateDiscoverySuggestions(
        serviceHistory, 
        language,
        detectedIntent
      ));
    }
    
    // Add cross-selling suggestions if appropriate
    if (strategy === 'specification' || strategy === 'conversion') {
      suggestions.push(...generateCrossSellingSuggestions(
        currentService, 
        serviceHistory, 
        language
      ));
    }
    
    // Add action-oriented suggestions for deep conversations
    if (conversationDepth > 5) {
      suggestions.push(...generateActionSuggestions(language, currentService));
    }
    
    // Ensure variety and limit suggestions
    const finalSuggestions = diversifySuggestions(suggestions, 4);
    
    return finalSuggestions.length > 0 ? finalSuggestions : getDefaultSuggestions(language);
    
  } catch (error) {
    console.warn('Error generating smart suggestions:', error);
    return getDefaultSuggestions(language);
  }
};

/**
 * Generate service-specific contextual suggestions
 */
const generateServiceSpecificSuggestions = (
  serviceName, 
  strategy, 
  detectedIntent, 
  language,
  conversationDepth
) => {
  const suggestions = [];
  const serviceData = serviceDescriptions[language]?.[serviceName];
  
  if (!serviceData) return suggestions;
  
  // Intent-based suggestions
  switch (detectedIntent.primary) {
    case 'pricing':
      suggestions.push(
        language === 'sw' 
          ? `Bei za ${serviceName} ni ngapi?`
          : `What are the costs for ${serviceName}?`,
        language === 'sw'
          ? `Je, kuna gharama za ziada?`
          : `Are there any additional fees?`
      );
      break;
      
    case 'duration':
      suggestions.push(
        language === 'sw'
          ? `Mafunzo ya ${serviceName} yanachukua muda gani?`
          : `How long does ${serviceName} training take?`,
        language === 'sw'
          ? `Je, kuna ratiba tofauti?`
          : `Are there different schedule options?`
      );
      break;
      
    case 'process':
      suggestions.push(
        language === 'sw'
          ? `${serviceName} inafanyaje?`
          : `How does ${serviceName} work?`,
        language === 'sw'
          ? `Ni hatua zipi muhimu?`
          : `What are the key steps involved?`
      );
      break;
      
    case 'benefits':
      suggestions.push(
        language === 'sw'
          ? `Nini faida za ${serviceName}?`
          : `What are the benefits of ${serviceName}?`,
        language === 'sw'
          ? `Nitapata matokeo gani?`
          : `What results can I expect?`
      );
      break;
  }
  
  // Strategy-based suggestions
  switch (strategy) {
    case 'exploration':
      suggestions.push(
        language === 'sw'
          ? `Eleza zaidi kuhusu ${serviceName}`
          : `Tell me more about ${serviceName}`,
        language === 'sw'
          ? `Ni nani anayefaa kwa ${serviceName}?`
          : `Who is ${serviceName} suitable for?`
      );
      break;
      
    case 'specification':
      suggestions.push(
        language === 'sw'
          ? `Je, mnaweza kurekebisha ${serviceName} kwa mahitaji yangu?`
          : `Can you customize ${serviceName} for my needs?`,
        language === 'sw'
          ? `Ninahitaji timu ya watu 20, mnawezaje?`
          : `I need this for a team of 20, how would that work?`
      );
      break;
      
    case 'conversion':
      suggestions.push(
        language === 'sw'
          ? `Ningewezaje kuanza ${serviceName}?`
          : `How can I get started with ${serviceName}?`,
        language === 'sw'
          ? `Naomba kutayarisha mkutano`
          : `I'd like to schedule a consultation`
      );
      break;
  }
  
  // Depth-specific suggestions
  if (conversationDepth > 3) {
    suggestions.push(
      language === 'sw'
        ? `Je, mna mifano ya mafanikio ya ${serviceName}?`
        : `Do you have success stories for ${serviceName}?`,
      language === 'sw'
        ? `Ni vipi mnavyopima mafanikio?`
        : `How do you measure success?`
    );
  }
  
  return suggestions;
};

/**
 * Generate discovery suggestions for new conversations
 */
const generateDiscoverySuggestions = (serviceHistory, language, detectedIntent) => {
  const suggestions = [];
  const exploredServices = new Set(serviceHistory);
  
  // Popular service suggestions
  const popularServices = [
    'Leadership Development',
    'Team Building', 
    'Digital Transformation',
    'Corporate Training'
  ];
  
  // Filter out already explored services
  const unexploredServices = popularServices.filter(
    service => !exploredServices.has(service)
  );
  
  // Add service exploration suggestions
  unexploredServices.slice(0, 2).forEach(service => {
    suggestions.push(
      language === 'sw'
        ? `Niambie kuhusu ${service}`
        : `Tell me about ${service}`,
      language === 'sw'
        ? `${service} ni nini?`
        : `What is ${service}?`
    );
  });
  
  // Add general exploration suggestions
  suggestions.push(
    language === 'sw'
      ? 'Ni huduma gani mnazo?'
      : 'What services do you offer?',
    language === 'sw'
      ? 'Ninaweza kupata msaada gani?'
      : 'How can you help me?',
    language === 'sw'
      ? 'Nataka kujua bei za huduma'
      : 'I want to know about pricing'
  );
  
  return suggestions;
};

/**
 * Generate cross-selling suggestions
 */
const generateCrossSellingSuggestions = (currentService, serviceHistory, language) => {
  const suggestions = [];
  
  // Service combinations that work well together
  const serviceCombinations = {
    'Leadership Development': ['Executive Coaching', 'Team Building', 'Organizational Culture'],
    'Innovation Management': ['Digital Transformation', 'Entrepreneurship', 'Corporate Training'],
    'Team Building': ['Leadership Development', 'Organizational Culture', 'Corporate Training'],
    'Digital Transformation': ['Innovation Management', 'Corporate Training', 'Organizational Culture'],
    'Entrepreneurship': ['Innovation Management', 'Executive Coaching', 'Speaking Engagements'],
    'Organizational Culture': ['Leadership Development', 'Team Building', 'Corporate Training'],
    'Corporate Training': ['Leadership Development', 'Team Building', 'Digital Transformation'],
    'Executive Coaching': ['Leadership Development', 'Speaking Engagements'],
    'Speaking Engagements': ['Leadership Development', 'Executive Coaching']
  };
  
  const relatedServices = serviceCombinations[currentService] || [];
  const unexploredRelated = relatedServices.filter(
    service => !serviceHistory.includes(service)
  );
  
  if (unexploredRelated.length > 0) {
    const relatedService = unexploredRelated[0];
    suggestions.push(
      language === 'sw'
        ? `${relatedService} inarejea vipi na ${currentService}?`
        : `How does ${relatedService} relate to ${currentService}?`,
      language === 'sw'
        ? `Je, ${relatedService} ingasaidia pia?`
        : `Would ${relatedService} also be helpful?`
    );
  }
  
  return suggestions;
};

/**
 * Generate action-oriented suggestions for deep conversations
 */
const generateActionSuggestions = (language, currentService) => {
  const suggestions = [];
  
  suggestions.push(
    language === 'sw'
      ? 'Nataka kuongea na mtaalamu'
      : 'I want to speak with a specialist',
    language === 'sw'
      ? 'Ninaweza kupata quotation?'
      : 'Can I get a quotation?',
    language === 'sw'
      ? 'Tuanze mkutano wa kujadili'
      : 'Let\'s schedule a consultation'
  );
  
  if (currentService) {
    suggestions.push(
      language === 'sw'
        ? `Natayari kuanza ${currentService}`
        : `I'm ready to start ${currentService}`
    );
  }
  
  return suggestions;
};

/**
 * Analyze user intent from message
 */
const analyzeUserIntent = (message, language) => {
  const intent = {
    primary: 'general',
    confidence: 0,
    keywords: []
  };
  
  if (!message) return intent;
  
  const messageLower = message.toLowerCase();
  
  // Check each intent pattern
  for (const [intentName, patterns] of Object.entries(INTENT_PATTERNS)) {
    const matchingPatterns = patterns.filter(pattern => 
      messageLower.includes(pattern.toLowerCase())
    );
    
    if (matchingPatterns.length > 0) {
      const confidence = matchingPatterns.length / patterns.length;
      if (confidence > intent.confidence) {
        intent.primary = intentName;
        intent.confidence = confidence;
        intent.keywords = matchingPatterns;
      }
    }
  }
  
  return intent;
};

/**
 * Determine conversation strategy based on depth
 */
const getConversationStrategy = (depth) => {
  if (depth === 0) return 'discovery';
  if (depth <= 2) return 'exploration';
  if (depth <= 4) return 'specification';
  if (depth <= 7) return 'conversion';
  return 'consultation';
};

/**
 * Diversify suggestions to avoid repetition
 */
const diversifySuggestions = (suggestions, limit = 4) => {
  // Remove duplicates
  const uniqueSuggestions = [...new Set(suggestions)];
  
  // Shuffle and limit
  const shuffled = uniqueSuggestions.sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, limit);
};

/**
 * Get default fallback suggestions
 */
const getDefaultSuggestions = (language) => {
  return language === 'sw' ? [
    'Ni huduma gani mnazo?',
    'Nataka kujua bei za mafunzo',
    'Mnafanya vipi mafunzo?',
    'Naomba maelezo zaidi'
  ] : [
    'What services do you offer?',
    'I want to know about pricing',
    'How do you conduct training?',
    'I need more information'
  ];
};

/**
 * Generate suggestions based on conversation context and user behavior
 */
export const generateContextualSuggestions = (
  currentService,
  conversationDepth,
  language,
  serviceContext,
  userPreferences = {}
) => {
  return generateSmartSuggestions(
    serviceContext,
    conversationDepth,
    language,
    '',
    [],
    []
  );
};

/**
 * Generate follow-up suggestions after bot response
 */
export const generateFollowUpSuggestions = (
  botResponse,
  currentService,
  language,
  conversationDepth
) => {
  const suggestions = [];
  
  // Analyze bot response to generate relevant follow-ups
  const responseLower = botResponse.toLowerCase();
  
  if (responseLower.includes('price') || responseLower.includes('cost') || responseLower.includes('bei')) {
    suggestions.push(
      language === 'sw'
        ? 'Je, kuna diskaunti za kikundi?'
        : 'Are there group discounts?',
      language === 'sw'
        ? 'Mnakubali malipo kwa awamu?'
        : 'Do you accept installment payments?'
    );
  }
  
  if (responseLower.includes('duration') || responseLower.includes('time') || responseLower.includes('muda')) {
    suggestions.push(
      language === 'sw'
        ? 'Je, mna ratiba za weekendi?'
        : 'Do you have weekend schedules?',
      language === 'sw'
        ? 'Mnaweza kufanya mafunzo online?'
        : 'Can you do online training?'
    );
  }
  
  return suggestions.length > 0 ? suggestions : generateDefaultSuggestions(language);
};

/**
 * Generate industry-specific suggestions
 */
export const generateIndustrySuggestions = (industry, language) => {
  const industryMappings = {
    'technology': ['Digital Transformation', 'Innovation Management', 'Agile Training'],
    'healthcare': ['Leadership Development', 'Team Building', 'Quality Management'],
    'finance': ['Risk Management', 'Leadership Development', 'Compliance Training'],
    'manufacturing': ['Lean Management', 'Quality Control', 'Safety Training'],
    'education': ['Curriculum Development', 'Teaching Excellence', 'Student Engagement']
  };
  
  const relevantServices = industryMappings[industry?.toLowerCase()] || [];
  
  return relevantServices.map(service => 
    language === 'sw'
      ? `Niambie kuhusu ${service} kwa ${industry}`
      : `Tell me about ${service} for ${industry}`
  );
};

/**
 * Export all utility functions
 */
export {
  SERVICE_CATEGORIES,
  INTENT_PATTERNS,
  DEPTH_STRATEGIES,
  analyzeUserIntent,
  getConversationStrategy,
  diversifySuggestions,
  getDefaultSuggestions
};