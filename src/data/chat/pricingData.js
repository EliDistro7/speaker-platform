// app/data/pricingData.js

export const pricingData = {
    en: {
      // Keynote Speaking pricing packages
      'Keynote Speaking': {
        currency: 'USD',
        packages: [
          {
            name: "Local Event",
            price: 2500,
            billingCycle: "per event",
            description: "Perfect for local conferences, corporate events, and community gatherings in Tanzania",
            features: [
              "60-90 minute keynote presentation",
              "Pre-event consultation call",
              "Customized content for your audience",
              "Interactive Q&A session",
              "Digital handouts for attendees",
              "Basic AV setup assistance",
              "Post-event follow-up resources"
            ],
            popular: false,
            deliveryTime: "Available within 2-4 weeks",
            audienceSize: "Up to 300 people"
          },
          {
            name: "Corporate Event",
            price: 7500,
            billingCycle: "per event",
            description: "Comprehensive keynote solution for corporate conferences and leadership summits",
            features: [
              "90-120 minute keynote with breakout sessions",
              "Detailed pre-event audience analysis",
              "Fully customized presentation content",
              "Interactive workshops integration",
              "Professional presentation materials",
              "30-minute meet & greet session",
              "Team leadership assessment tools",
              "Post-event action plan templates",
              "3-month follow-up consultation"
            ],
            popular: true,
            deliveryTime: "Book 6-8 weeks in advance",
            audienceSize: "Up to 1000 people"
          },
          {
            name: "International Event",
            price: 15000,
            billingCycle: "per event",
            description: "Premium keynote experience for international conferences and major corporate events",
            features: [
              "Full-day keynote with multiple sessions",
              "Comprehensive audience and industry research",
              "Multi-session presentation series",
              "Executive roundtable facilitation",
              "Custom leadership assessment creation",
              "VIP networking sessions",
              "Personalized coaching for key executives",
              "Professional video content creation",
              "6-month strategic follow-up program",
              "International travel coordination"
            ],
            popular: false,
            deliveryTime: "Book 3-6 months in advance",
            audienceSize: "1000+ people"
          }
        ],
        customNote: "Travel expenses are additional for events outside Dar es Salaam. Virtual presentations available at 50% of standard rates."
      },
      
      // Workshop Facilitation pricing
      'Workshop Facilitation': {
        currency: 'USD',
        packages: [
          {
            name: "Half-Day Workshop",
            price: 3500,
            billingCycle: "per workshop",
            description: "Intensive 4-hour workshop focused on specific leadership or team development topics",
            features: [
              "4-hour interactive workshop session",
              "Up to 25 participants",
              "Customized workshop materials",
              "Hands-on exercises and case studies",
              "Individual and group assessments",
              "Take-home action planning templates",
              "30-day email follow-up support"
            ],
            popular: false,
            deliveryTime: "2-3 weeks preparation time",
            maxParticipants: "25 people"
          },
          {
            name: "Full-Day Intensive",
            price: 6500,
            billingCycle: "per workshop",
            description: "Comprehensive 8-hour workshop with deep-dive into leadership transformation",
            features: [
              "8-hour comprehensive workshop",
              "Up to 40 participants",
              "Multi-module curriculum design",
              "Interactive simulations and role-plays",
              "Personal leadership style assessments",
              "Team building exercises",
              "Strategic planning sessions",
              "Comprehensive workbook materials",
              "90-day implementation support"
            ],
            popular: true,
            deliveryTime: "4-6 weeks preparation time",
            maxParticipants: "40 people"
          },
          {
            name: "Multi-Day Program",
            price: 12000,
            billingCycle: "per program",
            description: "Intensive 2-3 day leadership development program with ongoing support",
            features: [
              "2-3 day intensive program",
              "Up to 30 participants",
              "Comprehensive leadership curriculum",
              "360-degree leadership assessments",
              "Personal development planning",
              "Peer coaching setup",
              "Executive presentation skills training",
              "Strategic thinking workshops",
              "6-month mentorship program",
              "Quarterly progress check-ins"
            ],
            popular: false,
            deliveryTime: "6-8 weeks preparation time",
            maxParticipants: "30 people"
          }
        ],
        customNote: "Workshop content can be customized for specific industries or leadership challenges. Group coaching sessions available as add-ons."
      },
      
      // Executive Coaching pricing
      'Executive Coaching': {
        currency: 'USD',
        packages: [
          {
            name: "Foundation Coaching",
            price: 500,
            billingCycle: "per session",
            minimumTerm: "3 sessions",
            description: "Essential one-on-one coaching for emerging leaders and entrepreneurs",
            features: [
              "90-minute individual coaching sessions",
              "Leadership assessment and gap analysis",
              "Personal development planning",
              "Goal setting and accountability tracking",
              "Email support between sessions",
              "Resource library access"
            ],
            popular: false,
            deliveryTime: "Sessions scheduled weekly/bi-weekly",
            sessionDuration: "90 minutes"
          },
          {
            name: "Executive Development",
            price: 3500,
            billingCycle: "monthly package",
            minimumTerm: "6 months",
            description: "Comprehensive executive coaching program for senior leaders and executives",
            features: [
              "2 x 90-minute coaching sessions per month",
              "360-degree leadership assessment",
              "Comprehensive personal development plan",
              "Strategic thinking and decision-making support",
              "Team leadership enhancement",
              "Crisis management coaching",
              "Unlimited email and WhatsApp support",
              "Monthly progress reports",
              "Resource library and tools access"
            ],
            popular: true,
            deliveryTime: "Weekly or bi-weekly sessions",
            sessionDuration: "90 minutes each"
          },
          {
            name: "C-Suite Coaching",
            price: 7500,
            billingCycle: "monthly package",
            minimumTerm: "12 months",
            description: "Premium coaching program for CEOs, Managing Directors, and senior executives",
            features: [
              "4 x 90-minute coaching sessions per month",
              "Comprehensive leadership 360 assessment",
              "Strategic business coaching",
              "Board presentation and communication skills",
              "Organizational culture transformation",
              "Crisis leadership and change management",
              "Personal branding and thought leadership",
              "24/7 emergency coaching support",
              "Quarterly stakeholder feedback sessions",
              "Annual leadership retreat planning"
            ],
            popular: false,
            deliveryTime: "Weekly sessions available",
            sessionDuration: "90 minutes each"
          }
        ],
        customNote: "All coaching packages include initial assessment session. Virtual coaching available worldwide. Group coaching rates available for leadership teams."
      },
      
      // Corporate Training pricing
      'Corporate Training': {
        currency: 'USD',
        packages: [
          {
            name: "Team Training",
            price: 4500,
            billingCycle: "per training day",
            description: "Customized training programs for teams and departments",
            features: [
              "8-hour training program",
              "Up to 30 participants",
              "Customized training content",
              "Interactive learning modules",
              "Team building activities",
              "Skills assessment and evaluation",
              "Training materials and resources",
              "60-day implementation support"
            ],
            popular: false,
            deliveryTime: "3-4 weeks preparation",
            maxParticipants: "30 people"
          },
          {
            name: "Department Training",
            price: 8500,
            billingCycle: "per program",
            description: "Comprehensive multi-day training program for entire departments",
            features: [
              "2-day comprehensive training program",
              "Up to 50 participants",
              "Multi-level curriculum design",
              "Leadership and management tracks",
              "Change management workshops",
              "Performance improvement planning",
              "Communication and collaboration tools",
              "Supervisor coaching techniques",
              "3-month implementation monitoring"
            ],
            popular: true,
            deliveryTime: "6-8 weeks preparation",
            maxParticipants: "50 people"
          },
          {
            name: "Organization-Wide",
            price: 25000,
            billingCycle: "per program",
            description: "Complete organizational transformation program with ongoing support",
            features: [
              "5-day intensive training program",
              "Unlimited participants (multiple sessions)",
              "Organizational culture assessment",
              "Leadership development at all levels",
              "Change management implementation",
              "Performance management systems",
              "Succession planning workshops",
              "Train-the-trainer programs",
              "12-month ongoing support and consulting",
              "Quarterly progress evaluations"
            ],
            popular: false,
            deliveryTime: "3-4 months preparation",
            maxParticipants: "Unlimited (multiple cohorts)"
          }
        ],
        customNote: "Corporate training programs are fully customizable. Industry-specific content available for healthcare, finance, manufacturing, and technology sectors."
      },
      
      // Virtual Speaking pricing
      'Virtual Speaking': {
        currency: 'USD',
        packages: [
          {
            name: "Virtual Keynote",
            price: 1500,
            billingCycle: "per event",
            description: "Engaging virtual keynote presentation with interactive elements",
            features: [
              "60-minute virtual keynote",
              "Interactive polls and Q&A",
              "Breakout room facilitation",
              "Digital presentation materials",
              "Recording for later use",
              "Technical setup support"
            ],
            popular: false,
            platform: "Zoom, Teams, or preferred platform"
          },
          {
            name: "Virtual Workshop",
            price: 2500,
            billingCycle: "per workshop",
            description: "Interactive virtual workshop with hands-on activities and group work",
            features: [
              "3-4 hour virtual workshop",
              "Interactive breakout sessions",
              "Digital collaboration tools",
              "Virtual whiteboarding activities",
              "Individual and group exercises",
              "Follow-up resource packet",
              "30-day email support"
            ],
            popular: true,
            platform: "Zoom, Teams, or preferred platform"
          },
          {
            name: "Virtual Series",
            price: 5000,
            billingCycle: "per series",
            description: "Multi-session virtual learning series with ongoing engagement",
            features: [
              "4-session virtual series (2 hours each)",
              "Progressive skill building curriculum",
              "Peer learning and networking",
              "Weekly assignments and activities",
              "Group coaching elements",
              "Comprehensive resource library",
              "Certificate of completion",
              "3-month alumni support group"
            ],
            popular: false,
            platform: "Zoom, Teams, or preferred platform"
          }
        ],
        customNote: "All virtual events include technical rehearsal and platform setup support. Time zone coordination available for international audiences."
      }
    },
    sw: {
      // Keynote Speaking pricing packages
      'Keynote Speaking': {
        currency: 'TZS',
        packages: [
          {
            name: "Tukio la Ndani",
            price: 2500000,
            billingCycle: "kwa tukio",
            description: "Inafaa kwa mikutano ya ndani, matukio ya makampuni, na mikutano ya jamii Tanzania",
            features: [
              "Uwasilishaji wa dakika 60-90",
              "Mazungumzo ya ushauri kabla ya tukio",
              "Maudhui yaliyobinafsishwa kwa hadhira yako",
              "Kipindi cha maswali na majibu",
              "Vinyago vya kidijitali kwa washiriki",
              "Msaada wa msingi wa usanidi wa AV",
              "Rasilimali za kufuatilia baada ya tukio"
            ],
            popular: false,
            deliveryTime: "Inapatikana ndani ya wiki 2-4",
            audienceSize: "Hadi watu 300"
          },
          {
            name: "Tukio la Kampuni",
            price: 7500000,
            billingCycle: "kwa tukio",
            description: "Suluhisho kamili la uwasilishaji kwa mikutano ya makampuni na mkutano wa uongozi",
            features: [
              "Uwasilishaji wa dakika 90-120 na vikao vya vikundi",
              "Uchambuzi wa kina wa hadhira kabla ya tukio",
              "Maudhui ya uwasilishaji yaliyobinafsishwa kabisa",
              "Ujumuishaji wa warsha za kushirikishana",
              "Nyenzo za uwasilishaji za kitaalamu",
              "Kipindi cha dakika 30 cha mkutano na salamu",
              "Zana za tathmini ya uongozi wa timu",
              "Templeti za mpango wa hatua baada ya tukio",
              "Ushauri wa kufuatilia wa miezi 3"
            ],
            popular: true,
            deliveryTime: "Hifadhi wiki 6-8 mapema",
            audienceSize: "Hadi watu 1000"
          },
          {
            name: "Tukio la Kimataifa",
            price: 15000000,
            billingCycle: "kwa tukio",
            description: "Uzoefu wa premium wa uwasilishaji kwa mikutano ya kimataifa na matukio makubwa ya makampuni",
            features: [
              "Uwasilishaji wa siku nzima na vikao vingi",
              "Utafiti kamili wa hadhira na sekta",
              "Mfululizo wa uwasilishaji wa vikao vingi",
              "Uongozaji wa meza ya mviringo ya wakurugenzi",
              "Uundaji wa tathmini ya uongozi ya kibinafsi",
              "Vikao vya uwandani wa VIP",
              "Mafunzo ya kibinafsi kwa wakurugenzi wakuu",
              "Uundaji wa maudhui ya video ya kitaalamu",
              "Programu ya kufuatilia ya kimkakati ya miezi 6",
              "Uratibu wa safari za kimataifa"
            ],
            popular: false,
            deliveryTime: "Hifadhi miezi 3-6 mapema",
            audienceSize: "Watu 1000+"
          }
        ],
        customNote: "Gharama za safari ni za ziada kwa matukio nje ya Dar es Salaam. Mawasilisho ya mtandaoni yanapatikana kwa 50% ya kiwango cha kawaida."
      },
      
      // Workshop Facilitation pricing
      'Workshop Facilitation': {
        currency: 'TZS',
        packages: [
          {
            name: "Warsha ya Nusu Siku",
            price: 3500000,
            billingCycle: "kwa warsha",
            description: "Warsha mkali ya masaa 4 inayolenga mada maalum za uongozi au maendeleo ya timu",
            features: [
              "Kipindi cha warsha cha kushirikiana cha masaa 4",
              "Hadi washiriki 25",
              "Nyenzo za warsha zilizobinafsishwa",
              "Mazoezi ya vitendakazi na mifano ya kesi",
              "Tathmini za kibinafsi na za kikundi",
              "Templeti za kupanga hatua za kuchukua nyumbani",
              "Msaada wa kufuatilia wa barua pepe wa siku 30"
            ],
            popular: false,
            deliveryTime: "Muda wa maandalizi wa wiki 2-3",
            maxParticipants: "Watu 25"
          },
          {
            name: "Mkali wa Siku Nzima",
            price: 6500000,
            billingCycle: "kwa warsha",
            description: "Warsha kamili ya masaa 8 na kuzama kwa kina katika mabadiliko ya uongozi",
            features: [
              "Warsha kamili ya masaa 8",
              "Hadi washiriki 40",
              "Muundo wa mtaala wa moduli nyingi",
              "Mchanganyiko wa kushirikishana na mchezaji wa majukumu",
              "Tathmini za mtindo wa uongozi wa kibinafsi",
              "Mazoezi ya kujenga timu",
              "Vikao vya upangaji wa kimkakati",
              "Nyenzo kamili za kitabu cha kazi",
              "Msaada wa utekelezaji wa siku 90"
            ],
            popular: true,
            deliveryTime: "Muda wa maandalizi wa wiki 4-6",
            maxParticipants: "Watu 40"
          },
          {
            name: "Programu ya Siku Nyingi",
            price: 12000000,
            billingCycle: "kwa programu",
            description: "Programu mkali ya maendeleo ya uongozi ya siku 2-3 na msaada unaoendelea",
            features: [
              "Programu mkali ya siku 2-3",
              "Hadi washiriki 30",
              "Mtaala kamili wa uongozi",
              "Tathmini za uongozi za shahada 360",
              "Upangaji wa maendeleo ya kibinafsi",
              "Usanidi wa mafunzo ya wenzao",
              "Mafunzo ya ujuzi wa uwasilishaji wa wakurugenzi",
              "Warsha za mafikiri ya kimkakati",
              "Programu ya ushauri wa miezi 6",
              "Ukaguzi wa maendeleo wa kila robo"
            ],
            popular: false,
            deliveryTime: "Muda wa maandalizi wa wiki 6-8",
            maxParticipants: "Watu 30"
          }
        ],
        customNote: "Maudhui ya warsha yanaweza kubinafsishwa kwa viwanda mahususi au changamoto za uongozi. Vikao vya mafunzo ya kikundi vinapatikana kama nyongeza."
      },
      
      // Executive Coaching pricing
      'Executive Coaching': {
        currency: 'TZS',
        packages: [
          {
            name: "Mafunzo ya Misingi",
            price: 500000,
            billingCycle: "kwa kipindi",
            minimumTerm: "vipindi 3",
            description: "Mafunzo muhimu ya mtu mmoja kwa mmoja kwa viongozi wanaotokea na wajasiriamali",
            features: [
              "Vikao vya mafunzo ya kibinafsi vya dakika 90",
              "Tathmini ya uongozi na uchambuzi wa mapengo",
              "Upangaji wa maendeleo ya kibinafsi",
              "Kuweka malengo na kufuatilia uwajibikaji",
              "Msaada wa barua pepe kati ya vikao",
              "Upatikanaji wa maktaba ya rasilimali"
            ],
            popular: false,
            deliveryTime: "Vikao vimepangwa kila wiki/wiki mbili",
            sessionDuration: "Dakika 90"
          },
          {
            name: "Maendeleo ya Wakurugenzi",
            price: 3500000,
            billingCycle: "kifurushi cha kila mwezi",
            minimumTerm: "miezi 6",
            description: "Programu kamili ya mafunzo ya wakurugenzi kwa viongozi wakuu na wakurugenzi",
            features: [
              "Vikao 2 x 90 dakika za mafunzo kwa mwezi",
              "Tathmini ya uongozi ya shahada 360",
              "Mpango kamili wa maendeleo ya kibinafsi",
              "Msaada wa mafikiri ya kimkakati na kufanya maamuzi",
              "Uboreshaji wa uongozi wa timu",
              "Mafunzo ya usimamizi wa migogoro",
              "Msaada usio na kikomo wa barua pepe na WhatsApp",
              "Ripoti za maendeleo za kila mwezi",
              "Upatikanaji wa maktaba ya rasilimali na zana"
            ],
            popular: true,
            deliveryTime: "Vikao vya kila wiki au wiki mbili",
            sessionDuration: "Dakika 90 kila kimoja"
          },
          {
            name: "Mafunzo ya C-Suite",
            price: 7500000,
            billingCycle: "kifurushi cha kila mwezi",
            minimumTerm: "miezi 12",
            description: "Programu ya premium ya mafunzo kwa Wakurugenzi Mkuu, Wadirectors Wasimamizi, na wakurugenzi wakuu",
            features: [
              "Vikao 4 x 90 dakika za mafunzo kwa mwezi",
              "Tathmini kamili ya uongozi ya 360",
              "Mafunzo ya biashara ya kimkakati",
              "Ujuzi wa uwasilishaji na mawasiliano ya bodi",
              "Mabadiliko ya utamaduni wa shirika",
              "Uongozi wa migogoro na usimamizi wa mabadiliko",
              "Chapa ya kibinafsi na uongozi wa mafikira",
              "Msaada wa mafunzo wa dharura wa saa 24/7",
              "Vikao vya maoni ya wadau vya kila robo",
              "Upangaji wa mapumziko ya uongozi ya kila mwaka"
            ],
            popular: false,
            deliveryTime: "Vikao vya kila wiki vinapatikana",
            sessionDuration: "Dakika 90 kila kimoja"
          }
        ],
        customNote: "Vifurushi vyote vya mafunzo vinajumuisha kipindi cha tathmini ya kwanza. Mafunzo ya mtandaoni yanapatikana ulimwenguni. Kiwango cha mafunzo ya kikundi kinapatikana kwa timu za uongozi."
      },
      
      // Corporate Training pricing
      'Corporate Training': {
        currency: 'TZS',
        packages: [
          {
            name: "Mafunzo ya Timu",
            price: 4500000,
            billingCycle: "kwa siku ya mafunzo",
            description: "Mipango ya mafunzo iliyobinafsishwa kwa timu na idara",
            features: [
              "Programu ya mafunzo ya masaa 8",
              "Hadi washiriki 30",
              "Maudhui ya mafunzo yaliyobinafsishwa",
              "Moduli za kujifunza za kushirikishana",
              "Shughuli za kujenga timu",
              "Tathmini na tathmini ya ujuzi",
              "Nyenzo na rasilimali za mafunzo",
              "Msaada wa utekelezaji wa siku 60"
            ],
            popular: false,
            deliveryTime: "Maandalizi ya wiki 3-4",
            maxParticipants: "Watu 30"
          },
          {
            name: "Mafunzo ya Idara",
            price: 8500000,
            billingCycle: "kwa programu",
            description: "Programu kamili ya mafunzo ya siku nyingi kwa idara nzima",
            features: [
              "Programu kamili ya mafunzo ya siku 2",
              "Hadi washiriki 50",
              "Muundo wa mtaala wa ngazi nyingi",
              "Njia za uongozi na usimamizi",
              "Warsha za usimamizi wa mabadiliko",
              "Upangaji wa uboreshaji wa utendaji",
              "Zana za mawasiliano na ushirikiano",
              "Mbinu za mafunzo za wasimamizi",
              "Ufuatiliaji wa utekelezaji wa miezi 3"
            ],
            popular: true,
            deliveryTime: "Maandalizi ya wiki 6-8",
            maxParticipants: "Watu 50"
          },
          {
            name: "Shirika Lote",
            price: 25000000,
            billingCycle: "kwa programu",
            description: "Programu kamili ya mabadiliko ya shirika na msaada unaoendelea",
            features: [
              "Programu mkali ya mafunzo ya siku 5",
              "Washiriki wasio na kikomo (vikao vingi)",
              "Tathmini ya utamaduni wa shirika",
              "Maendeleo ya uongozi katika ngazi zote",
              "Utekelezaji wa usimamizi wa mabadiliko",
              "Mifumo ya usimamizi wa utendaji",
              "Warsha za upangaji wa mrithi",
              "Mipango ya mafunzo ya wafunzi",
              "Msaada unaoendelea na ushauri wa miezi 12",
              "Tathmini za maendeleo za kila robo"
            ],
            popular: false,
            deliveryTime: "Maandalizi ya miezi 3-4",
            maxParticipants: "Wasio na kikomo (makundi mengi)"
          }
        ],
        customNote: "Mipango ya mafunzo ya makampuni inaweza kubinafsishwa kabisa. Maudhui maalum ya sekta yanapatikana kwa huduma za afya, fedha, uzalishaji, na sekta za teknolojia."
      },
      
      // Virtual Speaking pricing
      'Virtual Speaking': {
        currency: 'TZS',
        packages: [
          {
            name: "Uwasilishaji Mtandaoni",
            price: 1500000,
            billingCycle: "kwa tukio",
            description: "Uwasilishaji wa mtandaoni wa kuvutia na vipengele vya kushirikishana",
            features: [
              "Uwasilishaji wa mtandaoni wa dakika 60",
              "Kura za kushirikishana na maswali na majibu",
              "Uongozaji wa chumba cha mapumziko",
              "Nyenzo za uwasilishaji za kidijitali",
              "Urekodi kwa matumizi ya baadaye",
              "Msaada wa usanidi wa kiufundi"
            ],
            popular: false,
            platform: "Zoom, Teams, au jukwaa linalotaka"
          },
          {
            name: "Warsha ya Mtandaoni",
            price: 2500000,
            billingCycle: "kwa warsha",
            description: "Warsha ya mtandaoni ya kushirikishana na shughuli za vitendakazi na kazi ya kikundi",
            features: [
              "Warsha ya mtandaoni ya masaa 3-4",
              "Vikao vya kushirikishana vya mapumziko",
              "Zana za ushirikiano za kidijitali",
              "Shughuli za ubao mweupe wa mtandaoni",
              "Mazoezi ya kibinafsi na ya kikundi",
              "Kifurushi cha rasilimali za kufuatilia",
              "Msaada wa barua pepe wa siku 30"
            ],
            popular: true,
            platform: "Zoom, Teams, au jukwaa linalotaka"
          },
          {
            name: "Mfululizo wa Mtandaoni",
            price: 5000000,
            billingCycle: "kwa mfululizo",
            description: "Mfululizo wa kujifunza wa mtandaoni wa vikao vingi na ushirikiano unaoendelea",
            features: [
              "Mfululizo wa mtandaoni wa vikao 4 (masaa 2 kila kimoja)",
              "Mtaala wa kujenga ujuzi wa kuhakikisha maendeleo",
              "Kujifunza kwa wenzao na uwandani",
              "Kazi za kila wiki na shughuli",
              "Vipengele vya mafunzo ya kikundi",
              "Maktaba kamili ya rasilimali",
              "Cheti cha kukamilisha",
              "Kikundi cha msaada wa waliohitimu wa miezi 3"
            ],
            popular: false,
            platform: "Zoom, Teams, au jukwaa linalotaka"
          }
        ],
        customNote: "Matukio yote ya mtandaoni yanajumuisha msaada wa mchezo wa kiufundi na usanidi wa jukwaa. Uratibu wa ukanda wa saa unapatikana kwa hadhira za kimataifa."
      }
    }
};
// This data structure provides a comprehensive overview of pricing packages for various services offered by the company.
// Each service category includes multiple packages with detailed features, pricing, and delivery information.