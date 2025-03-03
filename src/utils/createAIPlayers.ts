
import { PlayerData } from '@/components/PlayerProfileTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates an array of AI players with randomized personalities
 * @param count Number of AI players to generate
 * @returns Array of AI player objects
 */
export function createAIPlayers(count: number): PlayerData[] {
  const archetypes = ['mastermind', 'social-butterfly', 'comp-beast', 'floater', 'villain'];
  const traits = {
    'mastermind': ['analytical', 'strategic', 'manipulative', 'observant', 'patient'],
    'social-butterfly': ['charming', 'talkative', 'friendly', 'likeable', 'energetic'],
    'comp-beast': ['athletic', 'competitive', 'determined', 'focused', 'disciplined'],
    'floater': ['adaptable', 'quiet', 'non-threatening', 'flexible', 'diplomatic'],
    'villain': ['deceptive', 'aggressive', 'ruthless', 'cunning', 'bold']
  };
  
  const maleFirstNames = [
    'James', 'Michael', 'John', 'Robert', 'David', 'William', 'Richard', 'Thomas',
    'Chris', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Jason', 'Steven', 'Kevin',
    'Brandon', 'Derek', 'Tyler', 'Xavier', 'Zack', 'Cole', 'Victor', 'Devin'
  ];
  
  const femaleFirstNames = [
    'Mary', 'Jennifer', 'Linda', 'Patricia', 'Elizabeth', 'Susan', 'Jessica', 'Sarah',
    'Karen', 'Lisa', 'Nancy', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia',
    'Rachel', 'Danielle', 'Amber', 'Jasmine', 'Brittany', 'Whitney', 'Tiffany', 'Kayla'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
    'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'
  ];
  
  const cities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
  ];
  
  const occupations = [
    'Teacher', 'Nurse', 'Engineer', 'Doctor', 'Lawyer',
    'Sales Manager', 'Marketing Specialist', 'Chef', 'Accountant', 'Bartender',
    'Personal Trainer', 'Model', 'Entrepreneur', 'Student', 'Consultant',
    'IT Specialist', 'Real Estate Agent', 'Firefighter', 'Police Officer', 'Artist'
  ];
  
  const backstories = [
    'Grew up in a small town and moved to the city for a fresh start.',
    'Comes from a big family with 5 siblings and developed competitive skills early on.',
    'Former college athlete who never lost the competitive spirit.',
    'Self-made entrepreneur who built a successful business from scratch.',
    'Traveled across the country and loves meeting new people.',
    'Recently ended a long-term relationship and is looking for a new chapter in life.',
    'Worked multiple jobs to put themselves through college.',
    'Has a passion for cooking and always hosts dinner parties for friends.',
    'Lives for adventure and has traveled to over 20 countries.',
    'Works with underprivileged children and has a heart of gold... usually.'
  ];
  
  const motivations = [
    'Playing to pay off student loans.',
    'Wants to prove they can outsmart everyone else.',
    'Needs the money to start their dream business.',
    'Playing for their family back home.',
    'In it for the fame and the experience.',
    'Wants to challenge themselves and overcome their fears.',
    'Looking to make strategic connections for their career.',
    'Playing to show that nice people can win too.',
    'Hoping to become a reality TV star after the show.',
    'Simply loves the game and has been a fan since season one.'
  ];
  
  const aiPlayers: PlayerData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Randomly determine gender for name generation
    const isMale = Math.random() > 0.5;
    const firstName = isMale
      ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
      : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Randomly select personality archetype
    const archetype = archetypes[Math.floor(Math.random() * archetypes.length)] as 
      'mastermind' | 'social-butterfly' | 'comp-beast' | 'floater' | 'villain';
    
    // Get traits for this archetype
    const archetypeTraits = traits[archetype];
    
    // Randomly select 3 traits from this archetype
    const selectedTraits = [];
    const traitIndices = new Set<number>();
    while (traitIndices.size < 3) {
      traitIndices.add(Math.floor(Math.random() * archetypeTraits.length));
    }
    for (const index of traitIndices) {
      selectedTraits.push(archetypeTraits[index]);
    }
    
    // Generate attributes based on archetype
    const attributes = generateAttributesForArchetype(archetype);
    
    // Create the AI player
    const aiPlayer: PlayerData = {
      id: uuidv4(),
      name: `${firstName} ${lastName}`,
      isHuman: false,
      isAI: true,
      age: 20 + Math.floor(Math.random() * 30), // Age between 20-50
      hometown: cities[Math.floor(Math.random() * cities.length)],
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      bio: backstories[Math.floor(Math.random() * backstories.length)],
      personality: {
        archetype,
        traits: selectedTraits,
        background: backstories[Math.floor(Math.random() * backstories.length)],
        motivation: motivations[Math.floor(Math.random() * motivations.length)]
      },
      attributes,
      stats: {
        hohWins: 0,
        povWins: 0,
        timesNominated: 0,
        competitionsWon: 0
      }
    };
    
    aiPlayers.push(aiPlayer);
  }
  
  return aiPlayers;
}

/**
 * Generate attributes for an AI player based on their archetype
 */
function generateAttributesForArchetype(archetype: string) {
  // Base attributes start at 2
  const attributes = {
    general: 2 + Math.floor(Math.random() * 2),   // Add the missing general attribute
    physical: 2 + Math.floor(Math.random() * 2),
    endurance: 2 + Math.floor(Math.random() * 2),
    mentalQuiz: 2 + Math.floor(Math.random() * 2),
    strategic: 2 + Math.floor(Math.random() * 2),
    adaptability: 2 + Math.floor(Math.random() * 2),
    risk: 2 + Math.floor(Math.random() * 2),
    social: 2 + Math.floor(Math.random() * 2),
    leadership: 2 + Math.floor(Math.random() * 2),
    temperament: 2 + Math.floor(Math.random() * 2),
    loyalty: 2 + Math.floor(Math.random() * 2),
    deception: 2 + Math.floor(Math.random() * 2),
    independence: 2 + Math.floor(Math.random() * 2)
  };
  
  // Add bonus points based on archetype (total +6 points)
  switch (archetype) {
    case 'mastermind':
      attributes.strategic += 2;
      attributes.mentalQuiz += 2;
      attributes.deception += 1;
      attributes.adaptability += 1;
      // Update general attribute to reflect overall ability
      attributes.general += 1;
      break;
      
    case 'social-butterfly':
      attributes.social += 2;
      attributes.adaptability += 2;
      attributes.leadership += 1;
      attributes.temperament += 1;
      break;
      
    case 'comp-beast':
      attributes.physical += 2;
      attributes.endurance += 2;
      attributes.mentalQuiz += 1;
      attributes.leadership += 1;
      // Update general attribute to reflect overall ability
      attributes.general += 1;
      break;
      
    case 'floater':
      attributes.adaptability += 2;
      attributes.social += 1;
      attributes.temperament += 2;
      attributes.independence += 1;
      break;
      
    case 'villain':
      attributes.deception += 2;
      attributes.strategic += 2;
      attributes.risk += 1;
      attributes.independence += 1;
      // Update general attribute for villain archetype
      attributes.general += 1;
      break;
  }
  
  // Ensure no attribute exceeds 5
  Object.keys(attributes).forEach(key => {
    attributes[key] = Math.min(attributes[key], 5);
  });
  
  return attributes;
}
