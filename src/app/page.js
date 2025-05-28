'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
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

// Simplified background component
const Background = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/60" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl" />
    </div>
  );
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
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

  // Simplified intersection observer
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
    alert(t.purchaseCompleted);
    setSelectedEvent(null);
    setPurchaseForm({ name: '', email: '', phone: '', quantity: 1 });
  };

  const handleCartUpdate = (newCartCount) => {
    setCartCount(newCartCount);
  };

  const renderProfileView = () => (
    <div className="space-y-8">
      {/* Profile Banner Card */}
      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <ProfileBanner speaker={speaker} language={language} />
      </Card>

      {/* Main Profile Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Contact & Specialties */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
            <ContactInfo speaker={speaker} />
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
            <SpecialtiesList specialties={speaker.specialties} />
          </Card>
        </div>

        {/* Right Column - Bio & Testimonials */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
            <SpeakerBio bio={speaker.bio} />
          </Card>
          
          <TestimonialsSection testimonials={speaker.testimonials} />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return renderProfileView();
      case 'events':
        return <EventsList events={events} onRegister={setSelectedEvent} />;
      case 'tickets':
        return (
          <TicketsList 
            tickets={tickets}
            onDownload={(ticket) => alert(`${t.downloadTicket}: ${ticket.id}`)}
            onBrowseEvents={() => setCurrentView('events')}
          />
        );
      case 'shop':
        return <BooksShop speaker={speaker} onCartUpdate={handleCartUpdate} />;
      default:
        return renderProfileView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Background />
      
      {/* Fixed Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <Navigation 
          currentView={currentView}
          onViewChange={setCurrentView}
          speaker={speaker}
          ticketCount={tickets.length}
          cartCount={cartCount}
        />
      </div>

      {/* Main Content Container */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            ref={contentRef}
            initial="initial"
            animate={contentInView ? "animate" : "initial"}
            variants={pageVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial="initial"
                animate="animate" 
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Purchase Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <Modal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            title={t.registerForEvent}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {selectedEvent?.title}
                </h3>
                <EventDetails event={selectedEvent} />
              </div>
              
              <PurchaseForm 
                formData={purchaseForm}
                onChange={setPurchaseForm}
                event={selectedEvent}
              />
              
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1"
                >
                  {t.cancel}
                </Button>
                <Button 
                  onClick={handlePurchase}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t.purchaseTickets}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Fixed Components */}
      <ChatBot />
      <SocialFooter />
    </div>
  );
};

export default Main;