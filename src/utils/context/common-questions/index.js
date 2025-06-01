// File: utils/chatbotResponseHandlers.js

import { serviceDescriptions } from '@/data/chat/serviceDescriptions';
import { pricingData } from '@/data/chat/pricingData';
import { detectServiceFromMessage } from '../detect-service/index';
import { questionPatterns } from './patterns';
import { detectQuestionType } from './helpers';

/**
 * Enhanced chatbot response handlers for common questions
 */




/**
 * Generate services overview response
 * @param {string} language - Language code
 * @returns {Object} - Response object
 */
export const generateServicesResponse = (language = 'en') => {
  const responses = {
    en: {
      intro: "I offer a comprehensive range of professional development and business transformation services:",
      services: [
        {
          name: "🎯 Keynote Speaking",
          description: "Inspiring presentations for corporate events, conferences, and special occasions",
          highlight: "Perfect for motivating teams and sharing insights"
        },
        {
          name: "🛠️ Workshop Facilitation", 
          description: "Interactive training sessions from half-day to multi-day programs",
          highlight: "Hands-on learning with practical applications"
        },
        {
          name: "🎯 Executive Coaching",
          description: "One-on-one leadership development for C-suite and senior executives",
          highlight: "Personalized growth and strategic thinking"
        },
        {
          name: "🏢 Corporate Training",
          description: "Customized team and organizational development programs",
          highlight: "Scalable solutions for entire organizations"
        },
        {
          name: "💻 Virtual Speaking",
          description: "Online presentations, webinars, and remote training sessions",
          highlight: "Flexible delivery for global audiences"
        },
        {
          name: "🚀 Leadership Development",
          description: "Comprehensive programs to build exceptional leaders",
          highlight: "Transform leadership capabilities at all levels"
        },
        {
          name: "💡 Innovation Management",
          description: "Design thinking and creative problem-solving workshops",
          highlight: "Foster innovation culture and breakthrough thinking"
        }
      ],
      outro: "Each service is customized to your specific needs and objectives. Would you like to know more about any particular service?"
    },
    sw: {
      intro: "Ninatoa huduma mbalimbali za maendeleo ya kitaaluma na mabadiliko ya kibiashara:",
      services: [
        {
          name: "🎯 Hotuba Kuu",
          description: "Mazungumzo ya kuvutia kwa matukio ya makampuni, mikutano, na hafla maalum",
          highlight: "Bora kwa kuhamasisha timu na kushiriki maarifa"
        },
        {
          name: "🛠️ Uongozaji wa Warsha",
          description: "Vipindi vya mafunzo ya kushirikishana kutoka nusu siku hadi programu za siku nyingi",
          highlight: "Kujifunza kwa vitendo na matumizi ya kimsingi"
        },
        {
          name: "🎯 Mafunzo ya Uongozi wa Juu",
          description: "Maendeleo ya uongozi ya mtu mmoja kwa wakurugenzi wakuu na wakuu",
          highlight: "Ukuaji wa kibinafsi na ufikirisho wa kimkakati"
        }
      ],
      outro: "Kila huduma imepangwa kulingana na mahitaji yako maalum. Ungependa kujua zaidi kuhusu huduma yoyote?"
    }
  };

  return responses[language] || responses.en;
};

/**
 * Generate pricing information response
 * @param {string} service - Specific service (optional)
 * @param {string} language - Language code
 * @returns {Object} - Response object
 */
