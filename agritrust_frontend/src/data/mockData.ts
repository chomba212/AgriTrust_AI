export type TrustTier = 'high' | 'medium' | 'low' | 'unscored';

export interface TrustFactors {
  mobileMoneyConsistency: number;   // 0-100
  cooperativeRepayment: number;
  inputPurchasePattern: number;
  productionRecords: number;
  climateAdaptation: number;
  communityTrust: number;
}

export interface Farmer {
  id: string;
  name: string;
  county: string;
  subcounty: string;
  phone: string;
  cropTypes: string[];
  landAcres: number;
  gender: 'M' | 'F';
  isYouth: boolean;
  hasDisability: boolean;
  memberSince: string;
  trustScore: number | null;
  trustTier: TrustTier;
  trustFactors: TrustFactors;
  peerPoolId: string | null;
  hasIndividualScore: boolean;
  repaymentCycles: number;
  cooperativeName: string | null;
  mpesaLinked: boolean;
  explanation?: string;
}

export interface PeerPool {
  id: string;
  name: string;
  region: string;
  memberIds: string[];
  poolScore: number;
  repaymentRate: number;
  totalLoanKES: number;
  createdAt: string;
  status: 'active' | 'forming' | 'graduated';
  matchBasis: string[];
}

export interface LoanApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  amountKES: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  appliedAt: string;
  decidedAt?: string;
  lenderNote?: string;
  riskRating: 'A' | 'B' | 'C' | 'D';
  isPoolBacked: boolean;
  poolId?: string;
}

export interface FieldVisit {
  id: string;
  farmerId: string;
  agentId: string;
  visitDate: string;
  cropCondition: 'excellent' | 'good' | 'fair' | 'poor';
  droughtRisk: number;
  pestRisk: number;
  notes: string;
  photoCaptured: boolean;
  gpsLat: number;
  gpsLng: number;
}

