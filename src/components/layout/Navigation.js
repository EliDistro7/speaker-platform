// Updated Navigation.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeakerAvatar } from '../speaker/SpeakerAvatar';
import { NavButton } from './NavButton';
import { useLanguage } from '@/contexts/language';
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Globe, Menu, X, ChevronDown, User, Calendar, Ticket, ShoppingCart } from 'lucide-react';
import { events } from '@/data';

const translations = {
  en: {
    profile: 'Profile',
    events: 'Events',
    myTickets: 'Tickets',
    shop: 'Shop',
    menu: 'Menu',
    more: 'More'
  },
  sw: {
    profile: 'Wasifu',
    events: 'Matukio',
    myTickets: 'Tiketi',
    shop: 'Duka',
    menu: 'Menyu',
    more: 'Zaidi'
  }
};

const navigationItems = [
  { key: 'profile', icon: User },
  { key: 'events', icon: Calendar },
  { key: 'tickets', icon: Ticket },
  { key: 'shop', icon: ShoppingCart }
];

export const Navigation = ({ 
  currentView, 
  onViewChange, 
  speaker, 
  ticketCount,

  cartCount = 0,
  additionalNavItems = []
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = React.useState(false);

  const mainNavItems = navigationItems.slice(0, 4);
  const moreNavItems = [...navigationItems.slice(4), ...additionalNavItems];

  const getNavItemLabel = (key) => {
    switch(key) {
      case 'profile': return t.profile;
      case 'events': return t.events;
      case 'tickets': return `${t.myTickets} (${ticketCount})`;
      case 'shop': return t.shop;
      default: return key;
    }
  };

  const getItemCount = (key) => {
    switch(key) {
      case 'tickets': return ticketCount;
      case 'shop': return cartCount;
      case 'events' : return events.length; // Assuming no count for events
      default: return 0;
    }
  };

  return (
    <>
      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              
              {/* Logo/Speaker Info Section */}
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative group">
                  <SpeakerAvatar 
                    src={speaker.image} 
                    alt={speaker.name} 
                    size="sm" 
                    className="ring-2 ring-indigo-100 transition-all duration-300 group-hover:ring-indigo-200 group-hover:scale-105 group-hover:shadow-lg"
                  />
                  <motion.div 
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent lg:text-xl">
                    {speaker.name}
                  </h1>
                  <p className="text-sm text-neutral-600 font-medium lg:text-base">{speaker.title}</p>
                </div>
              </motion.div>

              {/* Desktop Navigation Buttons + Language Switcher */}
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Navigation Items */}
                <div className="flex items-center space-x-1">
                  {mainNavItems.map((item, index) => {
                    const Icon = item.icon;
                    const itemCount = getItemCount(item.key);
                    return (
                      <motion.div
                        key={item.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative"
                      >
                        <NavButton 
                          isActive={currentView === item.key}
                          onClick={() => onViewChange(item.key)}
                          className="group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                            <span>{item.key === 'tickets' ? t.myTickets : getNavItemLabel(item.key)}</span>
                          </div>
                        </NavButton>
                      {itemCount > 0 && (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className={`absolute -top-1 -right-1 h-5 w-5 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm ${
      item.key === 'shop' ? 'bg-red-500' : 
      item.key === 'events' ? 'bg-red-500' : 
      'bg-red-500'
    }`}
  >
    {itemCount}
  </motion.div>
)}
                      </motion.div>
                    );
                  })}
                  
                  {/* More dropdown for additional items */}
                  {moreNavItems.length > 0 && (
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                        className="flex items-center space-x-1 px-4 py-2.5 rounded-xl font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200"
                      >
                        <span>{t.more}</span>
                        <motion.div
                          animate={{ rotate: isMoreDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {isMoreDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200/60 py-2 backdrop-blur-xl"
                          >
                            {moreNavItems.map((item) => (
                              <button
                                key={item.key}
                                onClick={() => {
                                  onViewChange(item.key);
                                  setIsMoreDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                              >
                                {getNavItemLabel(item.key)}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Language Switcher - Desktop */}
                <div className="ml-2 pl-2 border-l border-neutral-200/60">
                  <LanguageSwitcher 
                    variant="button" 
                    size="sm" 
                    className="shadow-sm hover:shadow-md border-neutral-300/40 hover:border-indigo-200"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced Three Row Layout */}
        <div className="md:hidden">
          {/* First Row - Speaker Info & Language Toggle */}
          <div className="px-4 py-3 border-b border-neutral-100/80">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative">
                  <SpeakerAvatar 
                    src={speaker.image} 
                    alt={speaker.name} 
                    size="sm" 
                    className="ring-2 ring-indigo-100 shadow-sm"
                  />
                  <motion.div 
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h1 className="text-base font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
                    {speaker.name}
                  </h1>
                  <p className="text-sm text-neutral-600 font-medium">{speaker.title}</p>
                </div>
              </motion.div>

              {/* Right side: Language Switcher + Menu Button */}
              <div className="flex items-center space-x-2">
                {/* Language Switcher - Mobile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <LanguageSwitcher 
                    variant="toggle" 
                    size="sm" 
                    showIcon={false}
                    className="scale-90"
                  />
                </motion.div>

                {/* More menu button for mobile */}
                {moreNavItems.length > 0 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 transition-colors ml-1"
                    aria-label={t.menu}
                  >
                    <motion.div
                      animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </motion.div>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Second Row - Main Navigation */}
          <motion.div 
            className="px-2 py-2 bg-gradient-to-r from-neutral-50/50 to-white/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="grid grid-cols-4 gap-1">
              {mainNavItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentView === item.key;
                const itemCount = getItemCount(item.key);
                
                return (
                  <motion.button
                    key={item.key}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onViewChange(item.key)}
                    className={`
                      relative flex flex-col items-center justify-center p-3 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    <span className="text-xs font-semibold truncate w-full text-center">
                      {item.key === 'tickets' ? t.myTickets : 
                       item.key === 'shop' ? t.shop :
                       getNavItemLabel(item.key)}
                    </span>
                    {itemCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1 -right-1 h-5 w-5 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm ${
                          item.key === 'shop' ? 'bg-indigo-500' : 'bg-red-500'
                        }`}
                      >
                        {itemCount}
                      </motion.div>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-active-indicator"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full"
                        transition={{ type: "spring", duration: 0.4 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Third Row - Mobile More Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && moreNavItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-neutral-100/80 bg-white/98 backdrop-blur-sm"
              >
                <div className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      {t.more}
                    </p>
                    <div className="h-px bg-neutral-200 flex-1 ml-3"></div>
                  </div>
                  {moreNavItems.map((item, index) => (
                    <motion.button
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onViewChange(item.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors font-medium flex items-center space-x-3"
                    >
                      <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                      <span>{getNavItemLabel(item.key)}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};