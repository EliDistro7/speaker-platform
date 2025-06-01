
import { questionPatterns } from './patterns';

/**
 * Detect question type from user message
 * @param {string} message - User's message
 * @param {string} language - Language code
 * @returns {Object} - Question type and confidence
 */
export const detectQuestionType = (message, language = 'en') => {
  if (!message) return { type: null, confidence: 0 };

  const messageLower = message.toLowerCase();
  const results = [];

  Object.entries(questionPatterns).forEach(([questionType, langPatterns]) => {
    const patterns = langPatterns[language] || langPatterns.en;
    let matches = 0;
    
    patterns.forEach(pattern => {
      if (pattern.test(messageLower)) {
        matches++;
      }
    });

    if (matches > 0) {
      results.push({
        type: questionType,
        confidence: matches * 100, // Simple confidence based on pattern matches
        matches
      });
    }
  });

  // Sort by confidence and return best match
  results.sort((a, b) => b.confidence - a.confidence);
  return results.length > 0 ? results[0] : { type: null, confidence: 0 };
};
