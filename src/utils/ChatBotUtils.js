// app/utils/chatbotUtils.js


// app/utils/chatbotUtils.js

/**
 * Find matching service based on user message
 * @param {string} message - User message
 * @param {object} serviceKeywords - Keywords mapping for different services
 * @param {string} language - Current language
 * @returns {string|null} - Matching service title or null if no match
 */
export const findMatchingService = (message, serviceKeywords, language) => {
  if (!message || !serviceKeywords || !serviceKeywords[language]) {
    console.log('Missing parameters in findMatchingService:', { message, serviceKeywords, language });
    return null;
  }

  const lowerMsg = message.toLowerCase();
  
  // Sort service titles by keyword length (descending) to prioritize more specific matches
  const sortedServiceTitles = Object.entries(serviceKeywords[language])
    .sort((a, b) => {
      // Find the longest keyword in each service
      const longestA = a[1].reduce((max, kw) => Math.max(max, kw.length), 0);
      const longestB = b[1].reduce((max, kw) => Math.max(max, kw.length), 0);
      return longestB - longestA;
    })
    .map(entry => entry[0]);
  
  // First pass: look for exact matches with the longest keywords first
  for (const serviceTitle of sortedServiceTitles) {
    const keywords = serviceKeywords[language][serviceTitle];
    // Sort keywords by length (descending) to prioritize longer, more specific keywords
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    
    for (const keyword of sortedKeywords) {
      // Check for exact matches (as whole words)
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerMsg)) {
        console.log('Found exact match:', { serviceTitle, keyword });
        return serviceTitle;
      }
    }
  }
  
  // Second pass: look for partial matches if no exact match found
  for (const serviceTitle of sortedServiceTitles) {
    const keywords = serviceKeywords[language][serviceTitle];
    if (keywords.some(keyword => lowerMsg.includes(keyword.toLowerCase()))) {
      console.log('Found partial match:', { serviceTitle });
      return serviceTitle;
    }
  }
  
  return null;
};

/**
 * Get service response based on service title
 * @param {string} serviceTitle - Title of the service
 * @param {object} chatData - Chatbot text data
 * @param {string} language - Current language
 * @returns {string} - Response message
 */
export const getServiceResponse = (serviceTitle, chatData, language) => {
  console.log('getServiceResponse called with:', { serviceTitle, language });
  
  if (!serviceTitle || !chatData || !language) {
    console.error('Missing required parameters:', { serviceTitle, chatData, language });
    return chatData?.defaultResponse?.[language] || 'Sorry, I could not process your request.';
  }

  if (chatData.serviceDescriptions && 
      chatData.serviceDescriptions[language] && 
      chatData.serviceDescriptions[language][serviceTitle]) {
    
    const service = chatData.serviceDescriptions[language][serviceTitle];
    
    // Handle your complex object structure
    let responseText = `**${service.title || serviceTitle}**\n\n`;
    
    // Add short description
    if (service.shortDescription) {
      responseText += `${service.shortDescription}\n\n`;
    }
    
    // Add key benefits
    if (service.keyBenefits && service.keyBenefits.length > 0) {
      responseText += `**Key Benefits:**\n`;
      service.keyBenefits.forEach(benefit => {
        responseText += `• ${benefit}\n`;
      });
      responseText += '\n';
    }
    
    // Add delivery info
    if (service.deliveryFormats && service.deliveryFormats.length > 0) {
      responseText += `**Available as:** ${service.deliveryFormats.join(', ')}\n`;
    }
    
    if (service.duration) {
      responseText += `**Duration:** ${service.duration}\n`;
    }
    
    if (service.targetAudience) {
      responseText += `**Target Audience:** ${service.targetAudience}\n\n`;
    }
    
    // Add prompts for more info
    const moreInfoPrompt = chatData.ui?.moreInfo?.[language] || 'Would you like more detailed information?';
    const pricingPrompt = chatData.ui?.pricingInfo?.[language] || 'Would you like pricing information?';
    
    responseText += `${moreInfoPrompt}\n${pricingPrompt}`;
    
    return responseText;
  }
  
  // Fallback
  return chatData.defaultResponse?.[language] || 'I can help you with that. Please let me know what specific information you need.';
};

