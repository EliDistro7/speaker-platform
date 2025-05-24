

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
  },
  {
    id: 2,
    title: language === 'en' 
      ? "Entrepreneurship & Innovation in East Africa"
      : "Ujasiriamali na Uvumbuzi Afrika Mashariki",
    description: language === 'en'
      ? "Explore opportunities for business growth and innovation across Tanzania and the East African region. Connect with successful entrepreneurs and investors."
      : "Chunguza fursa za ukuaji wa biashara na uvumbuzi kote Tanzania na eneo la Afrika Mashariki. Unganishwa na wajasiriamali na wawekezaji mafanikio.",
    date: "2024-07-20",
    time: "09:00",
    duration: language === 'en' ? "4 hours" : "masaa 4",
    location: language === 'en' ? "Dar es Salaam Business Hub" : "Kituo cha Biashara Dar es Salaam",
    price: 75,
    capacity: 150,
    registered: 89,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: language === 'en' 
      ? "Sustainable Agriculture & Climate Resilience"
      : "Kilimo Endelevu na Muugunduzi wa Tabianchi",
    description: language === 'en'
      ? "Learn about modern farming techniques, climate adaptation strategies, and sustainable practices for Tanzanian agriculture. Features local experts and success stories."
      : "Jifunze mbinu za kisasa za kilimo, mikakati ya kukabiliana na mabadiliko ya tabianchi, na mbinu endelevu za kilimo Tanzania. Ina wataalamu wa ndani na hadithi za mafanikio.",
    date: "2024-08-10",
    time: "08:30",
    duration: language === 'en' ? "6 hours" : "masaa 6",
    location: language === 'en' ? "Arusha Agricultural Training Center" : "Kituo cha Mafunzo ya Kilimo Arusha",
    price: 45,
    capacity: 300,
    registered: 234,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: language === 'en' 
      ? "Tourism & Cultural Heritage Development"
      : "Utalii na Maendeleo ya Utamaduni",
    description: language === 'en'
      ? "Discover how to develop and promote Tanzania's rich cultural heritage and natural attractions. Network with tourism professionals and cultural leaders."
      : "Gundua jinsi ya kuendeleza na kukuza utamaduni tajiri wa Tanzania na vivutio vya asili. Shirikiana na wataalamu wa utalii na viongozi wa kitamaduni.",
    date: "2024-09-05",
    time: "10:00",
    duration: language === 'en' ? "3 hours" : "masaa 3",
    location: language === 'en' ? "Stone Town Cultural Center, Zanzibar" : "Kituo cha Utamaduni Stone Town, Zanzibar",
    price: 60,
    capacity: 120,
    registered: 67,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=250&fit=crop"
  }
];