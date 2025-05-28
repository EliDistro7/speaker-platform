// app/data/projects.js
export const projects = [
    {
      title: 'Picha Zangu',
      description: 'A platform for photographers to store and sell images and event videos',
      url: 'https://www.pichazangu.store',
      image: '/pichazangu.jpg',
      technologies: ['Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB']
    },
    {
      title: 'AMKA Kijana',
      description: 'An NGO website focused on reproductive and mental health education',
      url: 'https://www.amkakijana.org',
      image: '/amka.jpg',
      technologies: ['React', 'Express', 'MySQL', 'Sass']
    },
    {
      title: 'Four Freyn',
      description: 'A company profile site for an agriculture business',
      url: 'https://www.fourfreyn.com',
      image: '/fourfreyn.jpg',
      technologies: ['Next.js', 'Firebase', 'Tailwind CSS', 'Framer Motion']
    },
    {
      title: 'KKK Tyombo',
      description: 'A church management system for a Lutheran congregation',
      url: 'https://www.kkktyombo.org',
      image: '/yombo.jpg',
      technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'Bootstrap']
    },
    {
      title: 'FutureHolders',
      description: 'Company website for FutureHolders Company Limited',
      url: 'https://blog-nextjs-app-puce.vercel.app',
      image: '/fh.jpg',
      technologies: ['React', 'GraphQL', 'Node.js', 'Material UI']
    }
  ];
  
  // app/data/services.js
  export const services = [
    {
      title: 'Website Development',
      description: 'Custom websites built with modern frameworks and best practices for performance and SEO.',
      icon: '💻'
    },
    {
      title: 'UI/UX Design',
      description: 'User-focused designs that create engaging, intuitive interfaces and experiences.',
      icon: '🎨'
    },
    {
      title: 'Professional Business Emails',
      description: 'Setup and management of professional email systems for your business.',
      icon: '📧'
    },
    {
      title: 'Social Media Management',
      description: 'Strategic content creation and management for your brands social media presence.',
      icon: '📱'
    },
    {
      title: 'E-commerce Solutions',
      description: 'Online stores with secure payment processing and inventory management.',
      icon: '🛒'
    },
    {
      title: 'Web Maintenance',
      description: 'Regular updates, security checks, and improvements to keep your site running smoothly.',
      icon: '🛠️'
    }
  ];
  
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