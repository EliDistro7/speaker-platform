// app/data/chatbotData.js

export const chatbotData = {
    // Welcome messages in English and Swahili
    welcome: {
      en: "👋 Hi there! I'm your AI assistant. How can I help with your web development and design needs today?",
      sw: "👋 Habari! Mimi ni msaidizi wako wa AI. Ninawezaje kukusaidia na mahitaji yako ya utengenezaji wa tovuti na ubunifu leo?"
    },
  
    // Default responses when no specific match is found
    defaultResponse: {
      en: "I'm not sure I understand completely. You can ask me about our services including: website development, UI/UX design, professional emails, social media management, e-commerce solutions, web maintenance, SEO optimization, or content management systems.",
      sw: "Sijui kama ninaelewa kabisa. Unaweza kuniuliza kuhusu huduma zetu ikiwa ni pamoja na: utengenezaji wa tovuti, ubunifu wa UI/UX, barua pepe za kikazi, usimamizi wa mitandao ya kijamii, suluhisho za biashara mtandao, matengenezo ya tovuti, uboreshaji wa SEO, au mifumo ya usimamizi wa maudhui."
    },
  
    // Quick prompts suggestions
    prompts: {
      en: [
        "What services do you offer?",
        "Website development pricing",
        "UI/UX design portfolio",
        "E-commerce solutions",
        "SEO optimization",
        "Contact information"
      ],
      sw: [
        "Unatoa huduma gani?",
        "Bei ya utengenezaji wa tovuti",
        "Portfolio ya ubunifu wa UI/UX",
        "Suluhisho za biashara mtandao",
        "Uboreshaji wa SEO",
        "Maelezo ya mawasiliano"
      ]
    },
  
    // Expanded service keywords for better matching
    serviceKeywords: {
      en: {
        'Website Development': [
          'website', 'web development', 'site', 'web app', 'frontend', 'backend', 
          'responsive design', 'web project', 'build a website', 'create a website',
          'landing page', 'webpage', 'static site', 'dynamic site', 'web application',
          'site development', 'coding', 'programming', 'html', 'css', 'javascript',
          'react', 'vue', 'angular', 'nextjs', 'gatsby', 'wordpress', 'website builder'
        ],
        'UI/UX Design': [
          'design', 'ui', 'ux', 'interface', 'user experience', 'user interface',
          'wireframe', 'prototype', 'mockup', 'usability', 'accessibility',
          'graphic design', 'visual design', 'interaction design', 'design system',
          'branding', 'logo design', 'typography', 'color scheme', 'design thinking',
          'user research', 'user testing', 'user flow', 'information architecture'
        ],
        'Professional Business Emails': [
          'email', 'business email', 'professional email', 'corporate email',
          'email setup', 'google workspace', 'microsoft 365', 'email hosting',
          'email template', 'email signature', 'mail server', 'custom domain email',
          'outlook', 'gmail for business', 'email configuration', 'email management',
          'email marketing', 'newsletter', 'autoresponder', 'email campaign'
        ],
        'Social Media Management': [
          'social media', 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok',
          'marketing', 'social marketing', 'content creation', 'social strategy',
          'community management', 'post scheduling', 'social analytics', 'engagement',
          'followers', 'audience growth', 'social presence', 'brand awareness',
          'social media audit', 'social media advertising', 'digital marketing',
          'community building', 'content calendar', 'hashtag strategy'
        ],
        'E-commerce Solutions': [
          'e-commerce', 'online store', 'shop', 'payment', 'cart', 'checkout',
          'product catalog', 'inventory management', 'order processing', 'shipping',
          'woocommerce', 'shopify', 'magento', 'payment gateway', 'online payments',
          'digital products', 'e-commerce platform', 'product pages', 'shopping cart',
          'abandoned cart', 'customer accounts', 'product search', 'filters'
        ],
        'Web Maintenance': [
          'maintenance', 'update', 'security', 'hosting', 'backup', 'monitoring',
          'website care', 'website update', 'security patches', 'uptime monitoring',
          'performance optimization', 'bug fixes', 'website backup', 'site management',
          'regular updates', 'website support', 'technical support', 'website health',
          'site speed', 'plugin updates', 'website maintenance plan'
        ],
        'SEO Optimization': [
          'seo', 'search engine optimization', 'google ranking', 'search ranking',
          'visibility', 'keyword research', 'meta tags', 'site structure', 'backlinks',
          'organic traffic', 'serp', 'search results', 'analytics', 'indexing',
          'link building', 'local seo', 'content optimization', 'seo audit',
          'on-page seo', 'off-page seo', 'technical seo', 'search console'
        ],
        'Content Management': [
          'cms', 'content', 'blog', 'content creation', 'content strategy',
          'wordpress', 'content updates', 'blogging', 'article writing',
          'copywriting', 'content calendar', 'web content', 'content marketing',
          'publishing system', 'content workflow', 'website content', 'cms setup',
          'content editor', 'website text', 'content management system'
        ],
        'Web Hosting': [
          'hosting', 'web host', 'server', 'domain', 'domain name', 'dns',
          'shared hosting', 'vps', 'dedicated server', 'cloud hosting',
          'managed hosting', 'website migration', 'hosting plan', 'cpanel',
          'ssl certificate', 'https', 'bandwidth', 'storage', 'web server'
        ]
      },
      sw: {
        'Website Development': [
          'tovuti', 'kutengeneza tovuti', 'wavuti', 'programu ya wavuti',
          'kuunda tovuti', 'kujenga tovuti', 'ukurasa wa tovuti', 'wavuti ya biashara',
          'kutengeneza wavuti', 'kujenga mtandao', 'programu ya mtandao', 'mtandao wa kampuni',
          'kuunda mtandao', 'coding', 'kuprogramu', 'html', 'css', 'javascript',
          'react', 'vue', 'angular', 'nextjs', 'wordpress'
        ],
        'UI/UX Design': [
          'muundo', 'ui', 'ux', 'interface', 'zoefu la mtumiaji', 'kiolesura',
          'dizenisha', 'muundo wa tovuti', 'uchoraji', 'ubunifu wa kivinjari',
          'mpango wa rangi', 'muundo wa matumizi', 'mfumo wa matumizi',
          'ubunifu wa chapa', 'utafiti wa watumiaji', 'nembo', 'alama ya biashara'
        ],
        'Professional Business Emails': [
          'barua pepe', 'barua za kikazi', 'email', 'barua pepe za biashara',
          'anwani za barua pepe', 'gmail kwa biashara', 'msaada wa barua pepe',
          'usanidi wa barua pepe', 'mfumo wa barua pepe', 'seva ya barua pepe',
          'barua pepe ya kampuni', 'domain ya barua pepe'
        ],
        'Social Media Management': [
          'mitandao ya kijamii', 'facebook', 'instagram', 'twitter', 'tiktok',
          'ujenzi wa chapa', 'utangazaji', 'masoko ya mitandao', 'masoko ya dijitali',
          'kukuza mtandao wa kijamii', 'kusimamia mitandao ya kijamii', 'ufuatiliaji wa mitandao',
          'usimamizi wa jumuiya', 'kuongeza wafuasi', 'kupata watu zaidi',
          'mpango wa mitandao ya kijamii', 'kuunda maudhui', 'kampeni za mitandao'
        ],
        'E-commerce Solutions': [
          'biashara mtandao', 'duka online', 'duka la mtandao', 'malipo', 'ununuzi',
          'mfumo wa kikapu', 'lipa mtandaoni', 'bidhaa za mtandao', 'mauzo mtandaoni',
          'kutuma bidhaa', 'mfumo wa biashara', 'woocommerce', 'shopify', 'vifurushi',
          'biashara ya dijitali', 'katalogi ya bidhaa', 'bidhaa za dijitali'
        ],
        'Web Maintenance': [
          'matengenezo', 'sasisho', 'usalama', 'hosting', 'ukarabati wa tovuti',
          'huduma ya mtandao', 'kuhifadhi data', 'ufuatiliaji wa utendaji',
          'marekebisho ya hitilafu', 'msaada wa kiufundi', 'uboreshaji wa utendaji',
          'mpango wa matengenezo', 'uhifadhi wa tovuti', 'ulinzi wa wavuti'
        ],
        'SEO Optimization': [
          'seo', 'kutafuta uboreshaji wa injini', 'orodha ya kutafuta', 'google ranking',
          'utoaji wa seva za mtandao', 'kuongeza trafiki', 'utafiti wa maneno muhimu',
          'meta tags', 'kuongeza ushahidi', 'onyesho la google', 'kuongeza watumiaji',
          'uchunguzi wa tovuti', 'kufuatilia matokeo', 'uchunguzi wa SEO'
        ],
        'Content Management': [
          'cms', 'usimamizi wa maudhui', 'blogi', 'uandishi wa makala', 'kutengeneza maudhui',
          'maudhui ya tovuti', 'waraka wa tovuti', 'mfumo wa maudhui', 'kuhariri maudhui',
          'uchapishaji wa maudhui', 'mpango wa maudhui', 'nakala ya tovuti',
          'wordpress', 'mfumo wa usimamizi wa maudhui'
        ],
        'Web Hosting': [
          'hosting', 'kupangisha', 'seva', 'domain', 'jina la tovuti', 'dns',
          'kupangisha seva', 'vps', 'servidor binafsi', 'wingu', 'uhifadhi wa data',
          'uhamisishaji wa tovuti', 'mpango wa kupangisha', 'cheti cha ssl',
          'https', 'upeo wa data', 'hifadhi', 'seva ya mtandao'
        ]
      }
    },
  
    // Detailed service descriptions
    serviceDescriptions: {
      en: {
        'Website Development': "Our professional website development services create custom, responsive, and high-performing websites tailored to your business needs. We use modern technologies like React, Next.js, and WordPress to build everything from simple landing pages to complex web applications. All our websites are mobile-friendly, fast-loading, and designed with your users in mind.",
        'UI/UX Design': "Our UI/UX design services focus on creating intuitive, engaging, and user-friendly digital experiences. We conduct user research, create wireframes and prototypes, and design visually appealing interfaces that enhance user satisfaction. Our design process ensures your digital products are not only beautiful but also functional and easy to navigate.",
        'Professional Business Emails': "Elevate your business communication with our professional email solutions. We'll set up custom domain emails, configure email clients, create professional signatures, and ensure reliable delivery. Our services include Google Workspace or Microsoft 365 integration, email security, and ongoing support to keep your business communications running smoothly.",
        'Social Media Management': "Our comprehensive social media management services help you build and maintain a strong online presence. We develop tailored social media strategies, create engaging content, schedule posts, interact with your audience, and provide detailed analytics. Let us help you grow your followers and increase engagement across all major platforms.",
        'E-commerce Solutions': "Transform your business with our complete e-commerce solutions. We build secure, user-friendly online stores with product catalog management, secure payment gateways, order processing, and inventory tracking. Whether you're using WooCommerce, Shopify, or custom solutions, we ensure a seamless shopping experience for your customers.",
        'Web Maintenance': "Keep your website running smoothly with our web maintenance services. We handle regular updates, security patches, performance optimization, content updates, and technical support. Our maintenance plans include regular backups, uptime monitoring, and quick response times to ensure your site stays secure and performs at its best.",
        'SEO Optimization': "Improve your online visibility and drive organic traffic with our SEO optimization services. We conduct keyword research, optimize on-page content, improve site structure, build quality backlinks, and provide regular performance reports. Our comprehensive approach helps your website rank higher in search results and reach your target audience.",
        'Content Management': "Our content management services make it easy to update and maintain your website content. We set up user-friendly CMS solutions, create content workflows, train your team, and provide ongoing support. Whether you need blog management, product updates, or complete content strategy, we've got you covered.",
        'Web Hosting': "Reliable web hosting is essential for your online presence. We offer secure, fast, and reliable hosting solutions with excellent uptime, regular backups, and technical support. Our hosting services include domain management, SSL certificates, email hosting, and scalable solutions to grow with your business."
      },
      sw: {
        'Website Development': "Huduma zetu za kitaalamu za utengenezaji wa tovuti huunda tovuti mahususi, zinazoweza kukabiliana na vifaa tofauti, na zenye utendaji wa hali ya juu zilizoundwa kulingana na mahitaji ya biashara yako. Tunatumia teknolojia za kisasa kama React, Next.js, na WordPress kujenga kila kitu kuanzia kurasa rahisi za kutua hadi programu ngumu za wavuti. Tovuti zetu zote zinakubaliana na simu za mkononi, kupakia kwa kasi, na kuundwa kwa kuzingatia watumiaji wako.",
        'UI/UX Design': "Huduma zetu za ubunifu wa UI/UX zinazingatia kuunda uzoefu wa dijitali unaoeleweka, unaovutia, na rafiki kwa mtumiaji. Tunafanya utafiti wa watumiaji, kuunda wireframes na prototype, na kuunda interfaces zinazovutia zinazoboresha kuridhika kwa mtumiaji. Mchakato wetu wa usanifu unahakikisha kuwa bidhaa zako za dijitali sio tu nzuri lakini pia zinafanya kazi na rahisi kuzabiri.",
        'Professional Business Emails': "Inua mawasiliano ya biashara yako na suluhisho zetu za barua pepe za kitaalamu. Tutasanidi barua pepe za domain maalum, kusanidi wateja wa barua pepe, kuunda saini za kitaalamu, na kuhakikisha uwasilishaji wa kuaminika. Huduma zetu zinajumuisha ushirikiano wa Google Workspace au Microsoft 365, usalama wa barua pepe, na msaada unaoendelea ili kuweka mawasiliano ya biashara yako yakiendelea vizuri.",
        'Social Media Management': "Huduma zetu kamili za usimamizi wa mitandao ya kijamii zinakusaidia kujenga na kudumisha uwepo thabiti mtandaoni. Tunaendeleza mikakati ya mitandao ya kijamii iliyotengenezwa mahususi, kuunda maudhui yanayovutia, kupanga machapisho, kushirikiana na hadhira yako, na kutoa uchanganuzi wa kina. Turuhusu tukusaidie kukuza wafuasi wako na kuongeza ushirikishwaji katika majukwaa yote makuu.",
        'E-commerce Solutions': "Badilisha biashara yako na suluhisho zetu kamili za biashara mtandao. Tunajenga maduka ya mtandaoni yaliyo salama, rafiki kwa mtumiaji na usimamizi wa katalogi ya bidhaa, njia salama za malipo, uchakataji wa agizo, na ufuatiliaji wa inventori. Ikiwa unatumia WooCommerce, Shopify, au suluhisho maalum, tunahakikisha uzoefu laini wa ununuzi kwa wateja wako.",
        'Web Maintenance': "Weka tovuti yako ikiendelea vizuri na huduma zetu za matengenezo ya wavuti. Tunashughulikia masasisho ya kawaida, viraka vya usalama, uboreshaji wa utendaji, masasisho ya yaliyomo, na msaada wa kiufundi. Mipango yetu ya matengenezo inajumuisha nakala rudufu za kawaida, ufuatiliaji wa wakati, na nyakati za haraka za majibu ili kuhakikisha tovuti yako inabaki salama na kufanya kazi vyema.",
        'SEO Optimization': "Boresha mwonekano wako wa mtandaoni na kuongoza trafiki ya organiki na huduma zetu za uboreshaji wa SEO. Tunafanya utafiti wa maneno muhimu, kuboresha maudhui ya ukurasa, kuboresha muundo wa tovuti, kujenga viungo vya ubora, na kutoa ripoti za kawaida za utendaji. Mbinu yetu kamili inasaidia tovuti yako kupata nafasi ya juu katika matokeo ya utaftaji na kufikia hadhira yako lengwa.",
        'Content Management': "Huduma zetu za usimamizi wa maudhui hufanya iwe rahisi kusasisha na kudumisha maudhui ya tovuti yako. Tunaweka suluhisho za CMS zinazofaa kwa mtumiaji, kuunda mtiririko wa maudhui, kufunza timu yako, na kutoa msaada unaoendelea. Ikiwa unahitaji usimamizi wa blogu, masasisho ya bidhaa, au mkakati kamili wa maudhui, tunakushughulikia.",
        'Web Hosting': "Hosting ya wavuti inayotegemeka ni muhimu kwa uwepo wako mtandaoni. Tunatoa suluhisho za hosting zilizo salama, za haraka, na za kuaminika zenye muda wa juu, nakala rudufu za kawaida, na msaada wa kiufundi. Huduma zetu za hosting zinajumuisha usimamizi wa domain, vyeti vya SSL, hosting ya barua pepe, na suluhisho zinazoweza kupanuliwa kukua na biashara yako."
      }
    },
  
    // FAQ data
    faqs: {
      en: [
        {
          question: "How much does a website cost?",
          answer: "Website costs vary depending on complexity and requirements. Basic informational websites typically range from $1,000-$3,000, while e-commerce or custom web applications may cost $3,000-$10,000+. We provide detailed quotes after understanding your specific needs."
        },
        {
          question: "How long does it take to build a website?",
          answer: "The timeline for website development depends on complexity. Simple websites may take 2-4 weeks, while more complex sites with custom functionality can take 1-3 months. We'll provide a specific timeline based on your project requirements."
        },
        {
          question: "Do you provide website hosting?",
          answer: "Yes, we offer reliable website hosting solutions with excellent uptime, security, and performance. Our hosting packages include regular backups, SSL certificates, and technical support to ensure your website runs smoothly."
        },
        {
          question: "Can you help with my existing website?",
          answer: "Absolutely! We can update, redesign, or improve your existing website. Our team can work with your current platform to implement new features, improve performance, enhance security, or completely refresh the design."
        },
        {
          question: "What is your maintenance plan?",
          answer: "Our website maintenance plans include regular updates, security patches, content updates, performance optimization, and technical support. We offer different tiers of service based on your needs, from basic monitoring to comprehensive ongoing support."
        }
      ],
      sw: [
        {
          question: "Tovuti ingharimu kiasi gani?",
          answer: "Gharama za tovuti zinatofautiana kulingana na ugumu na mahitaji. Tovuti za msingi za habari kwa kawaida huanzia Sh. 100,000-300,000, wakati biashara mtandao au programu za wavuti maalum zinaweza kugharimu Sh. 300,000-1,000,000+. Tunatoa makadirio ya kina baada ya kuelewa mahitaji yako mahususi."
        },
        {
          question: "Inachukua muda gani kutengeneza tovuti?",
          answer: "Muda wa kuendeleza tovuti unategemea ugumu. Tovuti rahisi zinaweza kuchukua wiki 2-4, wakati tovuti ngumu zaidi zenye utendaji maalum zinaweza kuchukua miezi 1-3. Tutakupa ratiba maalum kulingana na mahitaji ya mradi wako."
        },
        {
          question: "Je, unatoa huduma ya kupangisha tovuti?",
          answer: "Ndiyo, tunatoa suluhisho za kupangisha tovuti zinazotegemeka zenye muda mzuri wa juu, usalama, na utendaji. Vifurushi vyetu vya kupangisha vinajumuisha nakala rudufu za kawaida, vyeti vya SSL, na msaada wa kiufundi ili kuhakikisha tovuti yako inafanya kazi vizuri."
        },
        {
          question: "Je, unaweza kusaidia na tovuti yangu iliyopo?",
          answer: "Kabisa! Tunaweza kusasisha, kubuni upya, au kuboresha tovuti yako iliyopo. Timu yetu inaweza kufanya kazi na jukwaa lako la sasa kutekeleza vipengele vipya, kuboresha utendaji, kuimarisha usalama, au kuboresha kabisa muundo."
        },
        {
          question: "Mpango wako wa matengenezo ni upi?",
          answer: "Mipango yetu ya matengenezo ya tovuti inajumuisha masasisho ya kawaida, viraka vya usalama, masasisho ya yaliyomo, uboreshaji wa utendaji, na msaada wa kiufundi. Tunatoa tabaka mbalimbali za huduma kulingana na mahitaji yako, kutoka ufuatiliaji wa msingi hadi msaada kamili unaoendelea."
        }
      ]
    },
  
    // UI text elements
    ui: {
      title: {
        en: "Web Services Assistant",
        sw: "Msaidizi wa Huduma za Tovuti"
      },
      inputPlaceholder: {
        en: "Ask about our services...",
        sw: "Uliza kuhusu huduma zetu..."
      },
      askForDetails: {
        en: "Ask me about any of these services for more details!",
        sw: "Niulize kuhusu huduma yoyote kwa maelezo zaidi!"
      },
      contactUs: {
        en: "Contact Us",
        sw: "Wasiliana Nasi"
      },
      moreInfo: {
        en: "Would you like more information about this service?",
        sw: "Ungependa maelezo zaidi kuhusu huduma hii?"
      },
      pricingInfo: {
        en: "Would you like pricing information?",
        sw: "Ungependa maelezo ya bei?"
      }
    },
  
    // Contact information
    contactInfo: {
      en: {
        email: "info@barikaneno.com",
        phone: "+255765762688",
        address: "123 Yombo, Dar es Salaam",
        hours: "Monday-Friday: 9am-5pm"
      },
      sw: {
        email: "info@barikaneno.com",
        phone: "+255765762688",
        address: "123 Yombo, Dar es Salaam",
        hours: "Monday-Friday: 9am-5pm"
      }
    }
  };