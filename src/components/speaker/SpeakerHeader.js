import { Stars, Users, MapPin, Calendar, Award } from 'lucide-react';
import React from 'react';
import { SpeakerAvatar } from './SpeakerAvatar';
import { Star } from 'lucide-react';

export const SpeakerHeader = ({ speaker }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with enhanced gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)]"></div>
      </div>
      
      {/* Content */}
      <div className="relative px-4 py-8 text-white sm:px-6 md:px-8 lg:px-12 md:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-white/20 to-white/10 blur-sm"></div>
              <SpeakerAvatar 
                src={speaker.image} 
                alt={speaker.name} 
                size="lg"
                className="relative border-4 border-white/30 shadow-2xl backdrop-blur-sm ring-4 ring-white/20 transition-transform duration-300 hover:scale-105"
              />
              
              {/* Floating badge for premium speakers */}
              {speaker.isPremium && (
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-warning-400 to-warning-500 shadow-lg">
                  <Award className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="flex-1 text-center lg:text-left">
              
              {/* Name and Title */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                    {speaker.name}
                  </span>
                </h1>
                <p className="mt-3 text-lg font-medium text-white/90 sm:text-xl md:text-2xl">
                  {speaker.title}
                </p>
                
                {/* Company/Organization */}
                {speaker.company && (
                  <p className="mt-2 text-base text-white/80 sm:text-lg">
                    {speaker.company}
                  </p>
                )}
              </div>
              
              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
                
                {/* Rating */}
                <div className="group rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105">
                  <div className="flex items-center justify-center space-x-2 lg:justify-start">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(speaker.rating) 
                              ? 'fill-warning-400 text-warning-400' 
                              : 'text-white/40'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-center lg:text-left">
                    <div className="text-xl font-bold sm:text-2xl">{speaker.rating}</div>
                    <div className="text-xs text-white/70 sm:text-sm">Rating</div>
                  </div>
                </div>
                
                {/* Total Events */}
                <div className="group rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105">
                  <div className="flex items-center justify-center lg:justify-start">
                    <Users className="h-5 w-5 text-accent-300 sm:h-6 sm:w-6" />
                  </div>
                  <div className="mt-2 text-center lg:text-left">
                    <div className="text-xl font-bold sm:text-2xl">{speaker.totalSpeaks}</div>
                    <div className="text-xs text-white/70 sm:text-sm">Events</div>
                  </div>
                </div>
                
                {/* Experience Years */}
                {speaker.experience && (
                  <div className="group rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105">
                    <div className="flex items-center justify-center lg:justify-start">
                      <Calendar className="h-5 w-5 text-success-300 sm:h-6 sm:w-6" />
                    </div>
                    <div className="mt-2 text-center lg:text-left">
                      <div className="text-xl font-bold sm:text-2xl">{speaker.experience}+</div>
                      <div className="text-xs text-white/70 sm:text-sm">Years</div>
                    </div>
                  </div>
                )}
                
                {/* Location */}
                {speaker.location && (
                  <div className="group rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105">
                    <div className="flex items-center justify-center lg:justify-start">
                      <MapPin className="h-5 w-5 text-error-300 sm:h-6 sm:w-6" />
                    </div>
                    <div className="mt-2 text-center lg:text-left">
                      <div className="text-sm font-medium sm:text-base">{speaker.location}</div>
                      <div className="text-xs text-white/70 sm:text-sm">Based in</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Specialties Tags */}
              {speaker.specialties && speaker.specialties.length > 0 && (
                <div className="mt-6 lg:mt-8">
                  <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                    {speaker.specialties.slice(0, 4).map((specialty, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/25 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        #{specialty}
                      </span>
                    ))}
                    {speaker.specialties.length > 4 && (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                        +{speaker.specialties.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
};