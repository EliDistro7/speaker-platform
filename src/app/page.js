'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { speaker, events } from '@/data/index'; // Adjust the import path as needed

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

// Floating particles animation component
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

// Enhanced background with gradient mesh
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

  // Intersection observer for animations
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [contentRef, contentInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
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
      
      {/* Navigation with enhanced styling and cart count */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navigation 
          currentView={currentView}
          onViewChange={setCurrentView}
          speaker={speaker}
          ticketCount={tickets.length}
          cartCount={cartCount} // Pass cart count to navigation
        />
      </motion.div>

      {/* Profile Banner - only show on profile view */}
      {currentView === 'profile' && (
        <ProfileBanner speaker={speaker} language={language}/>
      )}

      {/* Hero Section - only show on profile view */}
      {currentView === 'profile' && (
        <motion.div
          ref={heroRef}
          className="relative z-10 pt-20 pb-12"
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200/50 mb-8"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">{t.experienceExcellence}</span>
            </motion.div>
            
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight"
            >
              {t.welcome}
            </motion.h1>
            
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {t.transformYourJourney}
            </motion.p>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{speaker.rating} {t.rating}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>{speaker.totalSpeaks} {t.totalSpeaks}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Main Content */}
      <motion.div
        ref={contentRef}
        className={`relative z-10 ${currentView === 'profile' ? 'max-w-6xl mx-auto px-4 pb-16' : ''}`}
        initial={{ opacity: 0, y: 50 }}
        animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatePresence mode="wait">
          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card padding="p-0" className="overflow-hidden backdrop-blur-sm bg-white/90 border-white/20 shadow-2xl">
                <SpeakerHeader speaker={speaker} />
                <div className="p-8">
                 {/* <SpeakerBio bio={speaker.bio} /> */}
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <ContactInfo speaker={speaker} />
                    <SpecialtiesList specialties={speaker.specialties} />
                  </div>
                </div>
              </Card>
              <TestimonialsSection testimonials={speaker.testimonials} />
            </motion.div>
          )}
          
          {currentView === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <EventsList events={events} onRegister={setSelectedEvent} />
            </motion.div>
          )}
          
          {currentView === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <TicketsList 
                tickets={tickets}
                onDownload={(ticket) => alert(`${t.downloadTicket}: ${ticket.id}`)}
                onBrowseEvents={() => setCurrentView('events')}
              />
            </motion.div>
          )}

          {currentView === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <BooksShop 
                speaker={speaker} 
                onCartUpdate={handleCartUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <Modal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            title={t.registerForEvent}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <motion.h3 
                  className="text-xl font-semibold mb-4 text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedEvent?.title}
                </motion.h3>
                <EventDetails event={selectedEvent} />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PurchaseForm 
                  formData={purchaseForm}
                  onChange={setPurchaseForm}
                  event={selectedEvent}
                />
              </motion.div>
              
              <motion.div 
                className="flex space-x-4 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
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
                  <motion.div
                    className="flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t.purchaseTickets}
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;