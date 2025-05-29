'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Globe, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/language';
import { Navigation } from '@/components/layout/Navigation';
import { Card } from '@/components/ui/Card';
import { SpeakerBio } from '@/components/speaker/SpeakerBio';
import { ContactInfo } from '@/components/speaker/ContactInfo';
import { SpecialtiesList } from '@/components/speaker/Specialties';
import { SpeakerHeader } from '@/components/speaker/SpeakerHeader';
import { TestimonialsSection } from '@/components/speaker/TestimonialSection';  
import { EventsList } from '@/components/events/EventList';
import { TicketsList } from '@/components/tickets/TicketList';
import { BooksShop } from '@/components/book/BookShop';
import { Modal } from '@/components/ui/Modal';
import { EventDetails } from '@/components/events/EventDetails';
import { PurchaseForm } from '@/components/forms/PurchaseForm';
import { Button } from '@/components/ui/Button';
import { QRCodeDisplay } from '@/components/tickets/QRCodeDisplay';
import ProfileBanner from '@/components/banners/ProfileBanner';
import ChatBot from '@/components/chatBot/index'; // Import ChatBot component
import { speaker, events } from '@/data/index'; // Adjust the import path as needed
import SocialFooter from '@/components/layout/Footer';

const translations = {
  en: {
    registerForEvent: 'Register for Event',
    cancel: 'Cancel',
    purchaseTickets: 'Purchase Tickets',
    purchaseCompleted: 'Purchase completed!',
    downloadTicket: 'Download ticket',
    profile: 'Profile',
    events: 'Events',
    tickets: 'My Tickets',
    shop: 'Shop',
    welcome: 'Welcome',
    experienceExcellence: 'Experience Excellence',
    transformYourJourney: 'Transform Your Journey',
    businessCoach: 'Business & Life Coach',
    internationalSpeaker: 'International Speaker',
    entrepreneur: 'Entrepreneur',
    totalSpeaks: 'Total Speaks',
    rating: 'Rating',
    loadingProfile: 'Loading profile...',
    noEvents: 'No events available',
    noTickets: 'No tickets purchased yet'
  },
  sw: {
    registerForEvent: 'Jisajili kwa Tukio',
    cancel: 'Ghairi',
    purchaseTickets: 'Nunua Tiketi',
    purchaseCompleted: 'Ununuzi umekamilika!',
    downloadTicket: 'Pakua tiketi',
    profile: 'Wasifu',
    events: 'Matukio',
    tickets: 'Tiketi Zangu',
    shop: 'Duka',
    welcome: 'Karibu',
    experienceExcellence: 'Pata Ubora',
    transformYourJourney: 'Badilisha Safari Yako',
    businessCoach: 'Kocha wa Biashara na Maisha',
    internationalSpeaker: 'Mzungumzaji wa Kimataifa',
    entrepreneur: 'Mfanyabiashara',
    totalSpeaks: 'Jumla ya Mazungumzo',
    rating: 'Kiwango',
    loadingProfile: 'Inapakia wasifu...',
    noEvents: 'Hakuna matukio yaliyopatikana',
    noTickets: 'Bado haujanunua tiketi yoyote'
  }
};

