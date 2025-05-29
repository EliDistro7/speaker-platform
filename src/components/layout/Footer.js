import React from 'react';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/language';

const SocialMediaFooter = ({ 
  speaker = {
    name: "Dr. James Mwangamba",
    socialLinks: {
      facebook: "https://facebook.com/speaker",
      twitter: "https://twitter.com/speaker", 
      instagram: "https://instagram.com/speaker",
      linkedin: "https://linkedin.com/in/speaker",
      youtube: "https://youtube.com/@speaker",
      whatsapp: "+255617833806",
      email: "info@jamesmwangamba.com",
      phone: "+255 617 833 806"
    }
  }
}) => {
  // Use the language hook to get current language
  const { language } = useLanguage();

  const translations = {
    en: {
      followUs: "Follow Us",
      stayConnected: "Stay connected for latest updates and insights",
      contactUs: "Contact Us",
      getInTouch: "Get in touch for speaking engagements",
      rights: "All rights reserved",
      builtWith: "Built with passion for excellence"
    },
    sw: {
      followUs: "Tufuate",
      stayConnected: "Baki umeunganishwa kwa habari na maarifa mapya",
      contactUs: "Wasiliana Nasi",
      getInTouch: "Wasiliana nasi kwa mazungumzo",
      rights: "Haki zote zimehifadhiwa",
      builtWith: "Imejengwa kwa shauku ya ubora"
    }
  };

  const t = translations[language] || translations.en;

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: speaker.socialLinks?.facebook,
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: speaker.socialLinks?.twitter,
      color: 'hover:text-sky-500',
      bgColor: 'hover:bg-sky-50'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: speaker.socialLinks?.instagram,
      color: 'hover:text-pink-500',
      bgColor: 'hover:bg-pink-50'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: speaker.socialLinks?.linkedin,
      color: 'hover:text-blue-700',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: speaker.socialLinks?.youtube,
      color: 'hover:text-red-600',
      bgColor: 'hover:bg-red-50'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: speaker.socialLinks?.whatsapp ? `https://wa.me/${speaker.socialLinks.whatsapp.replace(/[^0-9]/g, '')}` : null,
      color: 'hover:text-green-500',
      bgColor: 'hover:bg-green-50'
    }
  ].filter(link => link.url);

  const contactLinks = [
    {
      name: 'Email',
      icon: Mail,
      value: speaker.socialLinks?.email,
      href: speaker.socialLinks?.email ? `mailto:${speaker.socialLinks.email}` : null,
      color: 'hover:text-indigo-600',
      bgColor: 'hover:bg-indigo-50'
    },
    {
      name: 'Phone',
      icon: Phone,
      value: speaker.socialLinks?.phone,
      href: speaker.socialLinks?.phone ? `tel:${speaker.socialLinks.phone}` : null,
      color: 'hover:text-purple-600',
      bgColor: 'hover:bg-purple-50'
    }
  ].filter(link => link.value);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.footer 
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full filter blur-3xl"
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
          className="absolute bottom-0 -right-4 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-600/10 rounded-full filter blur-3xl"
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
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Social Media Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <motion.h3 
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                {t.followUs}
              </motion.h3>
              <motion.p 
                className="text-gray-300 text-sm"
                variants={itemVariants}
              >
                {t.stayConnected}
              </motion.p>
            </div>
            
            {socialLinks.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 ${social.color} ${social.bgColor}`}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-6 h-6 transition-colors duration-300" />
                    
                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {social.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <motion.h3 
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                {t.contactUs}
              </motion.h3>
              <motion.p 
                className="text-gray-300 text-sm"
                variants={itemVariants}
              >
                {t.getInTouch}
              </motion.p>
            </div>
            
            {contactLinks.length > 0 && (
              <motion.div 
                className="space-y-4"
                variants={itemVariants}
              >
                {contactLinks.map((contact) => (
                  <motion.a
                    key={contact.name}
                    href={contact.href}
                    className={`group flex items-center space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 ${contact.color}`}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300 ${contact.bgColor}`}>
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-200">{contact.name}</div>
                      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {contact.value}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </motion.a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="pt-8 border-t border-white/10"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div 
              className="text-center md:text-left"
              variants={itemVariants}
            >
              <div className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {speaker.name}
              </div>
              <div className="text-sm text-gray-400">
                © {new Date().getFullYear()} {t.rights}
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center md:text-right"
              variants={itemVariants}
            >
              <div className="text-sm text-gray-400 flex items-center space-x-2">
                <span>{t.builtWith}</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  ❤️
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default SocialMediaFooter;