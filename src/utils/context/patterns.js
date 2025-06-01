

/**
 * Enhanced service context management utilities with improved pattern matching
 */

// Enhanced service detection patterns with better coverage and accuracy
export const serviceDetectionPatterns = {
  'Keynote Speaking': {
    en: {
      keywords: ['keynote', 'speaking', 'presentation', 'speech', 'conference', 'event', 'corporate event', 'local event', 'international event', 'speaker', 'talk', 'address', 'deliver speech'],
      patterns: [
        /\b(keynote|main)\s+(speaking?|presentation|speech|address)\b/i,
        /\b(corporate|business|conference|company)\s+(event|speaking|presentation)\b/i,
        /\bspeaking\s+(engagement|opportunity|event)\b/i,
        /\b(motivational|inspirational|guest)\s+(speaker?|speaking)\b/i,
        /\bdeliver\s+(a\s+)?(keynote|speech|presentation|talk)\b/i,
        /\b(present|give)\s+(a\s+)?(talk|speech|presentation)\s+(at|to|for)\b/i
      ],
      negativePatterns: [
        /\b(not\s+speaking|can't\s+speak|won't\s+present)\b/i
      ]
    },
    sw: {
      keywords: ['hotuba', 'mazungumzo', 'uwasilishaji', 'mkutano', 'tukio', 'mkutano wa kampuni', 'tukio la ndani', 'tukio la kimataifa', 'msemaji'],
      patterns: [
        /\bhotuba\s+(kuu|mkuu|muhimu)\b/i,
        /\bmazungumzo\s+(ya\s+)?(kampuni|biashara)\b/i,
        /\bmsemaji\s+(mkuu|muhimu)\b/i,
        /\buwasilishaji\s+wa\s+(tukio|mkutano)\b/i,
        /\ktoa\s+(hotuba|mazungumzo|uwasilishaji)\b/i
      ]
    }
  },
  'Workshop Facilitation': {
    en: {
      keywords: ['workshop', 'facilitation', 'training', 'team building', 'half-day', 'full-day', 'multi-day', 'facilitate', 'interactive', 'hands-on', 'practical session'],
      patterns: [
        /\bworkshop\s+(facilitation|training|session)\b/i,
        /\b(facilitate|lead|run)\s+(a\s+)?(workshop|training|session)\b/i,
        /\b(team\s+building|leadership|skills)\s+workshop\b/i,
        /\b(half|full|multi)[\-\s]day\s+(workshop|training|session)\b/i,
        /\binteractive\s+(session|training|workshop)\b/i,
        /\bhands[\-\s]on\s+(training|workshop|session)\b/i,
        /\bpractical\s+(training|workshop|session)\b/i
      ]
    },
    sw: {
      keywords: ['warsha', 'uongozaji', 'mafunzo', 'kujenga timu', 'nusu siku', 'siku nzima', 'siku nyingi', 'uongozi', 'kushirikishana'],
      patterns: [
        /\bwarsha\s+(ya\s+)?(mafunzo|uongozi|ujuzi)\b/i,
        /\b(kuongoza|kuendesha)\s+(warsha|mafunzo)\b/i,
        /\bkujenga\s+timu\b/i,
        /\b(nusu|siku\s+nzima)\s+(warsha|mafunzo)\b/i,
        /\bmafunzo\s+ya\s+(vitendo|kushirikishana)\b/i
      ]
    }
  },
  'Executive Coaching': {
    en: {
      keywords: ['coaching', 'executive', 'leadership', 'personal development', 'one-on-one', 'c-suite', 'ceo', 'mentor', 'guide', '1-on-1', 'individual coaching'],
      patterns: [
        /\bexecutive\s+(coaching|mentoring|development)\b/i,
        /\bleadership\s+(coaching|development|mentoring)\b/i,
        /\bpersonal\s+(development|coaching|growth)\b/i,
        /\b(one[\-\s]on[\-\s]one|1[\-\s]on[\-\s]1)\s+(coaching|mentoring|session)\b/i,
        /\bc[\-\s]suite\s+(coaching|development|training)\b/i,
        /\bindividual\s+(coaching|mentoring|development)\b/i,
        /\b(ceo|executive|senior\s+manager)\s+(coaching|mentoring)\b/i
      ]
    },
    sw: {
      keywords: ['mafunzo', 'mkurugenzi', 'uongozi', 'maendeleo ya kibinafsi', 'mtu mmoja', 'mkurugenzi mkuu', 'mshauri', 'mwongozi'],
      patterns: [
        /\bmafunzo\s+ya\s+(mkurugenzi|uongozi|kibinafsi)\b/i,
        /\bmaendeleo\s+ya\s+(kibinafsi|uongozi)\b/i,
        /\bmshauri\s+wa\s+(uongozi|kibinafsi)\b/i,
        /\bmafunzo\s+ya\s+(mtu\s+mmoja|binafsi)\b/i,
        /\bmwongozi\s+wa\s+(kibinafsi|mafunzo)\b/i
      ]
    }
  },
  'Corporate Training': {
    en: {
      keywords: ['corporate training', 'team training', 'department training', 'organization', 'company training', 'staff development', 'employee training', 'organizational development'],
      patterns: [
        /\bcorporate\s+(training|development|learning)\b/i,
        /\b(team|department|staff|employee)\s+(training|development)\b/i,
        /\bemployee\s+(development|training|education)\b/i,
        /\borganization(al)?\s+(training|development|learning)\b/i,
        /\bcompany[\-\s]wide\s+(training|development)\b/i,
        /\bworkforce\s+(development|training)\b/i,
        /\bstaff\s+(development|training|education)\b/i
      ]
    },
    sw: {
      keywords: ['mafunzo ya makampuni', 'mafunzo ya timu', 'mafunzo ya idara', 'shirika', 'mafunzo ya kampuni', 'maendeleo ya wafanyakazi'],
      patterns: [
        /\bmafunzo\s+ya\s+(makampuni|kampuni|shirika)\b/i,
        /\bmafunzo\s+ya\s+(timu|idara|wafanyakazi)\b/i,
        /\bmaendeleo\s+ya\s+(wafanyakazi|timu)\b/i,
        /\bmafunzo\s+ya\s+(shirika|taasisi)\b/i,
        /\bmafunzo\s+ya\s+pamoja\b/i
      ]
    }
  },
  'Virtual Speaking': {
    en: {
      keywords: ['virtual', 'online', 'remote', 'zoom', 'teams', 'webinar', 'digital', 'virtual keynote', 'online presentation', 'video conference'],
      patterns: [
        /\bvirtual\s+(speaking|presentation|keynote|event|meeting)\b/i,
        /\bonline\s+(event|presentation|workshop|training|speaking)\b/i,
        /\bremote\s+(speaking|training|presentation|workshop)\b/i,
        /\b(zoom|teams|webinar|skype)\s+(presentation|meeting|session|call)\b/i,
        /\bdigital\s+(event|presentation|speaking|workshop)\b/i,
        /\bvideo\s+(conference|call|presentation|meeting)\b/i,
        /\bweb[\-\s]based\s+(training|presentation|workshop)\b/i
      ]
    },
    sw: {
      keywords: ['mtandaoni', 'mbali', 'kidijitali', 'warsha ya mtandaoni', 'uwasilishaji mtandaoni', 'mazungumzo ya mbali'],
      patterns: [
        /\b(uwasilishaji|mazungumzo|hotuba)\s+mtandaoni\b/i,
        /\bwarsha\s+ya\s+mtandaoni\b/i,
        /\bmafunzo\s+ya\s+(mbali|mtandaoni)\b/i,
        /\bmkutano\s+wa\s+(mtandaoni|kidijitali)\b/i,
        /\btukio\s+la\s+mtandaoni\b/i
      ]
    }
  },
  'Leadership Development': {
    en: {
      keywords: ['leadership', 'leader', 'leadership training', 'leadership skills', 'leadership development', 'executive leadership', 'management training'],
      patterns: [
        /\bleadership\s+(development|training|skills|program|workshop)\b/i,
        /\b(develop|build|enhance)\s+(leadership|leader)\s+(skills|abilities|capabilities)\b/i,
        /\bexecutive\s+(leadership|development|training)\b/i,
        /\bmanagement\s+(training|development|skills)\b/i,
        /\b(emotional\s+intelligence|decision\s+making|delegation)\s+(training|workshop)\b/i,
        /\bleader\s+(development|training|coaching)\b/i
      ]
    },
    sw: {
      keywords: ['uongozi', 'kiongozi', 'mafunzo ya uongozi', 'ujuzi wa uongozi', 'maendeleo ya uongozi'],
      patterns: [
        /\buongozi\s+(maendeleo|mafunzo|ujuzi)\b/i,
        /\b(kujenga|kuboresha)\s+ujuzi\s+wa\s+uongozi\b/i,
        /\bmafunzo\s+ya\s+(uongozi|menejimenti)\b/i,
        /\bkiongozi\s+(mafunzo|maendeleo)\b/i
      ]
    }
  },
  'Innovation Management': {
    en: {
      keywords: ['innovation', 'creative thinking', 'innovation strategy', 'innovation management', 'design thinking', 'problem solving'],
      patterns: [
        /\binnovation\s+(management|strategy|training|workshop|development)\b/i,
        /\b(creative|design)\s+thinking\s+(workshop|training|session)\b/i,
        /\bproblem\s+solving\s+(skills|training|workshop)\b/i,
        /\binnovation\s+(process|framework|methodology)\b/i,
        /\b(breakthrough|disruptive)\s+(thinking|innovation)\b/i
      ]
    },
    sw: {
      keywords: ['uvumbuzi', 'ubunifu', 'mkakati wa uvumbuzi', 'usimamizi wa uvumbuzi', 'ufikirisho wa kubuni'],
      patterns: [
        /\buvumbuzi\s+(usimamizi|mkakati|mafunzo)\b/i,
        /\bubunifu\s+(mafunzo|warsha)\b/i,
        /\bufikirisho\s+wa\s+kubuni\b/i,
        /\bsuluhu\s+za\s+matatizo\b/i
      ]
    }
  }
};