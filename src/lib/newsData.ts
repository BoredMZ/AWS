// Location-specific news data organized by region and audience type
export const newsData = {
  'Luzon': {
    students: [
      {
        id: 1,
        title: 'Monsoon Season Alert: Prepare Your Projects',
        description: 'The Habagat monsoon brings heavy rains from June to September. Plan indoor activities and research projects accordingly.',
        category: 'Education',
        emoji: '📚',
      },
      {
        id: 2,
        title: 'Climate Change Science Fair - Register Now',
        description: 'Annual Science Fair focusing on weather prediction and climate adaptation. Prizes up to ₱50,000.',
        category: 'Event',
        emoji: '🏆',
      },
      {
        id: 3,
        title: 'Weather Forecasting Workshop for Students',
        description: 'Free workshop on meteorology basics and weather data analysis. Open to all high school and college students.',
        category: 'Workshop',
        emoji: '🎓',
      },
    ],
    farmers: [
      {
        id: 1,
        title: 'Crop Planning Guide for Habagat Season',
        description: 'Best practices for planting rice and vegetables during monsoon. Includes irrigation management tips.',
        category: 'Agriculture',
        emoji: '🌾',
      },
      {
        id: 2,
        title: 'Typhoon Risk Management for Farmers',
        description: 'Learn how to protect your crops and livestock during typhoon season. Free training programs available.',
        category: 'Safety',
        emoji: '⛑️',
      },
      {
        id: 3,
        title: 'Fertilizer Subsidy Program - December',
        description: 'Government subsidy for fertilizers. Apply now at your local agricultural office.',
        category: 'Subsidy',
        emoji: '💰',
      },
    ],
    government: [
      {
        id: 1,
        title: 'Disaster Risk Assessment Report',
        description: 'Monthly flood and landslide risk analysis for Luzon. Regional briefing required.',
        category: 'Report',
        emoji: '📊',
      },
      {
        id: 2,
        title: 'Climate Resilience Strategy Update',
        description: 'New protocols for weather alert dissemination and emergency response coordination.',
        category: 'Policy',
        emoji: '🏛️',
      },
      {
        id: 3,
        title: 'PAGASA Weather Station Network Expansion',
        description: 'Adding 5 new automated weather stations in Luzon. Project completion by Q2 2026.',
        category: 'Infrastructure',
        emoji: '🛰️',
      },
    ],
  },
  'Visayas': {
    students: [
      {
        id: 1,
        title: 'Tropical Storm Studies - Research Opportunity',
        description: 'Visayas experiences frequent tropical storms. Join research programs on storm surge prediction.',
        category: 'Education',
        emoji: '📚',
      },
      {
        id: 2,
        title: 'Island Biogeography and Weather Patterns',
        description: 'Explore how geography affects local weather. Field study scholarships available.',
        category: 'Scholarship',
        emoji: '🌍',
      },
      {
        id: 3,
        title: 'STEM Camp - Visayas Environmental Studies',
        description: 'Summer camp combining marine science and meteorology. Limited slots, apply by Dec 31.',
        category: 'Camp',
        emoji: '⛺',
      },
    ],
    farmers: [
      {
        id: 1,
        title: 'Coconut Farming - Typhoon Season Preparation',
        description: 'Secure your coconut palms before typhoon season. Expert advice on wind-resistant techniques.',
        category: 'Agriculture',
        emoji: '🥥',
      },
      {
        id: 2,
        title: 'Fishing Advisory - Current Sea Conditions',
        description: 'Rough seas expected December-February. Safe fishing windows and boat regulations.',
        category: 'Advisory',
        emoji: '🚤',
      },
      {
        id: 3,
        title: 'Crop Insurance Program for Visayas',
        description: 'Subsidized insurance for typhoon and flood damage. Enrollment period open until January 15.',
        category: 'Insurance',
        emoji: '📋',
      },
    ],
    government: [
      {
        id: 1,
        title: 'Inter-Island Weather Coordination System',
        description: 'New unified alert system for all Visayas provinces. Training scheduled for December 20.',
        category: 'System',
        emoji: '📡',
      },
      {
        id: 2,
        title: 'Coastal Erosion Monitoring Update',
        description: 'Monthly report on coastal erosion acceleration in Eastern Visayas. Mitigation plans in review.',
        category: 'Monitoring',
        emoji: '🗺️',
      },
      {
        id: 3,
        title: 'Budget Allocation for Storm Shelters',
        description: 'Approved ₱200M for new storm shelters in typhoon-prone areas. Construction starts January.',
        category: 'Budget',
        emoji: '🏗️',
      },
    ],
  },
  'Mindanao': {
    students: [
      {
        id: 1,
        title: 'Tropical Climate Research - Mindanao Focus',
        description: 'Mindanao has unique weather patterns. Research internships available at weather stations.',
        category: 'Internship',
        emoji: '📚',
      },
      {
        id: 2,
        title: 'Environmental Science Competition',
        description: 'Regional competition on climate adaptation strategies for Mindanao. Prizes and scholarships.',
        category: 'Competition',
        emoji: '🏅',
      },
      {
        id: 3,
        title: 'Workshop: Droughts and Water Management',
        description: 'Free workshop on managing dry seasons in Mindanao. Practical solutions for communities.',
        category: 'Workshop',
        emoji: '💧',
      },
    ],
    farmers: [
      {
        id: 1,
        title: 'Banana Plantation Care During Dry Season',
        description: 'Irrigation strategies and pest management during Mindanao\'s dry months.',
        category: 'Agriculture',
        emoji: '🍌',
      },
      {
        id: 2,
        title: 'Cacao Farming - Weather Optimization',
        description: 'Maximize cacao yield with proper weather monitoring and seasonal planning.',
        category: 'Agriculture',
        emoji: '🍫',
      },
      {
        id: 3,
        title: 'Drought Relief Assistance Applications',
        description: 'Emergency funds for farmers affected by prolonged dry spells. Submit applications at municipal offices.',
        category: 'Relief',
        emoji: '🤝',
      },
    ],
    government: [
      {
        id: 1,
        title: 'Drought Management Strategy - Mindanao',
        description: 'Regional plan to address recurring dry seasons. Water allocation protocols updated.',
        category: 'Strategy',
        emoji: '📋',
      },
      {
        id: 2,
        title: 'Hydroelectric Dam Weather Monitoring',
        description: 'New automated system for monitoring rainfall patterns affecting dams. Operational by January.',
        category: 'Infrastructure',
        emoji: '⚡',
      },
      {
        id: 3,
        title: 'Climate Adaptation Fund - Applications Open',
        description: 'Local government units can apply for climate adaptation projects. Deadline: January 31, 2026.',
        category: 'Funding',
        emoji: '💵',
      },
    ],
  },
  'Metro Manila': {
    students: [
      {
        id: 1,
        title: 'Urban Heat Island Effect Study',
        description: 'Research project on how Metro Manila\'s climate differs from surrounding areas. Join the study.',
        category: 'Research',
        emoji: '🌡️',
      },
      {
        id: 2,
        title: 'Disaster Risk Reduction Workshop',
        description: 'Learn how to prepare for urban flooding and typhoons. Youth leadership program available.',
        category: 'Workshop',
        emoji: '🚨',
      },
      {
        id: 3,
        title: 'Green Infrastructure Internship',
        description: 'Design urban gardens and green roofs for climate adaptation. Internship with NGOs available.',
        category: 'Internship',
        emoji: '🌱',
      },
    ],
    farmers: [
      {
        id: 1,
        title: 'Urban Gardening Guide - Metro Manila',
        description: 'Grow vegetables in small spaces. Adapt to Metro Manila\'s tropical climate and pollution.',
        category: 'Gardening',
        emoji: '🥬',
      },
      {
        id: 2,
        title: 'Community Market Opportunities',
        description: 'Sell organic produce from rooftop and balcony gardens. No permit needed for small-scale.',
        category: 'Business',
        emoji: '🏪',
      },
      {
        id: 3,
        title: 'Flood-Resistant Crop Varieties',
        description: 'New vegetable varieties resistant to flooding. Seeds available at agricultural centers.',
        category: 'Seeds',
        emoji: '🌿',
      },
    ],
    government: [
      {
        id: 1,
        title: 'Metro Manila Flood Control Upgrade',
        description: 'New drainage system implementation in flood-prone barangays. Construction timeline: 2026.',
        category: 'Infrastructure',
        emoji: '🏗️',
      },
      {
        id: 2,
        title: 'Heat Wave Response Protocol',
        description: 'Updated emergency procedures for extreme heat events. All offices briefed on new guidelines.',
        category: 'Protocol',
        emoji: '🔥',
      },
      {
        id: 3,
        title: 'PAGASA Forecast Accuracy Report',
        description: 'Monthly accuracy report for Metro Manila weather forecasts. 94% accuracy in November.',
        category: 'Report',
        emoji: '📊',
      },
    ],
  },
  'Calabarzon': {
    students: [
      {
        id: 1,
        title: 'Industrial Weather Impact Research',
        description: 'Study how weather affects industrial productivity. Research partnerships available.',
        category: 'Research',
        emoji: '🏭',
      },
      {
        id: 2,
        title: 'Environmental Monitoring Internship',
        description: 'Work with environmental agencies monitoring weather and air quality in Calabarzon.',
        category: 'Internship',
        emoji: '🌍',
      },
      {
        id: 3,
        title: 'Scholarship: Clean Energy Studies',
        description: 'Solar and wind energy potential in Calabarzon. Full scholarships for top applicants.',
        category: 'Scholarship',
        emoji: '🌞',
      },
    ],
    farmers: [
      {
        id: 1,
        title: 'Pineapple Farming - Weather Optimization',
        description: 'Maximize pineapple yield with climate-smart agriculture techniques.',
        category: 'Agriculture',
        emoji: '🍍',
      },
      {
        id: 2,
        title: 'Irrigation System Subsidy Program',
        description: '50% subsidy for modern irrigation systems. Apply at provincial agricultural office.',
        category: 'Subsidy',
        emoji: '💰',
      },
      {
        id: 3,
        title: 'Crop Diversification Guide',
        description: 'Recommended crops for different seasons in Calabarzon region. Free advisory service.',
        category: 'Advisory',
        emoji: '🌾',
      },
    ],
    government: [
      {
        id: 1,
        title: 'Industrial Air Quality Monitoring',
        description: 'Enhanced weather monitoring to track industrial emissions. Real-time dashboard available.',
        category: 'Monitoring',
        emoji: '📡',
      },
      {
        id: 2,
        title: 'Environmental Impact Assessment Guidelines',
        description: 'Updated EIA procedures considering local weather patterns. Effective January 1, 2026.',
        category: 'Guidelines',
        emoji: '📋',
      },
      {
        id: 3,
        title: 'Water Resource Management Plan',
        description: 'Optimize water usage for agriculture and industry. Public consultation scheduled.',
        category: 'Planning',
        emoji: '💧',
      },
    ],
  },
};

export type NewsCategory = 'students' | 'farmers' | 'government';

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  emoji: string;
}

export const getNewsByRegion = (
  region: string | null,
  audienceType: NewsCategory
): NewsItem[] => {
  if (!region) return [];
  
  const regionNews = newsData[region as keyof typeof newsData];
  if (!regionNews) return [];
  
  return regionNews[audienceType] || [];
};