export const farmers: Farmer[] = [
  {
    id: 'F001',
    name: 'Grace Wanjiku Muthoni',
    county: 'Kirinyaga',
    subcounty: 'Mwea',
    phone: '0712 345 678',
    cropTypes: ['Rice', 'Maize'],
    landAcres: 3.5,
    gender: 'F',
    isYouth: false,
    hasDisability: false,
    memberSince: '2022-03',
    trustScore: 78,
    trustTier: 'high',
    trustFactors: {
      mobileMoneyConsistency: 85,
      cooperativeRepayment: 90,
      inputPurchasePattern: 72,
      productionRecords: 68,
      climateAdaptation: 75,
      communityTrust: 80,
    },
    peerPoolId: null,
    hasIndividualScore: true,
    repaymentCycles: 4,
    cooperativeName: 'Mwea Rice Growers SACCO',
    mpesaLinked: true,
    explanation: 'Grace has demonstrated 4 consecutive repayment cycles with the Mwea Rice Growers SACCO, with M-Pesa activity showing consistent seasonal income from rice harvests. Her cooperative standing and input purchase pattern align with a reliable borrower profile.',
  },
  {
    id: 'F002',
    name: 'John Kiprotich Rono',
    county: 'Uasin Gishu',
    subcounty: 'Turbo',
    phone: '0722 456 789',
    cropTypes: ['Wheat', 'Barley'],
    landAcres: 12.0,
    gender: 'M',
    isYouth: false,
    hasDisability: false,
    memberSince: '2021-07',
    trustScore: 65,
    trustTier: 'medium',
    trustFactors: {
      mobileMoneyConsistency: 60,
      cooperativeRepayment: 70,
      inputPurchasePattern: 80,
      productionRecords: 55,
      climateAdaptation: 62,
      communityTrust: 68,
    },
    peerPoolId: null,
    hasIndividualScore: true,
    repaymentCycles: 2,
    cooperativeName: 'Turbo Grain Farmers Co-op',
    mpesaLinked: true,
    explanation: 'John shows strong input purchase discipline, indicating active farming. However, his mobile money consistency is moderate and he has only 2 repayment cycles on record. Climate data for Uasin Gishu shows above-average drought risk this season, which moderates the score.',
  },
  {
    id: 'F003',
    name: 'Amina Hassan Osman',
    county: 'Garissa',
    subcounty: 'Dadaab',
    phone: '0733 567 890',
    cropTypes: ['Sorghum', 'Cowpea'],
    landAcres: 1.5,
    gender: 'F',
    isYouth: true,
    hasDisability: false,
    memberSince: '2024-01',
    trustScore: null,
    trustTier: 'unscored',
    trustFactors: {
      mobileMoneyConsistency: 40,
      cooperativeRepayment: 0,
      inputPurchasePattern: 35,
      productionRecords: 10,
      climateAdaptation: 50,
      communityTrust: 45,
    },
    peerPoolId: 'PP002',
    hasIndividualScore: false,
    repaymentCycles: 0,
    cooperativeName: null,
    mpesaLinked: true,
    explanation: 'Amina is a first-time borrower with limited individual data history. She has been matched into Peer Pool PP002 — a 9-member group of thin-file Garissa farmers with similar crop types and mobile money patterns. The pool carries a 74% collective repayment score. Individual scoring activates after 2 repayment cycles.',
  },
  {
    id: 'F004',
    name: 'Peter Otieno Auma',
    county: 'Kisumu',
    subcounty: 'Nyando',
    phone: '0744 678 901',
    cropTypes: ['Sugarcane', 'Maize'],
    landAcres: 5.0,
    gender: 'M',
    isYouth: false,
    hasDisability: true,
    memberSince: '2023-05',
    trustScore: 54,
    trustTier: 'medium',
    trustFactors: {
      mobileMoneyConsistency: 58,
      cooperativeRepayment: 50,
      inputPurchasePattern: 60,
      productionRecords: 48,
      climateAdaptation: 55,
      communityTrust: 62,
    },
    peerPoolId: null,
    hasIndividualScore: true,
    repaymentCycles: 1,
    cooperativeName: 'Nyando Sugar Outgrowers',
    mpesaLinked: false,
    explanation: 'Peter has one repayment cycle and is not yet M-Pesa linked, limiting mobile money signals. Sugarcane records show productivity but the Nyando valley flooding risk in Q2 is flagged as elevated. Lender should consider crop insurance as a condition.',
  },
  {
    id: 'F005',
    name: 'Fatuma Abdullahi Wako',
    county: 'Wajir',
    subcounty: 'Eldas',
    phone: '0755 789 012',
    cropTypes: ['Goat rearing', 'Sorghum'],
    landAcres: 0.8,
    gender: 'F',
    isYouth: true,
    hasDisability: false,
    memberSince: '2024-06',
    trustScore: null,
    trustTier: 'unscored',
    trustFactors: {
      mobileMoneyConsistency: 30,
      cooperativeRepayment: 0,
      inputPurchasePattern: 20,
      productionRecords: 5,
      climateAdaptation: 38,
      communityTrust: 42,
    },
    peerPoolId: 'PP003',
    hasIndividualScore: false,
    repaymentCycles: 0,
    cooperativeName: null,
    mpesaLinked: true,
    explanation: 'Fatuma joined the platform 3 months ago with minimal data trail. She has been matched into Peer Pool PP003 — an 8-member pastoralist group in Wajir/Mandera. The pool\'s shared repayment guarantee de-risks this application. Her mobile money activity shows small but consistent Equity-linked transactions.',
  },
  {
    id: 'F006',
    name: 'Samuel Njoroge Kamau',
    county: 'Nyeri',
    subcounty: 'Tetu',
    phone: '0766 890 123',
    cropTypes: ['Coffee', 'Tea'],
    landAcres: 2.2,
    gender: 'M',
    isYouth: false,
    hasDisability: false,
    memberSince: '2020-11',
    trustScore: 89,
    trustTier: 'high',
    trustFactors: {
      mobileMoneyConsistency: 92,
      cooperativeRepayment: 95,
      inputPurchasePattern: 85,
      productionRecords: 88,
      climateAdaptation: 82,
      communityTrust: 90,
    },
    peerPoolId: null,
    hasIndividualScore: true,
    repaymentCycles: 7,
    cooperativeName: 'Tetu Coffee Farmers Co-op',
    mpesaLinked: true,
    explanation: 'Samuel is the strongest individual profile in the registry. 7 consecutive repayment cycles, deep cooperative integration, and consistent cherry delivery to the Tetu factory provide a dense data graph. M-Pesa income shows clear seasonal peaks matching harvest periods. Recommended for highest lending tier.',
  },
  {
    id: 'F007',
    name: 'Mary Chebet Koech',
    county: 'Bomet',
    subcounty: 'Chepalungu',
    phone: '0777 901 234',
    cropTypes: ['Tea', 'Vegetables'],
    landAcres: 1.8,
    gender: 'F',
    isYouth: true,
    hasDisability: false,
    memberSince: '2023-09',
    trustScore: 44,
    trustTier: 'low',
    trustFactors: {
      mobileMoneyConsistency: 45,
      cooperativeRepayment: 35,
      inputPurchasePattern: 50,
      productionRecords: 40,
      climateAdaptation: 48,
      communityTrust: 50,
    },
    peerPoolId: 'PP001',
    hasIndividualScore: true,
    repaymentCycles: 1,
    cooperativeName: null,
    mpesaLinked: true,
    explanation: 'Mary has one repayment cycle with a missed installment flagged. Individual score is low, but she has been matched into Peer Pool PP001 which carries a stronger group guarantee. Lender may consider a smaller initial loan with pool backing to build her individual history.',
  },
  {
    id: 'F008',
    name: 'David Mwangi Kariuki',
    county: 'Murang\'a',
    subcounty: 'Kangema',
    phone: '0788 012 345',
    cropTypes: ['Banana', 'Avocado', 'Maize'],
    landAcres: 4.1,
    gender: 'M',
    isYouth: false,
    hasDisability: false,
    memberSince: '2022-01',
    trustScore: 71,
    trustTier: 'high',
    trustFactors: {
      mobileMoneyConsistency: 75,
      cooperativeRepayment: 68,
      inputPurchasePattern: 78,
      productionRecords: 70,
      climateAdaptation: 65,
      communityTrust: 72,
    },
    peerPoolId: null,
    hasIndividualScore: true,
    repaymentCycles: 3,
    cooperativeName: 'Kangema Horticultural Farmers',
    mpesaLinked: true,
    explanation: 'David has a diversified crop portfolio reducing income risk. 3 repayment cycles with 98% on-time payment. Avocado exports add an additional income stream tracked via M-Pesa receipts from Kakuzi and exporters. Graph analysis shows strong links to reliable cooperative members.',
  },
];

