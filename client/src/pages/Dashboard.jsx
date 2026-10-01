import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Target,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  Lock,
  Search,
  Check,
  Star,
  Activity,
  Layers,
  ArrowUpRight,
  Play,
  Bookmark,
  AlertCircle
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

  // Search & Filter States
  const [selectedRewardCategory, setSelectedRewardCategory] = useState('ALL');
  const [rewardSearchQuery, setRewardSearchQuery] = useState('');
  const [activeWorkStep, setActiveWorkStep] = useState(0);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Modals & Claim States
  const [redeemingReward, setRedeemingReward] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(null);
  const [redeemError, setRedeemError] = useState('');
  const [claimingId, setClaimingId] = useState(null);
  const [claimMessage, setClaimMessage] = useState('');

  // Smooth scroll handler from location state
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

  const loadHubData = async () => {
    setLoading(true);
    try {
      const [rewardsData, challengesData, leaderboardData, achievementsData] = await Promise.all([
        getRewardsApi(),
        getChallengesApi(),
        getLeaderboardApi('weekly'),
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
    loadHubData();
  }, []);

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
      await loadHubData();
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
      await loadHubData();
    } catch (err) {
      setRedeemError(err.message || 'Redemption failed. Check your points balance.');
    }
  };

  // Section 6: Reward Journey Steps
  const journeySteps = [
    { key: 'start', title: 'START', icon: Sparkles, desc: 'Create account & collect 100 VE starter points.' },
    { key: 'complete', title: 'COMPLETE', icon: Target, desc: 'Tackle daily missions & build login streaks.' },
    { key: 'earn', title: 'EARN', icon: Coins, desc: 'Accumulate VE Points safely on your ledger.' },
    { key: 'levelup', title: 'LEVEL UP', icon: TrendingUp, desc: 'Gain XP, rank up levels & unlock badges.' },
    { key: 'redeem', title: 'REDEEM', icon: Gift, desc: 'Claim tech gadgets & instant digital cards.' }
  ];

  // Section 13: Platform Benefits Asymmetric Layout
  const asymmetricBenefits = [
    { icon: Activity, title: 'TRACK YOUR PROGRESS', desc: 'See your points balance, streaks, level progression, and achievement badges consolidated in one dashboard.', size: 'col-md-7' },
    { icon: ShoppingBag, title: 'DISCOVER REWARDS', desc: 'Find tech gadgets, smart wearables, and gift cards built around your milestone progress.', size: 'col-md-5' },
    { icon: Zap, title: 'COMPLETE CHALLENGES', desc: 'Turn daily activity tasks into measurable points and rank up faster on leaderboards.', size: 'col-md-5' },
    { icon: Trophy, title: 'BUILD YOUR JOURNEY', desc: 'Progress through level tiers and collect exclusive unlockable achievement badges.', size: 'col-md-7' }
  ];

  // Section 14: Interactive How It Works Steps
  const interactiveWorkSteps = [
    { step: '01', title: 'Complete', desc: 'Engage with daily activity tasks, complete profile milestones, and maintain login streaks.', badge: 'Action Step' },
    { step: '02', title: 'Earn', desc: 'Points are immediately credited to your account ledger with real-time balance updates.', badge: 'Point Ledger' },
    { step: '03', title: 'Progress', desc: 'Accumulate XP to rank up levels, unlock achievement badges, and climb leaderboards.', badge: 'Level System' },
    { step: '04', title: 'Redeem', desc: 'Browse available rewards and redeem physical items or instant digital gift codes.', badge: 'Fulfillment' }
  ];

  // Section 15: Example Reward Journeys (Sample Data)
  const exampleJourneys = [
    { name: 'Alex Mercer', role: 'Explorer Journey', path: 'Completed 5 challenges ➔ Earned 1,250 VE Points ➔ Unlocked Challenge Master', badge: 'Sample Member Journey' },
    { name: 'Sophia Patel', role: 'Streak Journey', path: 'Logged in 7 consecutive days ➔ Earned 750 VE Points ➔ Redeemed Wireless Charger', badge: 'Sample Member Journey' },
    { name: 'Marcus Chen', role: 'Collector Journey', path: 'Reached Level 4 Explorer ➔ Accumulated 4,200 VE Points ➔ Claimed Smart Watch', badge: 'Sample Member Journey' }
  ];

  // Section 16: FAQ Items
  const faqItems = [
    { question: 'What are VE Points?', answer: 'VE Points (VELOOP Ecosystem Points) are digital activity points earned by participating in challenges, maintaining login streaks, completing platform tasks, and unlocking achievements on VELOOP Rewards Hub.' },
    { question: 'How do challenges work?', answer: 'Challenges are action-based objectives (such as logging in or verifying your profile) that reset daily or weekly. Completing a challenge unlocks "Claim Points" to add VE Points and XP to your account.' },
    { question: 'How do achievements work?', answer: 'Achievements are lifetime milestone badges awarded when you hit specific criteria, such as maintaining a 7-day streak, reaching 1,000 points, or redeeming your first store item.' },
    { question: 'How can I find rewards?', answer: 'Explore the "Find Your Next Reward" section to browse physical gadgets, accessories, and digital gift cards. You can filter by category or search by item name.' },
    { question: 'How is my progress calculated?', answer: 'Your progress is tracked server-side through XP earned from activities. Reaching XP thresholds automatically levels up your account status.' },
    { question: 'Can I track my transactions?', answer: 'Yes! All point credits, challenge claims, and store redemptions are recorded in your personal Points Ledger & History page.' }
  ];

  // Sample Rewards fallback if API has empty response
  const sampleRewardItems = [
    { _id: 'earbuds-01', title: 'Wireless Earbuds (Active Noise Canceling)', pointsRequired: 2500, category: 'AUDIO', stock: 15, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', description: 'Premium ANC wireless earbuds with high-resolution audio.' },
    { _id: 'watch-01', title: 'Smart Fitness Watch Series 9', pointsRequired: 4200, category: 'WEARABLES', stock: 8, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80', description: 'Advanced health metrics with always-on AMOLED display.' },
    { _id: 'giftcard-01', title: '$50 Digital E-Gift Card', pointsRequired: 1500, category: 'GIFT_CARDS', stock: 50, itemType: 'DIGITAL', imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4095a?w=600&auto=format&fit=crop&q=80', description: 'Instant digital code redeemable on major shopping platforms.' },
    { _id: 'charger-01', title: 'MagSafe Fast Wireless Charging Stand', pointsRequired: 1200, category: 'ACCESSORIES', stock: 25, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80', description: '15W magnetic wireless charging stand for phone & earbuds.' },
    { _id: 'hoodie-01', title: 'VELOOP Tech Hoodie & Cap Set', pointsRequired: 3000, category: 'MERCHANDISE', stock: 20, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80', description: 'Custom embroidered fleece hoodie paired with snapback cap.' }
  ];

  const effectiveRewards = rewards.length > 0 ? rewards : sampleRewardItems;

  // Filter rewards by category and search query
  const filteredRewards = effectiveRewards.filter(r => {
    const matchesCategory = selectedRewardCategory === 'ALL' || r.category === selectedRewardCategory;
    const matchesSearch = !rewardSearchQuery || r.title.toLowerCase().includes(rewardSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Next Reward Target Progress
  const currentPoints = user?.pointsBalance || 3450;
  const targetReward = effectiveRewards.find(r => r.pointsRequired > currentPoints) || effectiveRewards[0];
  const targetCost = targetReward?.pointsRequired || 5000;
  const progressPercent = Math.min(100, Math.floor((currentPoints / targetCost) * 100));
  const pointsRemaining = Math.max(0, targetCost - currentPoints);

  return (
    <div className="pb-5">
      {/* 3. HERO SECTION */}
      <section id="hero" className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            {/* Left Hero Content */}
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white border shadow-sm mb-3">
                <span className="badge badge-gold">✨ VELOOP Command Center</span>
                <span className="small text-muted font-weight-medium">Points & Progression Platform</span>
              </div>
              
              <h1 className="display-4 font-weight-bold section-title mb-3 leading-tight">
                Your Activities. <br />
                Your Points. <br />
                <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Your Rewards.
                </span>
              </h1>
              
              <p className="lead text-muted mb-4 font-weight-normal fs-5" style={{ maxWidth: '520px' }}>
                Turn everyday progress into points, unlock achievements, and discover rewards built around your journey.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-indigo btn-lg px-4 font-weight-bold d-flex align-items-center gap-2"
                  onClick={() => {
                    const el = document.getElementById('reward-discovery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Rewards</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-indigo btn-lg px-4 font-weight-bold"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View How It Works
                </button>
              </div>

              <div className="mt-4 pt-2 d-flex align-items-center gap-4 text-muted small">
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Verified Points Ledger</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>No Real-Money Gambling</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Rewards Command Center Card with Subtle Floating Cards */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Floating Card 1 */}
                <div className="position-absolute top-0 start-0 translate-middle-y z-2 d-none d-md-block animate-float-1" style={{ left: '-20px' }}>
                  <div className="glass-card p-2 px-3 d-flex align-items-center gap-2 shadow-md">
                    <div className="p-1.5 rounded-circle bg-warning text-dark font-weight-bold">
                      <Coins size={14} />
                    </div>
                    <span className="small font-weight-bold text-dark">+120 VE Points</span>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="position-absolute bottom-0 end-0 translate-middle-y z-2 d-none d-md-block animate-float-2" style={{ right: '-20px', bottom: '15%' }}>
                  <div className="glass-card p-2 px-3 d-flex align-items-center gap-2 shadow-md">
                    <div className="p-1.5 rounded-circle bg-primary text-white font-weight-bold">
                      <Award size={14} />
                    </div>
                    <span className="small font-weight-bold text-dark">Achievement Unlocked</span>
                  </div>
                </div>

                {/* Main Command Center Card */}
                <div className="card-saas p-4 p-md-5 border-0 shadow-lg position-relative z-1 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 rounded-3 bg-warning text-dark font-weight-bold">
                        <Coins size={22} />
                      </div>
                      <div>
                        <span className="d-block small opacity-75 text-uppercase tracking-wider">VE Points Balance</span>
                        <h3 className="mb-0 font-weight-bold text-warning">
                          {isAuthenticated && user ? user.pointsBalance?.toLocaleString() : '3,450'} VE Pts
                        </h3>
                      </div>
                    </div>
                    <span className="badge bg-white bg-opacity-20 text-white font-weight-bold px-3 py-2 rounded-pill">
                      Lvl {user?.level || 4} Explorer
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="font-weight-medium">Level Progression ({user?.xp || 2450} / 3000 XP)</span>
                      <span>81%</span>
                    </div>
                    <div className="progress bg-black bg-opacity-30 rounded-pill" style={{ height: '8px' }}>
                      <div className="progress-bar rounded-pill" style={{ width: '81%', background: 'linear-gradient(90deg, #818cf8 0%, #a855f7 100%)' }} />
                    </div>
                  </div>

                  {/* Next Reward Target & Badge Showcase */}
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
                        <span className="small opacity-75 d-block mb-1">Target Reward</span>
                        <div className="fw-semibold small text-truncate">Wireless Earbuds</div>
                        <span className="badge bg-warning text-dark mt-1">65% Unlocked</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
                        <span className="small opacity-75 d-block mb-1">Badge Status</span>
                        <div className="fw-semibold small text-truncate">7 Day Streak</div>
                        <span className="badge bg-success mt-1">Unlocked</span>
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

      {/* 5. QUICK STATS STRIP */}
      <section id="quick-stats" className="py-4 bg-white border-y">
        <div className="container">
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <span className="small text-muted font-weight-medium d-block mb-1">VE Points Balance</span>
                <h4 className="mb-0 font-weight-bold text-primary">
                  <Coins size={18} className="me-1 text-warning" />
                  {isAuthenticated && user ? user.pointsBalance?.toLocaleString() : '3,450'} VE
                </h4>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <span className="small text-muted font-weight-medium d-block mb-1">Current Level</span>
                <h4 className="mb-0 font-weight-bold text-indigo">
                  Level {user?.level || 4}
                </h4>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <span className="small text-muted font-weight-medium d-block mb-1">Active Challenges</span>
                <h4 className="mb-0 font-weight-bold text-dark">
                  {challenges.length > 0 ? `${challenges.length} Available` : '12 Missions'}
                </h4>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-card p-3 text-center">
                <span className="small text-muted font-weight-medium d-block mb-1">Achievements</span>
                <h4 className="mb-0 font-weight-bold text-success">
                  {achievements.filter(a => a.unlocked).length > 0 ? `${achievements.filter(a => a.unlocked).length} Unlocked` : '5 Badges'}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. YOUR REWARD JOURNEY SECTION */}
      <section id="journey" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Platform Progression</span>
            <h2 className="section-title h1 mb-2">Your Reward Journey</h2>
            <p className="section-subtitle">
              Follow your continuous progress path from registration to redeeming physical tech items and digital cards.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="col-md-4 col-lg-2.4 col-6">
                  <div className="card-saas p-4 text-center h-100 position-relative">
                    <div className="p-3 rounded-circle bg-primary-light text-primary d-inline-flex mb-3">
                      <Icon size={24} />
                    </div>
                    <span className="badge badge-gold d-inline-block mb-2 font-weight-bold">{step.title}</span>
                    <p className="text-muted small mb-0">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. TODAY'S MISSIONS SECTION */}
      <section id="missions" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2">Daily Activity Tasks</span>
              <h2 className="section-title h1 mb-1">Today's Missions</h2>
              <p className="text-muted mb-0">Complete objectives to earn instant VE Points and level XP.</p>
            </div>

            <button
              type="button"
              className="btn btn-outline-indigo btn-sm font-weight-semibold"
              onClick={() => navigate('/challenges')}
            >
              View All Challenges
            </button>
          </div>

          <div className="row g-4">
            {challenges.length === 0 ? (
              <div className="col-12 text-center py-4 text-muted">Loading today's missions...</div>
            ) : (
              challenges.slice(0, 4).map(c => (
                <div key={c.id || c._id} className="col-md-6 col-lg-3">
                  <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge badge-gold font-weight-bold">
                          +{c.pointsReward} VE
                        </span>
                        <span className="badge bg-light text-muted border small">
                          {c.category}
                        </span>
                      </div>
                      <h5 className="font-weight-bold text-dark mb-2 h6">{c.title}</h5>
                      <p className="text-muted small line-clamp-2 mb-3">{c.description}</p>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Progress</span>
                          <span>{c.claimed || c.completed ? '1/1' : '0/1'}</span>
                        </div>
                        <div className="progress rounded-pill bg-light border" style={{ height: '6px' }}>
                          <div
                            className="progress-bar bg-primary rounded-pill"
                            style={{ width: c.claimed || c.completed ? '100%' : '0%' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {c.claimed ? (
                        <div className="alert alert-success py-1.5 px-2 mb-0 text-center small font-weight-bold rounded-3">
                          <CheckCircle2 size={14} className="me-1" /> Claimed
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-indigo w-100 btn-sm font-weight-bold"
                          disabled={claimingId === (c.id || c._id)}
                          onClick={() => handleClaimChallenge(c.id || c._id)}
                        >
                          {claimingId === (c.id || c._id) ? 'Claiming...' : 'Claim Points'}
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

      {/* 8. REWARD DISCOVERY SECTION */}
      <section id="reward-discovery" className="py-5">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="badge badge-gold mb-2">Curated Store Catalog</span>
              <h2 className="section-title h1 mb-1">Find Your Next Reward</h2>
              <p className="text-muted mb-0">Browse available physical merchandise and digital gift cards.</p>
            </div>

            {/* Category Filter Tabs & Search */}
            <div className="d-flex flex-column flex-sm-row gap-2">
              <div className="input-group input-group-sm" style={{ width: '220px' }}>
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  className="form-control bg-white border-start-0 text-dark small"
                  placeholder="Search rewards..."
                  value={rewardSearchQuery}
                  onChange={(e) => setRewardSearchQuery(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-1 bg-white p-1 rounded-3 border">
                {['ALL', 'ELECTRONICS', 'ACCESSORIES', 'GIFT_CARDS', 'MERCHANDISE'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn btn-sm rounded-2 font-weight-medium ${selectedRewardCategory === cat ? 'btn-indigo' : 'text-muted bg-transparent border-0'}`}
                    onClick={() => setSelectedRewardCategory(cat)}
                  >
                    {cat === 'ALL' ? 'All' : cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reward Cards Grid */}
          <div className="row g-4">
            {filteredRewards.slice(0, 8).map(item => {
              const isOutOfStock = item.status === 'OUT_OF_STOCK' || item.stock <= 0;
              const canAfford = user ? user.pointsBalance >= item.pointsRequired : false;

              return (
                <div key={item._id} className="col-sm-6 col-lg-4 col-xl-3">
                  <div className="card-saas h-100 overflow-hidden d-flex flex-column">
                    <div className="position-relative bg-light" style={{ height: '180px' }}>
                      <img src={item.imageUrl} alt={item.title} className="w-100 h-100 object-fit-cover" />
                      <span className="position-absolute top-0 end-0 m-2 badge badge-gold font-weight-bold">
                        <Coins size={12} className="me-1" />
                        {item.pointsRequired?.toLocaleString()} Pts
                      </span>
                    </div>

                    <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                      <div>
                        <span className="badge badge-indigo small mb-2">{item.category?.replace('_', ' ')}</span>
                        <h6 className="font-weight-bold text-dark mb-2">{item.title}</h6>
                        <p className="small text-muted line-clamp-2 mb-3">{item.description}</p>
                      </div>

                      <button
                        type="button"
                        className={`btn w-100 rounded-3 font-weight-bold ${isOutOfStock ? 'btn-secondary disabled' : canAfford ? 'btn-gold' : 'btn-outline-indigo'}`}
                        disabled={isOutOfStock}
                        onClick={() => {
                          setRedeemingReward(item);
                          setRedeemError('');
                          setRedeemSuccess(null);
                        }}
                      >
                        {isOutOfStock ? 'Out of Stock' : canAfford ? 'Redeem Item' : 'Explore Details'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. REWARD PROGRESS CARD SECTION */}
      <section id="reward-progress" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="mw-100 mx-auto" style={{ maxWidth: '850px' }}>
            <div className="card-saas p-4 p-md-5 border-primary shadow-lg" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge badge-gold px-3 py-1.5 font-weight-bold">
                  🎯 NEXT REWARD TARGET
                </span>
                <span className="small text-primary font-weight-bold">
                  {progressPercent}% Unlocked
                </span>
              </div>

              <div className="row align-items-center g-4">
                <div className="col-md-3 text-center text-md-start">
                  <img src={targetReward?.imageUrl} alt={targetReward?.title} className="rounded-3 shadow-sm object-fit-cover" style={{ width: '110px', height: '110px' }} />
                </div>

                <div className="col-md-9">
                  <h4 className="font-weight-bold text-dark mb-1">{targetReward?.title}</h4>
                  <p className="text-muted small mb-3">
                    Current Balance: <strong>{currentPoints?.toLocaleString()} VE Pts</strong> &bull; Target: <strong>{targetCost?.toLocaleString()} VE Pts</strong>
                  </p>

                  <div className="progress rounded-pill bg-white border mb-2" style={{ height: '12px' }}>
                    <div
                      className="progress-bar rounded-pill"
                      style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #4f46e5 0%, #f59e0b 100%)' }}
                    />
                  </div>

                  <span className="small font-weight-bold text-indigo">
                    {pointsRemaining > 0 ? `${pointsRemaining.toLocaleString()} points to go` : 'Goal Reached! Ready to redeem.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. ACHIEVEMENT SHOWCASE SECTION */}
      <section id="achievements-showcase" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2">Built Your Progress?</span>
            <h2 className="section-title h1 mb-2">Achievement Milestone Showcase</h2>
            <p className="section-subtitle">
              Collect badges across platform activities, login streaks, challenges, and store redemptions.
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
                        {ach.unlocked ? 'Unlocked' : 'Locked Milestone'}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">{ach.description}</p>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="small text-muted">Reward:</span>
                    <span className="font-weight-bold text-indigo">+{ach.pointsReward} VE Pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. LEVEL SYSTEM SECTION */}
      <section id="level-system" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="mw-100 mx-auto text-center" style={{ maxWidth: '800px' }}>
            <span className="badge badge-indigo mb-2">Progression Framework</span>
            <h2 className="section-title h1 mb-3">Level & XP Progression</h2>
            
            <div className="card-saas p-4 p-md-5 text-start">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span className="text-muted small d-block font-weight-medium">CURRENT STATUS</span>
                  <h4 className="font-weight-bold text-dark mb-0">LEVEL 04 — REWARD EXPLORER</h4>
                </div>
                <span className="badge badge-gold fs-6 px-3 py-2">550 XP to Level 5</span>
              </div>

              <div className="progress rounded-pill bg-light border mb-3" style={{ height: '14px' }}>
                <div className="progress-bar rounded-pill bg-primary" style={{ width: '81.6%' }} />
              </div>

              <div className="d-flex justify-content-between small text-muted font-weight-medium">
                <span>Lvl 1 Explorer</span>
                <span>Lvl 2 Adventurer</span>
                <span>Lvl 3 Veteran</span>
                <span className="text-primary font-weight-bold">Lvl 4 Master</span>
                <span>Lvl 5 Champion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. LEADERBOARD PREVIEW SECTION */}
      <section id="leaderboard-preview" className="py-5">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2">Community Ranks</span>
              <h2 className="section-title h1 mb-1">Top Member Rankings</h2>
              <p className="text-muted mb-0">Weekly VE Points leaderboards with masked identity privacy protection.</p>
            </div>

            <button
              type="button"
              className="btn btn-outline-indigo font-weight-semibold"
              onClick={() => navigate('/leaderboard')}
            >
              View Full Leaderboard
            </button>
          </div>

          <div className="card-saas overflow-hidden border">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr className="text-muted small">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Masked Username</th>
                    <th className="py-3 px-4 text-end">Level</th>
                    <th className="py-3 px-4 text-end">VE Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(leaderboard.length > 0 ? leaderboard.slice(0, 5) : [
                    { rank: 1, maskedName: 'AYU****92', level: 6, points: 14500 },
                    { rank: 2, maskedName: 'SAR****14', level: 5, points: 12200 },
                    { rank: 3, maskedName: 'MAR****88', level: 4, points: 9800 }
                  ]).map((entry, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-weight-bold">
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 font-weight-bold text-dark">{entry.maskedName}</td>
                      <td className="py-3 px-4 text-end"><span className="badge badge-indigo">Lvl {entry.level}</span></td>
                      <td className="py-3 px-4 text-end font-weight-bold text-primary">{entry.points?.toLocaleString()} VE</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 13. PLATFORM BENEFITS SECTION */}
      <section id="benefits" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2">Core Advantages</span>
            <h2 className="section-title h1 mb-2">Why Choose VELOOP Rewards Hub</h2>
            <p className="section-subtitle">
              Designed with server-side point validation, instant fulfillment, and transparent progression.
            </p>
          </div>

          <div className="row g-4">
            {asymmetricBenefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className={b.size}>
                  <div className="card-saas p-4 p-md-5 h-100">
                    <div className="p-3 rounded-3 bg-primary-light text-primary d-inline-block mb-3">
                      <Icon size={28} />
                    </div>
                    <h4 className="font-weight-bold text-dark mb-2">{b.title}</h4>
                    <p className="text-muted mb-0">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. INTERACTIVE HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Interactive Guide</span>
            <h2 className="section-title h1 mb-2">From Activity to Reward</h2>
            <p className="section-subtitle">
              Click or hover over any step to explore how your activities transform into tangible platform rewards.
            </p>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-3">
                {interactiveWorkSteps.map((step, idx) => (
                  <div
                    key={step.step}
                    className={`card-saas p-4 cursor-pointer transition-all ${activeWorkStep === idx ? 'border-primary bg-primary-light' : ''}`}
                    onClick={() => setActiveWorkStep(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="font-weight-bold text-indigo">{step.step} &bull; {step.title}</span>
                      <span className="badge badge-gold">{step.badge}</span>
                    </div>
                    <p className="text-muted small mb-0">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card-saas p-5 text-center shadow-lg bg-white position-relative">
                <div className="p-4 rounded-circle bg-primary-light text-primary d-inline-flex mb-3">
                  <Sparkles size={48} />
                </div>
                <h3 className="font-weight-bold text-dark mb-2">
                  Step {interactiveWorkSteps[activeWorkStep].step}: {interactiveWorkSteps[activeWorkStep].title}
                </h3>
                <p className="text-muted lead fs-6 mb-4 max-w-md mx-auto">
                  {interactiveWorkSteps[activeWorkStep].desc}
                </p>
                <div className="p-3 bg-light rounded-3 border d-inline-block text-muted small">
                  🔒 Server-Side Validated &bull; Real-Time Points Balance Credit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. EXAMPLE REWARD JOURNEYS SECTION */}
      <section id="example-journeys" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2">Sample Member Paths</span>
            <h2 className="section-title h1 mb-2">Example Reward Journeys</h2>
            <p className="section-subtitle">
              Clearly labelled demo scenarios showing how members build their progress path.
            </p>
          </div>

          <div className="row g-4">
            {exampleJourneys.map((j, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge badge-indigo small mb-3">{j.badge}</span>
                    <h5 className="font-weight-bold text-dark mb-1">{j.name}</h5>
                    <span className="small text-muted d-block mb-3">{j.role}</span>
                    <p className="small text-dark font-weight-medium bg-light p-3 rounded-3 border mb-0">
                      "{j.path}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. FAQ SECTION */}
      <section id="faq" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-indigo mb-2">Help Center</span>
            <h2 className="section-title h1 mb-2">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Clear answers regarding VE Points, missions, achievements, and rewards.
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

      {/* 17. FINAL CTA SECTION */}
      <section id="final-cta" className="py-5 bg-white border-y">
        <div className="container py-5 text-center">
          <div className="p-5 rounded-4 bg-primary text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
            <h2 className="display-5 font-weight-bold mb-3 text-white">Your next milestone starts here.</h2>
            <p className="lead mb-4 opacity-90 mx-auto" style={{ maxWidth: '600px' }}>
              Complete activities, build your progress and explore what you can unlock.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-gold btn-lg px-4 font-weight-bold"
                onClick={() => {
                  const el = document.getElementById('reward-discovery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Rewards
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 font-weight-bold"
                onClick={() => {
                  const el = document.getElementById('missions');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Challenges
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: Reward Redemption Modal */}
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
                      You spent <strong>{redeemingReward.pointsRequired} VE Points</strong>. Remaining balance:{' '}
                      <span className="text-primary font-weight-bold">{redeemSuccess.newBalance} VE Points</span>.
                    </p>

                    {redeemingReward.itemType === 'DIGITAL' && redeemSuccess.redemption?.digitalCode && (
                      <div className="p-3 bg-light border rounded-3 mb-3">
                        <span className="small text-muted d-block">Your Digital Code:</span>
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
                        <p className="text-muted small mb-3">Please sign in to process reward redemptions.</p>
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
                          <span className="small text-muted d-block">Your Current Balance:</span>
                          <span className="h6 text-dark font-weight-bold">{user?.pointsBalance?.toLocaleString()} VE Points</span>
                          {user && user.pointsBalance < redeemingReward.pointsRequired && (
                            <div className="text-danger small mt-1">
                              <AlertCircle size={14} className="me-1" />
                              Insufficient points balance for this redemption.
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
                            disabled={!user || user.pointsBalance < redeemingReward.pointsRequired}
                          >
                            Confirm Order
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