export const generatePricingResponse = (service = null, language = 'en') => {
  const responses = {
    en: {
      general: {
        intro: "My pricing is flexible and depends on several factors:",
        factors: [
          "📅 Duration (half-day, full-day, or multi-day programs)",
          "👥 Audience size and complexity",
          "📍 Location (local, national, or international)",
          "🎯 Customization level required",
          "📞 Delivery format (in-person vs. virtual)"
        ],
        ranges: {
          "Keynote Speaking": "$2,500 - $15,000+ per event",
          "Workshop Facilitation": "$3,500 - $12,000+ per day", 
          "Executive Coaching": "$300 - $800+ per hour",
          "Corporate Training": "$5,000 - $25,000+ per program",
          "Virtual Speaking": "$1,500 - $8,000+ per session"
        },
        outro: "I'd be happy to provide a detailed quote based on your specific requirements. What type of service are you interested in?"
      },
      specific: "For {service}, pricing typically ranges from {range}. The final investment depends on your specific needs, duration, and customization requirements."
    },
    sw: {
      general: {
        intro: "Bei yangu ni ya kubadilika na inategemea mambo kadhaa:",
        factors: [
          "📅 Muda (nusu siku, siku nzima, au programu za siku nyingi)",
          "👥 Ukubwa wa hadhira na ugumu",
          "📍 Mahali (ndani, kitaifa, au kimataifa)",
          "🎯 Kiwango cha ubinafsishaji kinachohitajika",
          "📞 Njia ya utoaji (ana kwa ana au mtandaoni)"
        ],
        outro: "Ningefurahi kutoa nukuu ya kina kulingana na mahitaji yako maalum. Ni aina gani ya huduma unayoipenda?"
      }
    }
  };

  return responses[language] || responses.en;
};

/**
 * Generate methodology/approach response
 * @param {string} service - Specific service (optional)
 * @param {string} language - Language code
 * @returns {Object} - Response object
 */
export const generateMethodologyResponse = (service = null, language = 'en') => {
  const responses = {
    en: {
      general: {
        intro: "My approach is based on proven methodologies and practical application:",
        principles: [
          "🎯 **Needs Assessment**: Understanding your specific challenges and objectives",
          "📋 **Customized Design**: Tailoring content and delivery to your context",
          "🤝 **Interactive Engagement**: Participatory learning with real-world applications",
          "📊 **Measurable Outcomes**: Setting clear objectives and success metrics",
          "🔄 **Continuous Support**: Follow-up and reinforcement for lasting impact"
        ],
        methods: [
          "**Experiential Learning**: Learning through doing and reflection",
          "**Case Studies**: Real-world examples and scenarios",
          "**Group Discussions**: Peer learning and knowledge sharing",
          "**Practical Tools**: Actionable frameworks and templates",
          "**Individual Coaching**: Personalized guidance and feedback"
        ],
        outro: "Each program is designed to be engaging, practical, and results-oriented. Would you like to know more about the approach for a specific service?"
      },
      specific: {
        "Keynote Speaking": "My keynotes combine storytelling, research-backed insights, and interactive elements to create memorable experiences that inspire action.",
        "Workshop Facilitation": "Workshops use a blend of instruction, group activities, case studies, and hands-on practice to ensure practical skill development.",
        "Executive Coaching": "Coaching sessions follow a structured process of assessment, goal-setting, skill development, and accountability tracking.",
        "Corporate Training": "Training programs are designed with pre-assessment, modular delivery, skill practice, and post-training reinforcement."
      }
    },
    sw: {
      general: {
        intro: "Mbinu yangu inategemea njia zilizothibitishwa na matumizi ya kimsingi:",
        principles: [
          "🎯 **Tathmini ya Mahitaji**: Kuelewa changamoto na malengo yako maalum",
          "📋 **Muundo wa Kibinafsi**: Kurekebisha maudhui na utoaji kulingana na mazingira yako",
          "🤝 **Ushiriki wa Kuvutia**: Kujifunza kwa kushiriki na matumizi ya kiulimwengu halisi",
          "📊 **Matokeo Yanayoweza Kupimwa**: Kuweka malengo wazi na vipimo vya mafanikio"
        ],
        outro: "Kila programu imeundwa kuwa ya kuvutia, ya kimsingi, na inayolenga matokeo. Ungependa kujua zaidi kuhusu mbinu kwa huduma maalum?"
      }
    }
  };

  const response = responses[language] || responses.en;
  
  if (service && response.specific && response.specific[service]) {
    return {
      intro: response.specific[service],
      isSpecific: true
    };
  }
  
  return response.general;
};

