import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language';

const translations = {
  en: {
    selectOption: 'Select an option',
    required: 'Required field'
  },
  sw: {
    selectOption: 'Chagua chaguo',
    required: 'Sehemu ya lazima'
  }
};

export const Select = ({ 
  label, 
  options, 
  value, 
  onChange, 
  required = false, 
  className = '',
  placeholder,
  disabled = false,
  error = false,
  helperText = ''
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption?.label || placeholder || t.selectOption;

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
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

      {/* Select Container */}
      <div className="relative">
        <div
          className={`
            relative w-full px-4 py-3.5 cursor-pointer
            bg-white border-2 rounded-xl
            flex items-center justify-between
            transition-all duration-200
            ${error 
              ? 'border-error-300 focus-within:border-error-500' 
              : isOpen
                ? 'border-primary-400 shadow-lg'
                : 'border-neutral-200 hover:border-neutral-300'
            }
            ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:shadow-md'}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Selected Value */}
          <span className={`
            block truncate
            ${selectedOption 
              ? 'text-neutral-800 font-medium' 
              : 'text-neutral-500'
            }
          `}>
            {displayText}
          </span>

          {/* Chevron */}
          <ChevronDown 
            className={`
              w-5 h-5 transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
              ${error ? 'text-error-400' : 'text-neutral-400'}
            `} 
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
              <div className="py-2 max-h-60 overflow-y-auto">
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value || index}
                      className={`
                        px-4 py-3 cursor-pointer
                        flex items-center justify-between
                        transition-colors duration-150
                        ${isSelected 
                          ? 'bg-primary-50 text-primary-700' 
                          : 'text-neutral-700 hover:bg-neutral-50'
                        }
                      `}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className={`
                        block truncate
                        ${isSelected ? 'font-semibold' : 'font-medium'}
                      `}>
                        {option.label}
                      </span>
                      
                      {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Click Away Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <div className={`
          mt-2 text-sm
          ${error ? 'text-error-600' : 'text-neutral-500'}
        `}>
          {helperText}
        </div>
      )}

      {/* Hidden Native Select */}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{t.selectOption}</option>
        {options.map((option, index) => (
          <option key={option.value || index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};