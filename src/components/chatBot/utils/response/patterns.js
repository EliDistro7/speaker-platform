

  // Enhanced specific patterns for location/contact queries
  export const locationContactPatterns = {
    en: [
      /where.*can.*i.*(get|find|reach|contact).*you/i,
      /where.*are.*you.*located/i,
      /where.*is.*your.*(office|location|address)/i,
      /how.*to.*find.*you/i,
      /your.*(location|address|office)/i,
      /directions.*to.*you/i,
      /where.*to.*meet/i,
      /find.*your.*place/i
    ],
    sw: [
      /wapi.*naweza.*kupata/i,
      /wapi.*mko/i,
      /mahali.*yenu/i,
      /anwani.*yenu/i,
      /ofisi.*yenu.*iko.*wapi/i,
      /mwelekeo.*wenu/i,
      /mahali.*pa.*kukutana/i
    ]
  };

  // Service-specific inquiry patterns
  export const servicePatterns = {
    en: [
      /what.*do.*you.*do/i,
      /what.*services.*do.*you.*offer/i,
      /can.*you.*help.*with/i,
      /do.*you.*provide/i,
      /are.*you.*able.*to/i
    ],
    sw: [
      /mnafanya.*nini/i,
      /huduma.*gani.*mnatoa/i,
      /mnaweza.*kusaidia/i,
      /mnatoa/i,
      /mnaweza/i
    ]
  };