export const peerPools: PeerPool[] = [
  {
    id: 'PP001',
    name: 'Chepalungu Tea Youth Group',
    region: 'Bomet, Chepalungu',
    memberIds: ['F007', 'F009', 'F010', 'F011', 'F012'],
    poolScore: 62,
    repaymentRate: 84,
    totalLoanKES: 250000,
    createdAt: '2024-02-10',
    status: 'active',
    matchBasis: ['Tea farming', 'Youth (<35)', 'Chepalungu subcounty', 'M-Pesa linked'],
  },
  {
    id: 'PP002',
    name: 'Dadaab Dryland Farmers Pool',
    region: 'Garissa, Dadaab',
    memberIds: ['F003', 'F013', 'F014', 'F015', 'F016', 'F017', 'F018', 'F019', 'F020'],
    poolScore: 74,
    repaymentRate: 91,
    totalLoanKES: 180000,
    createdAt: '2024-04-01',
    status: 'active',
    matchBasis: ['Dryland crops', 'ASAL region', 'Cooperative proximity', 'Similar M-Pesa patterns'],
  },
  {
    id: 'PP003',
    name: 'Wajir Pastoralist Women\'s Circle',
    region: 'Wajir, Eldas',
    memberIds: ['F005', 'F021', 'F022', 'F023', 'F024', 'F025', 'F026', 'F027'],
    poolScore: 58,
    repaymentRate: 78,
    totalLoanKES: 120000,
    createdAt: '2024-06-15',
    status: 'forming',
    matchBasis: ['Pastoralism', 'Women-only', 'Wajir/Mandera cross-border', 'Equity Mobile'],
  },
];