/**
 * Look for FAQ matches in user message
 * @param {string} message - User message
 * @param {object} faqs - FAQ data
 * @param {string} language - Current language
 * @returns {string|null} - FAQ answer or null if no match
 */
export const findFaqMatch = (message, faqs, language) => {
  if (!faqs || !faqs[language] || !Array.isArray(faqs[language])) {
    console.log('No FAQ data available for language:', language);
    return null;
  }
  
  const lowerMsg = message.toLowerCase();
  
  // Look for questions that contain keywords from the user's message
  const relevantFaqs = faqs[language].filter(faq => {
    if (!faq.question || !faq.answer) return false;
    
    const questionWords = faq.question.toLowerCase().split(/\s+/);
    // Return true if at least 2 significant words from the question appear in the message
    const significantMatches = questionWords
      .filter(word => word.length > 3) // Only consider words longer than 3 chars
      .filter(word => lowerMsg.includes(word.toLowerCase()))
      .length;
    
    return significantMatches >= 2;
  });
  
  if (relevantFaqs.length > 0) {
    // Return the most relevant FAQ (first match)
    return `**${relevantFaqs[0].question}**\n\n${relevantFaqs[0].answer}`;
  }
  
  return null;
};

/**
 * Check if user is asking for contact information
 * @param {string} message - User message
 * @param {string} language - Current language
 * @returns {boolean} - True if asking for contact info
 */
export const isAskingForContact = (message, language) => {
  if (!message) return false;
  
  const lowerMsg = message.toLowerCase();
  
  const contactKeywords = {
    en: ['contact', 'email', 'phone', 'call', 'reach', 'address', 'location', 'hours'],
    sw: ['wasiliana', 'barua pepe', 'simu', 'piga', 'fikia', 'anwani', 'mahali', 'saa']
  };
  
  const keywords = contactKeywords[language] || contactKeywords.en;
  return keywords.some(keyword => lowerMsg.includes(keyword));
};

/**
 * Format contact information response
 * @param {object} contactInfo - Contact info data
 * @param {string} language - Current language
 * @returns {string} - Formatted contact info
 */
export const getContactResponse = (contactInfo, language) => {
  if (!contactInfo || !contactInfo[language]) {
    return 'Contact information is currently unavailable.';
  }

  const info = contactInfo[language];
  
  return `**Contact Information:**\n\n` +
    `📧 Email: ${info.email || 'N/A'}\n` +
    `📞 Phone: ${info.phone || 'N/A'}\n` +
    `📍 Address: ${info.address || 'N/A'}\n` +
    `🕓 Business Hours: ${info.hours || 'N/A'}`;
};

/**
 * Detect language from user message
 * @param {string} message - User message
 * @param {object} langKeywords - Language detection keywords
 * @param {string} currentLanguage - Current language (fallback)
 * @returns {string} - Detected language code (default: 'en')
 */
export const detectLanguage = (message, langKeywords = null, currentLanguage = 'en') => {
  if (!message || message.trim() === '') return currentLanguage;
  
  // Default language detection keywords if not provided
  const keywords = langKeywords || {
    sw: ['habari', 'jambo', 'nafanya', 'nini', 'asante', 'shikamoo', 'tafadhali', 
         'kuhusu', 'huduma', 'bei', 'gani', 'tovuti', 'msaada', 'wasiliana'],
    fr: ['bonjour', 'merci', 'comment', 'ça va', 'salut', 'au revoir', 'oui', 'non'],
    es: ['hola', 'gracias', 'cómo', 'buenos días', 'buenas tardes', 'sí', 'no', 'por favor'],
  };
  
  const lowerMsg = message.toLowerCase();
  
  // Check for keywords in each language
  for (const [lang, langKeywords] of Object.entries(keywords)) {
    if (langKeywords.some(keyword => lowerMsg.includes(keyword))) {
      return lang;
    }
  }
  
  // Default to current language
  return currentLanguage;
};

/**
 * Generate suggestions based on user interaction context
 * @param {string} serviceTitle - Current service being discussed
 * @param {object} chatData - Chatbot data
 * @param {string} language - Current language
 * @returns {Array} - List of suggestion prompts
 */