/**
 * Generate "more information" response
 * @param {string} context - Detected service context (optional)
 * @param {string} language - Language code
 * @returns {Object} - Response object
 */
export const generateMoreInfoResponse = (context = null, language = 'en') => {
  const responses = {
    en: {
      general: {
        intro: "I'd be happy to provide more detailed information! Here's what you can learn about:",
        options: [
          "📋 **Specific Services**: Detailed breakdown of each offering",
          "💰 **Pricing & Investment**: Customized quotes for your needs",
          "📅 **Scheduling & Availability**: Timeline and booking process",
          "🎯 **Methodology**: How I approach training and development",
          "📈 **Success Stories**: Case studies and client testimonials",
          "🤝 **Next Steps**: How to get started with your project"
        ],
        questions: [
          "What specific service interests you most?",
          "What are your main objectives or challenges?",
          "When are you looking to implement training or speaking?",
          "What's your preferred format (in-person, virtual, hybrid)?"
        ]
      },
      contextual: {
        "Keynote Speaking": "For keynote speaking, I can provide details about topics, audience customization, technical requirements, and booking process.",
        "Workshop Facilitation": "For workshops, I can share information about formats, duration options, participant materials, and learning outcomes.",
        "Executive Coaching": "For executive coaching, I can explain the coaching process, assessment tools, session structure, and success metrics."
      }
    },
    sw: {
      general: {
        intro: "Ningefurahi kutoa taarifa za kina zaidi! Hivi ndivyo unavyoweza kujifunza kuhusu:",
        options: [
          "📋 **Huduma Maalum**: Maelezo ya kina ya kila toleo",
          "💰 **Bei na Uwekezaji**: Nukuu zilizobinafsishwa kwa mahitaji yako",
          "📅 **Ratiba na Upatikanaji**: Mstari wa wakati na mchakato wa kuhifadhi",
          "🎯 **Mbinu**: Jinsi ninavyoshughulikia mafunzo na maendeleo"
        ],
        questions: [
          "Ni huduma gani maalum inayokuvutia zaidi?",
          "Ni malengo au changamoto zako kuu gani?",
          "Ni lini unatafuta kutekeleza mafunzo au mazungumzo?",
          "Ni muundo gani unaoupendelea (ana kwa ana, mtandaoni, mchanganyiko)?"
        ]
      }
    }
  };

  const response = responses[language] || responses.en;
  
  if (context && response.contextual && response.contextual[context]) {
    return {
      ...response.general,
      contextSpecific: response.contextual[context],
      hasContext: true
    };
  }
  
  return response.general;
};

/**
 * Main response handler that combines question detection and service context
 * @param {string} userMessage - User's message
 * @param {string} language - Language code
 * @returns {Object} - Complete response object
 */
