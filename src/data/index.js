

 // Mock data with bilingual support
  export const speaker = {
    id: 1,
    name: "Dr. James Mwangamba",
    title: language === 'en' 
      ? "Business & Life Coach, International Speaker & Entrepreneur"
      : "Kocha wa Biashara na Maisha, Mzungumzaji wa Kimataifa na Mfanyabiashara",
    bio: language === 'en'
      ? "Dr. James Mwangamba is a renowned leadership consultant with over 15 years of experience helping Fortune 500 companies and individuals transform their organizational culture and personal growth journey."
      : "Dkt. James Mwangamba ni mshauri mashuhuri wa uongozi aliye na uzoefu wa zaidi ya miaka 15 wa kusaidia makampuni makubwa na watu binafsi kubadilisha utamaduni wa shirika na safari ya ukuaji wa kibinafsi.",
    image: "/avatar.jpg",
    rating: 4.9,
    totalSpeaks: 247,
    email: "info@jamesmwangamba.com",
    phone: "+1 (555) 123-4567",
    website: "www.jamesmwangamba.com",
    specialties: language === 'en' 
      ? ["Leadership Development", "Innovation Management", "Team Building"]
      : ["Maendeleo ya Uongozi", "Usimamizi wa Ubunifu", "Ujenzi wa Timu"],
    testimonials: [
      {
        text: language === 'en'
          ? "James's insights on leadership transformation were game-changing for our organization."
          : "Maarifa ya James kuhusu mabadiliko ya uongozi yaligeuza kabisa shirika letu.",
        author: language === 'en' ? "CEO, TechCorp" : "Mkurugenzi Mkuu, TechCorp"
      },
      {
        text: language === 'en'
          ? "One of the most engaging speakers I've ever heard. Practical and inspiring."
          : "Mmoja wa wazungumzaji wenye kuvutia zaidi niliyewahi kusikia. Wa vitendo na wa kutia moyo.",
        author: language === 'en' ? "HR Director, GlobalInc" : "Mkurugenzi wa Rasilimali Watu, GlobalInc"
      }
    ]
  };

  export const events = [
    {
      id: 1,
      title: language === 'en' 
        ? "Leadership in the Digital Age"
        : "Uongozi katika Enzi ya Kidijitali",
      description: language === 'en'
        ? "Discover how to lead effectively in our rapidly changing digital landscape."
        : "Gundua jinsi ya kuongoza kwa ufanisi katika mazingira ya kidijitali yanayobadilika haraka.",
      date: "2024-06-15",
      time: "14:00",
      duration: language === 'en' ? "2 hours" : "masaa 2",
      location: language === 'en' ? "Convention Center, Downtown" : "Kituo cha Mikutano, Mjini",
      price: 149,
      capacity: 200,
      registered: 127,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    }
  ];