// app/data/testimonials.js
export const testimonials = {
    en: [
      {
        name: "Sarah Johnson",
        company: "GrowthTech Solutions",
        image: "/images/testimonials/sarah-johnson.jpg",
        text: "Working with this team transformed our online presence. Our new website has increased conversions by 40% in just three months!",
        rating: 5
      },
      {
        name: "Michael Chen",
        company: "InnovateMind Startups",
        image: "/images/testimonials/michael-chen.jpg",
        text: "The e-commerce solution they built for us was exactly what we needed. User-friendly, scalable, and beautifully designed. Our customers love it.",
        rating: 5
      },
      {
        name: "Emma Rodriguez",
        company: "ArtisanCraft Collective",
        image: "/images/testimonials/emma-rodriguez.jpg",
        text: "Their UI/UX design expertise took our app to the next level. The interface is intuitive and our user engagement metrics have doubled.",
        rating: 4
      },
      {
        name: "Thomas Okafor",
        company: "GlobalReach Logistics",
        image: "/images/testimonials/thomas-okafor.jpg",
        text: "The SEO optimization package delivered beyond our expectations. We're now ranking on page one for all our target keywords.",
        rating: 5
      },
      {
        name: "Priya Sharma",
        company: "Wellness Connect",
        image: "/images/testimonials/priya-sharma.jpg",
        text: "Responsive, professional, and incredibly talented. They understood our vision from day one and executed it perfectly.",
        rating: 5
      },
      {
        name: "David Wilson",
        company: "Urban Finance Partners",
        image: "/images/testimonials/david-wilson.jpg",
        text: "The website redesign was completed ahead of schedule and has received outstanding feedback from our clients. Highly recommended!",
        rating: 4
      }
    ],
    sw: [
      {
        name: "Amina Hassan",
        company: "Teknolojia ya Kisasa",
        image: "/images/testimonials/amina-hassan.jpg",
        text: "Kufanya kazi na timu hii kulibadilisha uwepo wetu mtandaoni. Tovuti yetu mpya imeongeza mauzo kwa 40% katika miezi mitatu tu!",
        rating: 5
      },
      {
        name: "Juma Mbeki",
        company: "Biashara Bunifu",
        image: "/images/testimonials/juma-mbeki.jpg",
        text: "Suluhisho la biashara mtandao waliotutengenezea lilikuwa hasa tulichohitaji. Rahisi kutumia, inaweza kupanuka, na imeundwa vizuri. Wateja wetu wanaipenda.",
        rating: 5
      },
      {
        name: "Fatima Omar",
        company: "Sanaa na Ubunifu",
        image: "/images/testimonials/fatima-omar.jpg",
        text: "Utaalamu wao wa ubunifu wa UI/UX ulipeleka programu yetu katika kiwango kingine. Kiolesura ni rahisi kutumia na vipimo vya ushiriki wa watumiaji vimeongezeka maradufu.",
        rating: 4
      },
      {
        name: "Baraka Mwangi",
        company: "Usafirishaji wa Kimataifa",
        image: "/images/testimonials/baraka-mwangi.jpg",
        text: "Kifurushi cha uboreshaji wa SEO kilitoa zaidi ya matarajio yetu. Sasa tunaonekana kwenye ukurasa wa kwanza kwa maneno yote tunayolenga.",
        rating: 5
      },
      {
        name: "Zainab Yusuf",
        company: "Afya Connect",
        image: "/images/testimonials/zainab-yusuf.jpg",
        text: "Wanatoa huduma nzuri, ni wataalamu, na wenye vipaji visivyo vya kawaida. Walielewa maono yetu tangu siku ya kwanza na kuyatekeleza kikamilifu.",
        rating: 5
      },
      {
        name: "Karimu Ndegwa",
        company: "Washirika wa Fedha Mjini",
        image: "/images/testimonials/karimu-ndegwa.jpg",
        text: "Uboreshaji wa tovuti ulikamilika kabla ya ratiba na umepokea maoni mazuri sana kutoka kwa wateja wetu. Tunapendekeza sana!",
        rating: 4
      }
    ]
  };
  
  // Helper function to get random testimonials
  export const getRandomTestimonials = (count = 3, language = 'en') => {
    // Make sure we have a valid language
    const lang = testimonials[language] ? language : 'en';
    
    // Make sure count is not greater than available testimonials
    const availableCount = testimonials[lang].length;
    const requestedCount = Math.min(count, availableCount);
    
    // Create a copy of the testimonials array to avoid modifying the original
    const testimonialsCopy = [...testimonials[lang]];
    
    // Shuffle the array
    for (let i = testimonialsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [testimonialsCopy[i], testimonialsCopy[j]] = [testimonialsCopy[j], testimonialsCopy[i]];
    }
    
    // Return the requested number of testimonials
    return testimonialsCopy.slice(0, requestedCount);
  };
  
  // Get testimonials by rating
  export const getTestimonialsByRating = (rating, language = 'en') => {
    const lang = testimonials[language] ? language : 'en';
    return testimonials[lang].filter(testimonial => testimonial.rating === rating);
  };
  
  // Get all testimonials for a language
  export const getAllTestimonials = (language = 'en') => {
    const lang = testimonials[language] ? language : 'en';
    return testimonials[lang];
  };