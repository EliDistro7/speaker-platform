// Expanded conversation patterns
export const conversationPatterns = {
  // Greeting patterns
  greetingPatterns: {
    en: [
      /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)$/i,
      /^(hi there|hello there|hey there)$/i,
      /^(howdy|what's up|sup|wassup)$/i,
      /^(yo|heya|hiya|heyya)$/i,
      /^(good day|good to see you|nice to meet you)$/i,
      /^(how are you|how's it going|how are things)$/i,
      /^(top of the morning|rise and shine)$/i,
      /^(aloha|bonjour|hola|ciao)$/i,
      /^(salutations|welcome|g'day)$/i,
      /^(what's good|what's happening|what's new)$/i
    ],
    sw: [
      /^(hujambo|jambo|habari|shikamoo|salama)$/i,
      /^(habari za asubuhi|habari za mchana|habari za jioni)$/i,
      /^(mambo|niaje|sasa|vipi)$/i,
      /^(habari yako|habari zako|u hali gani)$/i,
      /^(karibu|karibuni|hongera)$/i,
      /^(hodi|hujambo bwana|hujambo mama)$/i,
      /^(salamu aleikum|wa aleikum salaam)$/i,
      /^(hamjambo|hatujambo)$/i,
      /^(marahaba|ahlan wa sahlan)$/i,
      /^(habari za leo|habari za kesho)$/i
    ]
  },

  // Goodbye/ending patterns
  goodbyePatterns: {
    en: [
      /^(bye|goodbye|see you|farewell|take care)$/i,
      /^(thanks|thank you|that's all|i'm done|finished)$/i,
      /^(bye bye|see ya|catch you later|ttyl)$/i,
      /^(ok thanks|okay thanks|alright thanks)$/i,
      /^(peace out|later|adios|au revoir)$/i,
      /^(until next time|talk soon|see you soon)$/i,
      /^(have a good one|have a nice day|take it easy)$/i,
      /^(gotta go|i'm out|i'm off)$/i,
      /^(cheers|tata|cheerio)$/i,
      /^(signing off|logging off|that's a wrap)$/i,
      /^(goodnight|good night|sleep well)$/i,
      /^(so long|farewell for now|until we meet again)$/i
    ],
    sw: [
      /^(kwaheri|baadaye|baadae|tutaonana|kwa heri)$/i,
      /^(asante|ahsante|nimeshiba|nashukuru|nimemaliza)$/i,
      /^(sawa asante|haya asante|ni hayo tu)$/i,
      /^(tutaonana baadaye|hadi tutakapoona)$/i,
      /^(lala salama|usiku mwema|usingizi mwema)$/i,
      /^(safari njema|kila la heri|mungu akubariki)$/i,
      /^(heri za usiku|heri za mchana)$/i,
      /^(tutaonana kesho|hadi kesho)$/i,
      /^(pole pole|haraka haraka|twende)$/i,
      /^(salama|salama kabisa|kwa amani)$/i,
      /^(marahaba|fi aman allah)$/i,
      /^(tumalize|tumalize hapo|mimi ninaishia hapo)$/i
    ]
  },

  // Appreciation patterns
  appreciationPatterns: {
    en: [
      /^(thanks a lot|thank you so much|great help|helpful)$/i,
      /^(perfect|excellent|awesome|wonderful)$/i,
      /^(you're great|you're helpful|nice work)$/i,
      /^(amazing|fantastic|brilliant|outstanding)$/i,
      /^(much appreciated|i appreciate it|grateful)$/i,
      /^(well done|good job|nicely done)$/i,
      /^(impressive|remarkable|superb|marvelous)$/i,
      /^(that's exactly what i needed|spot on|nailed it)$/i,
      /^(you're a lifesaver|you're the best|legend)$/i,
      /^(couldn't have done it without you|invaluable help)$/i,
      /^(top notch|first class|five stars)$/i,
      /^(kudos|props|well played|respect)$/i
    ],
    sw: [
      /^(asante sana|ahsante sana|umesaidia sana)$/i,
      /^(vizuri sana|bora sana|kamili)$/i,
      /^(wewe ni mzuri|umesaidia|kazi nzuri)$/i,
      /^(nashukuru sana|nina shukrani|baraka)$/i,
      /^(umefanya vizuri|kazi bora|hongera)$/i,
      /^(mungu akubariki|allah akubariki)$/i,
      /^(sifa nyingi|hongera sana|pongezi)$/i,
      /^(umekuwa wa msaada|ni msaada mkubwa)$/i,
      /^(wewe ni bora|wewe ni mkuu|shujaa)$/i,
      /^(asante kwa msaada|asante kwa kufundisha)$/i,
      /^(kila la heri|mungu akulipe|mola akulipe)$/i,
      /^(nimefurahia|nimeona faida|umekuwa mzuri)$/i
    ]
  },

  // Question/inquiry patterns
  questionPatterns: {
    en: [
      /^(what|how|when|where|why|which|who).*\?$/i,
      /^(can you|could you|would you|will you).*\?$/i,
      /^(do you|did you|have you|are you).*\?$/i,
      /^(is it|isn't it|was it|wasn't it).*\?$/i,
      /^(tell me|show me|explain|help me).*$/i,
      /^(i need|i want|i'm looking for|i wonder).*$/i,
      /^(any idea|do you know|got any).*\?$/i,
      /^(what's|how's|where's|when's|why's).*\?$/i
    ],
    sw: [
      /^(nini|vipi|lini|wapi|kwa nini|gani|nani).*\?$/i,
      /^(unaweza|ungeweza|utaweza|je unaweza).*\?$/i,
      /^(unafahamu|ulijua|umewahi|wewe ni).*\?$/i,
      /^(ni kweli|si kweli|ilikuwa|haikuwa).*\?$/i,
      /^(niambie|nionyeshe|nieleze|nisaidie).*$/i,
      /^(ninahitaji|nataka|natafuta|najiuliza).*$/i,
      /^(una wazo|unafahamu|una).*\?$/i,
      /^(ni nini|ni vipi|ni wapi|ni lini).*\?$/i
    ]
  },

  // Affirmation/agreement patterns
  affirmationPatterns: {
    en: [
      /^(yes|yeah|yep|yup|sure|absolutely)$/i,
      /^(okay|ok|alright|right|fine)$/i,
      /^(agreed|correct|exactly|precisely)$/i,
      /^(of course|certainly|definitely|indeed)$/i,
      /^(that's right|you're right|true|accurate)$/i,
      /^(sounds good|looks good|perfect)$/i,
      /^(i agree|i think so|makes sense)$/i,
      /^(no doubt|without question|for sure)$/i
    ],
    sw: [
      /^(ndio|ndiyo|naam|eh|sawa)$/i,
      /^(haya|sawa sawa|vizuri|poa)$/i,
      /^(nakubaliana|sahihi|kweli|kamili)$/i,
      /^(bila shaka|hakika|kwa hakika)$/i,
      /^(ni kweli|umesema kweli|ni sahihi)$/i,
      /^(inaonekana vizuri|ni nzuri|bora)$/i,
      /^(nakubaliana|nafikiri hivyo|ni mantiki)$/i,
      /^(hakuna shaka|pasipo swali|kwa uhakika)$/i
    ]
  },

  // Confusion/clarification patterns
  confusionPatterns: {
    en: [
      /^(what do you mean|i don't understand|confused)$/i,
      /^(can you clarify|please explain|i'm lost)$/i,
      /^(huh|what|sorry|excuse me|pardon)$/i,
      /^(i don't get it|that's unclear|not following)$/i,
      /^(could you repeat|say that again|come again)$/i,
      /^(i'm confused|this is confusing|unclear)$/i,
      /^(what exactly|can you be more specific)$/i,
      /^(i missed that|didn't catch that)$/i
    ],
    sw: [
      /^(unamaanisha nini|sielewi|ni changamoto)$/i,
      /^(unaweza kufafanua|tafadhali eleza|nimepotea)$/i,
      /^(eh|nini|samahani|nisamehe|radhi)$/i,
      /^(sielewi|si wazi|sijaelewa)$/i,
      /^(unaweza kurudia|sema tena|tena)$/i,
      /^(nimechanganyikiwa|ni changamoto|si wazi)$/i,
      /^(ni nini haswa|unaweza kuwa mahususi)$/i,
      /^(sikuskia|sikujua hiyo|sikuelewa)$/i
    ]
  }
};
