
  
  // app/constants/navigation.js
  export const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];


  // app/data/index.js
// Main entry point for chatbot data

import { welcomeMessages } from './welcomeMessages';
import { defaultResponses } from './defaultResponses';
import { quickPrompts } from './quickPrompts';
import { serviceKeywords } from './serviceKeywords';
import { serviceDescriptions } from './serviceDescriptions';
import { faqs } from './faqs';
import { uiText } from './uiText';
import { contactInfo } from './contactInfo';
import { caseStudies } from './caseStudies';
import { testimonials } from './testimonials';
import { pricingData } from './pricingData';

import { portfolioProjects } from './portfolioProjects';


// Combine all data sources into a single export
export const chatbotData = {
  welcome: welcomeMessages,
  defaultResponse: defaultResponses,
  prompts: quickPrompts,
  serviceKeywords: serviceKeywords,
  serviceDescriptions: serviceDescriptions,
  faqs: faqs,
  ui: uiText,
  contactInfo: contactInfo,
  caseStudies: caseStudies,
  testimonials: testimonials,
  pricing: pricingData,
 
  portfolio: portfolioProjects,
 
  
  // Helper function to get response by language
  getResponseByLang(key, lang = 'en') {
    const langData = this[key][lang] || this[key]['en']; // Fallback to English
    return langData;
  },
  
  // Helper function to find service by keyword
  findServiceByKeyword(keyword, lang = 'en') {
    const lowercaseKeyword = keyword.toLowerCase();
    const services = Object.keys(this.serviceKeywords[lang]);
    
    for (const service of services) {
      const keywords = this.serviceKeywords[lang][service];
      if (keywords.some(k => lowercaseKeyword.includes(k.toLowerCase()))) {
        return service;
      }
    }
    return null;
  },
  
  // Helper function to get related FAQs for a service
  getRelatedFAQs(service, lang = 'en', limit = 2) {
    return this.faqs[lang]
      .filter(faq => {
        const serviceLower = service.toLowerCase();
        const questionLower = faq.question.toLowerCase();
        return questionLower.includes(serviceLower);
      })
      .slice(0, limit);
  },
  
  // Helper function to get related case studies
  getRelatedCaseStudies(service, lang = 'en', limit = 2) {
    return this.caseStudies[lang]
      .filter(cs => cs.services.includes(service))
      .slice(0, limit);
  },
  
  // Helper function to get testimonials by service
  getTestimonialsByService(service, lang = 'en', limit = 2) {
    return this.testimonials[lang]
      .filter(t => t.services.includes(service))
      .slice(0, limit);
  }
};