export const handleCommonQuestions = (userMessage, language = 'en') => {
  // Detect question type
  const questionType = detectQuestionType(userMessage, language);
  
  // Detect service context
  const serviceContext = detectServiceFromMessage(userMessage, language);
  
  let response = {
    questionType: questionType.type,
    confidence: questionType.confidence,
    serviceContext: serviceContext.service,
    serviceConfidence: serviceContext.confidence,
    response: null,
    suggestedActions: []
  };

  // Generate appropriate response based on question type
  switch (questionType.type) {
    case 'services':
      response.response = generateServicesResponse(language);
      response.suggestedActions = ['show_pricing', 'learn_methodology', 'book_consultation'];
      break;
      
    case 'pricing':
      response.response = generatePricingResponse(serviceContext.service, language);
      response.suggestedActions = ['request_quote', 'schedule_call', 'view_services'];
      break;
      
    case 'methodology':
      response.response = generateMethodologyResponse(serviceContext.service, language);
      response.suggestedActions = ['see_examples', 'book_consultation', 'request_proposal'];
      break;
      
    case 'moreInfo':
      response.response = generateMoreInfoResponse(serviceContext.service, language);
      response.suggestedActions = ['specific_service', 'pricing_info', 'schedule_call'];
      break;

        case 'contact':
      response.response = generateContactResponse(language);
      response.suggestedActions = ['schedule_call', 'send_email', 'connect_linkedin'];
      break;
      
    case 'timeline':
      response.response = generateTimelineResponse(serviceContext.service, language);
      response.suggestedActions = ['book_consultation', 'discuss_urgency', 'flexible_scheduling'];
      break;
      
    case 'location':
      response.response = generateLocationResponse(language);
      response.suggestedActions = ['discuss_format', 'check_travel', 'virtual_demo'];
      break;
      
    case 'qualifications':
      response.response = generateQualificationsResponse(language);
      response.suggestedActions = ['see_testimonials', 'view_case_studies', 'book_consultation'];
      break;
      
    default:
      // If no specific question type detected, provide general help
      response.response = {
        intro: language === 'sw' ? 
          "Samahani, sijaelewa vizuri swali lako. Je, unaweza kuuliza kwa njia nyingine?" :
          "I'd be happy to help! Could you clarify what you'd like to know about?",
        suggestions: language === 'sw' ? [
          "Huduma gani mnazotoa?",
          "Bei zenu ni ngapi?", 
          "Mnafanyaje mafunzo?",
          "Nataka maelezo zaidi"
        ] : [
          "What services do you offer?",
          "What are your pricing rates?",
          "How do you conduct training?",
          "I need more information"
        ]
      };
      response.suggestedActions = ['show_services', 'show_pricing', 'book_consultation'];
  }

  return response;
};

/**
 * Format response for display in chatbot
 * @param {Object} responseObj - Response object from handleCommonQuestions
 * @param {string} language - Language code
 * @returns {string} - Formatted message for display
 */
export const formatResponseForDisplay = (responseObj, language = 'en') => {
  const { response, serviceContext, questionType } = responseObj;
  
  if (!response) return '';

  let formattedMessage = '';

  // Add intro
  if (response.intro) {
    formattedMessage += response.intro + '\n\n';
  }

  // Add main content based on response type
  if (response.services) {
    response.services.forEach(service => {
      formattedMessage += `${service.name}\n${service.description}\n*${service.highlight}*\n\n`;
    });
  }

   // Add contact methods
  if (response.contactMethods) {
    response.contactMethods.forEach(contact => {
      formattedMessage += `${contact.method}: ${contact.details}\n*${contact.note}*\n\n`;
    });
  }

  // Add timelines
  if (response.timelines) {
    response.timelines.forEach(timeline => {
      formattedMessage += `${timeline.service}: ${timeline.timeline}\n*${timeline.details}*\n\n`;
    });
  }

  // Add delivery formats
  if (response.formats) {
    response.formats.forEach(format => {
      formattedMessage += `${format.type}\n${format.description}\n`;
      formattedMessage += `Benefits: ${format.benefits.join(', ')}\n`;
      formattedMessage += `*${format.note}*\n\n`;
    });
  }

  // Add credentials
  if (response.credentials) {
    formattedMessage += '**Professional Credentials:**\n';
    formattedMessage += response.credentials.join('\n') + '\n\n';
  }

  // Add specializations  
  if (response.specializations) {
    formattedMessage += '**Areas of Specialization:**\n';
    formattedMessage += response.specializations.map(s => `• ${s}`).join('\n') + '\n\n';
  }

  if (response.factors) {
    formattedMessage += response.factors.join('\n') + '\n\n';
  }

  if (response.principles) {
    formattedMessage += response.principles.join('\n\n') + '\n\n';
  }

  if (response.options) {
    formattedMessage += response.options.join('\n\n') + '\n\n';
  }

  // Add context-specific information
  if (response.contextSpecific) {
    formattedMessage += `\n**Specific to your interest**: ${response.contextSpecific}\n\n`;
  }

  // Add ranges for pricing
  if (response.ranges) {
    formattedMessage += '**Typical Investment Ranges:**\n';
    Object.entries(response.ranges).forEach(([service, range]) => {
      formattedMessage += `• ${service}: ${range}\n`;
    });
    formattedMessage += '\n';
  }

  // Add outro/questions
  if (response.outro) {
    formattedMessage += response.outro;
  }

  if (response.questions) {
    formattedMessage += '\n\n**To help me assist you better, please let me know:**\n';
    formattedMessage += response.questions.map(q => `• ${q}`).join('\n');
  }

  if (response.suggestions) {
    formattedMessage += '\n\n**You can ask me:**\n';
    formattedMessage += response.suggestions.map(s => `• "${s}"`).join('\n');
  }

  return formattedMessage.trim();
};


