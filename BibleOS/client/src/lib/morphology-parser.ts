/**
 * Morphology Parser for Hebrew, Aramaic, and Greek
 * 
 * Decodes morphological codes from biblical texts into human-readable format.
 * 
 * Format examples:
 * - Hebrew/Aramaic: "HR/Ncfsa", "AVqp3ms", "ANcmsd/Td"
 * - Greek: "V-PAI-3S", "N-NSM", "RA-NSF"
 */

export interface MorphologyParsed {
  language: 'hebrew' | 'aramaic' | 'greek';
  partOfSpeech: string;
  gender?: 'masculine' | 'feminine' | 'common' | 'neuter';
  number?: 'singular' | 'plural' | 'dual';
  person?: '1st' | '2nd' | '3rd';
  tense?: string;
  voice?: string;
  mood?: string;
  state?: 'absolute' | 'construct' | 'determined';
  prefix?: string[];
  suffix?: string[];
  raw: string;
  readable: string;
}

/**
 * Parse Hebrew/Aramaic morphology code
 * 
 * Format: [Language][Prefix]/[POS][Gender][Number][State][/Suffix]
 * 
 * Examples:
 * - "HR/Ncfsa" = Hebrew, preposition prefix, common noun, feminine, singular, absolute
 * - "AVqp3ms" = Aramaic, verb, Qal, perfect, 3rd person, masculine, singular
 * - "ANcmsd/Td" = Aramaic, noun, common, masculine, singular, determined, with article
 */