export const generateSuggestions = (serviceTitle, chatData, language) => {
  // If discussing a specific service, offer related questions
  if (serviceTitle && chatData.ui) {
    const pricingInfo = chatData.ui.pricingInfo?.[language] || 'What are the prices for';
    
    return [
      `${pricingInfo} ${serviceTitle}?`,
      `What does ${serviceTitle} include?`,
      `Do you have examples of ${serviceTitle}?`,
      `How long does ${serviceTitle} take?`
    ];
  }
  
  // Otherwise return default prompts
  return chatData.prompts?.[language] || [];
};

/**
 * Process user message and generate appropriate response
 * @param {string} message - User message
 * @param {object} chatData - Chatbot data
 * @param {string} language - Current language
 * @returns {object} - Response object with text and suggestions
 */
export const processUserMessage = (message, chatData, language) => {
  console.log('Processing message:', { message, language });
  
  // If language is not specified, detect it
  const detectedLang = language || detectLanguage(message);
  
  // Validate chatData structure
  if (!chatData) {
    console.error('ChatData is missing');
    return {
      text: 'Sorry, I am currently unavailable. Please try again later.',
      suggestions: []
    };
  }
  
  // Check for contact information request
  if (isAskingForContact(message, detectedLang)) {
    console.log('Contact request detected');
    return {
      text: getContactResponse(chatData.contactInfo, detectedLang),
      suggestions: generateSuggestions(null, chatData, detectedLang)
    };
  }
  
  // Check for FAQ match
  const faqMatch = findFaqMatch(message, chatData.faqs, detectedLang);
  if (faqMatch) {
    console.log('FAQ match found');
    return {
      text: faqMatch,
      suggestions: generateSuggestions(null, chatData, detectedLang)
    };
  }
  
  // Check for service match
  const serviceMatch = findMatchingService(message, chatData.serviceKeywords, detectedLang);
  if (serviceMatch) {
    console.log('Service match found:', serviceMatch);
    return {
      text: getServiceResponse(serviceMatch, chatData, detectedLang),
      suggestions: generateSuggestions(serviceMatch, chatData, detectedLang)
    };
  }
  
  // Default response when no specific matches found  
  console.log('Using default response');
  return {
    text: chatData.defaultResponse?.[detectedLang] || 'How can I help you today?',
    suggestions: chatData.prompts?.[detectedLang] || []
  };
};












// 2. Updated usage in ChatBot component
const handleMessageSend = () => {
  if (!message.trim()) return;
  
  const userMessage = message.trim();
  const detectedLang = detectLanguage(userMessage, null, language); // Pass current language as fallback
  
  // Add user message
  setChatMessages(prev => [...prev, { 
    role: 'user', 
    content: userMessage,
    timestamp: new Date().toISOString(),
    language: detectedLang // Store detected language with the message
  }]);
  
  setMessage('');
  setIsTyping(true);
  
  // Process message and generate response
  setTimeout(() => {
    const responseData = processUserMessage(userMessage, chatbotData, detectedLang);
    
    // Consider updating the app's language if consistently detecting a different language
    // This is optional and depends on your application requirements
    if (detectedLang !== language && 
        chatMessages.filter(msg => msg.role === 'user' && msg.language === detectedLang).length >= 2) {
      // If user has sent multiple messages in the same non-current language, consider switching
      // This approach prevents accidental language switching
      // You might want to ask the user first before switching
      console.log(`User consistently using ${detectedLang}, consider switching language`);
      // Optional: setLanguage(detectedLang); - if you want to update the app language
    }
    
    setChatMessages(prev => [...prev, { 
      role: 'bot', 
      content: responseData.text,
      timestamp: new Date().toISOString(),
      language: detectedLang // Bot responds in same language
    }]);
    
    // Update suggestions and active service
    setSuggestions(responseData.suggestions);
    
    // Try to identify service from response
    if (responseData.text.startsWith('**')) {
      const serviceTitle = responseData.text.split('\n')[0].replace(/\*\*/g, '');
      if (chatbotData.serviceDescriptions[detectedLang]?.[serviceTitle]) {
        setActiveService(serviceTitle);
      }
    } else {
      setActiveService(null);
    }
    
    setIsTyping(false);
  }, 1500);
};



