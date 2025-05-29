import { ChevronRight, Sparkles, Target, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { quickPromptVariants } from './animations';

export default function QuickPrompts({ 
  suggestions, 
  onSelect, 
  serviceContext,
  conversationDepth = 0,
  disabled = false,
  detectionConfidence = 0,
  currentDetection,
  insights
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  if (!suggestions || suggestions.length === 0) return null;
  
  // Enhanced confidence calculation
  const effectiveConfidence = currentDetection?.confidence || detectionConfidence || 0;
  const detectionMethod = currentDetection?.detectionMethod || 'unknown';
  const hasAlternatives = currentDetection?.alternativeServices?.length > 0;
  
  // Limit visible suggestions to prevent UI overflow
  const maxVisibleSuggestions = isExpanded ? (showAll ? suggestions.length : 8) : 4;
  const visibleSuggestions = suggestions.slice(0, maxVisibleSuggestions);
  const hasMoreSuggestions = suggestions.length > maxVisibleSuggestions;
  
  // Enhanced prompt categorization
  const getPromptStyling = (index) => {
    if (effectiveConfidence > 0.8) {
      if (index < 2) {
        return {
          gradient: 'from-green-700 to-emerald-700 border-green-500',
          priority: 'high',
          icon: Target
        };
      }
      return {
        gradient: 'from-blue-700 to-indigo-700 border-blue-500',
        priority: 'medium',
        icon: ChevronRight
      };
    }
    
    if (effectiveConfidence > 0.6) {
      if (index < 3) {
        return {
          gradient: 'from-blue-700 to-cyan-700 border-blue-400',
          priority: 'medium-high',
          icon: Brain
        };
      }
      return {
        gradient: 'from-gray-700 to-blue-800 border-gray-500',
        priority: 'medium',
        icon: ChevronRight
      };
    }
    
    if (effectiveConfidence > 0.3) {
      return {
        gradient: 'from-gray-700 to-slate-700 border-gray-500',
        priority: 'low-medium',
        icon: ChevronRight
      };
    }
    
    return {
      gradient: 'from-gray-800 to-slate-800 border-gray-600',
      priority: 'low',
      icon: ChevronRight
    };
  };

  // Enhanced prompt prioritization
  const prioritizePrompts = (prompts) => {
    if (effectiveConfidence < 0.4) {
      return prompts;
    }
    
    if (serviceContext?.currentService && conversationDepth > 2) {
      const serviceSpecific = prompts.filter(prompt => 
        prompt.toLowerCase().includes(serviceContext.currentService.toLowerCase())
      );
      const others = prompts.filter(prompt => 
        !prompt.toLowerCase().includes(serviceContext.currentService.toLowerCase())
      );
      return [...serviceSpecific, ...others];
    }
    
    return prompts;
  };

  const prioritizedSuggestions = prioritizePrompts(visibleSuggestions);

  // Confidence display
  const getConfidenceDisplay = () => {
    if (effectiveConfidence > 0.8) {
      return { text: 'High relevance', color: 'text-green-400', bgColor: 'bg-green-500/10' };
    }
    if (effectiveConfidence > 0.6) {
      return { text: 'Good relevance', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    }
    if (effectiveConfidence > 0.3) {
      return { text: 'Some relevance', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    }
    return { text: 'General suggestions', color: 'text-gray-400', bgColor: 'bg-gray-500/10' };
  };

  const confidenceDisplay = getConfidenceDisplay();

  return (
    <div className="mb-2">
      {/* Collapsible header with confidence indicator */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
            <span>Quick Suggestions</span>
          </motion.button>
          
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${confidenceDisplay.bgColor}`}>
            <Sparkles size={12} className={confidenceDisplay.color} />
            <span className={confidenceDisplay.color}>
              {confidenceDisplay.text}
            </span>
            {effectiveConfidence > 0 && (
              <span className="text-gray-400">
                ({Math.round(effectiveConfidence * 100)}%)
              </span>
            )}
          </div>
        </div>
        
        {/* Compact context indicators */}
        <div className="flex items-center gap-1">
          {serviceContext?.currentService && (
            <div className="text-xs text-blue-400 font-medium truncate max-w-[100px]">
              {serviceContext.currentService}
            </div>
          )}
          
          {conversationDepth > 3 && (
            <div className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">
              Deep
            </div>
          )}
          
          {hasAlternatives && (
            <div className="text-xs bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-full">
              Alt
            </div>
          )}
        </div>
      </div>
      
      {/* Collapsible prompts container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Compact prompts display */}
            <div className={`flex flex-wrap gap-1.5 ${
              showAll ? 'max-h-32 overflow-y-auto' : 'max-h-20 overflow-hidden'
            } custom-scrollbar pb-1`}>
              {prioritizedSuggestions.map((prompt, index) => {
                const styling = getPromptStyling(index);
                const IconComponent = styling.icon;
                
                return (
                  <motion.button
                    key={`${prompt}-${index}`}
                    custom={index}
                    variants={quickPromptVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => onSelect(prompt)}
                    className={`px-2.5 py-1 text-xs text-blue-100 rounded-full transition-all border flex items-center gap-1 ${
                      styling.gradient
                    } ${
                      disabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:border-blue-400 hover:shadow-sm hover:shadow-blue-500/20'
                    } ${
                      styling.priority === 'high' ? 'ring-1 ring-green-500/30' : ''
                    }`}
                    disabled={disabled}
                    title={`${prompt} (${styling.priority} priority)`}
                  >
                    <IconComponent 
                      size={10} 
                      className={`${
                        styling.priority === 'high' ? 'text-green-400' :
                        styling.priority === 'medium-high' ? 'text-blue-400' :
                        'text-gray-400'
                      } flex-shrink-0`}
                    />
                    <span 
                      className="truncate max-w-[140px] sm:max-w-[120px]"
                      style={{
                        fontWeight: styling.priority === 'high' ? '500' : '400'
                      }}
                    >
                      {prompt}
                    </span>
                    
                    {/* Priority indicator */}
                    {styling.priority === 'high' && (
                      <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0 animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Show more/less toggle */}
            {hasMoreSuggestions && (
              <div className="flex justify-center mt-2">
                <motion.button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showAll ? (
                    <>
                      <ChevronUp size={12} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      Show More ({suggestions.length - maxVisibleSuggestions} more)
                    </>
                  )}
                </motion.button>
              </div>
            )}
            
            {/* Context hints */}
            {effectiveConfidence > 0.6 && hasAlternatives && (
              <div className="mt-2 text-xs text-orange-400 opacity-70 px-1">
                💡 Alternative services detected
              </div>
            )}
            
            {conversationDepth > 5 && serviceContext?.currentService && (
              <div className="mt-2 text-xs text-purple-400 opacity-70 px-1">
                🎯 Consider contacting our specialist
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Compact view when collapsed */}
      {!isExpanded && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{suggestions.length} suggestions available</span>
          {effectiveConfidence > 0.7 && (
            <span className="text-green-400">• High relevance detected</span>
          )}
        </div>
      )}
    </div>
  );
}