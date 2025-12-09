// Mock data for development - will be replaced by API calls later

export const mockProjects = [
  {
    id: 1,
    client: 'TechCorp Inc.',
    clientInitial: 'TI',
    clientColor: '#3B82F6',
    industry: 'Technology',
    year: 2024,
    status: 'Won',
    productOwner: {
      name: 'Amelia Chen',
      email: 'amelia.chen@techcorp.com'
    },
    objectives: 'Modernize legacy systems and migrate to cloud infrastructure to improve operational efficiency by 40%',
    strategies: ['Cloud Migration', 'Agile Adoption', 'Change Management'],
    keyOutcomes: '35% reduction in operational costs, 50% faster deployment cycles',
    metrics: {
      costEfficiency: '+35%',
      timeSaved: '50%',
      satisfaction: '+28 NPS',
    },
  },
  {
    id: 2,
    client: 'Global Bank',
    clientInitial: 'GB',
    clientColor: '#10B981',
    industry: 'Finance',
    year: 2024,
    status: 'Won',
    productOwner: {
      name: 'Carlos Alvarez',
      email: 'carlos.alvarez@globalbank.com'
    },
    objectives: 'Enhance digital banking experience and increase customer satisfaction scores by 25%',
    strategies: ['UX Research', 'Mobile-First Design', 'A/B Testing'],
    keyOutcomes: 'NPS increased by 32 points, 60% increase in mobile app engagement',
    metrics: {
      costEfficiency: '+28%',
      timeSaved: '45%',
      satisfaction: '+32 NPS',
    },
  },
  {
    id: 3,
    client: 'RetailCo',
    clientInitial: 'RC',
    clientColor: '#F59E0B',
    industry: 'Retail',
    year: 2023,
    status: 'Won',
    productOwner: {
      name: 'Riley Thompson',
      email: 'riley.thompson@retailco.com'
    },
    objectives: 'Integrate online and offline channels to create seamless shopping experience',
    strategies: ['Channel Integration', 'Inventory Optimization', 'Analytics'],
    keyOutcomes: '45% increase in online sales, improved inventory turnover by 28%',
    metrics: {
      costEfficiency: '+35%',
      timeSaved: '50%',
      satisfaction: '+32 NPS',
    },
  },
  {
    id: 4,
    client: 'HealthPlus',
    clientInitial: 'HP',
    clientColor: '#8B5CF6',
    industry: 'Healthcare',
    year: 2023,
    status: 'Won',
    productOwner: {
      name: 'Dr. Priya Nair',
      email: 'priya.nair@healthplus.com'
    },
    objectives: 'Implement telemedicine platform to increase patient access by 50%',
    strategies: ['Platform Development', 'Regulatory Compliance', 'Patient Engagement'],
    keyOutcomes: '65% increase in patient reach, 4.8/5 patient satisfaction rating',
    metrics: {
      costEfficiency: '+42%',
      timeSaved: '60%',
      satisfaction: '+38 NPS',
    },
  },
  {
    id: 5,
    client: 'AutoDrive',
    clientInitial: 'AD',
    clientColor: '#EC4899',
    industry: 'Technology',
    year: 2023,
    status: 'Won',
    productOwner: {
      name: 'Leo Martins',
      email: 'leo.martins@autodrive.com'
    },
    objectives: 'Launch AI-powered driver assistance features with 99.9% reliability',
    strategies: ['ML Engineering', 'Safety Testing', 'Partner Integration'],
    keyOutcomes: 'Successful launch in 3 markets, zero critical incidents',
    metrics: {
      costEfficiency: '+30%',
      timeSaved: '55%',
      satisfaction: '+25 NPS',
    },
  },
  {
    id: 6,
    client: 'EcoEnergy',
    clientInitial: 'EE',
    clientColor: '#14B8A6',
    industry: 'Technology',
    year: 2023,
    status: 'Won',
    productOwner: {
      name: 'Sophia Zhang',
      email: 'sophia.zhang@ecoenergy.com'
    },
    objectives: 'Build renewable energy management platform for smart grid optimization',
    strategies: ['IoT Integration', 'Data Analytics', 'Sustainability Strategy'],
    keyOutcomes: '28% energy efficiency improvement, $2M cost savings',
    metrics: {
      costEfficiency: '+28%',
      timeSaved: '40%',
      satisfaction: '+20 NPS',
    },
  },
  {
    id: 7,
    client: 'FashionForward',
    clientInitial: 'FF',
    clientColor: '#F97316',
    industry: 'Retail',
    year: 2024,
    status: 'Lost',
    productOwner: {
      name: 'Nina Patel',
      email: 'nina.patel@fashionforward.com'
    },
    objectives: 'Create personalized shopping experience using AI recommendations',
    strategies: ['Recommendation Engine', 'Personalization', 'Mobile Commerce'],
    keyOutcomes: 'Project not secured - budget constraints',
    metrics: null,
  },
  {
    id: 8,
    client: 'DataStream',
    clientInitial: 'DS',
    clientColor: '#6366F1',
    industry: 'Finance',
    year: 2023,
    status: 'Won',
    productOwner: {
      name: 'Ethan Walker',
      email: 'ethan.walker@datastream.com'
    },
    objectives: 'Develop real-time fraud detection system with 99% accuracy',
    strategies: ['Machine Learning', 'Real-time Processing', 'Risk Management'],
    keyOutcomes: '99.2% fraud detection accuracy, 40% reduction in false positives',
    metrics: {
      costEfficiency: '+40%',
      timeSaved: '65%',
      satisfaction: '+35 NPS',
    },
  },
];

export const mockStats = {
  totalProjects: 8,
  wonProjects: 6,
  lostProjects: 2,
  winRate: 75,
  activeClients: 4,
};

export const mockClients = ['TechCorp Inc.', 'Global Bank', 'RetailCo', 'HealthPlus'];
export const mockIndustries = ['Technology', 'Finance', 'Retail', 'Healthcare'];
export const mockYears = [2024, 2023];
export const mockStatuses = ['Won', 'Lost'];
