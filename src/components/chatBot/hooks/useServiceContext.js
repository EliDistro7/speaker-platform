// File: app/components/layout/ChatBot/hooks/useServiceContext.js
import { useEffect } from 'react';
import { 
  validateServiceContext, 
  createFreshServiceContext,
  getConversationInsights 
} from '@/utils/serviceContextUtils';

/**
 * Custom hook to manage service context
 * Handles service detection, context validation, and insights generation
 */
export function useServiceContext(serviceContext, updateServiceContextState) {
  
  // Service context validation on component update
  useEffect(() => {
    if (!validateServiceContext(serviceContext)) {
      console.warn('Invalid service context detected, resetting...');
      updateServiceContextState(createFreshServiceContext());
    }
  }, [serviceContext, updateServiceContextState]);

  // Get conversation insights
  const getInsights = () => {
    return getConversationInsights(serviceContext);
  };

  // Check if deep conversation is happening
  const isDeepConversation = () => {
    return serviceContext.conversationDepth > 3;
  };

  // Check if user is highly engaged
  const isHighlyEngaged = () => {
    const insights = getConversationInsights(serviceContext);
    return insights.insights.includes('Deep engagement detected');
  };

  // Get service history
  const getServiceHistory = () => {
    return serviceContext.serviceHistory || [];
  };

  // Check if multiple services discussed
  const hasMultipleServices = () => {
    return getServiceHistory().length > 1;
  };

  // Get current service display name
  const getCurrentServiceDisplay = (language) => {
    if (!serviceContext.currentService) return null;
    
    return {
      service: serviceContext.currentService,
      depth: serviceContext.conversationDepth,
      isDeep: isDeepConversation(),
      isEngaged: isHighlyEngaged()
    };
  };

  // Generate service context indicator text
  const getServiceIndicatorText = (language) => {
    if (!serviceContext.currentService) return null;
    
    const baseText = language === 'sw' ? 
      'Tunazungumza kuhusu' : 
      'Discussing';
    
    return `${baseText}: ${serviceContext.currentService}`;
  };

  // Generate deep conversation badge text
  const getDeepConversationText = (language) => {
    return language === 'sw' ? 
      'Mazungumzo ya kina' : 
      'Deep conversation';
  };

  // Generate service history text
  const getServiceHistoryText = (language) => {
    const history = getServiceHistory();
    if (history.length <= 1) return null;
    
    const baseText = language === 'sw' ? 
      'Huduma zilizojadiliwa' : 
      'Services discussed';
    
    return `${baseText}: ${history.join(', ')}`;
  };

  return {
    // State checks
    isDeepConversation,
    isHighlyEngaged,
    hasMultipleServices,
    
    // Data getters
    getInsights,
    getServiceHistory,
    getCurrentServiceDisplay,
    
    // Display helpers
    getServiceIndicatorText,
    getDeepConversationText,
    getServiceHistoryText
  };
}