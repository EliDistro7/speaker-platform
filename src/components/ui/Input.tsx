import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    required: 'Required field',
    showPassword: 'Show password',
    hidePassword: 'Hide password'
  },
  sw: {
    required: 'Sehemu ya lazima',
    showPassword: 'Onyesha nywila',
    hidePassword: 'Ficha nywila'
  }
};

export const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false, 
  className = '',
  disabled = false,
  error = false,
  errorMessage = '',
  helperText = '',
  icon: Icon,
  success = false,
  onFocus,
  onBlur
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasValue = value && value.length > 0;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <div
          className={`
            relative flex items-center
            bg-white border-2 rounded-xl
            transition-all duration-200
            ${error 
              ? 'border-error-300 focus-within:border-error-500' 
              : success && hasValue
                ? 'border-success-300 focus-within:border-success-500'
                : isFocused
                  ? 'border-primary-400 shadow-lg'
                  : 'border-neutral-200 hover:border-neutral-300'
            }
            ${!disabled ? 'hover:shadow-md' : 'opacity-60'}
          `}
        >
          {/* Left Icon */}
          {Icon && (
            <div className={`
              flex items-center justify-center w-5 h-5 ml-4
              ${error 
                ? 'text-error-400' 
                : success && hasValue
                  ? 'text-success-500'
                  : isFocused 
                    ? 'text-primary-500' 
                    : 'text-neutral-400'
              }
            `}>
              <Icon className="w-5 h-5" />
            </div>
          )}

          {/* Input Element */}
          <input
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full py-3.5 bg-transparent
              text-neutral-800 placeholder-neutral-400
              focus:outline-none font-medium
              ${Icon ? 'pl-3' : 'pl-4'}
              ${(isPassword || success || error) ? 'pr-12' : 'pr-4'}
            `}
            required={required}
          />

          {/* Right Icons */}
          <div className="flex items-center space-x-2 pr-4">
            {/* Success Icon */}
            {success && hasValue && !error && (
              <Check className="w-5 h-5 text-success-500" />
            )}

            {/* Error Icon */}
            {error && (
              <AlertCircle className="w-5 h-5 text-error-500" />
            )}

            {/* Password Toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                  p-1 rounded-md transition-colors duration-150
                  ${isFocused ? 'text-primary-500 hover:text-primary-600' : 'text-neutral-400 hover:text-neutral-600'}
                `}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || errorMessage) && (
        <div className={`
          mt-2 text-sm
          ${error && errorMessage ? 'text-error-600' : 'text-neutral-500'}
        `}>
          {error && errorMessage ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
};