export const loanApplications: LoanApplication[] = [
  {
    id: 'LA001',
    farmerId: 'F001',
    farmerName: 'Grace Wanjiku Muthoni',
    amountKES: 85000,
    purpose: 'Rice planting inputs & irrigation repair',
    status: 'pending',
    appliedAt: '2026-06-18',
    riskRating: 'A',
    isPoolBacked: false,
  },
  {
    id: 'LA002',
    farmerId: 'F003',
    farmerName: 'Amina Hassan Osman',
    amountKES: 15000,
    purpose: 'Sorghum seeds and hand tools',
    status: 'pending',
    appliedAt: '2026-06-20',
    riskRating: 'B',
    isPoolBacked: true,
    poolId: 'PP002',
  },
  {
    id: 'LA003',
    farmerId: 'F006',
    farmerName: 'Samuel Njoroge Kamau',
    amountKES: 150000,
    purpose: 'Coffee pulping machine upgrade',
    status: 'approved',
    appliedAt: '2026-06-10',
    decidedAt: '2026-06-12',
    lenderNote: 'Exceptional profile. Fast-tracked. Disbursed via M-Pesa.',
    riskRating: 'A',
    isPoolBacked: false,
  },
  {
    id: 'LA004',
    farmerId: 'F007',
    farmerName: 'Mary Chebet Koech',
    amountKES: 25000,
    purpose: 'Fertiliser for tea bushes',
    status: 'pending',
    appliedAt: '2026-06-21',
    riskRating: 'C',
    isPoolBacked: true,
    poolId: 'PP001',
  },
  {
    id: 'LA005',
    farmerId: 'F002',
    farmerName: 'John Kiprotich Rono',
    amountKES: 60000,
    purpose: 'Wheat harvester hire',
    status: 'disbursed',
    appliedAt: '2026-05-28',
    decidedAt: '2026-06-01',
    lenderNote: 'Approved with crop insurance requirement.',
    riskRating: 'B',
    isPoolBacked: false,
  },
  {
    id: 'LA006',
    farmerId: 'F005',
    farmerName: 'Fatuma Abdullahi Wako',
    amountKES: 12000,
    purpose: 'Goat feed and veterinary costs',
    status: 'pending',
    appliedAt: '2026-06-22',
    riskRating: 'C',
    isPoolBacked: true,
    poolId: 'PP003',
  },
  {
    id: 'LA007',
    farmerId: 'F008',
    farmerName: 'David Mwangi Kariuki',
    amountKES: 95000,
    purpose: 'Avocado cold storage unit',
    status: 'approved',
    appliedAt: '2026-06-14',
    decidedAt: '2026-06-16',
    lenderNote: 'Diversified income reduces risk. Export market linkage confirmed.',
    riskRating: 'A',
    isPoolBacked: false,
  },
  {
    id: 'LA008',
    farmerId: 'F004',
    farmerName: 'Peter Otieno Auma',
    amountKES: 40000,
    purpose: 'Sugarcane ratoon management',
    status: 'rejected',
    appliedAt: '2026-06-05',
    decidedAt: '2026-06-08',
    lenderNote: 'Flood risk Q2 too high. Recommend reapplication after rains subside and with crop insurance.',
    riskRating: 'D',
    isPoolBacked: false,
  },
];

export const fieldVisits: FieldVisit[] = [
  {
    id: 'FV001',
    farmerId: 'F001',
    agentId: 'AG001',
    visitDate: '2026-06-15',
    cropCondition: 'good',
    droughtRisk: 20,
    pestRisk: 15,
    notes: 'Rice paddies well irrigated. Grace has adopted new SRI technique. Recommend input loan approval.',
    photoCaptured: true,
    gpsLat: -0.6891,
    gpsLng: 37.3573,
  },
  {
    id: 'FV002',
    farmerId: 'F003',
    agentId: 'AG002',
    visitDate: '2026-06-19',
    cropCondition: 'fair',
    droughtRisk: 68,
    pestRisk: 30,
    notes: 'Amina\'s sorghum plot shows moisture stress. Peer pool backing crucial — individual plot risk elevated. Early rains forecast next 3 weeks.',
    photoCaptured: true,
    gpsLat: 0.0444,
    gpsLng: 40.3128,
  },
  {
    id: 'FV003',
    farmerId: 'F006',
    agentId: 'AG001',
    visitDate: '2026-06-17',
    cropCondition: 'excellent',
    droughtRisk: 10,
    pestRisk: 8,
    notes: 'Samuel\'s coffee trees in peak condition. Cherry count per tree above county average. New pulping machine will add 30% processing capacity.',
    photoCaptured: true,
    gpsLat: -0.4167,
    gpsLng: 36.9500,
  },
];

export const systemStats = {
  totalFarmers: 1247,
  scoredFarmers: 834,
  inPeerPools: 413,
  activePools: 47,
  totalDisbursedKES: 18_450_000,
  portfolioAtRiskPct: 4.2,
  womenPct: 58,
  youthPct: 34,
  avgTrustScore: 63,
  loansThisMonth: 89,
};

export function getTrustColor(tier: TrustTier) {
  switch (tier) {
    case 'high': return '#1a7a4a';
    case 'medium': return '#f59e0b';
    case 'low': return '#ef4444';
    case 'unscored': return '#6b7280';
  }
}

export function getTrustLabel(tier: TrustTier) {
  switch (tier) {
    case 'high': return 'High trust';
    case 'medium': return 'Medium trust';
    case 'low': return 'Low trust';
    case 'unscored': return 'Peer pool';
  }
}

export function getFarmerById(id: string) {
  return farmers.find(f => f.id === id);
}

export function getPoolById(id: string) {
  return peerPools.find(p => p.id === id);
}

export function getLoansForFarmer(farmerId: string) {
  return loanApplications.filter(l => l.farmerId === farmerId);
}
