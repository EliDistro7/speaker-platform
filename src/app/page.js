'use client';
import React, { useState, useCallback } from 'react';
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
import ChatBot from '@/components/chatBot/index';
import { speaker, events } from '@/data/index';
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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
      {/* Base gradient matching BooksShop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      
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
  const [cartCount, setCartCount] = useState(0);
  const [purchaseForm, setPurchaseForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    quantity: 1 
  });

  const handleFormChange = useCallback((updateFn) => {
    setPurchaseForm(updateFn);
  }, []);

  const handleNameChange = useCallback((e) => {
    setPurchaseForm(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleEmailChange = useCallback((e) => {
    setPurchaseForm(prev => ({ ...prev, email: e.target.value }));
  }, []);

  const handlePhoneChange = useCallback((e) => {
    setPurchaseForm(prev => ({ ...prev, phone: e.target.value }));
  }, []);

  const handleQuantityChange = useCallback((e) => {
    setPurchaseForm(prev => ({ ...prev, quantity: parseInt(e.target.value) }));
  }, []);

  const handlePurchase = () => {
    const newTicket = {
      id: Date.now(),
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      purchaseDate: new Date().toISOString(),
      ...purchaseForm
    };
    
    setTickets(prev => [...prev, newTicket]);
    alert(t.purchaseCompleted);
    setSelectedEvent(null);
    setPurchaseForm({ name: '', email: '', phone: '', quantity: 1 });
  };

  const handleCartUpdate = (newCartCount) => {
    setCartCount(newCartCount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <EnhancedBackground />
      <FloatingParticles />
      
      {/* Enhanced Navigation */}
      <div className="relative z-50">
        <Navigation 
          currentView={currentView}
          onViewChange={setCurrentView}
          speaker={speaker}
          ticketCount={tickets.length}
          cartCount={cartCount}
        />
      </div>

      {/* Main Content Container with consistent spacing */}
      <div className="relative z-10">
        {/* Profile View */}
        {currentView === 'profile' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Profile Header Card */}
              <Card padding="p-0" className="overflow-hidden backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl rounded-3xl">
                <div className="p-8">
                  <SpeakerBio bio={speaker.bio} />
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <ContactInfo speaker={speaker} />
                    <SpecialtiesList specialties={speaker.specialties} />
                  </div>
                </div>
              </Card>
              
              {/* Testimonials Section */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                <TestimonialsSection testimonials={speaker.testimonials} />
              </div>
            </div>
          </div>
        )}
        
        {/* Events View */}
        {currentView === 'events' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <EventsList events={events} onRegister={setSelectedEvent} />
            </div>
          </div>
        )}
        
        {/* Tickets View */}
        {currentView === 'tickets' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <TicketsList 
                tickets={tickets}
                onDownload={(ticket) => alert(`${t.downloadTicket}: ${ticket.id}`)}
                onBrowseEvents={() => setCurrentView('events')}
              />
            </div>
          </div>
        )}

        {/* Shop View - Full width like BooksShop */}
        {currentView === 'shop' && (
          <div className="w-full">
            <BooksShop 
              speaker={speaker} 
              onCartUpdate={handleCartUpdate}
            />
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={t.registerForEvent}
        >
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedEvent?.title}
              </h3>
              <EventDetails event={selectedEvent} />
            </div>
            
            {/* Purchase Form */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-lg">
              <PurchaseForm 
                formData={purchaseForm}
                onChange={handleFormChange}
                event={selectedEvent}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-3 px-6 rounded-2xl border-2 border-neutral-300 hover:border-neutral-400 transition-all duration-200 hover:scale-105 font-semibold"
              >
                {t.cancel}
              </Button>
              <Button 
                onClick={handlePurchase}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t.purchaseTickets}
                </div>
              </Button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* ChatBot and Footer */}
      <ChatBot />
      <SocialFooter />  
    </div>
  );
};

export default Main;