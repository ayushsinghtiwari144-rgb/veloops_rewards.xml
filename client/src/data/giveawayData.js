// Mock Giveaway and Winner Data for VELOOP Rewards Phase 2

export const mockGiveaways = [
  {
    id: 'gw-1',
    slug: 'iphone-15-pro',
    name: 'Apple iPhone 15 Pro (256GB)',
    description: 'Win the brand new iPhone 15 Pro featuring an Aerospace-grade titanium design, A17 Pro chip, and customizable Action button.',
    prizeDescription: '1x Brand New Unlocked Apple iPhone 15 Pro 256GB Natural Titanium edition with official 1-Year AppleCare warranty.',
    image: 'iphone',
    status: 'ACTIVE',
    participants: 1420,
    remainingTime: 86400 * 3 + 3600 * 5 + 1200, // 3 days, 5 hours, 20 mins from now
    entryRequirement: 'Complete daily activity check-in and verify account email.',
    entryCurrency: 'VELOOP Points',
    entryAmount: 50,
    startDate: '2026-09-20',
    endDate: '2026-09-30',
    eligibility: 'Open to verified members aged 18+. One entry per registered account.',
    rules: [
      'Participants must hold a verified VELOOP Rewards account.',
      'Only one entry ticket per user per giveaway session.',
      'Cheating, multiple account creation, or automated scripts result in immediate disqualification.',
      'Winner selected randomly via verified cryptographic seed drawing at end of countdown.'
    ],
    terms: 'Prize is non-transferable and cannot be exchanged for cash. Shipping costs covered worldwide by VELOOP Rewards.',
    winnerSelectionInfo: 'Automated seed drawing conducted publicly within 1 hour of giveaway conclusion.',
    claimProcess: 'Winner will receive an automated email notification and in-app claim banner valid for 7 calendar days.'
  },
  {
    id: 'gw-2',
    slug: 'apple-watch-series-9',
    name: 'Apple Watch Series 9 GPS',
    description: 'Track your health and fitness with the powerful S9 SiP chip, brighter display, and magical Double Tap gesture feature.',
    prizeDescription: '1x Apple Watch Series 9 GPS 45mm Midnight Aluminum Case with Sport Band.',
    image: 'watch',
    status: 'ACTIVE',
    participants: 980,
    remainingTime: 86400 * 1 + 3600 * 12 + 4500, // 1 day, 13 hours, 15 mins
    entryRequirement: 'Earn entries through community reward streaks.',
    entryCurrency: 'VELOOP Points',
    entryAmount: 30,
    startDate: '2026-09-22',
    endDate: '2026-09-28',
    eligibility: 'Open to registered VELOOP Rewards account holders.',
    rules: [
      'Account must be in good standing without fraud flags.',
      'Single entry ticket per account.',
      'Selection takes place live after timer expiration.'
    ],
    terms: 'Valid shipping address required upon notification.',
    winnerSelectionInfo: 'Random draw protocol executed upon timer completion.',
    claimProcess: 'Claim form sent directly to winner dashboard.'
  },
  {
    id: 'gw-3',
    slug: 'airpods-pro-2',
    name: 'Apple AirPods Pro 2nd Gen',
    description: 'Experience up to 2x more Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.',
    prizeDescription: '1x Apple AirPods Pro (2nd Generation) with MagSafe Charging Case (USB-C).',
    image: 'airpods',
    status: 'ACTIVE',
    participants: 2150,
    remainingTime: 3600 * 4 + 1800, // 4 hours, 30 mins
    entryRequirement: 'Free entry for active weekly members.',
    entryCurrency: 'VELOOP Points',
    entryAmount: 20,
    startDate: '2026-09-24',
    endDate: '2026-09-27',
    eligibility: 'All active platform members eligible.',
    rules: [
      'Single ticket allowed per user.',
      'No entry fee required beyond standard activity points.'
    ],
    terms: 'Worldwide delivery supported.',
    winnerSelectionInfo: 'Provably fair random selection.',
    claimProcess: 'Instant digital notification.'
  },
  {
    id: 'gw-4',
    slug: 'amazon-500-gift-card',
    name: '$500 Amazon eGift Card',
    description: 'Shop millions of items online with an instant $500 digital Amazon eGift Card delivered straight to your inbox.',
    prizeDescription: '1x $500 USD Amazon Digital Gift Code redeemable on Amazon store worldwide.',
    image: 'giftcard',
    status: 'UPCOMING',
    participants: 310,
    remainingTime: 86400 * 5, // Starts in 5 days
    entryRequirement: 'Pre-register entries before launch.',
    entryCurrency: 'VELOOP Points',
    entryAmount: 15,
    startDate: '2026-10-01',
    endDate: '2026-10-10',
    eligibility: 'Open to all VELOOP users.',
    rules: [
      'Pre-registration grants 1 bonus entry ticket.',
      'Digital code delivered within 24 hours of winning.'
    ],
    terms: 'Redeemable online according to Amazon TOS.',
    winnerSelectionInfo: 'Draw occurs at conclusion of event.',
    claimProcess: 'Instant email delivery of gift claim code.'
  },
  {
    id: 'gw-5',
    slug: 'sony-playstation-5-slim',
    name: 'Sony PlayStation 5 Slim Edition',
    description: 'Unleash new gaming possibilities with lightning-fast loading, haptic feedback, 3D Audio, and ultra-high speed SSD.',
    prizeDescription: '1x PS5 Digital Slim Console + DualSense Wireless Controller.',
    image: 'ps5',
    status: 'ENDED',
    participants: 4500,
    remainingTime: 0,
    entryRequirement: 'Completed September Grand Event.',
    entryCurrency: 'VELOOP Points',
    entryAmount: 100,
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    eligibility: 'Global members.',
    rules: ['Event concluded.'],
    terms: 'Prize dispatched to verified winner.',
    winnerSelectionInfo: 'Drawing completed on 2026-09-15.',
    claimProcess: 'Claimed by winner.'
  }
];

