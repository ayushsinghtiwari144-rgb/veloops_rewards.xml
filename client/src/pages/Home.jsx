import React, { useState, useEffect } from 'react';
import HeroSection from '../components/layout/HeroSection';
import GiveawayStats from '../components/giveaway/GiveawayStats';
import GiveawayCard from '../components/giveaway/GiveawayCard';
import HowToParticipate from '../components/giveaway/HowToParticipate';
import GiveawayRules from '../components/giveaway/GiveawayRules';
import WinnerSlider from '../components/winner/WinnerSlider';
import TrustSection from '../components/common/TrustSection';
import FAQ from '../components/common/FAQ';
import CTASection from '../components/common/CTASection';
import PrizeSkeleton from '../components/loader/PrizeSkeleton';
import { fetchCurrentGiveawaysApi } from '../services/giveawayService';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Home = () => {
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGiveaways = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentGiveawaysApi();
      setGiveaways(data || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to VELOOP Rewards service.');
      setGiveaways([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGiveaways();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Platform Stats Section */}
      <GiveawayStats />

      {/* 3. Featured Giveaways Section */}
      <section id="featured-giveaways" className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold rounded-pill mb-2">
                Live & Upcoming Events
              </span>
              <h2 className="fw-bold display-6 mb-0">Featured Giveaways</h2>
            </div>
            <p className="text-muted small mb-0 mt-2 mt-md-0" style={{ maxWidth: '400px' }}>
              Explore our current promotional giveaways. Select a prize to view rules and participation details.
            </p>
          </div>

          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="col-md-6 col-lg-3">
                  <PrizeSkeleton />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="alert alert-danger d-flex align-items-center justify-content-between p-4 rounded-4" role="alert">
              <div className="d-flex align-items-center gap-3">
                <AlertCircle size={28} className="text-danger flex-shrink-0" />
                <div>
                  <h6 className="fw-bold mb-1">Unable to Load Giveaways</h6>
                  <p className="small mb-0 opacity-90">{error}</p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 font-semibold"
                onClick={loadGiveaways}
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          ) : giveaways.length === 0 ? (
            <div className="text-center py-5 bg-light rounded-4 border">
              <h5 className="fw-bold text-secondary mb-2">No Active Giveaways Right Now</h5>
              <p className="text-muted small mb-0">
                Check back soon! New rewards and giveaways are added regularly.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {giveaways.map((giveaway) => (
                <div key={giveaway._id || giveaway.id || giveaway.slug} className="col-md-6 col-lg-3">
                  <GiveawayCard giveaway={giveaway} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. How It Works */}
      <HowToParticipate />

      {/* 5. Winner Announcement Slider */}
      <WinnerSlider />

      {/* 6. Trust Section */}
      <TrustSection />

      {/* 7. Rules Section */}
      <GiveawayRules />

      {/* 8. FAQ */}
      <FAQ />

      {/* 9. Final CTA */}
      <CTASection />
    </div>
  );
};

export default Home;