// Floating particles animation component (Framer Motion kept for background)
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Enhanced background with gradient mesh (Framer Motion kept for background)
const EnhancedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-40 -right-4 w-72 h-72 bg-gradient-to-r from-cyan-400/30 to-blue-600/30 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.8, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.3, 0.7, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const Main = () => {
  const { language } = useLanguage();
  console.log('Current language:', language);
  const t = translations[language];
  
  const [currentView, setCurrentView] = useState('profile');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cartCount, setCartCount] = useState(0); // Add cart count state
  const [purchaseForm, setPurchaseForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    quantity: 1 
  });

  const handlePurchase = () => {
    const newTicket = {
      id: Date.now(),
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      purchaseDate: new Date().toISOString(),
      ...purchaseForm
    };
    
    setTickets(prev => [...prev, newTicket]);
    
    // Show success message
    alert(t.purchaseCompleted);
    setSelectedEvent(null);
    
    // Reset form
    setPurchaseForm({ name: '', email: '', phone: '', quantity: 1 });
  };

  // Function to handle cart updates from BooksShop
  const handleCartUpdate = (newCartCount) => {
    setCartCount(newCartCount);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedBackground />
      <FloatingParticles />
      
      {/* Navigation - Framer Motion removed */}
      <div className="transform translate-y-0 opacity-100 transition-all duration-800 ease-out">
        <Navigation 
          currentView={currentView}
          onViewChange={setCurrentView}
          speaker={speaker}
          ticketCount={tickets.length}
          cartCount={cartCount} // Pass cart count to navigation
        />
      </div>

      {/* Hero Section - only show on profile view, Framer Motion removed */}
      {currentView === 'profile' && (
        <div className="relative z-10 pt-0 pb-12 opacity-100 transition-opacity duration-1000">
      
        </div>
      )}
      
      {/* Main Content - Framer Motion removed */}
      <div className={`relative z-10 opacity-100 transform translate-y-0 transition-all duration-800 ${currentView === 'profile' ? 'max-w-6xl mx-0 px-0 pb-16' : ''}`}>
        {/* Simple view transitions using CSS classes instead of AnimatePresence */}
        {currentView === 'profile' && (
          <div className="opacity-100 transform translate-x-0 transition-all duration-500 space-y-8">
            <Card padding="p-0" className="overflow-hidden backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl">
            
              <div className="p-8 px-0">
               {/* <SpeakerBio bio={speaker.bio} /> */}
                <SpeakerBio bio={speaker.bio} />
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  
                  <ContactInfo speaker={speaker} />
                  <SpecialtiesList specialties={speaker.specialties} />
                </div>
              </div>
            </Card>
            <TestimonialsSection testimonials={speaker.testimonials} />
          </div>
        )}
        
        {currentView === 'events' && (
          <div className="opacity-100 transform translate-x-0 transition-all duration-500">
            <EventsList events={events} onRegister={setSelectedEvent} />
          </div>
        )}
        
        {currentView === 'tickets' && (
          <div className="opacity-100 transform translate-x-0 transition-all duration-500">
            <TicketsList 
              tickets={tickets}
              onDownload={(ticket) => alert(`${t.downloadTicket}: ${ticket.id}`)}
              onBrowseEvents={() => setCurrentView('events')}
            />
          </div>
        )}

        {currentView === 'shop' && (
          <div className="opacity-100 transform translate-x-0 transition-all duration-500 w-full">
            <BooksShop 
              speaker={speaker} 
              onCartUpdate={handleCartUpdate}
            />
          </div>
        )}
      </div>

      {/* Modal - Simplified without heavy Framer animations */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={t.registerForEvent}
        >
          <div className="opacity-100 transform translate-y-0 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 opacity-100 transition-opacity delay-100">
                {selectedEvent?.title}
              </h3>
              <EventDetails event={selectedEvent} />
            </div>
            
            <div className="opacity-100 transform translate-y-0 transition-all delay-200 duration-300">
              <PurchaseForm 
                formData={purchaseForm}
                onChange={setPurchaseForm}
                event={selectedEvent}
              />
            </div>
            
            <div className="flex space-x-4 mt-6 opacity-100 transform translate-y-0 transition-all delay-300 duration-300">
              <Button 
                variant="outline" 
                onClick={() => setSelectedEvent(null)}
                className="flex-1 hover:scale-105 transition-transform duration-200"
              >
                {t.cancel}
              </Button>
              <Button 
                onClick={handlePurchase}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-center hover:scale-105 transition-transform duration-150">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t.purchaseTickets}
                </div>
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      <ChatBot />
      <SocialFooter />  
    </div>
  );
};

export default Main;