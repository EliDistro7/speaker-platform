// Question type detection patterns
export const questionPatterns = {
  services: {
    en: [
      /what\s+(services|programs|offerings|solutions)\s+do\s+you\s+(offer|provide|have)/i,
      /what\s+(can\s+you|do\s+you)\s+(do|offer|provide)/i,
      /tell\s+me\s+about\s+your\s+(services|programs|offerings)/i,
      /list\s+(of\s+)?(services|programs|offerings)/i,
      /what\s+(are\s+)?your\s+(services|programs|specialties)/i,
      /show\s+me\s+(all\s+)?(services|programs|options)/i,
      /available\s+(services|programs|training|workshops)/i
    ],
    sw: [
      /huduma\s+gani\s+(mnatoa|mnauza)/i,
      /ni\s+huduma\s+gani\s+mnazotoa/i,
      /mafunzo\s+gani\s+mnayotoa/i,
      /programu\s+zenu\s+ni\s+zipi/i,
      /naomba\s+kufahamu\s+huduma\s+zenu/i
    ]
  },
  pricing: {
    en: [
      /what\s+(is\s+the\s+)?cost/i,
      /how\s+much\s+(do\s+you\s+charge|does\s+it\s+cost|is\s+it)/i,
      /(pricing|price|rates?|fees?|cost)\s+(information|details|structure)?/i,
      /tell\s+me\s+about\s+(your\s+)?(pricing|rates|fees|costs)/i,
      /budget|expensive|affordable|investment/i,
      /quote|estimate|proposal/i,
      /what\s+(would\s+it\s+cost|will\s+it\s+cost)/i
    ],
    sw: [
      /ni\s+kiasi\s+gani/i,
      /gharama\s+ni\s+ngapi/i,
      /bei\s+yenu\s+ni\s+gani/i,
      /naomba\s+kufahamu\s+(bei|gharama)/i,
      /pesa\s+ngapi/i
    ]
  },
  methodology: {
    en: [
      /how\s+do\s+you\s+(conduct|deliver|run|organize)\s+(training|workshops|sessions)/i,
      /what\s+(is\s+)?your\s+(approach|methodology|process|method)/i,
      /how\s+(does\s+it\s+work|do\s+you\s+work)/i,
      /tell\s+me\s+about\s+your\s+(process|approach|methodology)/i,
      /training\s+(format|style|method|delivery)/i,
      /how\s+(are\s+)?sessions\s+(structured|organized|conducted)/i,
      /delivery\s+(method|format|approach)/i
    ],
    sw: [
      /mafunzo\s+yanafanyikaje/i,
      /mbinu\s+yenu\s+ni\s+gani/i,
      /mnafundishaje/i,
      /utaratibu\s+wa\s+mafunzo/i,
      /jinsi\s+mnavyofanya/i
    ]
  },
  moreInfo: {
    en: [
      /(need|want|would\s+like)\s+(more\s+)?information/i,
      /tell\s+me\s+more/i,
      /additional\s+(details|information|info)/i,
      /can\s+you\s+(explain|elaborate|give\s+more\s+details)/i,
      /more\s+(details|info|information)/i,
      /learn\s+more/i,
      /find\s+out\s+more/i,
      /interested\s+in\s+learning/i
    ],
    sw: [
      /naomba\s+maelezo\s+zaidi/i,
      /nataka\s+kujua\s+zaidi/i,
      /taarifa\s+zaidi/i,
      /unaweza\s+kunieleza\s+zaidi/i,
      /ningependa\s+kujua/i
    ]
  }
};