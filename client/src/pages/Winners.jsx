import React, { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle2, Gift } from 'lucide-react';
import WinnerCard from '../components/winner/WinnerCard';
import PreviousWinnerCard from '../components/winner/PreviousWinnerCard';
import VeloopLoader from '../components/loader/VeloopLoader';
import { getPreviousWinnersApi, fetchCurrentGiveawaysApi } from '../services/giveawayService';

const Winners = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [loading, setLoading] = useState(true);
  const [activeGiveaways, setActiveGiveaways] = useState([]);
  const [previousWinners, setPreviousWinners] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadWinnersData = async () => {
      setLoading(true);

      // Load active giveaways
      try {
        const activeData = await fetchCurrentGiveawaysApi();
        if (isMounted) {
          setActiveGiveaways(activeData || []);
        }
      } catch (err) {
        if (isMounted) {
          setActiveGiveaways([]);
        }
      }

      // Load previous winners
      try {
        const prevData = await getPreviousWinnersApi();
        if (isMounted) {
          setPreviousWinners(prevData || []);
        }
      } catch (err) {
        if (isMounted) {
          setPreviousWinners([]);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadWinnersData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-flex mb-3">
          <Trophy size={40} />
        </div>
        <h1 className="fw-bold display-6">Winner Transparency Hub</h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Explore live campaign winner countdowns and verified historic reward drawing records.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex justify-content-center mb-4">
        <div className="bg-light p-1 rounded-pill border d-inline-flex gap-1">
          <button
            type="button"
            className={`btn btn-sm px-4 py-2 rounded-pill font-semibold ${
              activeTab === 'ACTIVE' ? 'btn-primary shadow-sm' : 'btn-light text-secondary'
            }`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            <Clock size={16} className="me-1 inline-block" /> ACTIVE GIVEAWAYS
          </button>
          <button
            type="button"
            className={`btn btn-sm px-4 py-2 rounded-pill font-semibold ${
              activeTab === 'PREVIOUS' ? 'btn-primary shadow-sm' : 'btn-light text-secondary'
            }`}
            onClick={() => setActiveTab('PREVIOUS')}
          >
            <CheckCircle2 size={16} className="me-1 inline-block" /> PREVIOUS WINNERS
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="row justify-content-center">
        <div className="col-lg-9">
          {loading ? (
            <VeloopLoader messageIndex={1} />
          ) : activeTab === 'ACTIVE' ? (
            <div>
              <div className="alert alert-primary d-flex align-items-center gap-2 mb-4" role="alert">
                <Gift size={20} />
                <div>
                  <strong>Active Campaign Notice:</strong> Winners for active giveaways will be announced after the giveaway ends.
                </div>
              </div>

              {activeGiveaways.length > 0 ? (
                activeGiveaways.map((gw) => (
                  <WinnerCard key={gw._id || gw.id || gw.slug} giveaway={gw} />
                ))
              ) : (
                <div className="text-center py-5 bg-light rounded-3">
                  <p className="text-muted mb-0">No active giveaways at this moment.</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                <CheckCircle2 size={20} />
                <div>
                  <strong>Verified Records:</strong> Displaying confirmed winners from concluded promotional giveaways (User IDs masked for privacy protection).
                </div>
              </div>

              {previousWinners.length > 0 ? (
                previousWinners.map((winner) => (
                  <PreviousWinnerCard key={winner.id || winner._id} winner={winner} />
                ))
              ) : (
                <div className="text-center py-5 bg-light rounded-3">
                  <p className="text-muted mb-0">No previous winners yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Winners;