export const mockWinners = [
  {
    id: 'win-101',
    maskedUserId: 'AYU****92',
    prize: 'Sony PlayStation 5 Slim',
    giveawayName: 'Sony PlayStation 5 Slim Edition',
    announcedDate: 'September 15, 2026',
    status: 'Claimed & Dispatched',
    avatarBg: '#0d6efd'
  },
  {
    id: 'win-102',
    maskedUserId: 'SAM****14',
    prize: 'MacBook Air M3',
    giveawayName: 'Apple MacBook Air 15" M3',
    announcedDate: 'September 10, 2026',
    status: 'Claimed',
    avatarBg: '#198754'
  },
  {
    id: 'win-103',
    maskedUserId: 'RAH****08',
    prize: '$250 Amazon Gift Card',
    giveawayName: '$250 Amazon Digital Voucher',
    announcedDate: 'September 05, 2026',
    status: 'Claimed',
    avatarBg: '#ffc107'
  },
  {
    id: 'win-104',
    maskedUserId: 'PRI****55',
    prize: 'iPad Pro 11"',
    giveawayName: 'Apple iPad Pro M4 Edition',
    announcedDate: 'August 28, 2026',
    status: 'Claimed',
    avatarBg: '#0dcaf0'
  },
  {
    id: 'win-105',
    maskedUserId: 'NIX****31',
    prize: 'Bose QuietComfort Ultra',
    giveawayName: 'Bose QC Ultra Wireless Headphones',
    announcedDate: 'August 20, 2026',
    status: 'Claimed',
    avatarBg: '#6f42c1'
  }
];

export const platformStats = {
  activeGiveaways: 24,
  totalParticipants: '8.5K+',
  rewardsDistributed: '1.2K+',
  trustScore: '99.8%'
};
