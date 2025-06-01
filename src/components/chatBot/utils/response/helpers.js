import { faqs } from "@/data/chat/faqs";


/**
 * Calculate intent strength based on multiple indicators
 * @param {Object} indicators - Various intent indicators
 * @returns {number} Intent strength score (0-1)
 */
export function calculateIntentStrength(indicators) {
  const weights = {
    isContactRequest: 0.2,
    isLocationRequest: 0.15,
    isPricingInquiry: 0.15,
    isInfoSeeking: 0.1,
    isServiceInquiry: 0.15,
    isBookingRequest: 0.2,
    isUrgent: 0.1,
    matchesLocationContactPattern: 0.25,
    matchesServicePattern: 0.2
  };
  
  let totalScore = 0;
  let maxPossibleScore = 0;
  
  Object.entries(indicators).forEach(([key, value]) => {
    if (weights[key]) {
      maxPossibleScore += weights[key];
      if (value) {
        totalScore += weights[key];
      }
    }
  });
  
  return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
}

/**
 * Get suggested action based on intent analysis
 * @param {string} primaryIntent - Primary detected intent
 * @param {boolean} isUrgent - Whether request is urgent
 * @param {boolean} isBooking - Whether it's a booking request
 * @returns {string} Suggested action
 */
export function getSuggestedAction(primaryIntent, isUrgent, isBooking) {
  if (isUrgent && isBooking) return 'immediate_booking';
  if (isUrgent) return 'priority_response';
  if (isBooking) return 'schedule_appointment';
  
  switch (primaryIntent) {
    case 'contact': return 'provide_contact_info';
    case 'pricing': return 'provide_pricing';
    case 'service': return 'explain_services';
    case 'casual': return 'engage_casually';
    case 'information': return 'provide_information';
    default: return 'general_assistance';
  }
}

/**
 * Calculate confidence score for intent detection
 * @param {string} messageText - Processed message text
 * @param {string} primaryIntent - Detected primary intent
 * @param {string} language - Current language
 * @returns {number} Confidence score (0-1)
 */
export function calculateIntentConfidence(messageText, primaryIntent, language) {
  const words = messageText.split(/\s+/);
  let matchCount = 0;
  
  // Simple confidence calculation based on keyword matches
  const intentKeywords = {
    contact: {
      en: ['contact', 'call', 'email', 'phone', 'reach', 'speak', 'talk', 'meet'],
      sw: ['wasiliana', 'piga', 'barua pepe', 'simu', 'fikia', 'ongea', 'zungumza', 'kutana']
    },
    pricing: {
      en: ['price', 'cost', 'fee', 'charge', 'rate', 'budget', 'expensive', 'cheap'],
      sw: ['bei', 'gharama', 'ada', 'malipo', 'kiwango', 'bajeti', 'ghali', 'rahisi']
    },
    information: {
      en: ['what', 'how', 'why', 'when', 'where', 'tell', 'explain', 'describe'],
      sw: ['nini', 'jinsi', 'kwa nini', 'lini', 'wapi', 'ambia', 'eleza', 'elezea']
    }
  };
  
  const keywords = intentKeywords[primaryIntent] && intentKeywords[primaryIntent][language] ? 
    intentKeywords[primaryIntent][language] : [];
  
  keywords.forEach(keyword => {
    if (messageText.includes(keyword)) matchCount++;
  });
  
  return Math.min(matchCount / Math.max(words.length * 0.3, 1), 1.0);
}


/**
 * Generate contextual follow-up response based on previous conversation
 * @param {Object} serviceContext - Current service context
 * @param {Object} intentAnalysis - Intent analysis result
 * @param {Object} chatbotData - Chatbot configuration data
 * @param {string} language - Current language
 * @returns {Object} Contextual response
 */