function parseHebrewAramaic(code: string): MorphologyParsed {
  const parts = code.split('/');
  const mainPart = parts[0];
  const suffixPart = parts.length > 1 ? parts[parts.length - 1] : '';
  
  // Determine language
  const language = mainPart.startsWith('H') ? 'hebrew' : 'aramaic';
  
  // Parse prefix (first character after language marker)
  const prefixes: string[] = [];
  let pos = 1; // Start after language marker (H or A)
  
  while (pos < mainPart.length && /[RCTVD]/.test(mainPart[pos])) {
    const prefix = mainPart[pos];
    switch (prefix) {
      case 'R': prefixes.push('preposition'); break;
      case 'C': prefixes.push('conjunction'); break;
      case 'T': prefixes.push('article'); break;
      case 'V': prefixes.push('vav'); break;
      case 'D': prefixes.push('definite article'); break;
    }
    pos++;
  }
  
  // Parse part of speech (next 1-2 characters)
  let partOfSpeech = '';
  let posCode = mainPart.substring(pos, pos + 2);
  
  if (posCode.startsWith('N')) {
    // Noun
    const nounType = posCode[1];
    switch (nounType) {
      case 'c': partOfSpeech = 'common noun'; break;
      case 'p': partOfSpeech = 'proper noun'; break;
      case 'g': partOfSpeech = 'gentilic'; break;
      default: partOfSpeech = 'noun';
    }
    pos += 2;
  } else if (posCode.startsWith('V')) {
    // Verb
    partOfSpeech = 'verb';
    pos += 1;
  } else if (posCode.startsWith('A')) {
    // Adjective/Adverb
    if (posCode[1] === 'a') {
      partOfSpeech = 'adjective';
      pos += 2;
    } else {
      partOfSpeech = 'adverb';
      pos += 1;
    }
  } else if (posCode.startsWith('P')) {
    // Pronoun/Preposition/Particle
    const subType = posCode[1];
    switch (subType) {
      case 'p': partOfSpeech = 'personal pronoun'; break;
      case 'd': partOfSpeech = 'demonstrative pronoun'; break;
      case 'r': partOfSpeech = 'relative pronoun'; break;
      case 'i': partOfSpeech = 'interrogative pronoun'; break;
      default: partOfSpeech = 'pronoun';
    }
    pos += 2;
  } else if (posCode.startsWith('T')) {
    partOfSpeech = 'particle';
    pos += 1;
  }
  
  // Parse gender (next character)
  let gender: MorphologyParsed['gender'];
  if (pos < mainPart.length) {
    switch (mainPart[pos]) {
      case 'm': gender = 'masculine'; pos++; break;
      case 'f': gender = 'feminine'; pos++; break;
      case 'c': gender = 'common'; pos++; break;
    }
  }
  
  // Parse number (next character)
  let number: MorphologyParsed['number'];
  if (pos < mainPart.length) {
    switch (mainPart[pos]) {
      case 's': number = 'singular'; pos++; break;
      case 'p': number = 'plural'; pos++; break;
      case 'd': number = 'dual'; pos++; break;
    }
  }
  
  // Parse state (next character)
  let state: MorphologyParsed['state'];
  if (pos < mainPart.length) {
    switch (mainPart[pos]) {
      case 'a': state = 'absolute'; pos++; break;
      case 'c': state = 'construct'; pos++; break;
      case 'd': state = 'determined'; pos++; break;
    }
  }
  
  // Parse verb specifics if verb
  let tense: string | undefined;
  let person: MorphologyParsed['person'];
  
  if (partOfSpeech === 'verb' && pos < mainPart.length) {
    // Stem/binyan (q=Qal, p=Piel, h=Hiphil, etc.)
    const stem = mainPart[pos];
    pos++;
    
    // Tense/aspect
    if (pos < mainPart.length) {
      switch (mainPart[pos]) {
        case 'p': tense = 'perfect'; break;
        case 'i': tense = 'imperfect'; break;
        case 'v': tense = 'imperative'; break;
        case 'a': tense = 'infinitive absolute'; break;
        case 'c': tense = 'infinitive construct'; break;
        case 'r': tense = 'participle'; break;
      }
      pos++;
    }
    
    // Person
    if (pos < mainPart.length && /[123]/.test(mainPart[pos])) {
      switch (mainPart[pos]) {
        case '1': person = '1st'; break;
        case '2': person = '2nd'; break;
        case '3': person = '3rd'; break;
      }
      pos++;
    }
    
    // Gender and number for verbs
    if (pos < mainPart.length) {
      switch (mainPart[pos]) {
        case 'm': gender = 'masculine'; pos++; break;
        case 'f': gender = 'feminine'; pos++; break;
        case 'c': gender = 'common'; pos++; break;
      }
    }
    
    if (pos < mainPart.length) {
      switch (mainPart[pos]) {
        case 's': number = 'singular'; break;
        case 'p': number = 'plural'; break;
        case 'd': number = 'dual'; break;
      }
    }
  }
  
  // Parse suffix
  const suffixes: string[] = [];
  if (suffixPart && suffixPart !== mainPart) {
    if (suffixPart.includes('Sp')) {
      suffixes.push('pronominal suffix');
    }
    if (suffixPart.includes('Td')) {
      suffixes.push('definite article');
    }
  }
  
  // Build readable string
  const readable = buildReadableString({
    language,
    partOfSpeech,
    gender,
    number,
    person,
    tense,
    state,
    prefix: prefixes,
    suffix: suffixes,
  });
  
  return {
    language,
    partOfSpeech,
    gender,
    number,
    person,
    tense,
    state,
    prefix: prefixes.length > 0 ? prefixes : undefined,
    suffix: suffixes.length > 0 ? suffixes : undefined,
    raw: code,
    readable,
  };
}

/**
 * Parse Greek morphology code
 * 
 * Format: [POS]-[Tense][Voice][Mood]-[Person][Number][Gender][Case]
 * 
 * Examples:
 * - "V-PAI-3S" = Verb, Present, Active, Indicative, 3rd person, Singular
 * - "N-NSM" = Noun, Nominative, Singular, Masculine
 * - "RA-NSF" = Definite article, Nominative, Singular, Feminine
 */
