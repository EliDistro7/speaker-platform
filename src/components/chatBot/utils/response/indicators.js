 // Enhanced contact intent indicators
  export const contactIndicators = {
    en: [
      'contact', 'call', 'email', 'phone', 'reach', 'speak', 'talk', 'meet', 
      'find you', 'get you', 'locate you', 'get in touch', 'reach out',
      'communicate', 'connect', 'appointment', 'schedule', 'book'
    ],
    sw: [
      'wasiliana', 'piga', 'barua pepe', 'simu', 'fikia', 'ongea', 'zungumza', 
      'kutana', 'kupata', 'mahali', 'miadi', 'ratiba', 'hifadhi',
      'unganisha', 'kufikiana', 'mazungumzo'
    ]
  };


  

  // Enhanced location/address specific indicators
  export const locationIndicators = {
    en: [
      'where', 'location', 'address', 'office', 'find', 'visit', 'come to', 
      'directions', 'map', 'navigate', 'situated', 'based', 'headquarters',
      'branch', 'premises', 'building', 'area', 'region', 'place'
    ],
    sw: [
      'wapi', 'mahali', 'anwani', 'ofisi', 'pata', 'tembelea', 'kuja', 
      'mwelekeo', 'ramani', 'elekea', 'iko', 'makao', 'tawi',
      'jengo', 'eneo', 'mkoa', 'sehemu', 'kiwanda'
    ]
  };
  
  // Enhanced pricing intent indicators
  export const pricingIndicators = {
    en: [
      'price', 'cost', 'fee', 'charge', 'rate', 'budget', 'expensive', 'cheap', 
      'affordable', 'pricing', 'quote', 'estimate', 'bill', 'payment',
      'money', 'dollar', 'currency', 'value', 'worth', 'discount'
    ],
    sw: [
      'bei', 'gharama', 'ada', 'malipo', 'kiwango', 'bajeti', 'ghali', 'rahisi', 
      'nafuu', 'kipimo', 'hesabu', 'bili', 'pesa', 'dola',
      'thamani', 'punguzo', 'ongezeko', 'kiasi'
    ]
  };
  
  // Enhanced information seeking indicators
  export const infoIndicators = {
    en: [
      'what', 'how', 'why', 'when', 'tell me', 'explain', 'describe',
      'information', 'details', 'about', 'regarding', 'concerning',
      'help', 'assist', 'guide', 'show', 'demonstrate'
    ],
    sw: [
      'nini', 'jinsi', 'kwa nini', 'lini', 'niambie', 'eleza', 'elezea',
      'habari', 'maelezo', 'kuhusu', 'juu ya', 'kuhusiana',
      'msaada', 'kusaidia', 'mwongozo', 'onyesha', 'dhihirisha'
    ]
  };

  // Service inquiry indicators
  export const serviceIndicators = {
    en: [
      'service', 'services', 'offer', 'provide', 'do you have', 'available',
      'can you', 'do you do', 'specialise', 'expertise', 'capability'
    ],
    sw: [
      'huduma', 'kutoa', 'una', 'unapatikana', 'unaweza', 'unafanya',
      'utaalamu', 'uwezo', 'kipengele'
    ]
  };

  // Booking/scheduling indicators
  export const bookingIndicators = {
    en: [
      'book', 'schedule', 'appointment', 'reserve', 'arrange', 'plan',
      'meeting', 'consultation', 'session', 'slot', 'available time'
    ],
    sw: [
      'hifadhi', 'ratiba', 'miadi', 'panga', 'mpango', 'mkutano',
      'mazungumzo', 'kipindi', 'nafasi', 'wakati'
    ]
  };

  // Urgency indicators
  export const urgencyIndicators = {
    en: [
      'urgent', 'emergency', 'asap', 'quickly', 'immediately', 'now',
      'soon', 'fast', 'rush', 'priority'
    ],
    sw: [
      'haraka', 'dharura', 'sasa hivi', 'upesi', 'mara moja',
      'kipaumbele', 'mbio'
    ]
  };

  // Add to existing indicator objects around line 350-400
export const confirmationIndicators = {
  en: [
    'yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'alright', 'definitely',
    'absolutely', 'of course', 'please', 'go ahead', 'continue'
  ],
  sw: [
    'ndiyo', 'ndio', 'sawa', 'haya', 'kabisa', 'bila shaka', 
    'endelea', 'karibu', 'haya basi'
  ]
};

export const elaborationIndicators = {
  en: [
    'tell me more', 'more details', 'explain more', 'elaborate', 
    'go deeper', 'what else', 'continue', 'more info', 'expand',
    'tell me about', 'how can i start', 'how do i begin', 'what next'
  ],
  sw: [
    'niambie zaidi', 'maelezo zaidi', 'eleza zaidi', 'endelea',
    'nini kingine', 'habari zaidi', 'jinsi ya kuanza', 'nitaanzaje',
    'hatua ya kwanza', 'nini kifuatacho'
  ]
};