import {stopWords} from './stopwords';



/**
 * Preprocess message for better matching
 * @param {string} message - Raw user message
 * @param {string} language - Language code
 * @returns {string} - Cleaned message
 */
export const preprocessMessage = (message, language = 'en') => {
  if (!message) return '';
  
  return message
    .toLowerCase()
    .trim()
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove common punctuation that might interfere
    .replace(/[,.!?;:]/g, ' ')
    // Normalize hyphens and underscores
    .replace(/[-_]/g, ' ');
};

/**
 * Calculate keyword density and relevance score
 * @param {string} message - Preprocessed message
 * @param {Array} keywords - Keywords to search for
 * @param {string} language - Language code
 * @returns {Object} - Match details
 */
export const calculateKeywordScore = (message, keywords, language = 'en') => {
  const words = message.split(' ').filter(word => 
    word.length > 2 && !stopWords[language]?.includes(word)
  );
  
  const totalWords = words.length;
  let matchedKeywords = [];
  let totalMatches = 0;
  let exactMatches = 0;
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    
    // Exact phrase match (higher weight)
    if (message.includes(keywordLower)) {
      exactMatches++;
      matchedKeywords.push(keyword);
      totalMatches += 2; // Higher weight for exact matches
    }
    
    // Individual word matches
    const keywordWords = keywordLower.split(' ');
    const wordMatches = keywordWords.filter(kw => 
      words.some(word => word.includes(kw) || kw.includes(word))
    ).length;
    
    if (wordMatches > 0 && wordMatches === keywordWords.length) {
      if (!matchedKeywords.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
      totalMatches += wordMatches;
    }
  });
  
  // Calculate density score (matches per total words)
  const densityScore = totalWords > 0 ? (totalMatches / totalWords) * 100 : 0;
  
  return {
    matchedKeywords,
    totalMatches,
    exactMatches,
    densityScore,
    relevanceScore: exactMatches * 3 + totalMatches
  };
};
