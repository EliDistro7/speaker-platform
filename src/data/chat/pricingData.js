// app/data/pricingData.js

export const pricingData = {
    en: {
      // Website Development pricing packages
      'Website Development': {
        currency: 'USD',
        packages: [
          {
            name: "Basic",
            price: 1200,
            billingCycle: "one-time",
            description: "Perfect for small businesses needing a professional online presence",
            features: [
              "5-page responsive website",
              "Mobile-friendly design",
              "Contact form integration",
              "Basic SEO setup",
              "Social media integration",
              "Google Analytics setup",
              "1 hour training session"
            ],
            popular: false,
            deliveryTime: "2-3 weeks"
          },
          {
            name: "Standard",
            price: 2800,
            billingCycle: "one-time",
            description: "Comprehensive solution for growing businesses with more complex needs",
            features: [
              "10-page responsive website",
              "Custom design & branding",
              "Advanced contact forms",
              "Content management system",
              "Blog/news section",
              "Comprehensive SEO setup",
              "Social media integration",
              "Google Analytics & Search Console",
              "Speed optimization",
              "2 hours of training"
            ],
            popular: true,
            deliveryTime: "3-5 weeks"
          },
          {
            name: "Premium",
            price: 6000,
            billingCycle: "one-time",
            description: "Advanced website solution with custom functionality for established businesses",
            features: [
              "15+ page responsive website",
              "Custom design with unique branding",
              "Advanced content management system",
              "Custom functionality development",
              "E-commerce integration (if needed)",
              "Advanced SEO optimization",
              "Website security enhancements",
              "Performance optimization",
              "Multi-language support",
              "4 hours of training"
            ],
            popular: false,
            deliveryTime: "6-8 weeks"
          }
        ],
        customNote: "Custom website development with specific requirements is available. Contact us for a personalized quote."
      },
      
      // E-commerce Solutions pricing
      'E-commerce Solutions': {
        currency: 'USD',
        packages: [
          {
            name: "Starter Store",
            price: 2500,
            billingCycle: "one-time",
            description: "Basic e-commerce solution for businesses just starting online sales",
            features: [
              "Up to 50 products",
              "Responsive design",
              "Basic product filtering",
              "Secure payment integration",
              "Order management system",
              "Customer account creation",
              "Basic inventory management",
              "Standard shipping options",
              "2 hours of training"
            ],
            popular: false,
            deliveryTime: "3-4 weeks"
          },
          {
            name: "Business Store",
            price: 4500,
            billingCycle: "one-time",
            description: "Comprehensive e-commerce platform for established businesses",
            features: [
              "Up to 250 products",
              "Custom design and branding",
              "Advanced product filtering & search",
              "Multiple payment gateways",
              "Discount and coupon system",
              "Advanced inventory management",
              "Multiple shipping options",
              "Customer reviews and ratings",
              "Wishlist functionality",
              "Basic CRM integration",
              "3 hours of training"
            ],
            popular: true,
            deliveryTime: "5-7 weeks"
          },
          {
            name: "Enterprise Store",
            price: 8000,
            billingCycle: "one-time",
            description: "Advanced e-commerce solution for large businesses with complex needs",
            features: [
              "Unlimited products",
              "Fully custom design and UX",
              "Advanced product configurators",
              "Multiple currencies support",
              "Advanced CRM integration",
              "Automated inventory management",
              "Multi-warehouse support",
              "Subscription-based products option",
              "Advanced analytics and reporting",
              "Multi-language support",
              "Customer loyalty program",
              "5 hours of training"
            ],
            popular: false,
            deliveryTime: "8-12 weeks"
          }
        ],
        customNote: "For B2B e-commerce platforms, marketplaces, or specialized e-commerce needs, please contact us for a custom quote."
      },
      
      // Web Maintenance pricing
      'Web Maintenance': {
        currency: 'USD',
        packages: [
          {
            name: "Basic Care",
            price: 99,
            billingCycle: "monthly",
            description: "Essential maintenance for small business websites",
            features: [
              "Monthly security updates",
              "Weekly website backups",
              "Uptime monitoring",
              "Monthly performance report",
              "1 hour of content updates per month",
              "Email support"
            ],
            popular: false,
            deliveryTime: "Ongoing"
          },
          {
            name: "Standard Care",
            price: 249,
            billingCycle: "monthly",
            description: "Comprehensive maintenance for business websites with regular updates",
            features: [
              "Weekly security updates",
              "Daily website backups",
              "24/7 uptime monitoring",
              "Monthly in-depth performance report",
              "3 hours of content updates per month",
              "Minor design changes",
              "Plugin and theme updates",
              "Email and phone support",
              "48-hour response time"
            ],
            popular: true,
            deliveryTime: "Ongoing"
          },
          {
            name: "Premium Care",
            price: 499,
            billingCycle: "monthly",
            description: "Complete maintenance solution for business-critical websites",
            features: [
              "Weekly security updates & monitoring",
              "Daily website backups",
              "24/7 uptime monitoring with alerts",
              "Monthly security scans",
              "Speed optimization",
              "5 hours of content updates per month",
              "Regular design improvements",
              "Monthly strategy consultation",
              "Priority email and phone support",
              "24-hour response time"
            ],
            popular: false,
            deliveryTime: "Ongoing"
          }
        ],
        customNote: "We also offer pay-as-you-go maintenance services at $75/hour for clients who need occasional support."
      },
      
      // SEO Optimization pricing
      'SEO Optimization': {
        currency: 'USD',
        packages: [
          {
            name: "SEO Essentials",
            price: 450,
            billingCycle: "monthly",
            minimumTerm: "3 months",
            description: "Basic SEO services for local businesses looking to improve their online visibility",
            features: [
              "Keyword research (10 keywords)",
              "Competitor analysis",
              "On-page SEO optimization",
              "Google My Business optimization",
              "Monthly performance report",
              "Basic local SEO",
              "Content recommendations"
            ],
            popular: false,
            deliveryTime: "Results typically in 3-4 months"
          },
          {
            name: "SEO Professional",
            price: 900,
            billingCycle: "monthly",
            minimumTerm: "3 months",
            description: "Comprehensive SEO strategy for businesses seeking significant improvement in search rankings",
            features: [
              "Advanced keyword research (25 keywords)",
              "Comprehensive competitor analysis",
              "Complete on-page SEO optimization",
              "Content creation (2 articles/month)",
              "Technical SEO improvements",
              "Link building (5 quality backlinks/month)",
              "Local SEO optimization",
              "Schema markup implementation",
              "Bi-weekly performance reports"
            ],
            popular: true,
            deliveryTime: "Results typically in 2-3 months"
          },
          {
            name: "SEO Enterprise",
            price: 1800,
            billingCycle: "monthly",
            minimumTerm: "6 months",
            description: "Advanced SEO campaign for businesses targeting competitive markets and keywords",
            features: [
              "Comprehensive keyword research (50+ keywords)",
              "In-depth competitor and market analysis",
              "Advanced on-page and technical SEO",
              "Content strategy and creation (4 articles/month)",
              "Aggressive link building (10+ quality backlinks/month)",
              "Conversion rate optimization",
              "International SEO (if applicable)",
              "Advanced schema markup",
              "Weekly performance reports",
              "Monthly strategy consultation"
            ],
            popular: false,
            deliveryTime: "Results typically in 1-3 months"
          }
        ],
        customNote: "SEO results vary based on competition, industry, and current website condition. We offer customized SEO campaigns tailored to specific business goals."
      },
      
      // Social Media Management pricing
      'Social Media Management': {
        currency: 'USD',
        packages: [
          {
            name: "Social Starter",
            price: 350,
            billingCycle: "monthly",
            description: "Basic social media management for small businesses",
            features: [
              "Management of 2 platforms",
              "12 posts per month",
              "Basic content calendar",
              "Community management",
              "Monthly performance report"
            ],
            popular: false,
            platforms: ["Facebook", "Instagram"]
          },
          {
            name: "Social Growth",
            price: 750,
            billingCycle: "monthly",
            description: "Comprehensive social media management for established businesses",
            features: [
              "Management of 3 platforms",
              "20 posts per month",
              "Content calendar",
              "Community management",
              "Hashtag strategy",
              "Basic influencer outreach",
              "2 graphic designs per month",
              "Bi-weekly performance reports",
              "Competitor monitoring"
            ],
            popular: true,
            platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn"]
          },
          {
            name: "Social Domination",
            price: 1500,
            billingCycle: "monthly",
            description: "Advanced social media management for businesses seeking significant growth",
            features: [
              "Management of 4+ platforms",
              "30+ posts per month",
              "Strategic content calendar",
              "Advanced community management",
              "Comprehensive hashtag strategy",
              "Influencer collaboration",
              "5 custom graphic designs per month",
              "2 short video creations per month",
              "Weekly performance reports",
              "Social media advertising management (ads budget not included)",
              "Crisis management planning"
            ],
            popular: false,
            platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "Pinterest"]
          }
        ],
        customNote: "Social media advertising budgets are separate from management fees. We can provide recommendations based on your goals and target audience."
      }
    },
    sw: {
      // Website Development pricing packages
      'Website Development': {
        currency: 'TZS',
        packages: [
          {
            name: "Msingi",
            price: 1200000,
            billingCycle: "one-time",
            description: "Inafaa kwa biashara ndogo zinazohitaji uwepo wa kitaalamu mtandaoni",
            features: [
              "Tovuti yenye kurasa 5 inayoitikia",
              "Muundo rafiki wa simu",
              "Ujumuishaji wa fomu ya mawasiliano",
              "Usanidi wa msingi wa SEO",
              "Ujumuishaji wa mitandao ya kijamii",
              "Usanidi wa Google Analytics",
              "Kipindi cha mafunzo cha saa 1"
            ],
            popular: false,
            deliveryTime: "Wiki 2-3"
          },
          {
            name: "Kawaida",
            price: 2800000,
            billingCycle: "one-time",
            description: "Suluhisho kamili kwa biashara zinazokua zenye mahitaji zaidi ya kina",
            features: [
              "Tovuti yenye kurasa 10 inayoitikia",
              "Muundo na chapa ya kipekee",
              "Fomu za mawasiliano za hali ya juu",
              "Mfumo wa usimamizi wa maudhui",
              "Sehemu ya blogu/habari",
              "Usanidi kamili wa SEO",
              "Ujumuishaji wa mitandao ya kijamii",
              "Google Analytics na Search Console",
              "Uboreshaji wa kasi",
              "Masaa 2 ya mafunzo"
            ],
            popular: true,
            deliveryTime: "Wiki 3-5"
          },
          {
            name: "Premium",
            price: 6000000,
            billingCycle: "one-time",
            description: "Suluhisho la tovuti la hali ya juu na utendaji wa kipekee kwa biashara zilizoimarika",
            features: [
              "Tovuti yenye kurasa 15+ inayoitikia",
              "Muundo wa kipekee na chapa ya kipekee",
              "Mfumo wa usimamizi wa maudhui wa hali ya juu",
              "Maendeleo ya utendaji wa kipekee",
              "Ujumuishaji wa biashara ya mtandaoni (ikihitajika)",
              "Uboreshaji wa SEO wa hali ya juu",
              "Uboreshaji wa usalama wa tovuti",
              "Uboreshaji wa utendaji",
              "Msaada wa lugha nyingi",
              "Masaa 4 ya mafunzo"
            ],
            popular: false,
            deliveryTime: "Wiki 6-8"
          }
        ],
        customNote: "Utengenezaji wa tovuti maalum kwa mahitaji maalum unapatikana. Wasiliana nasi kwa nukuu ya kibinafsi."
      },
      
      // E-commerce Solutions pricing
      'E-commerce Solutions': {
        currency: 'TZS',
        packages: [
          {
            name: "Duka la Kuanzia",
            price: 2500000,
            billingCycle: "one-time",
            description: "Suluhisho la msingi la biashara mtandaoni kwa biashara zinazoanza mauzo mtandaoni",
            features: [
              "Hadi bidhaa 50",
              "Muundo unaoitikia",
              "Uchujaji wa bidhaa wa msingi",
              "Ujumuishaji wa malipo salama",
              "Mfumo wa usimamizi wa oda",
              "Uundaji wa akaunti ya mteja",
              "Usimamizi wa msingi wa mali",
              "Chaguo za kawaida za usafirishaji",
              "Masaa 2 ya mafunzo"
            ],
            popular: false,
            deliveryTime: "Wiki 3-4"
          },
          {
            name: "Duka la Biashara",
            price: 4500000,
            billingCycle: "one-time",
            description: "Jukwaa kamili la biashara mtandaoni kwa biashara zilizoimarika",
            features: [
              "Hadi bidhaa 250",
              "Muundo wa kipekee na chapa",
              "Uchujaji wa bidhaa wa hali ya juu na utafutaji",
              "Malango mengi ya malipo",
              "Mfumo wa punguzo na kuponi",
              "Usimamizi wa mali wa hali ya juu",
              "Chaguo nyingi za usafirishaji",
              "Maoni na tathmini za wateja",
              "Utendaji wa orodha ya matakwa",
              "Ujumuishaji wa msingi wa CRM",
              "Masaa 3 ya mafunzo"
            ],
            popular: true,
            deliveryTime: "Wiki 5-7"
          },
          {
            name: "Duka la Kampuni",
            price: 8000000,
            billingCycle: "one-time",
            description: "Suluhisho la hali ya juu la biashara mtandaoni kwa biashara kubwa zenye mahitaji magumu",
            features: [
              "Bidhaa zisizo na kikomo",
              "Muundo wa kipekee kabisa na UX",
              "Visanidi vya bidhaa vya hali ya juu",
              "Msaada wa fedha nyingi",
              "Ujumuishaji wa CRM wa hali ya juu",
              "Usimamizi wa mali wa kiotomatiki",
              "Msaada wa ghala nyingi",
              "Chaguo la bidhaa za misingi ya usajili",
              "Uchambuzi na ripoti za hali ya juu",
              "Msaada wa lugha nyingi",
              "Programu ya uaminifu wa mteja",
              "Masaa 5 ya mafunzo"
            ],
            popular: false,
            deliveryTime: "Wiki 8-12"
          }
        ],
        customNote: "Kwa majukwaa ya biashara mtandaoni ya B2B, masoko, au mahitaji maalum ya biashara mtandaoni, tafadhali wasiliana nasi kwa nukuu ya kibinafsi."
      },
      
      // Web Maintenance pricing
      'Web Maintenance': {
        currency: 'TZS',
        packages: [
          {
            name: "Utunzaji wa Msingi",
            price: 99000,
            billingCycle: "monthly",
            description: "Matengenezo muhimu kwa tovuti za biashara ndogo",
            features: [
              "Sasisho za usalama za kila mwezi",
              "Nakala rudufu za tovuti za kila wiki",
              "Ufuatiliaji wa muda wa juu",
              "Ripoti ya utendaji ya kila mwezi",
              "Saa 1 ya sasisho za maudhui kwa mwezi",
              "Msaada wa barua pepe"
            ],
            popular: false,
            deliveryTime: "Inaendelea"
          },
          {
            name: "Utunzaji wa Kawaida",
            price: 249000,
            billingCycle: "monthly",
            description: "Matengenezo kamili kwa tovuti za biashara zenye sasisho za mara kwa mara",
            features: [
              "Sasisho za usalama za kila wiki",
              "Nakala rudufu za tovuti za kila siku",
              "Ufuatiliaji wa muda wa juu 24/7",
              "Ripoti ya kina ya utendaji ya kila mwezi",
              "Masaa 3 ya sasisho za maudhui kwa mwezi",
              "Mabadiliko madogo ya muundo",
              "Sasisho za programu-jalizi na mandhari",
              "Msaada wa barua pepe na simu",
              "Muda wa majibu wa saa 48"
            ],
            popular: true,
            deliveryTime: "Inaendelea"
          },
          {
            name: "Utunzaji wa Premium",
            price: 499000,
            billingCycle: "monthly",
            description: "Suluhisho kamili la matengenezo kwa tovuti muhimu za biashara",
            features: [
              "Sasisho na ufuatiliaji wa usalama wa kila wiki",
              "Nakala rudufu za tovuti za kila siku",
              "Ufuatiliaji wa muda wa juu 24/7 na arifa",
              "Uchunguzi wa usalama wa kila mwezi",
              "Uboreshaji wa kasi",
              "Masaa 5 ya sasisho za maudhui kwa mwezi",
              "Uboreshaji wa mara kwa mara wa muundo",
              "Ushauri wa kimkakati wa kila mwezi",
              "Kipaumbele kwa msaada wa barua pepe na simu",
              "Muda wa majibu wa saa 24"
            ],
            popular: false,
            deliveryTime: "Inaendelea"
          }
        ],
        customNote: "Tunatoa pia huduma za matengenezo ya kulipa-unapotumia kwa TZS 75,000/saa kwa wateja wanaohitaji msaada wa mara kwa mara."
      },
      
      // SEO Optimization pricing
      'SEO Optimization': {
        currency: 'TZS',
        packages: [
          {
            name: "SEO ya Msingi",
            price: 450000,
            billingCycle: "monthly",
            minimumTerm: "miezi 3",
            description: "Huduma za msingi za SEO kwa biashara za ndani zinazotafuta kuboresha muonekano wao mtandaoni",
            features: [
              "Utafiti wa maneno muhimu (maneno 10)",
              "Uchambuzi wa washindani",
              "Uboreshaji wa SEO kwenye kurasa",
              "Uboreshaji wa Google My Business",
              "Ripoti ya utendaji ya kila mwezi",
              "SEO ya ndani ya msingi",
              "Mapendekezo ya maudhui"
            ],
            popular: false,
            deliveryTime: "Matokeo kwa kawaida katika miezi 3-4"
          },
          {
            name: "SEO ya Kitaalamu",
            price: 900000,
            billingCycle: "monthly",
            minimumTerm: "miezi 3",
            description: "Mkakati kamili wa SEO kwa biashara zinazotafuta uboreshaji mkubwa katika nafasi za utafutaji",
            features: [
              "Utafiti wa kina wa maneno muhimu (maneno 25)",
              "Uchambuzi kamili wa washindani",
              "Uboreshaji kamili wa SEO kwenye kurasa",
              "Uundaji wa maudhui (makala 2/mwezi)",
              "Uboreshaji wa kiufundi wa SEO",
              "Ujenzi wa viungo (viungo vya ubora 5/mwezi)",
              "Uboreshaji wa SEO ya ndani",
              "Utekelezaji wa alama za muundo",
              "Ripoti za utendaji za kila wiki mbili"
            ],
            popular: true,
            deliveryTime: "Matokeo kwa kawaida katika miezi 2-3"
          },
          {
            name: "SEO ya Kampuni",
            price: 1800000,
            billingCycle: "monthly",
            minimumTerm: "miezi 6",
            description: "Kampeni ya SEO ya hali ya juu kwa biashara zinazolenga masoko na maneno muhimu ya ushindani",
            features: [
              "Utafiti kamili wa maneno muhimu (maneno 50+)",
              "Uchambuzi wa kina wa washindani na soko",
              "SEO ya hali ya juu kwenye na nje ya kurasa",
              "Mkakati na uundaji wa maudhui (makala 4/mwezi)",
              "Ujenzi mkali wa viungo (viungo vya ubora 10+/mwezi)",
              "Uboreshaji wa kiwango cha ubadilishaji",
              "SEO ya kimataifa (inapohitajika)",
              "Alama za muundo za hali ya juu",
              "Ripoti za utendaji za kila wiki",
              "Ushauri wa kimkakati wa kila mwezi"
            ],
            popular: false,
            deliveryTime: "Matokeo kwa kawaida katika miezi 1-3"
          }
        ],
        customNote: "Matokeo ya SEO hutofautiana kulingana na ushindani, sekta, na hali ya sasa ya tovuti. Tunatoa kampeni za SEO zilizobinafsishwa kulingana na malengo maalum ya biashara."
      },
      
      // Social Media Management pricing
      'Social Media Management': {
        currency: 'TZS',
        packages: [
          {
            name: "Mitandao ya Kuanzia",
            price: 350000,
            billingCycle: "monthly",
            description: "Usimamizi wa msingi wa mitandao ya kijamii kwa biashara ndogo",
            features: [
              "Usimamizi wa majukwaa 2",
              "Machapisho 12 kwa mwezi",
              "Kalenda ya msingi ya maudhui",
              "Usimamizi wa jumuiya",
              "Ripoti ya utendaji ya kila mwezi"
            ],
            popular: false,
            platforms: ["Facebook", "Instagram"]
          },
          {
            name: "Ukuaji wa Mitandao",
            price: 750000,
            billingCycle: "monthly",
            description: "Usimamizi kamili wa mitandao ya kijamii kwa biashara zilizoimarika",
            features: [
              "Usimamizi wa majukwaa 3",
              "Machapisho 20 kwa mwezi",
              "Kalenda ya maudhui",
              "Usimamizi wa jumuiya",
              "Mkakati wa hashtag",
              "Ufikio wa msingi wa waathiri",
              "Miundo 2 ya grafiki kwa mwezi",
              "Ripoti za utendaji za kila wiki mbili",
              "Ufuatiliaji wa washindani"
            ],
            popular: true,
            platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn"]
          },
          {
            name: "Utawala wa Mitandao",
            price: 1500000,
            billingCycle: "monthly",
            description: "Usimamizi wa hali ya juu wa mitandao ya kijamii kwa biashara zinazotafuta ukuaji mkubwa",
            features: [
              "Usimamizi wa majukwaa 4+",
              "Machapisho 30+ kwa mwezi",
              "Kalenda ya kimkakati ya maudhui",
              "Usimamizi wa jumuiya wa hali ya juu",
              "Mkakati kamili wa hashtag",
              "Ushirikiano na waathiri",
              "Miundo 5 ya kipekee ya grafiki kwa mwezi",
              "Uundaji wa video fupi 2 kwa mwezi",
              "Ripoti za utendaji za kila wiki",
              "Usimamizi wa matangazo ya mitandao ya kijamii (bajeti ya matangazo haijajumuishwa)",
              "Mpango wa usimamizi wa mgogoro"
            ],
            popular: false,
            platforms: ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "Pinterest"]
          }
        ],
        customNote: "Bajeti za matangazo ya mitandao ya kijamii ni tofauti na ada za usimamizi. Tunaweza kutoa mapendekezo kulingana na malengo yako na walengwa."
      }
    }
};