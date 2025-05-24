import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Ticket, DollarSign } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    ticketDetails: 'Ticket Details',
    quantity: 'Quantity',
    ticket: 'ticket',
    tickets: 'tickets',
    total: 'Total',
    enterName: 'Enter your full name',
    enterEmail: 'Enter your email address',
    enterPhone: 'Enter your phone number (optional)',
    selectQuantity: 'Select number of tickets'
  },
  sw: {
    personalInfo: 'Taarifa za Kibinafsi',
    fullName: 'Jina Kamili',
    email: 'Barua Pepe',
    phone: 'Nambari ya Simu',
    ticketDetails: 'Maelezo ya Tiketi',
    quantity: 'Idadi',
    ticket: 'tiketi',
    tickets: 'tiketi',
    total: 'Jumla',
    enterName: 'Ingiza jina lako kamili',
    enterEmail: 'Ingiza barua pepe yako',
    enterPhone: 'Ingiza nambari ya simu (si lazima)',
    selectQuantity: 'Chagua idadi ya tiketi'
  }
};

export const PurchaseForm = ({ formData, onChange, event }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const quantityOptions = [1, 2, 3, 4, 5].map(num => ({
    value: num,
    label: `${num} ${num > 1 ? t.tickets : t.ticket}`
  }));

  const formFields = [
    {
      icon: User,
      name: 'name',
      label: t.fullName,
      placeholder: t.enterName,
      type: 'text',
      required: true,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: Mail,
      name: 'email',
      label: t.email,
      placeholder: t.enterEmail,
      type: 'email',
      required: true,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    },
    {
      icon: Phone,
      name: 'phone',
      label: t.phone,
      placeholder: t.enterPhone,
      type: 'tel',
      required: false,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Personal Information Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div 
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-900"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <User className="w-4 h-4 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-neutral-800">
            {t.personalInfo}
          </h3>
        </div>
        
        <div className="space-y-4">
          {formFields.map((field, index) => (
            <motion.div
              key={field.name}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {field.label}
                {field.required && <span className="text-error-500 ml-1">*</span>}
              </label>
              
              <div className="relative">
                <motion.div 
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${field.bgColor} rounded-lg p-2 group-focus-within:scale-110 transition-transform duration-200`}
                  whileHover={{ scale: 1.05 }}
                >
                  <field.icon className={`w-4 h-4 ${field.color}`} />
                </motion.div>
                
                <Input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => onChange({...formData, [field.name]: e.target.value})}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="pl-14 bg-gradient-to-r from-white to-neutral-50/50 border-neutral-200/60 hover:border-neutral-300/80 focus:border-primary-400 focus:ring-primary-400/20 transition-all duration-200"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ticket Details Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div 
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600"
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Ticket className="w-4 h-4 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-neutral-800">
            {t.ticketDetails}
          </h3>
        </div>

        <motion.div
          className="group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t.quantity}
            <span className="text-error-500 ml-1">*</span>
          </label>
          
          <div className="relative">
            <motion.div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-warning-50 rounded-lg p-2 group-focus-within:scale-110 transition-transform duration-200"
              whileHover={{ scale: 1.05 }}
            >
              <Ticket className="w-4 h-4 text-warning-600" />
            </motion.div>
            
            <Select
              value={formData.quantity}
              onChange={(e) => onChange({...formData, quantity: parseInt(e.target.value)})}
              options={quantityOptions}
              className="pl-14 bg-gradient-to-r from-white to-neutral-50/50 border-neutral-200/60 hover:border-neutral-300/80 focus:border-accent-400 focus:ring-accent-400/20 transition-all duration-200"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Total Section */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border-2 border-primary-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-2xl" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-success-500 to-success-600 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h4 className="text-lg font-semibold text-neutral-800">
                  {t.total}
                </h4>
                <p className="text-sm text-neutral-600">
                  {formData.quantity} {formData.quantity > 1 ? t.tickets : t.ticket}
                </p>
              </div>
            </div>
            
            <motion.div
              className="text-right"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">
                ${(event.price * formData.quantity).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-500">
                ${event.price} {language === 'en' ? 'per ticket' : 'kwa tiketi'}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};