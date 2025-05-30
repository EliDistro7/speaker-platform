// Expanded conversation patterns
import { conversationPatterns } from './casualPatterns';

/**
 * Analyze if message is a casual interaction (greeting, goodbye, etc.)
 * @param {string} message - User message
 * @param {string} language - Current language
 * @returns {Object} Casual interaction analysis
 */
export function analyzeCasualInteraction(message, language) {
  const messageText = message.toLowerCase().trim();
  
  const langGreetings = conversationPatterns.greetingPatterns[language] || conversationPatterns.greetingPatterns['en'];
  const langGoodbyes = conversationPatterns.goodbyePatterns[language] || conversationPatterns.goodbyePatterns['en'];
  const langAppreciation = conversationPatterns.appreciationPatterns[language] || conversationPatterns.appreciationPatterns['en'];
  const langQuestions = conversationPatterns.questionPatterns[language] || conversationPatterns.questionPatterns['en'];
  const langAffirmations = conversationPatterns.affirmationPatterns[language] || conversationPatterns.affirmationPatterns['en'];
  const langConfusion = conversationPatterns.confusionPatterns[language] || conversationPatterns.confusionPatterns['en'];
  
  const isGreeting = langGreetings.some(pattern => pattern.test(messageText));
  const isGoodbye = langGoodbyes.some(pattern => pattern.test(messageText));
  const isAppreciation = langAppreciation.some(pattern => pattern.test(messageText));
  const isQuestion = langQuestions.some(pattern => pattern.test(messageText));
  const isAffirmation = langAffirmations.some(pattern => pattern.test(messageText));
  const isConfusion = langConfusion.some(pattern => pattern.test(messageText));
  
  const isCasualInteraction = isGreeting || isGoodbye || isAppreciation || isAffirmation || isConfusion;
  
  let interactionType = null;
  if (isGreeting) interactionType = 'greeting';
  else if (isGoodbye) interactionType = 'goodbye';
  else if (isAppreciation) interactionType = 'appreciation';
  else if (isAffirmation) interactionType = 'affirmation';
  else if (isConfusion) interactionType = 'confusion';
  
  return {
    isCasualInteraction,
    interactionType,
    isGreeting,
    isGoodbye,
    isAppreciation,
    isQuestion,
    isAffirmation,
    isConfusion
  };
}

/**
 * Generate casual interaction response
 * @param {Object} interactionAnalysis - Casual interaction analysis
 * @param {Object} serviceContext - Service context
 * @param {string} language - Current language
 * @returns {Object} Casual response
 */
export function generateCasualResponse(interactionAnalysis, serviceContext, language) {
  const { interactionType } = interactionAnalysis;
  
  let responseText = '';
  
  switch (interactionType) {
    case 'greeting':
      responseText = language === 'sw' ? 
        '👋 Hujambo! Karibu! Ninahitajika kukusaidia namna gani leo?' :
        '👋 Hello! Welcome! How can I help you today?';
      
      // Add context if returning user
      if (serviceContext.conversationDepth > 0) {
        const returningNote = language === 'sw' ? 
          '\n\nNinaona tumeongea hapo awali. Je, una swali lingine?' :
          '\n\nI see we\'ve chatted before. Do you have another question?';
        responseText += returningNote;
      }
      break;
      
    case 'goodbye':
      responseText = language === 'sw' ? 
        '👋 Kwaheri! Asante kwa mazungumzo. Karibu tena wakati wowote!' :
        '👋 Goodbye! Thanks for chatting. Feel free to come back anytime!';
      
      // Add summary if services were discussed
      if (serviceContext.serviceHistory.length > 0) {
        const summaryNote = language === 'sw' ? 
          `\n\n📋 Tumeongea kuhusu: ${serviceContext.serviceHistory.join(', ')}. Wasiliana nasi kwa maelezo zaidi!` :
          `\n\n📋 We discussed: ${serviceContext.serviceHistory.join(', ')}. Contact us for more details!`;
        responseText += summaryNote;
      }
      break;
      
    case 'appreciation':
      responseText = language === 'sw' ? 
        '😊 Karibu sana! Nimefurahi kukusaidia. Je, kuna kitu kingine?' :
        '😊 You\'re very welcome! I\'m glad I could help. Is there anything else?';
      
      // Encourage further engagement
      const encouragementNote = language === 'sw' ? 
        '\n\n💡 Kumbuka, unaweza kuniuliza chochote kuhusu huduma zetu wakati wowote.' :
        '\n\n💡 Remember, you can ask me anything about our services anytime.';
      responseText += encouragementNote;
      break;

    case 'affirmation':
      responseText = language === 'sw' ? 
        '✅ Vizuri! Tuendelee. Je, kuna kitu kingine unachohitaji?' :
        '✅ Great! Let\'s continue. Is there anything else you need?';
      break;

    case 'confusion':
      responseText = language === 'sw' ? 
        '🤔 Samahani kwa uwazi huo. Nitajaribu kueleza vizuri zaidi. Ni sehemu gani hasa unayohitaji kufafanuliwa?' :
        '🤔 Sorry for the confusion. Let me try to explain better. Which part specifically would you like me to clarify?';
      
      // Offer to restart or simplify
      const clarificationOffer = language === 'sw' ? 
        '\n\n💡 Au ungependa tuanze upya kwa njia rahisi zaidi?' :
        '\n\n💡 Or would you like me to start over with a simpler explanation?';
      responseText += clarificationOffer;
      break;
  }
  
  return {
    text: responseText,
    type: 'casual',
    interactionType,
    metadata: {
      conversationDepth: serviceContext.conversationDepth,
      servicesDiscussed: serviceContext.serviceHistory,
      casualInteraction: true
    }
  };
}