function parseGreek(code: string): MorphologyParsed {
  const parts = code.split('-');
  if (parts.length < 2) {
    return {
      language: 'greek',
      partOfSpeech: 'unknown',
      raw: code,
      readable: code,
    };
  }
  
  const posCode = parts[0];
  const morphCode = parts[1];
  const inflectionCode = parts.length > 2 ? parts[2] : '';
  
  // Parse part of speech
  let partOfSpeech = '';
  switch (posCode) {
    case 'V': partOfSpeech = 'verb'; break;
    case 'N': partOfSpeech = 'noun'; break;
    case 'A': partOfSpeech = 'adjective'; break;
    case 'R': partOfSpeech = 'pronoun'; break;
    case 'RA': partOfSpeech = 'definite article'; break;
    case 'P': partOfSpeech = 'preposition'; break;
    case 'C': partOfSpeech = 'conjunction'; break;
    case 'D': partOfSpeech = 'adverb'; break;
    case 'T': partOfSpeech = 'particle'; break;
    case 'I': partOfSpeech = 'interjection'; break;
    default: partOfSpeech = posCode;
  }
  
  let tense: string | undefined;
  let voice: string | undefined;
  let mood: string | undefined;
  let person: MorphologyParsed['person'];
  let number: MorphologyParsed['number'];
  let gender: MorphologyParsed['gender'];
  
  // Parse verb morphology
  if (partOfSpeech === 'verb' && morphCode.length >= 3) {
    // Tense
    switch (morphCode[0]) {
      case 'P': tense = 'present'; break;
      case 'I': tense = 'imperfect'; break;
      case 'F': tense = 'future'; break;
      case 'A': tense = 'aorist'; break;
      case 'X': tense = 'perfect'; break;
      case 'Y': tense = 'pluperfect'; break;
    }
    
    // Voice
    switch (morphCode[1]) {
      case 'A': voice = 'active'; break;
      case 'M': voice = 'middle'; break;
      case 'P': voice = 'passive'; break;
    }
    
    // Mood
    switch (morphCode[2]) {
      case 'I': mood = 'indicative'; break;
      case 'S': mood = 'subjunctive'; break;
      case 'O': mood = 'optative'; break;
      case 'M': mood = 'imperative'; break;
      case 'N': mood = 'infinitive'; break;
      case 'P': mood = 'participle'; break;
    }
  }
  
  // Parse inflection
  if (inflectionCode.length >= 2) {
    // Person
    switch (inflectionCode[0]) {
      case '1': person = '1st'; break;
      case '2': person = '2nd'; break;
      case '3': person = '3rd'; break;
    }
    
    // Number
    switch (inflectionCode[1]) {
      case 'S': number = 'singular'; break;
      case 'P': number = 'plural'; break;
    }
    
    // Gender
    if (inflectionCode.length >= 3) {
      switch (inflectionCode[2]) {
        case 'M': gender = 'masculine'; break;
        case 'F': gender = 'feminine'; break;
        case 'N': gender = 'neuter'; break;
      }
    }
  }
  
  // Build readable string
  const readable = buildReadableString({
    language: 'greek',
    partOfSpeech,
    gender,
    number,
    person,
    tense,
    voice,
    mood,
  });
  
  return {
    language: 'greek',
    partOfSpeech,
    gender,
    number,
    person,
    tense,
    voice,
    mood,
    raw: code,
    readable,
  };
}

/**
 * Build human-readable morphology string
 */
function buildReadableString(parsed: Partial<MorphologyParsed>): string {
  const parts: string[] = [];
  
  if (parsed.prefix && parsed.prefix.length > 0) {
    parts.push(`with ${parsed.prefix.join(', ')}`);
  }
  
  if (parsed.tense) parts.push(parsed.tense);
  if (parsed.voice) parts.push(parsed.voice);
  if (parsed.mood) parts.push(parsed.mood);
  
  parts.push(parsed.partOfSpeech || 'unknown');
  
  if (parsed.person) parts.push(parsed.person + ' person');
  if (parsed.gender) parts.push(parsed.gender);
  if (parsed.number) parts.push(parsed.number);
  if (parsed.state) parts.push(parsed.state + ' state');
  
  if (parsed.suffix && parsed.suffix.length > 0) {
    parts.push(`+ ${parsed.suffix.join(', ')}`);
  }
  
  return parts.join(' ');
}

/**
 * Main morphology parser function
 */
export function parseMorphology(code: string): MorphologyParsed {
  if (!code || code.trim() === '') {
    return {
      language: 'hebrew',
      partOfSpeech: 'unknown',
      raw: code,
      readable: 'unknown',
    };
  }
  
  // Determine language and parse accordingly
  if (code.startsWith('H') || code.startsWith('A')) {
    return parseHebrewAramaic(code);
  } else if (code.includes('-')) {
    return parseGreek(code);
  } else {
    // Fallback
    return {
      language: 'hebrew',
      partOfSpeech: code,
      raw: code,
      readable: code,
    };
  }
}

/**
 * Parse multiple morphology codes
 */
export function parseMorphologyBatch(codes: string[]): MorphologyParsed[] {
  return codes.map(parseMorphology);
}