// Add these new response generators to your existing file

/**
 * Generate contact information response
 * @param {string} language - Language code
 * @returns {Object} - Response object
 */
export const generateContactResponse = (language = 'en') => {
  const responses = {
    en: {
      intro: "I'd love to connect with you! Here are the best ways to reach me:",
      contactMethods: [
        {
          method: "📧 **Email**",
          details: "info@mwangamba.com",
          note: "Best for detailed inquiries and proposals"
        },
        {
          method: "📞 **Phone**", 
          details: "+255 765 762-688",
          note: "Available Monday-Friday, 9 AM - 5 PM EST"
        },
        {
          method: "💼 **LinkedIn**",
          details: "linkedin.com/mwangamba/online3309372772",
          note: "Connect with me professionally"
        },
        {
          method: "📅 **Schedule Direct**",
          details: "calendly.com/mwangamba",
          note: "Book a complimentary 30-minute consultation"
        }
      ],
      availability: "I typically respond within 24 hours and am available for calls Monday through Friday.",
      nextSteps: "Ready to discuss your needs? I offer a complimentary 30-minute discovery call to understand your objectives and explore how I can help.",
      outro: "What's the best way for you to connect?"
    },
    sw: {
      intro: "Ningependa kuungana nawe! Hizi ni njia bora za kunifikia:",
      contactMethods: [
        {
          method: "📧 **Barua Pepe**",
          details: "info@mwangamba.com", 
          note: "Bora kwa maswali ya kina na mapendekezo"
        },
        {
          method: "📞 **Simu**",
          details: "+255 765 762-688",
          note: "Ninapatikana Jumatatu-Ijumaa, 9 AM - 5 PM EST"
        }
      ],
      availability: "Kwa kawaida najibu ndani ya masaa 24 na ninapatikana kwa simu Jumatatu hadi Ijumaa.",
      outro: "Ni njia gani bora kwako ya kuungana?"
    }
  };

  return responses[language] || responses.en;
};

/**
 * Generate timeline/scheduling response
 * @param {string} service - Specific service (optional)
 * @param {string} language - Language code
 * @returns {Object} - Response object
 */
export const generateTimelineResponse = (service = null, language = 'en') => {
  const responses = {
    en: {
      general: {
        intro: "Timeline depends on the type of engagement and your specific needs:",
        timelines: [
          {
            service: "🎯 **Keynote Speaking**",
            timeline: "2-8 weeks notice preferred",
            details: "Can accommodate urgent requests with 1-2 weeks notice"
          },
          {
            service: "🛠️ **Workshop Facilitation**", 
            timeline: "4-6 weeks for custom design",
            details: "Includes needs assessment, content development, and materials preparation"
          },
          {
            service: "🎯 **Executive Coaching**",
            timeline: "Can start within 1-2 weeks",
            details: "3-12 month engagements typical"
          },
          {
            service: "🏢 **Corporate Training**",
            timeline: "6-12 weeks for full program",
            details: "Includes assessment, design, pilot, and rollout phases"
          }
        ],
        flexibility: "I maintain flexible scheduling and can often accommodate expedited timelines when needed.",
        outro: "When are you looking to begin? I can work with your timeline to find the best approach."
      },
      urgent: {
        intro: "I understand urgency is important! Here's what I can accommodate:",
        options: [
          "**Virtual presentations**: Can be arranged within 1-2 weeks",
          "**Existing workshop formats**: Available with 2-3 weeks notice", 
          "**Coaching sessions**: Can begin immediately upon agreement",
          "**Consultation calls**: Usually available within 48-72 hours"
        ],
        note: "For urgent requests, some customization may be limited, but I'll ensure maximum impact within your timeframe."
      }
    },
    sw: {
      general: {
        intro: "Muda unategemea aina ya ushiriki na mahitaji yako maalum:",
        flexibility: "Nina ratiba ya kubadilika na mara nyingi naweza kukidhi mstari wa wakati wa haraka unapohitajika.",
        outro: "Ni lini unatafuta kuanza? Naweza kufanya kazi na ratiba yako kupata mbinu bora."
      }
    }
  };

  return responses[language] || responses.en;
};

