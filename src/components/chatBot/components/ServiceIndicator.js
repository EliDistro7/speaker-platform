// ===== 5. SERVICE INDICATOR COMPONENT (components/ServiceIndicator.jsx) =====
import { motion } from 'framer-motion';

export default function ServiceIndicator({
  language,
  serviceContext,
  currentDetectionResult,
  isSmallScreen,
  isClosing,
  onContactRequest
}) {
  return (
    <>
      <div className="flex justify-between items-center pt-1">
        {serviceContext.currentService && (
          <div className="flex items-center gap-2 text-xs">
            <div className="text-blue-400 opacity-70">
              {language === 'sw' ? 'Tunazungumza kuhusu' : 'Discussing'}: {serviceContext.currentService}
            </div>
            {serviceContext.conversationDepth > 3 && (
              <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                {language === 'sw' ? 'Mazungumzo ya kina' : 'Deep conversation'}
              </div>
            )}
          </div>
        )}
        
        <motion.button
          onClick={onContactRequest}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 ml-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isClosing}
          style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}
        >
          {language === "sw" ? "Wasiliana Nasi" : "Contact Us"}
        </motion.button>
      </div>

      {serviceContext.serviceHistory.length > 1 && (
        <div className="text-xs text-gray-400 opacity-60">
          {language === 'sw' ? 'Huduma zilizojadiliwa' : 'Services discussed'}: {serviceContext.serviceHistory.join(', ')}
        </div>
      )}

      {currentDetectionResult && (
        <div className="text-xs text-gray-500 opacity-50">
          {language === 'sw' ? 'Njia ya kugundua' : 'Detection method'}: {currentDetectionResult.detectionMethod}
        </div>
      )}

      {!isSmallScreen && (
        <div className="text-xs text-gray-500 opacity-50 text-center">
          {language === 'sw' ? 'Bonyeza ESC kufunga' : 'Press ESC to close'}
        </div>
      )}
    </>
  );
}