export function generateContextualFollowUp(serviceContext, intentAnalysis, chatbotData, language) {
  const { lastResponse, currentService, conversationDepth } = serviceContext;
  
  if (intentAnalysis.isConfirmation && lastResponse?.type) {
    // Handle "yes" responses based on last response type
    switch (lastResponse.type) {
      case 'service':
        return generateServiceElaboration(currentService, chatbotData, language);
      case 'pricing':
        return generatePricingElaboration(currentService, language);
      case 'contact':
        return generateContactElaboration(chatbotData, language);
      default:
        return generateGeneralElaboration(serviceContext, language);
    }
  }
  
  if (intentAnalysis.isElaborationRequest) {
    if (currentService) {
      return generateServiceElaboration(currentService, chatbotData, language);
    }
    return generateGeneralGuidance(serviceContext, language);
  }
  
  return null;
}

/**
 * Generate detailed service information
 */
export function generateServiceElaboration(service, chatbotData, language) {
  const elaborationContent = language === 'sw' ? 
    `📚 MAELEZO ZAIDI KUHUSU ${service.toUpperCase()}:\n\n` +
    `🎯 Lengo: Kukuwezesha kupata ujuzi wa uongozi wa hali ya juu\n` +
    `⏱️ Muda: Kulingana na mahitaji yako\n` +
    `👥 Kwa: Viongozi na wanaotaka kuongoza\n\n` +
    `💡 Je, ungependa kujua zaidi kuhusu:\n` +
    `• Jinsi ya kuanza\n• Bei na mipango ya malipo\n• Mfumo wa masomo` :
    
    `📚 MORE DETAILS ABOUT ${service.toUpperCase()}:\n\n` +
    `🎯 Purpose: To help you develop high-level leadership skills\n` +
    `⏱️ Duration: Based on your needs\n` +
    `👥 For: Current and aspiring leaders\n\n` +
    `💡 Would you like to know more about:\n` +
    `• How to get started\n• Pricing and payment plans\n• Course structure`;

  return {
    text: elaborationContent,
    type: 'service_elaboration',
    service: service,
    metadata: { elaborationType: 'service_details' }
  };
}

/**
 * Generate pricing elaboration
 */
export function generatePricingElaboration(service, language) {
  const pricingDetails = language === 'sw' ? 
    `💰 MAELEZO ZAIDI YA BEI:\n\n` +
    `📊 Tunayo mipango tofauti:\n` +
    `• Mafunzo ya binafsi\n• Vikundi vidogo\n• Mipango ya kampuni\n\n` +
    `💳 Malipo:\n` +
    `• Malipo ya mara moja\n• Malipo kwa awamu\n• Mipango maalum\n\n` +
    `📞 Wasiliana nasi kwa bei maalum yako.` :
    
    `💰 DETAILED PRICING INFORMATION:\n\n` +
    `📊 We offer different packages:\n` +
    `• Individual training\n• Small groups\n• Corporate packages\n\n` +
    `💳 Payment options:\n` +
    `• One-time payment\n• Installment plans\n• Custom arrangements\n\n` +
    `📞 Contact us for your personalized quote.`;

  return {
    text: pricingDetails,
    type: 'pricing_elaboration',
    service: service,
    metadata: { elaborationType: 'pricing_details' }
  };
}

/**
 * Generate general guidance for getting started
 */
export function generateGeneralGuidance(serviceContext, language) {
  const guidanceContent = language === 'sw' ? 
    `🚀 JINSI YA KUANZA:\n\n` +
    `1️⃣ Chagua huduma unayohitaji\n` +
    `2️⃣ Wasiliana nasi kwa mazungumzo\n` +
    `3️⃣ Tupange mfumo unaokufaa\n` +
    `4️⃣ Anza safari yako ya maendeleo\n\n` +
    `📋 Huduma zetu kuu:\n` +
    `• Leadership courses\n• Executive coaching\n• Keynote speaking\n\n` +
    `❓ Je, ungependa kujua zaidi kuhusu huduma fulani?` :
    
    `🚀 HOW TO GET STARTED:\n\n` +
    `1️⃣ Choose the service you need\n` +
    `2️⃣ Contact us for consultation\n` +
    `3️⃣ We'll design a plan that fits you\n` +
    `4️⃣ Begin your development journey\n\n` +
    `📋 Our main services:\n` +
    `• Leadership courses\n• Executive coaching\n• Keynote speaking\n\n` +
    `❓ Would you like to know more about a specific service?`;

  return {
    text: guidanceContent,
    type: 'guidance',
    metadata: { elaborationType: 'getting_started' }
  };
}