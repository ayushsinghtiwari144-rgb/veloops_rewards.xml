import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getRewardsApi,
  getChallengesApi,
  getLeaderboardApi,
  getAchievementsApi,
  getTransactionsApi,
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
  Shield,
  ChevronDown,
  ChevronUp,
  Lock,
  Search,
  Check,
  Activity,
  ArrowUpRight,
  AlertCircle,
  Calendar,
  Clock,
  Layers,
  Star
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
  const [transactions, setTransactions] = useState([]);
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

  // Handle scroll to section if passed via location state
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
      const [rewardsData, challengesData, leaderboardData, achievementsData, txData] = await Promise.all([
        getRewardsApi(),
        getChallengesApi(),
        getLeaderboardApi('weekly'),
        getAchievementsApi(),
        getTransactionsApi()
      ]);
      setRewards(rewardsData || []);
      setChallenges(challengesData || []);
      setLeaderboard(leaderboardData || []);
      setAchievements(achievementsData || []);
      setTransactions(txData || []);
    } catch (err) {
      console.error('Failed to load command center data:', err);
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

  // Static Fallbacks for Store Items
  const sampleRewardItems = [
    { _id: 'earbuds-01', title: 'Wireless Earbuds', pointsRequired: 5000, category: 'AUDIO', stock: 15, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', description: 'Active noise canceling wireless earbuds with high-res drivers.' },
    { _id: 'watch-01', title: 'Smart Fitness Watch Series 9', pointsRequired: 4200, category: 'WEARABLES', stock: 8, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80', description: 'Advanced health metrics with always-on AMOLED display.' },
    { _id: 'giftcard-01', title: '$50 Digital E-Gift Card', pointsRequired: 1500, category: 'GIFT_CARDS', stock: 50, itemType: 'DIGITAL', imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4095a?w=600&auto=format&fit=crop&q=80', description: 'Instant digital code redeemable on major e-commerce platforms.' },
    { _id: 'charger-01', title: 'MagSafe Fast Wireless Charging Stand', pointsRequired: 1200, category: 'ACCESSORIES', stock: 25, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80', description: '15W magnetic wireless charging stand for phone & earbuds.' },
    { _id: 'hoodie-01', title: 'VELOOP Tech Hoodie & Cap Set', pointsRequired: 3000, category: 'MERCHANDISE', stock: 20, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80', description: 'Custom embroidered fleece hoodie paired with snapback cap.' }
  ];

  const effectiveRewards = rewards.length > 0 ? rewards : sampleRewardItems;

  const filteredRewards = effectiveRewards.filter(r => {
    const matchesCategory = selectedRewardCategory === 'ALL' || r.category === selectedRewardCategory;
    const matchesSearch = !rewardSearchQuery || r.title.toLowerCase().includes(rewardSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Next Reward Target Progress
  const currentPoints = user?.pointsBalance || 2450;
  const targetReward = effectiveRewards.find(r => r.pointsRequired > currentPoints) || effectiveRewards[0];
  const targetCost = targetReward?.pointsRequired || 5000;
  const progressPercent = Math.min(100, Math.floor((currentPoints / targetCost) * 100));
  const pointsRemaining = Math.max(0, targetCost - currentPoints);

  // Level Progression Timeline Data
  const levelTimeline = [
    { level: '01', title: 'STARTER', range: '0 - 500 XP', active: false },
    { level: '02', title: 'EXPLORER', range: '500 - 1,500 XP', active: false },
    { level: '03', title: 'ACHIEVER', range: '1,500 - 2,500 XP', active: false },
    { level: '04', title: 'REWARD EXPLORER', range: '2,500 - 3,500 XP', active: true },
    { level: '05', title: 'ELITE', range: '3,500+ XP', active: false }
  ];

  // Achievement Wall Badges Data
  const achievementBadges = [
    { key: 'first-steps', title: 'First Steps', desc: 'Completed initial task', unlocked: true, icon: CheckCircle2 },
    { key: 'streak-7', title: '7 Day Streak', desc: '7 days active login', unlocked: true, icon: Zap },
    { key: 'challenge-master', title: 'Challenge Master', desc: '10 missions finished', unlocked: true, icon: Target },
    { key: 'point-collector', title: 'Point Collector', desc: '1,000 points earned', unlocked: true, icon: Coins },
    { key: 'reward-explorer', title: 'Reward Explorer', desc: '1 reward redeemed', unlocked: false, icon: Gift },
    { key: 'consistency-champion', title: 'Consistency Champion', desc: '30 day streak record', unlocked: false, icon: Trophy }
  ];

  // Activity Timeline Data (Real or Fallback)
  const activityTimelineData = transactions.length > 0 ? transactions.slice(0, 4) : [
    { _id: 'act-1', dateLabel: 'TODAY', title: 'Challenge completed', details: 'Daily Platform Activity', amount: 150, type: 'EARNED' },
    { _id: 'act-2', dateLabel: 'YESTERDAY', title: 'Achievement unlocked', details: 'Challenge Master Badge', amount: 300, type: 'EARNED' },
    { _id: 'act-3', dateLabel: '2 DAYS AGO', title: 'Profile completed', details: 'Verified account details', amount: 100, type: 'EARNED' }
  ];

  // Interactive How It Works Steps
  const interactiveWorkSteps = [
    { step: '01', title: 'Complete', desc: 'Engage with daily activity tasks, complete profile milestones, and maintain login streaks.', badge: 'Action Step' },
    { step: '02', title: 'Earn', desc: 'Points are immediately credited to your account ledger with real-time balance updates.', badge: 'Point Ledger' },
    { step: '03', title: 'Progress', desc: 'Accumulate XP to rank up levels, unlock achievement badges, and climb leaderboards.', badge: 'Level System' },
    { step: '04', title: 'Redeem', desc: 'Browse available rewards and redeem physical items or instant digital gift codes.', badge: 'Fulfillment' }
  ];

  // FAQ Accordion Items
  const faqItems = [
    { question: 'What are VE Points?', answer: 'VE Points (VELOOP Ecosystem Points) are digital activity points earned by participating in challenges, maintaining login streaks, completing platform tasks, and unlocking achievements on VELOOP Rewards Hub.' },
    { question: 'How do challenges work?', answer: 'Challenges are action-based objectives (such as logging in or verifying your profile) that reset daily or weekly. Completing a challenge unlocks "Claim Points" to add VE Points and XP to your account.' },
    { question: 'How do achievements work?', answer: 'Achievements are lifetime milestone badges awarded when you hit specific criteria, such as maintaining a 7-day streak, reaching 1,000 points, or redeeming your first store item.' },
    { question: 'How can I find rewards?', answer: 'Explore the "Reward Explorer" section to browse physical gadgets, accessories, and digital gift cards. You can filter by category or search by item name.' },
    { question: 'How is my progress calculated?', answer: 'Your progress is tracked server-side through XP earned from activities. Reaching XP thresholds automatically levels up your account status.' },
    { question: 'Can I track my transactions?', answer: 'Yes! All point credits, challenge claims, and store redemptions are recorded in your personal Points Ledger & History page.' }
  ];

  return (
    <div className="pb-5">
      {/* SECTION 2 — COMMAND CENTER HERO */}
      <section id="hero" className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)', color: '#ffffff' }}>
        <div className="container py-4 text-center">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-3">
            <span className="badge badge-gold">✨ VELOOP COMMAND CENTER</span>
            <span className="small text-light font-weight-medium">Your Progress Command Center</span>
          </div>

          <h1 className="display-3 font-weight-bold text-white mb-3 tracking-tight">
            Make Progress. Unlock More.
          </h1>

          <p className="lead text-light opacity-80 mb-4 mx-auto" style={{ maxWidth: '640px' }}>
            Complete activities, build your progress and discover rewards along the way.
          </p>

          <div className="d-flex justify-content-center gap-3 mb-5">
            <button
              type="button"
              className="btn btn-gold btn-lg px-4 font-weight-bold d-flex align-items-center gap-2"
              onClick={() => {
                const el = document.getElementById('rewards');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Rewards</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-outline-light btn-lg px-4 font-weight-bold"
              onClick={() => {
                const el = document.getElementById('challenges');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Challenges
            </button>
          </div>

          {/* LARGE CENTERED INTERACTIVE COMMAND CENTER DASHBOARD */}
          <div className="mw-100 mx-auto" style={{ maxWidth: '960px' }}>
            <div className="p-4 p-md-5 rounded-4 shadow-lg text-start position-relative overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              
              {/* Floating Indicator Cards */}
              <div className="position-absolute top-0 end-0 m-3 d-none d-md-block animate-float-1">
                <div className="px-3 py-2 rounded-3 bg-warning text-dark font-weight-bold small shadow-sm d-flex align-items-center gap-1.5">
                  <Coins size={14} /> +120 VE Points Today
                </div>
              </div>

              <div className="position-absolute bottom-0 start-0 m-3 d-none d-md-block animate-float-2">
                <div className="px-3 py-2 rounded-3 bg-indigo text-white font-weight-bold small shadow-sm d-flex align-items-center gap-1.5">
                  <Award size={14} /> Challenge Master Unlocked
                </div>
              </div>

              {/* Dashboard Top Row */}
              <div className="row align-items-center g-4 mb-4">
                <div className="col-md-5">
                  <span className="small text-uppercase tracking-wider opacity-75 font-weight-bold d-block mb-1">VELOOP PROGRESS</span>
                  <h2 className="display-5 font-weight-bold text-warning mb-0">
                    {currentPoints.toLocaleString()} VE POINTS
                  </h2>
                  <span className="small text-light opacity-75">Verified Server Ledger</span>
                </div>

                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3">
                    {/* SVG Circular Radial Progress */}
                    <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                      <svg width="64" height="64" viewBox="0 0 36 36">
                        <path className="text-white opacity-20" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-warning" strokeDasharray="82, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="position-absolute font-weight-bold small text-white">82%</span>
                    </div>

                    <div>
                      <h6 className="font-weight-bold text-white mb-0">LEVEL 04</h6>
                      <span className="badge bg-indigo text-white small">REWARD EXPLORER</span>
                      <span className="small text-light opacity-75 d-block mt-1">550 points to next level</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 text-md-end">
                  <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10">
                    <span className="small opacity-75 d-block mb-1">NEXT REWARD TARGET</span>
                    <span className="font-weight-bold text-white d-block text-truncate">Wireless Earbuds</span>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm font-weight-bold mt-2 w-100"
                      onClick={() => {
                        const el = document.getElementById('next-reward');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Explore Reward
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-3 rounded-3 bg-black bg-opacity-30 border border-white border-opacity-10">
                <div className="d-flex justify-content-between small text-light opacity-90 mb-2 font-weight-medium">
                  <span>Level Progress (2,450 / 3,000 XP)</span>
                  <span>550 XP Remaining</span>
                </div>
                <div className="progress rounded-pill bg-white bg-opacity-20" style={{ height: '10px' }}>
                  <div className="progress-bar rounded-pill" style={{ width: '82%', background: 'linear-gradient(90deg, #818cf8 0%, #f59e0b 100%)' }} />
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
            <button type="button" className="btn-close" onClick={() => setMessage('')} />
          </div>
        </div>
      )}

      {/* SECTION 3 — PROGRESS WIDGETS */}
      <section id="quick-stats" className="py-4 bg-white border-y">
        <div className="container">
          <div className="row g-4">
            {/* Widget 1: VE Points */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-start border-4 border-warning">
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">VE Points</span>
                <h3 className="mb-1 font-weight-bold text-primary">
                  <Coins size={20} className="me-1 text-warning" />
                  {currentPoints.toLocaleString()}
                </h3>
                <span className="badge badge-gold small">+120 VE Earned Today</span>
              </div>
            </div>

            {/* Widget 2: Level Progress */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-start border-4 border-primary">
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">Level Progression</span>
                <h3 className="mb-1 font-weight-bold text-indigo">Lvl 04</h3>
                <span className="small text-muted font-weight-medium">82% to Level 5</span>
              </div>
            </div>

            {/* Widget 3: Active Challenges */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-start border-4 border-info">
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">Active Missions</span>
                <h3 className="mb-1 font-weight-bold text-dark">
                  {challenges.length > 0 ? `${challenges.length} Active` : '4 Missions'}
                </h3>
                <span className="badge badge-indigo small">Daily Tasks Ready</span>
              </div>
            </div>

            {/* Widget 4: Achievements */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-start border-4 border-success">
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">Badges Unlocked</span>
                <h3 className="mb-1 font-weight-bold text-success">
                  {achievements.filter(a => a.unlocked).length || 4} Badges
                </h3>
                <span className="small text-muted font-weight-medium">Milestone Achieved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — NEXT REWARD (YOUR NEXT UNLOCK) */}
      <section id="next-reward" className="py-5">
        <div className="container py-4">
          <div className="card-saas p-4 p-md-5 border-primary shadow-lg" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="badge badge-gold px-3 py-1.5 font-weight-bold">
                🎯 YOUR NEXT UNLOCK
              </span>
              <span className="small text-primary font-weight-bold">
                65% Unlocked
              </span>
            </div>

            <div className="row align-items-center g-4">
              <div className="col-md-4 text-center">
                <img
                  src={targetReward?.imageUrl || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'}
                  alt={targetReward?.title || 'Wireless Earbuds'}
                  className="rounded-4 shadow-sm object-fit-cover w-100"
                  style={{ maxHeight: '220px' }}
                />
              </div>

              <div className="col-md-8">
                <h3 className="font-weight-bold text-dark mb-2">{targetReward?.title || 'Wireless Earbuds'}</h3>
                <p className="text-muted small mb-3">{targetReward?.description || 'Active Noise Canceling Wireless Earbuds with High-Res Audio.'}</p>

                <div className="d-flex justify-content-between small text-muted font-weight-medium mb-1">
                  <span>Required: {targetCost.toLocaleString()} VE Points</span>
                  <span>Current: {currentPoints.toLocaleString()} VE Points</span>
                </div>

                <div className="progress rounded-pill bg-white border mb-3" style={{ height: '14px' }}>
                  <div
                    className="progress-bar rounded-pill"
                    style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #4f46e5 0%, #f59e0b 100%)' }}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="font-weight-bold text-indigo">
                    {pointsRemaining > 0 ? `${pointsRemaining.toLocaleString()} points to go` : 'Goal Reached! Ready to redeem.'}
                  </span>

                  <button
                    type="button"
                    className="btn btn-gold font-weight-bold px-4 rounded-3"
                    onClick={() => {
                      if (targetReward) {
                        setRedeemingReward(targetReward);
                        setRedeemError('');
                        setRedeemSuccess(null);
                      }
                    }}
                  >
                    Redeem Target Reward
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — DAILY MISSION BOARD */}
      <section id="challenges" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2">Interactive Mission Board</span>
              <h2 className="section-title h1 mb-1">Today's Missions</h2>
              <p className="text-muted mb-0">Complete active missions to claim points and XP directly to your account balance.</p>
            </div>

            <Link to="/challenges" className="btn btn-outline-indigo btn-sm font-weight-semibold">
              Full Challenges Page
            </Link>
          </div>

          <div className="d-flex flex-column gap-3">
            {(challenges.length > 0 ? challenges.slice(0, 4) : [
              { id: 'ch-1', title: 'Complete Your Profile', description: 'Verify your name and account details in profile settings.', pointsReward: 100, claimed: true },
              { id: 'ch-2', title: 'Daily Platform Activity', description: 'Explore the Rewards Store or Leaderboard today.', pointsReward: 150, claimed: false },
              { id: 'ch-3', title: 'Maintain Your Streak', description: 'Log into VELOOP Rewards Hub consecutive days in a row.', pointsReward: 200, claimed: false }
            ]).map(mission => (
              <div key={mission.id || mission._id} className="card-saas p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-circle font-weight-bold ${mission.claimed ? 'bg-success bg-opacity-10 text-success' : 'bg-primary-light text-primary'}`}>
                    {mission.claimed ? <CheckCircle2 size={24} /> : <Target size={24} />}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h5 className="font-weight-bold text-dark mb-0">{mission.title}</h5>
                      <span className="badge badge-gold">+{mission.pointsReward} VE</span>
                    </div>
                    <p className="text-muted small mb-0">{mission.description}</p>
                  </div>
                </div>

                <div>
                  {mission.claimed ? (
                    <span className="badge bg-success-subtle text-success px-4 py-2 rounded-3 font-weight-bold">
                      ✓ Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-indigo px-4 font-weight-bold rounded-3"
                      disabled={claimingId === (mission.id || mission._id)}
                      onClick={() => handleClaimChallenge(mission.id || mission._id)}
                    >
                      {claimingId === (mission.id || mission._id) ? 'Claiming...' : 'Claim Points'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — REWARD EXPLORER (ASYMMETRIC LAYOUT) */}
      <section id="rewards" className="py-5">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
            <div>
              <span className="badge badge-gold mb-2">Curated Store Catalog</span>
              <h2 className="section-title h1 mb-1">Find Your Next Reward</h2>
              <p className="text-muted mb-0">Explore physical tech gadgets, smart wearables, and instant digital gift cards.</p>
            </div>

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

          {/* Asymmetric Reward Grid: 1 Large Left, 2 Medium Center, 2 Small Right */}
          <div className="row g-4">
            {/* Left Large Reward Card */}
            {filteredRewards[0] && (
              <div className="col-lg-5">
                <div className="card-saas h-100 overflow-hidden d-flex flex-column">
                  <div className="position-relative bg-light" style={{ height: '280px' }}>
                    <img src={filteredRewards[0].imageUrl} alt={filteredRewards[0].title} className="w-100 h-100 object-fit-cover" />
                    <span className="position-absolute top-0 end-0 m-3 badge badge-gold font-weight-bold fs-6">
                      <Coins size={14} className="me-1" />
                      {filteredRewards[0].pointsRequired?.toLocaleString()} VE Pts
                    </span>
                  </div>
                  <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <span className="badge badge-indigo mb-2">{filteredRewards[0].category?.replace('_', ' ')}</span>
                      <h4 className="font-weight-bold text-dark mb-2">{filteredRewards[0].title}</h4>
                      <p className="text-muted small mb-3">{filteredRewards[0].description}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-gold w-100 font-weight-bold rounded-3 py-2"
                      onClick={() => {
                        setRedeemingReward(filteredRewards[0]);
                        setRedeemError('');
                        setRedeemSuccess(null);
                      }}
                    >
                      Explore Reward Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Center Medium Reward Cards */}
            <div className="col-lg-4 d-flex flex-column gap-4">
              {filteredRewards.slice(1, 3).map(item => (
                <div key={item._id} className="card-saas p-3 d-flex gap-3 align-items-center h-100">
                  <img src={item.imageUrl} alt={item.title} className="rounded-3 object-fit-cover" style={{ width: '100px', height: '100px' }} />
                  <div className="flex-grow-1">
                    <span className="badge badge-indigo small mb-1">{item.category?.replace('_', ' ')}</span>
                    <h6 className="font-weight-bold text-dark mb-1 line-clamp-1">{item.title}</h6>
                    <span className="badge badge-gold font-weight-bold mb-2">{item.pointsRequired?.toLocaleString()} VE</span>
                    <button
                      type="button"
                      className="btn btn-outline-indigo btn-sm w-100 font-weight-bold"
                      onClick={() => {
                        setRedeemingReward(item);
                        setRedeemError('');
                        setRedeemSuccess(null);
                      }}
                    >
                      Redeem Item
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Horizontal Small Reward Cards */}
            <div className="col-lg-3 d-flex flex-column gap-4">
              {filteredRewards.slice(3, 5).map(item => (
                <div key={item._id} className="card-saas p-3 d-flex flex-column justify-content-between h-100">
                  <div>
                    <span className="badge badge-gold small mb-2">{item.pointsRequired?.toLocaleString()} VE Pts</span>
                    <h6 className="font-weight-bold text-dark mb-1">{item.title}</h6>
                    <p className="text-muted small line-clamp-2 mb-2">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-indigo btn-sm w-100 font-weight-semibold"
                    onClick={() => {
                      setRedeemingReward(item);
                      setRedeemError('');
                      setRedeemSuccess(null);
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — LEVEL JOURNEY */}
      <section id="level-journey" className="py-5 bg-white border-y">
        <div className="container py-4 text-center">
          <span className="badge badge-indigo mb-2">Progression Path</span>
          <h2 className="section-title h1 mb-2">Level Journey Framework</h2>
          <p className="section-subtitle mb-5">
            Rank up your profile level as you earn XP through activity tasks and milestone streak records.
          </p>

          <div className="row g-3 justify-content-center">
            {levelTimeline.map((item, idx) => (
              <div key={item.level} className="col-md-2.4 col-6">
                <div className={`card-saas p-4 h-100 text-center ${item.active ? 'border-primary bg-primary-light shadow-md' : ''}`}>
                  <span className={`badge ${item.active ? 'badge-gold' : 'bg-light text-muted border'} mb-2`}>
                    LEVEL {item.level}
                  </span>
                  <h6 className="font-weight-bold text-dark mb-1">{item.title}</h6>
                  <span className="small text-muted d-block">{item.range}</span>
                  {item.active && <span className="badge bg-primary mt-2">Current Rank</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — ACHIEVEMENT WALL */}
      <section id="achievements" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2">Milestone System</span>
            <h2 className="section-title h1 mb-2">Achievement Wall</h2>
            <p className="section-subtitle">
              Collect circular badges as you complete challenges, hit streak records, and redeem platform items.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {achievementBadges.map(badge => {
              const Icon = badge.icon;
              return (
                <div key={badge.key} className="col-md-4 col-lg-2.0 col-6 text-center">
                  <div className={`card-saas p-4 h-100 ${badge.unlocked ? 'border-primary' : 'opacity-60'}`}>
                    <div className={`avatar-circle mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle border ${badge.unlocked ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`} style={{ width: '72px', height: '72px' }}>
                      <Icon size={32} />
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">{badge.title}</h6>
                    <span className="small text-muted d-block">{badge.desc}</span>
                    <span className={`badge mt-2 ${badge.unlocked ? 'badge-gold' : 'bg-light text-muted border'}`}>
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 — ACTIVITY TIMELINE */}
      <section id="activity-timeline" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="mw-100 mx-auto" style={{ maxWidth: '800px' }}>
            <div className="text-center mb-5">
              <span className="badge badge-indigo mb-2">Audit History</span>
              <h2 className="section-title h1 mb-2">Activity Log Timeline</h2>
              <p className="section-subtitle">
                Track your recent ledger activity events, challenge claims, and achievement unlocks.
              </p>
            </div>

            <div className="position-relative ps-4 border-start border-3 border-primary ms-3">
              {activityTimelineData.map(item => (
                <div key={item._id} className="mb-4 position-relative">
                  <div className="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-primary text-white p-1 ms-n3" style={{ left: '-2px' }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <div className="card-saas p-3 ms-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge badge-gold small">{item.dateLabel || 'RECENT'}</span>
                      <span className="font-weight-bold text-success">+{item.amount || 150} VE</span>
                    </div>
                    <h6 className="font-weight-bold text-dark mb-0">{item.title || item.description}</h6>
                    <span className="small text-muted">{item.details || item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — LEADERBOARD PREVIEW */}
      <section id="leaderboard" className="py-5">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2">Community Rankings</span>
              <h2 className="section-title h1 mb-1">Top Member Leaderboard</h2>
              <p className="text-muted mb-0">Weekly VE Points leaderboards with masked username privacy protection.</p>
            </div>

            <Link to="/leaderboard" className="btn btn-outline-indigo font-weight-semibold">
              View Full Leaderboard
            </Link>
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
                  {(leaderboard.length > 0 ? leaderboard.slice(0, 3) : [
                    { rank: 1, maskedName: 'AYU****92', level: 6, points: 14500 },
                    { rank: 2, maskedName: 'SAR****14', level: 5, points: 12200 },
                    { rank: 3, maskedName: 'MAR****88', level: 4, points: 9800 }
                  ]).map((entry, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-weight-bold">
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : '🥉 #3'}
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

      {/* SECTION 11 — WHY VELOOP (EDITORIAL ASYMMETRIC LAYOUT) */}
      <section id="why-veloop" className="py-5 bg-white border-y">
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <span className="badge badge-gold mb-2">Platform Philosophy</span>
              <h2 className="display-4 font-weight-bold section-title mb-3">
                Progress should feel rewarding.
              </h2>
              <p className="text-muted lead fs-6 mb-4">
                We believe every daily action, verified milestone, and task completion deserves clear visibility and tangible platform rewards.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card-saas p-4">
                    <div className="p-2 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <Activity size={20} />
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Track Progress</h6>
                    <p className="text-muted small mb-0">See your points and achievements in one central hub.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-saas p-4">
                    <div className="p-2 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <ShoppingBag size={20} />
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Discover Rewards</h6>
                    <p className="text-muted small mb-0">Find physical gadgets & gift cards that match your progress.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-saas p-4">
                    <div className="p-2 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <Zap size={20} />
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Complete Challenges</h6>
                    <p className="text-muted small mb-0">Turn daily activities into measurable points payouts.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-saas p-4">
                    <div className="p-2 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <Trophy size={20} />
                    </div>
                    <h6 className="font-weight-bold text-dark mb-1">Build Achievements</h6>
                    <p className="text-muted small mb-0">Progress through levels and unlock milestone badges.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12 — FAQ (TWO COLUMN DESIGN) */}
      <section id="faq" className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-4">
              <span className="badge badge-indigo mb-2">Support & Info</span>
              <h2 className="display-5 font-weight-bold text-dark mb-3">
                Questions? <br />
                We've got answers.
              </h2>
              <p className="text-muted">
                Need more information on how VE Points work or how reward redemptions are fulfilled? Explore our frequently asked questions.
              </p>
            </div>

            <div className="col-lg-8">
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
        </div>
      </section>

      {/* SECTION 13 — FINAL CTA */}
      <section id="final-cta" className="py-5 bg-white border-y">
        <div className="container py-5 text-center">
          <div className="p-5 rounded-4 bg-primary text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
            <h2 className="display-4 font-weight-bold mb-3 text-white">What's your next milestone?</h2>
            <p className="lead mb-4 opacity-90 mx-auto" style={{ maxWidth: '600px' }}>
              Complete activities, build your progress and explore what you can unlock.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-gold btn-lg px-4 font-weight-bold"
                onClick={() => {
                  const el = document.getElementById('rewards');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Rewards
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4 font-weight-bold"
                onClick={() => {
                  const el = document.getElementById('challenges');
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
