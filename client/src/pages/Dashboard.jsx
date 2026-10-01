import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getRewardsApi,
  getChallengesApi,
  getLeaderboardApi,
  getAchievementsApi,
  claimChallengeApi,
  redeemRewardApi
} from '../services/hubService';
import {
  Sparkles,
  Coins,
  Zap,
  Gift,
  Trophy,
  Award,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  TrendingUp,
  CalendarCheck,
  Target,
  Users,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  Smartphone,
  Watch,
  Headphones,
  Check,
  AlertCircle,
  HelpCircle,
  Star,
  Activity,
  Layers,
  Search
} from 'lucide-react';

export const Dashboard = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Data States
  const [rewards, setRewards] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedRewardCategory, setSelectedRewardCategory] = useState('ALL');
  const [challengeTab, setChallengeTab] = useState('DAILY'); // DAILY or WEEKLY
  const [leaderboardTab, setLeaderboardTab] = useState('WEEKLY'); // WEEKLY or MONTHLY

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Modals
  const [activeEarnModal, setActiveEarnModal] = useState(null);
  const [redeemingReward, setRedeemingReward] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [redeemError, setRedeemError] = useState('');
  const [claimingId, setClaimingId] = useState(null);
  const [claimMessage, setClaimMessage] = useState('');

  // Handle scroll to section passed from navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.state]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rewardsData, challengesData, leaderboardData, achievementsData] = await Promise.all([
        getRewardsApi(),
        getChallengesApi(),
        getLeaderboardApi(leaderboardTab.toLowerCase()),
        getAchievementsApi()
      ]);
      setRewards(rewardsData || []);
      setChallenges(challengesData || []);
      setLeaderboard(leaderboardData || []);
      setAchievements(achievementsData || []);
    } catch (err) {
      console.error('Failed to load hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [leaderboardTab]);

  const handleClaimChallenge = async (challengeId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setClaimingId(challengeId);
    setClaimMessage('');
    try {
      const result = await claimChallengeApi(challengeId);
      setClaimMessage(`🎉 Success! +${result.pointsAwarded} VE Points added to your balance.`);
      await refreshUser();
      await loadData();
    } catch (err) {
      setClaimMessage(`⚠️ ${err.message || 'Failed to claim challenge'}`);
    } finally {
      setClaimingId(null);
    }
  };

  const handleExecuteRedeem = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!redeemingReward) return;
    setRedeemError('');
    setRedeemSuccess(null);

    try {
      const result = await redeemRewardApi(redeemingReward._id, { shippingAddress });
      setRedeemSuccess(result);
      await refreshUser();
      await loadData();
    } catch (err) {
      setRedeemError(err.message || 'Redemption failed. Check your points balance.');
    }
  };

  // Static Data for Sections
  const waysToEarn = [
    {
      id: 'check-in',
      icon: CalendarCheck,
      title: 'Daily Check-in',
      points: '+50 VE Pts',
      badge: 'Daily',
      description: 'Log into VELOOP Rewards Hub daily to collect instant point bonuses and build active login streaks.',
      steps: [
        'Log into your VELOOP account every 24 hours.',
        'Navigate to the Daily Challenges section.',
        'Click "Claim Points" on the Daily Login Reward card.',
        'Build consecutive 7-day login streaks for bonus XP!'
      ]
    },
    {
      id: 'daily-challenges',
      icon: Zap,
      title: 'Daily Challenges',
      points: '+100 - +200 VE Pts',
      badge: 'Daily',
      description: 'Complete quick daily activities like exploring the store, checking your rank, or updating settings.',
      steps: [
        'Check the Daily Challenges tab every morning.',
        'Perform the requested action (e.g. view store or update profile).',
        'Click "Claim Points" to receive instant credit.',
        'Complete all daily tasks to maximize your daily point cap.'
      ]
    },
    {
      id: 'weekly-challenges',
      icon: Target,
      title: 'Weekly Challenges',
      points: '+250 - +500 VE Pts',
      badge: 'Weekly',
      description: 'Tackle milestone objectives over 7-day cycles for massive point payouts and achievement progress.',
      steps: [
        'View active Weekly Challenges under the Challenges section.',
        'Track your progress bar across the week.',
        'Complete objectives like redeeming a reward or inviting friends.',
        'Claim high-value point payouts before the weekly reset.'
      ]
    },
    {
      id: 'activity-completion',
      icon: CheckCircle2,
      title: 'Activity Completion',
      points: '+150 VE Pts',
      badge: 'Milestone',
      description: 'Earn points by completing account verification, profile customization, and system milestones.',
      steps: [
        'Go to your Profile settings.',
        'Fill out your contact details and shipping preferences.',
        'Save your profile to trigger instant point verification.',
        'Unlock initial explorer achievement badges.'
      ]
    },
    {
      id: 'referral-milestones',
      icon: Users,
      title: 'Referral Milestones',
      points: '+250 VE Pts',
      badge: 'Social',
      description: 'Invite friends, family, and colleagues to join VELOOP and earn bonus points for every active referral.',
      steps: [
        'Share your unique referral link or invitation code with friends.',
        'When your friend registers a free VELOOP account, bonus points are credited.',
        'Earn +250 VE Points per friend invited.',
        'Climb the monthly community referral leaderboard.'
      ]
    },
    {
      id: 'special-events',
      icon: Sparkles,
      title: 'Special Events',
      points: 'Up to +1,000 VE Pts',
      badge: 'Featured',
      description: 'Participate in seasonal events, promotional campaigns, and limited-time point multiplier events.',
      steps: [
        'Watch for special banner announcements on VELOOP Rewards Hub.',
        'Participate in promotional event windows.',
        'Earn 2x point multipliers on select daily challenges.',
        'Unlock exclusive limited-edition event badges.'
      ]
    }
  ];

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Create Free Account',
      description: 'Sign up in under 30 seconds with secure authentication. Receive 100 bonus VE Points upon registration.'
    },
    {
      number: '02',
      title: 'Complete Activities',
      description: 'Check in daily, complete daily & weekly challenges, build streaks, and invite friends to earn XP.'
    },
    {
      number: '03',
      title: 'Earn VE Points',
      description: 'Accumulate VE Points safely on your server-validated balance ledger with real-time tracking.'
    },
    {
      number: '04',
      title: 'Redeem Rewards',
      description: 'Claim premium physical tech gadgets, accessories, or instant digital e-gift cards delivered to you.'
    }
  ];

  const platformBenefits = [
    {
      icon: Shield,
      title: 'Secure Ledger',
      description: 'Server-side point verification and token authentication prevent balance tampering and duplicate claims.'
    },
    {
      icon: Activity,
      title: 'Transparent Tracking',
      description: 'Complete visibility into all earned and redeemed points with an immutable transaction audit log.'
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Flawless experience tailored for all screen viewports from 320px mobile to 1920px desktop displays.'
    },
    {
      icon: TrendingUp,
      title: 'Activity Tracking',
      description: 'Track your daily login streaks, total lifetime points earned, level XP, and achievement milestones.'
    },
    {
      icon: ShoppingBag,
      title: 'Reward Discovery',
      description: 'Curated collection of wireless earbuds, smartwatches, fast chargers, gift cards, and merch.'
    },
    {
      icon: Award,
      title: 'Achievement System',
      description: 'Unlockable badge tiers, level progression, and weekly leaderboard competitive rankings.'
    }
  ];

  const demoTestimonials = [
    {
      name: 'Alex Mercer',
      role: 'Tech Enthusiast',
      points: '14,500 VE Pts',
      text: 'VELOOP Rewards Hub is super engaging! Completing daily challenges gave me enough points to redeem a wireless charger.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Sophia Patel',
      role: 'Daily Explorer',
      points: '8,200 VE Pts',
      text: 'The daily streak system keeps me coming back every morning. Redeemed a $50 gift card seamlessly!',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Marcus Chen',
      role: 'Top Leaderboard Member',
      points: '22,400 VE Pts',
      text: 'Climbing the weekly leaderboard while unlocking achievement badges makes points earning feel like a game.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const faqItems = [
    {
      question: 'What are VE Points?',
      answer: 'VE Points (VELOOP Ecosystem Points) are digital activity points earned by participating in challenges, maintaining login streaks, completing platform tasks, and unlocking achievements on VELOOP Rewards Hub.'
    },
    {
      question: 'How can I earn points?',
      answer: 'You can earn VE Points by logging in daily, completing daily and weekly challenges, inviting friends via referral milestones, updating your profile, and participating in seasonal community events.'
    },
    {
      question: 'How do challenges work?',
      answer: 'Challenges are action-based objectives (such as checking in or redeeming a reward) that reset daily or weekly. Once you complete the requirement, click "Claim Points" to instantly add VE Points to your balance and earn XP toward your next level.'
    },
    {
      question: 'How do I redeem rewards?',
      answer: 'Browse the Rewards Store, select any available physical merchandise or digital gift card, and click "Redeem". If you have sufficient VE Points, your redemption will be processed server-side, deducting points and generating your digital code or shipping order.'
    },
    {
      question: 'Can I track my activity?',
      answer: 'Yes! Your account includes a real-time Points History ledger, active streak counter, XP progress bar, and achievement unlock tracker available in your member dashboard.'
    },
    {
      question: 'What happens if a reward is unavailable?',
      answer: 'If a physical reward is temporarily out of stock, it will be marked as "Out of Stock" or "Limited Availability". Our inventory updates regularly, or you can choose from dozens of digital gift cards and other available reward items.'
    }
  ];

  // Filtering Rewards
  const filteredRewards = rewards.filter(r => {
    if (selectedRewardCategory === 'ALL') return true;
    return r.category === selectedRewardCategory;
  });

  // Filtering Challenges
  const filteredChallenges = challenges.filter(c => c.category === challengeTab);

  // Requirement for required reward cards
  const requiredSampleRewards = [
    {
      _id: 'sample-earbuds',
      title: 'Wireless Earbuds (Sony WF-1000XM5)',
      pointsRequired: 2500,
      category: 'AUDIO',
      stock: 15,
      itemType: 'PHYSICAL',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      description: 'Active Noise Canceling Wireless Earbuds with High-Res audio drivers.'
    },
    {
      _id: 'sample-watch',
      title: 'Smart Watch (Apple Watch Series 9)',
      pointsRequired: 4200,
      category: 'WEARABLES',
      stock: 8,
      itemType: 'PHYSICAL',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      description: 'Fitness & Health Smart Watch with always-on display and gesture controls.'
    },
    {
      _id: 'sample-giftcard',
      title: '$50 Digital E-Gift Card',
      pointsRequired: 1500,
      category: 'GIFT_CARDS',
      stock: 50,
      itemType: 'DIGITAL',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4095a?w=600&auto=format&fit=crop&q=80',
      description: 'Instant digital code redeemable for shopping on major e-commerce platforms.'
    },
    {
      _id: 'sample-accessories',
      title: 'MagSafe Mobile Fast Wireless Charger',
      pointsRequired: 1200,
      category: 'ACCESSORIES',
      stock: 25,
      itemType: 'PHYSICAL',
      imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80',
      description: '15W fast magnetic wireless charger and desktop phone stand.'
    },
    {
      _id: 'sample-merch',
      title: 'VELOOP Premium Tech Hoodie & Cap',
      pointsRequired: 3000,
      category: 'MERCHANDISE',
      stock: 20,
      itemType: 'PHYSICAL',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      description: 'Custom embroidered fleece tech hoodie and snapback cap set.'
    }
  ];

  const displayRewards = filteredRewards.length > 0 ? filteredRewards : requiredSampleRewards;

  return (
    <div className="pb-5">
      {/* 1. HERO SECTION */}
      <section id="hero" className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white border shadow-sm mb-3">
                <span className="badge badge-gold">✨ VELOOP Rewards Platform</span>
                <span className="small text-muted font-weight-medium">Points & Redemptions</span>
              </div>
              <h1 className="display-4 font-weight-bold section-title mb-3 leading-tight">
                Earn Points. <br />
                Complete Challenges. <br />
                <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Unlock Rewards.
                </span>
              </h1>
              <p className="lead text-muted mb-4 font-weight-normal fs-5" style={{ maxWidth: '520px' }}>
                Join the VELOOP points and rewards ecosystem. Complete daily tasks, climb community leaderboards, accumulate VE Points, and redeem exclusive tech gadgets, gift cards, and merchandise.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-indigo btn-lg px-4 font-weight-bold d-flex align-items-center gap-2"
                  onClick={() => {
                    if (isAuthenticated) {
                      const el = document.getElementById('challenges');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      navigate('/register');
                    }
                  }}
                >
                  <span>{isAuthenticated ? 'My Dashboard' : 'Get Started'}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-indigo btn-lg px-4 font-weight-bold"
                  onClick={() => {
                    const el = document.getElementById('rewards');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore Rewards
                </button>
              </div>

              <div className="mt-4 pt-2 d-flex align-items-center gap-4 text-muted small">
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Free Registration</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>No Real-Money Gambling</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Verified Redemptions</span>
                </div>
              </div>
            </div>

            {/* Interactive Hero Visual */}
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="card-saas p-4 p-md-5 border-0 shadow-lg position-relative z-1 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff' }}>
                  {/* Decorative Elements */}
                  <div className="position-absolute top-0 end-0 p-3 opacity-20">
                    <Sparkles size={120} />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 rounded-3 bg-warning text-dark font-weight-bold">
                        <Coins size={20} />
                      </div>
                      <div>
                        <span className="d-block small opacity-75 text-uppercase tracking-wider">VE Points Balance</span>
                        <h3 className="mb-0 font-weight-bold text-warning">
                          {isAuthenticated && user ? user.pointsBalance?.toLocaleString() : '3,450'} VE Pts
                        </h3>
                      </div>
                    </div>
                    <span className="badge bg-white bg-opacity-20 text-white font-weight-bold px-3 py-2 rounded-pill">
                      🔥 {user?.streakDays || 7} Day Streak
                    </span>
                  </div>

                  {/* XP Progress Card */}
                  <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="font-weight-medium">Level {user?.level || 3} Explorer Progress</span>
                      <span>{user?.xp || 1450} / 2000 XP</span>
                    </div>
                    <div className="progress bg-black bg-opacity-30 rounded-pill" style={{ height: '8px' }}>
                      <div
                        className="progress-bar rounded-pill"
                        style={{ width: '72.5%', background: 'linear-gradient(90deg, #818cf8 0%, #a855f7 100%)' }}
                      />
                    </div>
                  </div>

                  {/* Mini Preview Cards */}
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
                        <span className="small opacity-75 d-block mb-1">Active Challenge</span>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold small">Daily Check-in</span>
                          <span className="badge bg-success font-weight-bold">+50 Pts</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
                        <span className="small opacity-75 d-block mb-1">Featured Reward</span>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold small line-clamp-1">Wireless Earbuds</span>
                          <span className="badge bg-warning text-dark font-weight-bold">2,500 Pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {claimMessage && (
        <div className="container mt-3">
          <div className="alert alert-info alert-dismissible fade show rounded-3 shadow-sm" role="alert">
            {claimMessage}
            <button type="button" className="btn-close" onClick={() => setClaimMessage('')} />
          </div>
        </div>
      )}

      {/* 2. TRUST / STATS SECTION */}
      <section id="trust-stats" className="py-4 bg-white border-y">
        <div className="container">
          <div className="text-center mb-3">
            <span className="badge badge-indigo">Platform Statistics (Demo Data)</span>
          </div>

          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3">
                <h2 className="display-6 font-weight-bold text-indigo mb-1">24+</h2>
                <p className="text-muted font-weight-medium mb-0">Rewards Available</p>
                <span className="small text-muted">Electronics & Cards</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <h2 className="display-6 font-weight-bold text-indigo mb-1">12+</h2>
                <p className="text-muted font-weight-medium mb-0">Active Challenges</p>
                <span className="small text-muted">Daily & Weekly Tasks</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <h2 className="display-6 font-weight-bold text-indigo mb-1">1.2M+</h2>
                <p className="text-muted font-weight-medium mb-0">Points Earned</p>
                <span className="small text-muted">Sample Ecosystem</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <h2 className="display-6 font-weight-bold text-indigo mb-1">15,000+</h2>
                <p className="text-muted font-weight-medium mb-0">Achievements Unlocked</p>
                <span className="small text-muted">Member Milestones</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WAYS TO EARN SECTION */}
      <section id="ways-to-earn" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Earning System</span>
            <h2 className="section-title h1 mb-2">Multiple Ways to Earn VE Points</h2>
            <p className="section-subtitle">
              Participate in daily check-ins, complete activity challenges, hit milestone streaks, and invite friends to accumulate points fast.
            </p>
          </div>

          <div className="row g-4">
            {waysToEarn.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="col-md-6 col-lg-4">
                  <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="p-3 rounded-3 bg-primary-light text-primary">
                          <Icon size={24} />
                        </div>
                        <span className="badge badge-gold">{item.points}</span>
                      </div>
                      <h5 className="font-weight-bold text-dark mb-2">{item.title}</h5>
                      <p className="text-muted small mb-4">{item.description}</p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-indigo btn-sm w-100 font-weight-semibold"
                      onClick={() => setActiveEarnModal(item)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. REWARDS STORE SECTION */}
      <section id="rewards" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="badge badge-gold mb-2">Rewards Store</span>
              <h2 className="section-title h1 mb-1">Redeem Available Platform Rewards</h2>
              <p className="text-muted mb-0">Use your accumulated VE Points to claim physical tech items and instant digital cards.</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="d-flex flex-wrap gap-1 bg-light p-1.5 rounded-3 border">
              {['ALL', 'AUDIO', 'WEARABLES', 'GIFT_CARDS', 'ACCESSORIES', 'MERCHANDISE'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm rounded-2 font-weight-medium ${selectedRewardCategory === cat ? 'btn-indigo' : 'text-muted bg-transparent border-0'}`}
                  onClick={() => setSelectedRewardCategory(cat)}
                >
                  {cat === 'ALL' ? 'All Items' : cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {displayRewards.map(item => (
              <div key={item._id} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card-saas h-100 overflow-hidden d-flex flex-column">
                  <div className="position-relative bg-light" style={{ height: '200px' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <span className="position-absolute top-0 end-0 m-3 badge badge-gold font-weight-bold">
                      <Coins size={12} className="me-1" />
                      {item.pointsRequired?.toLocaleString()} Pts
                    </span>
                    <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark border small">
                      {item.itemType === 'DIGITAL' ? 'Digital Code' : 'Physical Item'}
                    </span>
                  </div>

                  <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-indigo font-weight-semibold">{item.category?.replace('_', ' ')}</span>
                        <span className={`small font-weight-bold ${item.stock > 0 ? 'text-success' : 'text-danger'}`}>
                          {item.stock > 0 ? `${item.stock} Available` : 'Out of Stock'}
                        </span>
                      </div>
                      <h5 className="font-weight-bold text-dark mb-2 h6">{item.title}</h5>
                      <p className="text-muted small line-clamp-2 mb-3">{item.description}</p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-gold w-100 font-weight-bold rounded-3"
                      disabled={item.stock === 0}
                      onClick={() => {
                        setRedeemingReward(item);
                        setRedeemError('');
                        setRedeemSuccess(null);
                      }}
                    >
                      Redeem Reward
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Simple Process</span>
            <h2 className="section-title h1 mb-2">How VELOOP Rewards Works</h2>
            <p className="section-subtitle">
              Follow our simple 4-step process to create your account, complete activities, accumulate VE Points, and redeem your rewards.
            </p>
          </div>

          <div className="row g-4">
            {howItWorksSteps.map((step, idx) => (
              <div key={step.number} className="col-md-6 col-lg-3">
                <div className="card-saas p-4 h-100 position-relative">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="display-5 font-weight-bold text-indigo opacity-40">{step.number}</span>
                    {idx < 3 && <ArrowRight size={20} className="text-muted d-none d-lg-block" />}
                  </div>
                  <h5 className="font-weight-bold text-dark mb-2">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CHALLENGES SECTION */}
      <section id="challenges" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2">Interactive Challenges</span>
              <h2 className="section-title h1 mb-1">Daily & Weekly Challenges</h2>
              <p className="text-muted mb-0">Complete tasks to earn points and XP instantly on your account.</p>
            </div>

            <div className="d-flex gap-2 bg-light p-1 rounded-3 border">
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-2 font-weight-bold ${challengeTab === 'DAILY' ? 'btn-indigo' : 'text-muted border-0 bg-transparent'}`}
                onClick={() => setChallengeTab('DAILY')}
              >
                Daily Challenges
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-2 font-weight-bold ${challengeTab === 'WEEKLY' ? 'btn-indigo' : 'text-muted border-0 bg-transparent'}`}
                onClick={() => setChallengeTab('WEEKLY')}
              >
                Weekly Challenges
              </button>
            </div>
          </div>

          <div className="row g-4">
            {filteredChallenges.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">Loading challenges for {challengeTab.toLowerCase()} mode...</p>
              </div>
            ) : (
              filteredChallenges.map(challenge => (
                <div key={challenge.id || challenge._id} className="col-md-6 col-lg-4">
                  <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge badge-gold font-weight-bold">
                          +{challenge.pointsReward} VE Pts
                        </span>
                        <span className="badge bg-light text-muted border">
                          {challenge.category}
                        </span>
                      </div>
                      <h5 className="font-weight-bold text-dark mb-2">{challenge.title}</h5>
                      <p className="text-muted small mb-3">{challenge.description}</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Progress</span>
                          <span>{challenge.completed || challenge.claimed ? '1 / 1' : '0 / 1'}</span>
                        </div>
                        <div className="progress rounded-pill bg-light border" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-primary rounded-pill"
                            style={{ width: challenge.completed || challenge.claimed ? '100%' : '0%' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {challenge.claimed ? (
                        <div className="alert alert-success py-2 px-3 mb-0 text-center small font-weight-bold rounded-3">
                          <CheckCircle2 size={16} className="me-1" /> Claimed & Credited
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-indigo w-100 font-weight-bold"
                          disabled={claimingId === (challenge.id || challenge._id)}
                          onClick={() => handleClaimChallenge(challenge.id || challenge._id)}
                        >
                          {claimingId === (challenge.id || challenge._id) ? 'Claiming...' : 'Claim Points'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7. ACHIEVEMENTS SECTION */}
      <section id="achievements" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2">Achievement Badges</span>
            <h2 className="section-title h1 mb-2">Unlock Milestone Achievements</h2>
            <p className="section-subtitle">
              Collect badges as you level up, complete challenges, build streak records, and redeem store rewards.
            </p>
          </div>

          <div className="row g-4">
            {achievements.map(ach => (
              <div key={ach._id} className="col-md-6 col-lg-4">
                <div className={`card-saas p-4 h-100 ${ach.unlocked ? 'border-primary' : 'opacity-75'}`}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className={`p-3 rounded-circle d-flex align-items-center justify-content-center ${ach.unlocked ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>
                      {ach.unlocked ? <Trophy size={28} /> : <Lock size={28} />}
                    </div>
                    <div>
                      <h5 className="font-weight-bold text-dark mb-1">{ach.title}</h5>
                      <span className={`badge ${ach.unlocked ? 'badge-gold' : 'bg-light text-muted border'}`}>
                        {ach.unlocked ? 'Unlocked Badges' : 'Locked'}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted small mb-3">{ach.description}</p>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="small text-muted font-weight-medium">Bonus Reward:</span>
                    <span className="font-weight-bold text-indigo">+{ach.pointsReward} VE Pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LEADERBOARD SECTION */}
      <section id="leaderboard" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2">Community Ranks</span>
              <h2 className="section-title h1 mb-1">Global Points Leaderboard</h2>
              <p className="text-muted mb-0">Track top members competing across weekly and monthly cycles.</p>
            </div>

            <div className="d-flex gap-2 bg-light p-1 rounded-3 border">
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-2 font-weight-bold ${leaderboardTab === 'WEEKLY' ? 'btn-indigo' : 'text-muted border-0 bg-transparent'}`}
                onClick={() => setLeaderboardTab('WEEKLY')}
              >
                Weekly Rank
              </button>
              <button
                type="button"
                className={`btn btn-sm px-4 rounded-2 font-weight-bold ${leaderboardTab === 'MONTHLY' ? 'btn-indigo' : 'text-muted border-0 bg-transparent'}`}
                onClick={() => setLeaderboardTab('MONTHLY')}
              >
                Monthly Rank
              </button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="card-saas overflow-hidden border">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold" style={{ width: '80px' }}>Rank</th>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold">Member (Masked)</th>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold text-end">Level</th>
                    <th className="py-3 px-4 text-muted small text-uppercase font-weight-bold text-end">VE Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 10).map((entry, idx) => {
                    const isTop3 = idx < 3;
                    return (
                      <tr key={entry.userId || idx} className={entry.isCurrentUser ? 'bg-primary-light' : ''}>
                        <td className="py-3 px-4 font-weight-bold">
                          {idx === 0 && <span className="badge bg-warning text-dark px-2 py-1">🥇 #1</span>}
                          {idx === 1 && <span className="badge bg-secondary text-white px-2 py-1">🥈 #2</span>}
                          {idx === 2 && <span className="badge bg-danger text-white px-2 py-1">🥉 #3</span>}
                          {!isTop3 && <span className="text-muted">#{entry.rank || idx + 1}</span>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center gap-2">
                            <div className="p-2 rounded-circle bg-light border text-primary font-weight-bold small">
                              {entry.maskedName?.substring(0, 2) || 'US'}
                            </div>
                            <span className="font-weight-bold text-dark">
                              {entry.maskedName}
                              {entry.isCurrentUser && <span className="badge bg-primary ms-2">You</span>}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-end">
                          <span className="badge badge-indigo">Lvl {entry.level || 1}</span>
                        </td>
                        <td className="py-3 px-4 text-end font-weight-bold text-indigo fs-6">
                          {entry.points?.toLocaleString()} VE
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* User's Position Banner */}
          {isAuthenticated && user && (
            <div className="mt-4 p-3 bg-primary-light border border-primary rounded-3 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <Trophy className="text-primary" size={24} />
                <div>
                  <span className="small text-muted d-block font-weight-medium">Your Current Position</span>
                  <h6 className="mb-0 font-weight-bold text-dark">{user.name}</h6>
                </div>
              </div>
              <div className="text-end">
                <span className="badge badge-gold me-2">{user.pointsBalance?.toLocaleString()} VE Pts</span>
                <span className="badge badge-indigo">Level {user.level}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. PLATFORM BENEFITS SECTION */}
      <section id="benefits" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Platform Features</span>
            <h2 className="section-title h1 mb-2">Built for Performance & Security</h2>
            <p className="section-subtitle">
              VELOOP Rewards Hub delivers a high-grade rewards experience with server-side validation and continuous tracking.
            </p>
          </div>

          <div className="row g-4">
            {platformBenefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="card-saas p-4 h-100">
                    <div className="p-3 rounded-3 bg-primary-light text-primary d-inline-block mb-3">
                      <Icon size={24} />
                    </div>
                    <h5 className="font-weight-bold text-dark mb-2">{b.title}</h5>
                    <p className="text-muted small mb-0">{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. DEMO USER STORIES (TESTIMONIALS) */}
      <section id="testimonials" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2">Member Feedback</span>
            <h2 className="section-title h1 mb-2">Demo Member Stories</h2>
            <p className="section-subtitle">
              Sample experiences from members exploring VELOOP Rewards Hub (Clearly Labelled Sample Data).
            </p>
          </div>

          <div className="row g-4">
            {demoTestimonials.map((t, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-1 text-warning mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-muted small italic mb-4">"{t.text}"</p>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-3 border-top">
                    <img src={t.avatar} alt={t.name} className="rounded-circle object-fit-cover" style={{ width: '44px', height: '44px' }} />
                    <div>
                      <h6 className="mb-0 font-weight-bold text-dark">{t.name}</h6>
                      <span className="small text-muted">{t.role} &bull; <strong className="text-indigo">{t.points}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section id="faq" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Help Center</span>
            <h2 className="section-title h1 mb-2">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about VE Points, challenges, and reward redemptions.
            </p>
          </div>

          <div className="mw-100 mx-auto" style={{ maxWidth: '800px' }}>
            <div className="d-flex flex-column gap-3">
              {faqItems.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="card-saas overflow-hidden border">
                    <button
                      type="button"
                      className="w-100 p-4 text-start bg-transparent border-0 d-flex justify-content-between align-items-center font-weight-bold text-dark h6 mb-0"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-muted" />}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 text-muted small leading-relaxed border-top pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA SECTION */}
      <section id="final-cta" className="py-5 bg-white border-y">
        <div className="container py-5 text-center">
          <div className="p-5 rounded-4 bg-primary text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
            <h2 className="display-5 font-weight-bold mb-3 text-white">Ready to start earning VE Points?</h2>
            <p className="lead mb-4 opacity-90 mx-auto" style={{ maxWidth: '600px' }}>
              Create your free account now to receive welcome points, start daily challenges, and claim your first reward.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-gold btn-lg px-4 font-weight-bold"
                onClick={() => {
                  if (isAuthenticated) {
                    const el = document.getElementById('challenges');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/register');
                  }
                }}
              >
                Get Started
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 font-weight-bold"
                onClick={() => {
                  const el = document.getElementById('rewards');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Rewards
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: Ways to Earn Details */}
      {activeEarnModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge badge-gold">{activeEarnModal.points}</span>
                  <h5 className="modal-title font-weight-bold text-dark">{activeEarnModal.title}</h5>
                </div>
                <button type="button" className="btn-close" onClick={() => setActiveEarnModal(null)} />
              </div>
              <div className="modal-body p-4">
                <p className="text-muted mb-4">{activeEarnModal.description}</p>
                <h6 className="font-weight-bold text-dark mb-3">How to Complete:</h6>
                <ol className="ps-3 mb-4 d-flex flex-column gap-2 text-muted small">
                  {activeEarnModal.steps.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
                <button
                  type="button"
                  className="btn btn-indigo w-100 font-weight-bold"
                  onClick={() => {
                    setActiveEarnModal(null);
                    const el = document.getElementById('challenges');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Earning Points
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Reward Details & Redemption */}
      {redeemingReward && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title font-weight-bold text-dark">Redeem {redeemingReward.title}</h5>
                <button type="button" className="btn-close" onClick={() => setRedeemingReward(null)} />
              </div>

              <div className="modal-body p-4">
                {redeemSuccess ? (
                  <div className="text-center py-4">
                    <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mb-3">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="font-weight-bold text-dark mb-2">Redemption Successful!</h4>
                    <p className="text-muted small mb-3">
                      You spent <strong>{redeemingReward.pointsRequired} VE Points</strong>. Your updated balance is{' '}
                      <span className="text-primary font-weight-bold">{redeemSuccess.newBalance} VE Points</span>.
                    </p>

                    {redeemingReward.itemType === 'DIGITAL' && redeemSuccess.redemption?.digitalCode && (
                      <div className="p-3 bg-light border rounded-3 mb-3">
                        <span className="small text-muted d-block">Digital Code:</span>
                        <code className="h5 text-primary font-weight-bold">{redeemSuccess.redemption.digitalCode}</code>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-secondary rounded-3 px-4"
                      onClick={() => setRedeemingReward(null)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleExecuteRedeem}>
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
                      <img src={redeemingReward.imageUrl} alt={redeemingReward.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                      <div>
                        <h6 className="mb-1 text-dark font-weight-bold">{redeemingReward.title}</h6>
                        <span className="badge badge-gold">
                          <Coins size={12} className="me-1" />
                          {redeemingReward.pointsRequired?.toLocaleString()} VE Points
                        </span>
                      </div>
                    </div>

                    {!isAuthenticated ? (
                      <div className="text-center py-3">
                        <p className="text-muted small mb-3">Please sign in to your VELOOP account to process reward redemptions.</p>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-indigo btn-sm px-4"
                            onClick={() => {
                              setRedeemingReward(null);
                              navigate('/login');
                            }}
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            className="btn btn-indigo btn-sm px-4"
                            onClick={() => {
                              setRedeemingReward(null);
                              navigate('/register');
                            }}
                          >
                            Create Account
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-3">
                          <span className="small text-muted d-block">Your Points Balance:</span>
                          <span className="h6 text-dark font-weight-bold">{user?.pointsBalance?.toLocaleString()} VE Points</span>
                          {user?.pointsBalance < redeemingReward.pointsRequired && (
                            <div className="text-danger small mt-1">
                              <AlertCircle size={14} className="me-1" />
                              Insufficient points. You need {redeemingReward.pointsRequired - (user?.pointsBalance || 0)} more points.
                            </div>
                          )}
                        </div>

                        {redeemingReward.itemType === 'PHYSICAL' && (
                          <div className="mb-3">
                            <label className="form-label small text-muted font-weight-medium">Shipping Address</label>
                            <textarea
                              className="form-control border text-dark"
                              rows="3"
                              placeholder="Enter street address, city, country..."
                              value={shippingAddress}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              required
                            />
                          </div>
                        )}

                        {redeemError && (
                          <div className="alert alert-danger small p-2 rounded mb-3">{redeemError}</div>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary rounded-3"
                            onClick={() => setRedeemingReward(null)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-gold font-weight-bold rounded-3 px-4"
                            disabled={user?.pointsBalance < redeemingReward.pointsRequired}
                          >
                            Confirm Redemption
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
