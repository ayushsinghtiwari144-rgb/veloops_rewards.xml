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
  Star,
  Flame,
  UserCheck
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
    { _id: 'earbuds-01', title: 'Wireless Earbuds', pointsRequired: 5000, category: 'AUDIO', stock: 15, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', description: 'Active noise canceling wireless earbuds with high-res audio.' },
    { _id: 'watch-01', title: 'Smart Fitness Watch Series 9', pointsRequired: 4200, category: 'WEARABLES', stock: 8, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80', description: 'Advanced health metrics with always-on AMOLED display.' },
    { _id: 'giftcard-01', title: '$50 Digital E-Gift Card', pointsRequired: 1500, category: 'GIFT_CARDS', stock: 50, itemType: 'DIGITAL', imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67daf4095a?w=600&auto=format&fit=crop&q=80', description: 'Instant digital code redeemable on major e-commerce platforms.' },
    { _id: 'charger-01', title: 'MagSafe Fast Wireless Charger', pointsRequired: 1200, category: 'ACCESSORIES', stock: 25, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80', description: '15W magnetic wireless charging stand for phone & earbuds.' },
    { _id: 'hoodie-01', title: 'VELOOP Tech Hoodie & Cap Set', pointsRequired: 3000, category: 'MERCHANDISE', stock: 20, itemType: 'PHYSICAL', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80', description: 'Custom embroidered fleece hoodie paired with snapback cap.' }
  ];

  const effectiveRewards = rewards.length > 0 ? rewards : sampleRewardItems;

  const filteredRewards = effectiveRewards.filter(r => {
    const matchesCategory = selectedRewardCategory === 'ALL' || r.category === selectedRewardCategory;
    const matchesSearch = !rewardSearchQuery || r.title.toLowerCase().includes(rewardSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate target reward progress
  const currentPoints = user?.pointsBalance || 2450;
  const targetReward = effectiveRewards[0] || sampleRewardItems[0];
  const targetCost = targetReward.pointsRequired || 5000;
  const progressPercent = Math.min(100, Math.round((currentPoints / targetCost) * 100));
  const pointsRemaining = Math.max(0, targetCost - currentPoints);

  // Level Progression Timeline
  const levelTimeline = [
    { level: 1, title: 'Bronze Explorer', range: '0 - 500 XP', active: false },
    { level: 2, title: 'Silver Collector', range: '501 - 1,200 XP', active: false },
    { level: 3, title: 'Gold Champion', range: '1,201 - 2,200 XP', active: false },
    { level: 4, title: 'Reward Master', range: '2,201 - 3,500 XP', active: true },
    { level: 5, title: 'Diamond Legend', range: '3,501+ XP', active: false }
  ];

  // Achievement Badges Setup
  const achievementBadges = [
    { key: 'first_login', title: 'Early Explorer', desc: 'Log into VELOOP Rewards Hub', icon: Sparkles, unlocked: true },
    { key: 'streak_3', title: 'Streak Master', desc: 'Maintain 3-day active streak', icon: Flame, unlocked: true },
    { key: 'pts_1000', title: 'Points Collector', desc: 'Reach 1,000 total VE Points', icon: Coins, unlocked: true },
    { key: 'challenge_5', title: 'Mission Hero', desc: 'Complete 5 platform missions', icon: Target, unlocked: true },
    { key: 'first_redeem', title: 'Store Pioneer', desc: 'Redeem your first store reward', icon: Gift, unlocked: false },
    { key: 'top_10', title: 'Leaderboard Elite', desc: 'Rank top 10 on leaderboard', icon: Trophy, unlocked: false }
  ];

  // Activity Timeline Fallback Data
  const activityTimelineData = transactions.length > 0 ? transactions.slice(0, 5) : [
    { _id: 'tx-1', title: 'Daily Login Challenge Claimed', details: 'Completed Daily Check-In mission', amount: 120, dateLabel: 'Today, 10:45 AM', type: 'CHALLENGE_REWARD' },
    { _id: 'tx-2', title: 'Profile Verification Completed', details: 'Verified account email & username', amount: 100, dateLabel: 'Yesterday', type: 'CHALLENGE_REWARD' },
    { _id: 'tx-3', title: 'Weekly Leaderboard Bonus', details: 'Ranked #3 in Weekly Sprint', amount: 250, dateLabel: '2 days ago', type: 'LEADERBOARD_BONUS' }
  ];

  // FAQ Items
  const faqItems = [
    { question: 'What are VE Points?', answer: 'VE Points (VELOOP Ecosystem Points) are digital activity points earned by participating in challenges, maintaining login streaks, completing platform tasks, and unlocking achievements on VELOOP Rewards Hub.' },
    { question: 'How do challenges work?', answer: 'Challenges are action-based objectives (such as logging in or verifying your profile) that reset daily or weekly. Completing a challenge unlocks "Claim Points" to add VE Points and XP to your account.' },
    { question: 'How do achievements work?', answer: 'Achievements are lifetime milestone badges awarded when you hit specific criteria, such as maintaining a 7-day streak, reaching 1,000 points, or redeeming your first store item.' },
    { question: 'How can I redeem rewards?', answer: 'Explore the "Reward Explorer" section to browse physical gadgets, accessories, and digital gift cards. Click "Redeem", enter your address if required, and confirm your order.' },
    { question: 'How is my progress calculated?', answer: 'Your progress is tracked server-side through XP earned from activities. Reaching XP thresholds automatically levels up your account status.' },
    { question: 'Can I track my transactions?', answer: 'Yes! All point credits, challenge claims, and store redemptions are recorded in your personal Points Ledger & History page.' }
  ];

  return (
    <div className="pb-5">
      {/* SECTION 1 — COMMAND CENTER HERO */}
      <section
        id="hero"
        className="py-5 position-relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 70%, #020617 100%)',
          color: '#ffffff'
        }}
      >
        {/* Background Decorative Ambient Glow Blobs */}
        <div
          className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-30 pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(245,158,11,0.1) 50%, rgba(0,0,0,0) 70%)',
            filter: 'blur(60px)'
          }}
        />

        <div className="container py-4 text-center position-relative z-1">
          {/* Hero Top Glass Pill Badge */}
          <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-3.5 shadow-sm">
            <span className="w-2 h-2 rounded-circle bg-warning animate-pulse-glow" />
            <span className="badge badge-gold">✨ VELOOP COMMAND CENTER</span>
            <span className="small text-light font-weight-semibold">Your Progress Command Center</span>
          </div>

          {/* Main Headline */}
          <h1 className="display-3 font-weight-extrabold text-white mb-3 tracking-tight">
            Make Progress. <span className="text-gradient-gold">Unlock More.</span>
          </h1>

          {/* Subtitle */}
          <p className="lead text-light opacity-85 mb-4.5 mx-auto font-weight-normal" style={{ maxWidth: '640px' }}>
            Complete daily activities, build your XP progress, earn VE Points, and discover exclusive platform rewards.
          </p>

          {/* Action CTAs */}
          <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
            <button
              type="button"
              className="btn btn-gold btn-lg px-4.5 py-3 font-weight-extrabold d-flex align-items-center gap-2 shadow-lg"
              onClick={() => {
                const el = document.getElementById('rewards');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Rewards Catalog</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-outline-light btn-lg px-4.5 py-3 font-weight-bold rounded-3"
              onClick={() => {
                const el = document.getElementById('challenges');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Daily Missions
            </button>
          </div>

          {/* LARGE CENTERED INTERACTIVE COMMAND CENTER DASHBOARD */}
          <div className="mw-100 mx-auto" style={{ maxWidth: '980px' }}>
            <div className="glass-card-dark p-4 p-md-5 text-start position-relative overflow-hidden border border-white border-opacity-20 shadow-xl">
              
              {/* Floating Indicator Badges */}
              <div className="position-absolute top-0 end-0 m-3.5 d-none d-md-block animate-float-1 z-2">
                <div className="px-3.5 py-2 rounded-3 bg-warning text-dark font-weight-extrabold small shadow-md d-flex align-items-center gap-2 border border-amber-300">
                  <Coins size={16} className="text-dark" /> +120 VE Points Today
                </div>
              </div>

              <div className="position-absolute bottom-0 start-0 m-3.5 d-none d-md-block animate-float-2 z-2">
                <div className="px-3.5 py-2 rounded-3 bg-indigo text-white font-weight-bold small shadow-md d-flex align-items-center gap-2 border border-indigo-400">
                  <Award size={16} className="text-warning" /> Challenge Master Unlocked
                </div>
              </div>

              {/* Dashboard Top Row */}
              <div className="row align-items-center g-4 mb-4">
                <div className="col-md-5">
                  <span className="small text-uppercase tracking-wider opacity-75 font-weight-bold d-block mb-1 text-indigo-200">
                    VELOOP VERIFIED LEDGER
                  </span>
                  <h2 className="display-5 font-weight-extrabold text-warning mb-0">
                    {currentPoints.toLocaleString()} <span className="fs-4 font-weight-bold text-white">VE POINTS</span>
                  </h2>
                  <span className="small text-light opacity-75 d-inline-flex align-items-center gap-1 mt-1">
                    <Shield size={14} className="text-success" /> Server-Validated Balance
                  </span>
                </div>

                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3">
                    {/* SVG Circular Radial Progress */}
                    <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '68px', height: '68px' }}>
                      <svg width="68" height="68" viewBox="0 0 36 36">
                        <path className="text-white opacity-20" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-warning" strokeDasharray="82, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="position-absolute font-weight-extrabold small text-white">82%</span>
                    </div>

                    <div>
                      <h6 className="font-weight-extrabold text-white mb-0">LEVEL 04</h6>
                      <span className="badge badge-indigo small mt-0.5">REWARD EXPLORER</span>
                      <span className="small text-light opacity-75 d-block mt-1">550 XP to Level 5</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 text-md-end">
                  <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-15 backdrop-blur">
                    <span className="small opacity-75 d-block mb-1 font-weight-medium">TARGET UNLOCK</span>
                    <span className="font-weight-bold text-white d-block text-truncate">Wireless Earbuds</span>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm font-weight-extrabold mt-2 w-100 shadow-sm"
                      onClick={() => {
                        const el = document.getElementById('next-reward');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      View Target Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-3.5 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10">
                <div className="d-flex justify-content-between small text-light opacity-90 mb-2 font-weight-semibold">
                  <span>Level Progress (2,450 / 3,000 XP)</span>
                  <span>550 XP Remaining</span>
                </div>
                <div className="progress rounded-pill bg-white bg-opacity-20" style={{ height: '12px' }}>
                  <div
                    className="progress-bar rounded-pill"
                    style={{ width: '82%', background: 'linear-gradient(90deg, #6366f1 0%, #f59e0b 100%)' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Claim Notification Message */}
      {claimMessage && (
        <div className="container mt-3.5">
          <div className="alert alert-info alert-dismissible fade show rounded-3 shadow-sm border-0 font-weight-semibold" role="alert">
            {claimMessage}
            <button type="button" className="btn-close" onClick={() => setClaimMessage('')} />
          </div>
        </div>
      )}

      {/* SECTION 2 — QUICK METRICS & PROGRESS WIDGETS */}
      <section id="quick-stats" className="py-4.5 bg-white border-y">
        <div className="container">
          <div className="row g-4">
            {/* Widget 1: VE Points */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-top border-4 border-warning shadow-sm">
                <div className="p-2.5 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-flex mb-2">
                  <Coins size={22} />
                </div>
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">VE Points Balance</span>
                <h3 className="mb-1 font-weight-extrabold text-dark">
                  {currentPoints.toLocaleString()}
                </h3>
                <span className="badge badge-gold small">+120 Earned Today</span>
              </div>
            </div>

            {/* Widget 2: Level Progress */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-top border-4 border-primary shadow-sm">
                <div className="p-2.5 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex mb-2">
                  <Award size={22} />
                </div>
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">Level Progression</span>
                <h3 className="mb-1 font-weight-extrabold text-indigo">Lvl 04</h3>
                <span className="small text-muted font-weight-semibold">82% to Level 5</span>
              </div>
            </div>

            {/* Widget 3: Active Missions */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-top border-4 border-info shadow-sm">
                <div className="p-2.5 rounded-circle bg-info bg-opacity-10 text-info d-inline-flex mb-2">
                  <Target size={22} />
                </div>
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">Active Missions</span>
                <h3 className="mb-1 font-weight-extrabold text-dark">
                  {challenges.length > 0 ? `${challenges.length} Active` : '4 Missions'}
                </h3>
                <span className="badge badge-indigo small">Daily Tasks Ready</span>
              </div>
            </div>

            {/* Widget 4: Achievements */}
            <div className="col-md-3 col-6">
              <div className="card-saas p-4 text-center h-100 border-top border-4 border-success shadow-sm">
                <div className="p-2.5 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-2">
                  <Trophy size={22} />
                </div>
                <span className="small text-muted font-weight-bold d-block text-uppercase tracking-wider mb-1">Badges Unlocked</span>
                <h3 className="mb-1 font-weight-extrabold text-success">
                  {achievements.filter(a => a.unlocked).length || 4} Badges
                </h3>
                <span className="small text-muted font-weight-semibold">Milestones Achieved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — TARGET REWARD UNLOCK SHOWCASE */}
      <section id="next-reward" className="py-5">
        <div className="container py-3">
          <div className="card-saas p-4 p-md-5 border-primary shadow-lg overflow-hidden position-relative" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 60%, #eef2ff 100%)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3.5 flex-wrap gap-2">
              <span className="badge badge-gold px-3.5 py-2 font-weight-extrabold fs-7">
                🎯 YOUR NEXT UNLOCK GOAL
              </span>
              <span className="small text-primary font-weight-extrabold bg-primary bg-opacity-10 px-3 py-1 rounded-pill">
                {progressPercent}% Goal Reached
              </span>
            </div>

            <div className="row align-items-center g-4">
              <div className="col-md-4 text-center">
                <div className="position-relative overflow-hidden rounded-4 shadow-md bg-white p-2">
                  <img
                    src={targetReward?.imageUrl || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'}
                    alt={targetReward?.title || 'Wireless Earbuds'}
                    className="rounded-3 object-fit-cover w-100 transition-transform duration-300 hover-scale"
                    style={{ maxHeight: '220px' }}
                  />
                  <span className="position-absolute top-0 end-0 m-3 badge badge-gold font-weight-extrabold">
                    {targetCost.toLocaleString()} VE Pts
                  </span>
                </div>
              </div>

              <div className="col-md-8">
                <h3 className="font-weight-extrabold text-dark mb-2 h2">{targetReward?.title || 'Wireless Earbuds'}</h3>
                <p className="text-muted small mb-3.5 leading-relaxed">{targetReward?.description || 'Active Noise Canceling Wireless Earbuds with High-Res Audio & long battery life.'}</p>

                <div className="d-flex justify-content-between small text-muted font-weight-bold mb-1.5">
                  <span>Target Cost: {targetCost.toLocaleString()} VE Points</span>
                  <span>Current Balance: {currentPoints.toLocaleString()} VE Points</span>
                </div>

                <div className="progress rounded-pill bg-white border mb-3.5 shadow-xs" style={{ height: '14px' }}>
                  <div
                    className="progress-bar rounded-pill"
                    style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #4f46e5 0%, #f59e0b 100%)' }}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <span className="font-weight-extrabold text-indigo fs-6">
                    {pointsRemaining > 0 ? `${pointsRemaining.toLocaleString()} points remaining to unlock` : '🎉 Goal Reached! Ready to redeem now.'}
                  </span>

                  <button
                    type="button"
                    className="btn btn-gold font-weight-extrabold px-4 py-2.5 rounded-3 shadow-md"
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

      {/* SECTION 4 — DAILY MISSION BOARD */}
      <section id="challenges" className="py-5 bg-white border-y">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2 font-weight-bold">Interactive Mission Board</span>
              <h2 className="section-title h1 mb-1">Today's Missions</h2>
              <p className="text-muted mb-0">Complete active tasks to claim points and XP directly to your account balance.</p>
            </div>

            <Link to="/challenges" className="btn btn-outline-indigo font-weight-extrabold px-4">
              Full Missions Hub
            </Link>
          </div>

          <div className="d-flex flex-column gap-3">
            {(challenges.length > 0 ? challenges.slice(0, 4) : [
              { id: 'ch-1', title: 'Complete Your Profile', description: 'Verify your name and account details in profile settings.', pointsReward: 100, claimed: true },
              { id: 'ch-2', title: 'Daily Platform Activity', description: 'Explore the Rewards Store or Leaderboard today.', pointsReward: 150, claimed: false },
              { id: 'ch-3', title: 'Maintain Your Streak', description: 'Log into VELOOP Rewards Hub consecutive days in a row.', pointsReward: 200, claimed: false }
            ]).map(mission => (
              <div key={mission.id || mission._id} className={`card-saas p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-start border-4 ${mission.claimed ? 'border-success' : 'border-indigo'}`}>
                <div className="d-flex align-items-center gap-3.5">
                  <div className={`p-3 rounded-circle font-weight-bold ${mission.claimed ? 'bg-success bg-opacity-10 text-success' : 'bg-primary-light text-primary'}`}>
                    {mission.claimed ? <CheckCircle2 size={26} /> : <Target size={26} />}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <h5 className="font-weight-extrabold text-dark mb-0">{mission.title}</h5>
                      <span className="badge badge-gold font-weight-extrabold">+{mission.pointsReward} VE</span>
                    </div>
                    <p className="text-muted small mb-0">{mission.description}</p>
                  </div>
                </div>

                <div>
                  {mission.claimed ? (
                    <span className="badge bg-success-subtle text-success px-4 py-2.5 rounded-3 font-weight-extrabold border border-success border-opacity-25">
                      ✓ Claimed & Completed
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-indigo px-4.5 py-2.5 font-weight-extrabold rounded-3"
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

      {/* SECTION 5 — REWARD EXPLORER CATALOG */}
      <section id="rewards" className="py-5">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4.5 gap-3">
            <div>
              <span className="badge badge-gold mb-2 font-weight-bold">Curated Store Catalog</span>
              <h2 className="section-title h1 mb-1">Find Your Next Reward</h2>
              <p className="text-muted mb-0">Explore physical tech gadgets, smart wearables, and instant digital gift cards.</p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2.5">
              <div className="input-group input-group-sm shadow-xs" style={{ width: '230px' }}>
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  className="form-control bg-white border-start-0 text-dark small font-weight-medium"
                  placeholder="Search rewards..."
                  value={rewardSearchQuery}
                  onChange={(e) => setRewardSearchQuery(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-1 bg-white p-1 rounded-3 border shadow-xs">
                {['ALL', 'ELECTRONICS', 'ACCESSORIES', 'GIFT_CARDS', 'MERCHANDISE'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn btn-sm rounded-2 font-weight-extrabold ${selectedRewardCategory === cat ? 'btn-indigo' : 'text-muted bg-transparent border-0'}`}
                    onClick={() => setSelectedRewardCategory(cat)}
                  >
                    {cat === 'ALL' ? 'All' : cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Asymmetric Reward Grid Layout */}
          <div className="row g-4">
            {/* Left Featured Large Reward Card */}
            {filteredRewards[0] && (
              <div className="col-lg-5">
                <div className="card-saas h-100 overflow-hidden d-flex flex-column shadow-md">
                  <div className="position-relative bg-light" style={{ height: '280px' }}>
                    <img src={filteredRewards[0].imageUrl} alt={filteredRewards[0].title} className="w-100 h-100 object-fit-cover" />
                    <span className="position-absolute top-0 end-0 m-3 badge badge-gold font-weight-extrabold fs-6 shadow-sm">
                      <Coins size={14} className="me-1" />
                      {filteredRewards[0].pointsRequired?.toLocaleString()} VE Pts
                    </span>
                  </div>
                  <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                    <div>
                      <span className="badge badge-indigo mb-2 font-weight-bold">{filteredRewards[0].category?.replace('_', ' ')}</span>
                      <h4 className="font-weight-extrabold text-dark mb-2">{filteredRewards[0].title}</h4>
                      <p className="text-muted small mb-3.5 leading-relaxed">{filteredRewards[0].description}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-gold w-100 font-weight-extrabold rounded-3 py-2.5 shadow-sm"
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
                <div key={item._id} className="card-saas p-3.5 d-flex gap-3 align-items-center h-100 shadow-sm">
                  <img src={item.imageUrl} alt={item.title} className="rounded-3 object-fit-cover shrink-0" style={{ width: '105px', height: '105px' }} />
                  <div className="flex-grow-1">
                    <span className="badge badge-indigo small mb-1">{item.category?.replace('_', ' ')}</span>
                    <h6 className="font-weight-extrabold text-dark mb-1 line-clamp-1">{item.title}</h6>
                    <span className="badge badge-gold font-weight-extrabold mb-2">{item.pointsRequired?.toLocaleString()} VE</span>
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
                <div key={item._id} className="card-saas p-3.5 d-flex flex-column justify-content-between h-100 shadow-sm">
                  <div>
                    <span className="badge badge-gold small mb-2 font-weight-extrabold">{item.pointsRequired?.toLocaleString()} VE Pts</span>
                    <h6 className="font-weight-extrabold text-dark mb-1">{item.title}</h6>
                    <p className="text-muted small line-clamp-2 mb-2.5">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-indigo btn-sm w-100 font-weight-bold"
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

      {/* SECTION 6 — LEVEL JOURNEY TIMELINE */}
      <section id="level-journey" className="py-5 bg-white border-y">
        <div className="container py-3 text-center">
          <span className="badge badge-indigo mb-2 font-weight-bold">Progression Framework</span>
          <h2 className="section-title h1 mb-2">Level Journey Framework</h2>
          <p className="section-subtitle mb-5">
            Rank up your profile level as you earn XP through activity tasks and milestone streak records.
          </p>

          <div className="row g-3.5 justify-content-center">
            {levelTimeline.map((item) => (
              <div key={item.level} className="col-md-2.4 col-6">
                <div className={`card-saas p-4 h-100 text-center ${item.active ? 'border-2 border-primary bg-primary-light shadow-md' : 'shadow-xs'}`}>
                  <span className={`badge ${item.active ? 'badge-gold' : 'bg-light text-muted border'} mb-2 font-weight-extrabold`}>
                    LEVEL {item.level}
                  </span>
                  <h6 className="font-weight-extrabold text-dark mb-1">{item.title}</h6>
                  <span className="small text-muted d-block font-weight-medium">{item.range}</span>
                  {item.active && <span className="badge bg-primary text-white mt-2 font-weight-bold">Current Rank</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — ACHIEVEMENT WALL */}
      <section id="achievements" className="py-5">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge badge-gold mb-2 font-weight-bold">Milestone System</span>
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
                  <div className={`card-saas p-4 h-100 ${badge.unlocked ? 'border-primary shadow-sm' : 'opacity-65'}`}>
                    <div className={`mx-auto mb-3.5 d-flex align-items-center justify-content-center rounded-circle border ${badge.unlocked ? 'bg-primary text-white shadow-md' : 'bg-light text-muted'}`} style={{ width: '72px', height: '72px' }}>
                      <Icon size={32} />
                    </div>
                    <h6 className="font-weight-extrabold text-dark mb-1">{badge.title}</h6>
                    <span className="small text-muted d-block mb-2">{badge.desc}</span>
                    <span className={`badge ${badge.unlocked ? 'badge-gold' : 'bg-light text-muted border'} font-weight-bold`}>
                      {badge.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8 — ACTIVITY TIMELINE */}
      <section id="activity-timeline" className="py-5 bg-white border-y">
        <div className="container py-3">
          <div className="mw-100 mx-auto" style={{ maxWidth: '820px' }}>
            <div className="text-center mb-5">
              <span className="badge badge-indigo mb-2 font-weight-bold">Audit History</span>
              <h2 className="section-title h1 mb-2">Activity Log Timeline</h2>
              <p className="section-subtitle">
                Track your recent ledger activity events, challenge claims, and achievement unlocks.
              </p>
            </div>

            <div className="position-relative ps-4 border-start border-3 border-primary ms-3">
              {activityTimelineData.map(item => (
                <div key={item._id} className="mb-4 position-relative">
                  <div className="position-absolute top-0 start-0 translate-middle-x rounded-circle bg-primary text-white p-1 ms-n3 shadow-xs" style={{ left: '-2px' }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="card-saas p-3.5 ms-3 shadow-xs">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge badge-gold small font-weight-bold">{item.dateLabel || 'RECENT'}</span>
                      <span className="font-weight-extrabold text-success">+{item.amount || 150} VE Points</span>
                    </div>
                    <h6 className="font-weight-extrabold text-dark mb-0">{item.title || item.description}</h6>
                    <span className="small text-muted">{item.details || item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — LEADERBOARD PREVIEW */}
      <section id="leaderboard" className="py-5">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <span className="badge badge-indigo mb-2 font-weight-bold">Community Rankings</span>
              <h2 className="section-title h1 mb-1">Top Member Leaderboard</h2>
              <p className="text-muted mb-0">Weekly VE Points leaderboards with masked username privacy protection.</p>
            </div>

            <Link to="/leaderboard" className="btn btn-outline-indigo font-weight-extrabold px-4">
              View Full Leaderboard
            </Link>
          </div>

          <div className="card-saas overflow-hidden border shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr className="text-muted small">
                    <th className="py-3.5 px-4 font-weight-bold">Rank</th>
                    <th className="py-3.5 px-4 font-weight-bold">Masked Username</th>
                    <th className="py-3.5 px-4 font-weight-bold text-end">Level</th>
                    <th className="py-3.5 px-4 font-weight-bold text-end">VE Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(leaderboard.length > 0 ? leaderboard.slice(0, 3) : [
                    { rank: 1, maskedName: 'AYU****92', level: 6, points: 14500 },
                    { rank: 2, maskedName: 'SAR****14', level: 5, points: 12200 },
                    { rank: 3, maskedName: 'MAR****88', level: 4, points: 9800 }
                  ]).map((entry, idx) => (
                    <tr key={idx}>
                      <td className="py-3.5 px-4 font-weight-extrabold fs-6">
                        {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : '🥉 #3'}
                      </td>
                      <td className="py-3.5 px-4 font-weight-extrabold text-dark">{entry.maskedName}</td>
                      <td className="py-3.5 px-4 text-end"><span className="badge badge-indigo font-weight-bold">Lvl {entry.level}</span></td>
                      <td className="py-3.5 px-4 text-end font-weight-extrabold text-primary">{entry.points?.toLocaleString()} VE</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — WHY VELOOP */}
      <section id="why-veloop" className="py-5 bg-white border-y">
        <div className="container py-3">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <span className="badge badge-gold mb-2 font-weight-bold">Platform Philosophy</span>
              <h2 className="display-5 font-weight-extrabold section-title mb-3">
                Progress should feel rewarding.
              </h2>
              <p className="text-muted lead fs-6 mb-4 leading-relaxed">
                We believe every daily action, verified milestone, and task completion deserves clear visibility and tangible platform rewards.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="row g-3.5">
                <div className="col-6">
                  <div className="card-saas p-4 h-100 shadow-xs">
                    <div className="p-2.5 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <Activity size={22} />
                    </div>
                    <h6 className="font-weight-extrabold text-dark mb-1">Track Progress</h6>
                    <p className="text-muted small mb-0">See your points and achievements in one central hub.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-saas p-4 h-100 shadow-xs">
                    <div className="p-2.5 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <ShoppingBag size={22} />
                    </div>
                    <h6 className="font-weight-extrabold text-dark mb-1">Discover Rewards</h6>
                    <p className="text-muted small mb-0">Find physical gadgets & gift cards that match your progress.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-saas p-4 h-100 shadow-xs">
                    <div className="p-2.5 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <Zap size={22} />
                    </div>
                    <h6 className="font-weight-extrabold text-dark mb-1">Complete Challenges</h6>
                    <p className="text-muted small mb-0">Turn daily activities into measurable points payouts.</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-saas p-4 h-100 shadow-xs">
                    <div className="p-2.5 rounded-3 bg-primary-light text-primary d-inline-block mb-2">
                      <Trophy size={22} />
                    </div>
                    <h6 className="font-weight-extrabold text-dark mb-1">Build Achievements</h6>
                    <p className="text-muted small mb-0">Progress through levels and unlock milestone badges.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FAQ */}
      <section id="faq" className="py-5">
        <div className="container py-3">
          <div className="row g-5">
            <div className="col-lg-4">
              <span className="badge badge-indigo mb-2 font-weight-bold">Support & Info</span>
              <h2 className="display-5 font-weight-extrabold text-dark mb-3">
                Questions? <br />
                We've got answers.
              </h2>
              <p className="text-muted leading-relaxed">
                Need more information on how VE Points work or how reward redemptions are fulfilled? Explore our frequently asked questions.
              </p>
            </div>

            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {faqItems.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className={`card-saas overflow-hidden border ${isOpen ? 'border-primary shadow-sm' : ''}`}>
                      <button
                        type="button"
                        className="w-100 p-4 text-start bg-transparent border-0 d-flex justify-content-between align-items-center font-weight-extrabold text-dark h6 mb-0"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp size={22} className="text-primary shrink-0" /> : <ChevronDown size={22} className="text-muted shrink-0" />}
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

      {/* SECTION 12 — FINAL CTA */}
      <section id="final-cta" className="py-5 bg-white border-y">
        <div className="container py-4 text-center">
          <div className="p-5 rounded-4 bg-primary text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}>
            <h2 className="display-4 font-weight-extrabold mb-3 text-white">What's your next milestone?</h2>
            <p className="lead mb-4 opacity-90 mx-auto font-weight-normal" style={{ maxWidth: '600px' }}>
              Complete activities, build your progress and explore what you can unlock today.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-gold btn-lg px-4.5 font-weight-extrabold shadow-md"
                onClick={() => {
                  const el = document.getElementById('rewards');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Rewards Catalog
              </button>
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4.5 font-weight-bold"
                onClick={() => {
                  const el = document.getElementById('challenges');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Daily Missions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL: Reward Redemption Modal */}
      {redeemingReward && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.65)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-xl">
              <div className="modal-header border-bottom">
                <h5 className="modal-title font-weight-extrabold text-dark">Redeem {redeemingReward.title}</h5>
                <button type="button" className="btn-close" onClick={() => setRedeemingReward(null)} />
              </div>

              <div className="modal-body p-4">
                {redeemSuccess ? (
                  <div className="text-center py-4">
                    <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle d-inline-block mb-3">
                      <CheckCircle2 size={48} />
                    </div>
                    <h4 className="font-weight-extrabold text-dark mb-2">Redemption Successful!</h4>
                    <p className="text-muted small mb-3">
                      You spent <strong>{redeemingReward.pointsRequired} VE Points</strong>. Remaining balance:{' '}
                      <span className="text-primary font-weight-extrabold">{redeemSuccess.newBalance} VE Points</span>.
                    </p>

                    {redeemingReward.itemType === 'DIGITAL' && redeemSuccess.redemption?.digitalCode && (
                      <div className="p-3 bg-light border rounded-3 mb-3">
                        <span className="small text-muted d-block">Your Digital Code:</span>
                        <code className="h5 text-primary font-weight-bold">{redeemSuccess.redemption.digitalCode}</code>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-secondary rounded-3 px-4 font-weight-bold"
                      onClick={() => setRedeemingReward(null)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleExecuteRedeem}>
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3 border">
                      <img src={redeemingReward.imageUrl} alt={redeemingReward.title} style={{ width: '64px', height: '64px', objectFit: 'cover' }} className="rounded-3 shrink-0" />
                      <div>
                        <h6 className="mb-1 text-dark font-weight-extrabold">{redeemingReward.title}</h6>
                        <span className="badge badge-gold font-weight-extrabold">
                          <Coins size={12} className="me-1" />
                          {redeemingReward.pointsRequired?.toLocaleString()} VE Points
                        </span>
                      </div>
                    </div>

                    {!isAuthenticated ? (
                      <div className="text-center py-3">
                        <p className="text-muted small mb-3 font-weight-medium">Please sign in to process reward redemptions.</p>
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
                          <span className="small text-muted d-block font-weight-medium">Your Current Balance:</span>
                          <span className="h6 text-dark font-weight-extrabold">{user?.pointsBalance?.toLocaleString()} VE Points</span>
                          {user && user.pointsBalance < redeemingReward.pointsRequired && (
                            <div className="text-danger small mt-1 font-weight-semibold">
                              <AlertCircle size={14} className="me-1" />
                              Insufficient points balance for this redemption.
                            </div>
                          )}
                        </div>

                        {redeemingReward.itemType === 'PHYSICAL' && (
                          <div className="mb-3">
                            <label className="form-label small text-muted font-weight-semibold">Shipping Address</label>
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
                          <div className="alert alert-danger small p-2 rounded mb-3 font-weight-semibold">{redeemError}</div>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary rounded-3 font-weight-bold"
                            onClick={() => setRedeemingReward(null)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-gold font-weight-extrabold rounded-3 px-4"
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