/**
 * Generate location/delivery format response
 * @param {string} language - Language code  
 * @returns {Object} - Response object
 */
export const generateLocationResponse = (language = 'en') => {
  const responses = {
    en: {
      intro: "I offer flexible delivery options to meet your needs:",
      formats: [
        {
          type: "🏢 **On-Site/In-Person**",
          description: "Full engagement at your location",
          benefits: ["Maximum interaction", "Team building", "Customized environment"],
          note: "Available within 500 miles of Dar es Salaam or with travel arrangements"
        },
        {
          type: "💻 **Virtual/Online**", 
          description: "High-quality remote delivery via video conference",
          benefits: ["Cost-effective", "No travel time", "Accessible globally"],
          note: "Using professional setup with multiple cameras and interactive tools"
        },
        {
          type: "🔄 **Hybrid Format**",
          description: "Combination of in-person and virtual elements",  
          benefits: ["Best of both worlds", "Flexible participation", "Extended reach"],
          note: "Perfect for organizations with distributed teams"
        }
      ],
      travel: {
        intro: "**Travel Coverage:**",
        details: [
          "• Local area: No additional travel costs",
          "• Regional (within 500 miles): Travel expenses apply", 
          "• National/International: Full travel package available"
        ]
      },
      outro: "What delivery format works best for your team and objectives?"
    },
    sw: {
      intro: "Ninatoa chaguo za utekelezaji zenye kubadilika ili kukidhi mahitaji yako:",
      outro: "Ni muundo gani wa utekelezaji unafaa vizuri kwa timu yako na malengo?"
    }
  };

  return responses[language] || responses.en;
};

/**
 * Generate qualifications/credentials response
 * @param {string} language - Language code
 * @returns {Object} - Response object  
 */
export const generateQualificationsResponse = (language = 'en') => {
  const responses = {
    en: {
      intro: "I bring extensive experience and proven expertise to every engagement:",
      experience: {
        years: "15+ years in leadership development and organizational training",
        clients: "Worked with Fortune 500 companies, startups, and non-profits",
        reach: "Trained over 10,000 professionals across 25+ countries"
      },
      credentials: [
        "🎓 **Education**: MBA in Organizational Leadership",
        "🏆 **Certifications**: Certified Speaking Professional (CSP), ICF Certified Coach",
        "📚 **Author**: 3 published books on leadership and innovation",
        "🎤 **Speaking**: 500+ keynote presentations delivered"
      ],
      specializations: [
        "Leadership Development & Executive Coaching",
        "Innovation Management & Design Thinking", 
        "Change Management & Organizational Transformation",
        "Team Building & Collaboration",
        "Communication & Presentation Skills"
      ],
      recognition: [
        "Top 50 Leadership Speakers (Global Gurus, 2023)",
        "Excellence in Training Award (ATD, 2022)",
        "Client satisfaction rating: 98% (based on 500+ evaluations)"
      ],
      outro: "My approach combines academic rigor with practical, real-world application. Would you like to see specific case studies or client testimonials?"
    },
    sw: {
      intro: "Ninaleta uzoefu mkubwa na utaalamu uliothibitishwa kwa kila ushiriki:",
      outro: "Mbinu yangu inachanganya uthabiti wa kitaaluma na matumizi ya kimsingi ya ulimwengu halisi. Ungependa kuona mifano maalum au ushuhuda wa wateja?"
    }
  };

  return responses[language] || responses.en;
};


