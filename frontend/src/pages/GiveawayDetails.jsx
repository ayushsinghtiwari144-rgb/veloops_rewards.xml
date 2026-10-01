import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, Coins, ShieldCheck, CheckCircle2, Lock, Gift, AlertCircle, Trophy, Award } from 'lucide-react';
import PrizeImage from '../components/common/PrizeImage';
import Countdown from '../components/giveaway/Countdown';
import VeloopLoader from '../components/loader/VeloopLoader';
import PrizeClaimModal from '../components/winner/PrizeClaimModal';
import { useAuth } from '../context/AuthContext';
import {
  fetchGiveawayByIdApi,
  fetchMyParticipationStatusApi,
  joinGiveawayApi,
  getMyClaimApi,
  getWinnersApi
} from '../services/giveawayService';

const GiveawayDetails = () => {
  const { slug } = useParams();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [giveaway, setGiveaway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [participated, setParticipated] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Winner & Claim states
  const [isWinner, setIsWinner] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  // Load Giveaway details & user participation/claim status on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setErrorMessage(null);

      let currentGw = null;

      try {
        const apiData = await fetchGiveawayByIdApi(slug);
        if (isMounted && apiData) {
          currentGw = apiData.giveaway || apiData.data || apiData;
          setGiveaway(currentGw);
        }
      } catch (err) {
        // Fallback: Check if slug matches current active giveaways
        try {
          const currentList = await fetchCurrentGiveawaysApi();
          const match = currentList.find(g => g.slug === slug || g.id === slug || g._id === slug) || currentList[0];
          if (isMounted && match) {
            currentGw = match;
            setGiveaway(currentGw);
          }
        } catch (fallbackErr) {
          if (isMounted) {
            setGiveaway(null);
          }
        }
      }

      // Check participation status if user is authenticated
      if (isAuthenticated && currentGw) {
        try {
          const status = await fetchMyParticipationStatusApi(slug);
          if (isMounted && status.participated) {
            setParticipated(true);
          }
        } catch (err) {
          // Ignore status errors
        }

        // Check if user is a winner (if giveaway is ended)
        if (currentGw && (currentGw.status === 'ENDED' || new Date(currentGw.endDate) <= new Date())) {
          try {
            const winners = await getWinnersApi(slug);
            if (isMounted && Array.isArray(winners)) {
              // Check if user matches winner
              const foundWinner = winners.find(w => w.userId === user?.id || w.userId === user?._id);
              if (foundWinner) {
                setIsWinner(true);
              }
            }
          } catch (err) {
            // Ignore winners fetch error
          }

          // Check claim status
          try {
            const claimData = await getMyClaimApi(slug);
            if (isMounted && claimData && claimData.claimed) {
              setClaimStatus(claimData.claimStatus || 'SUBMITTED');
            }
          } catch (err) {
            // Ignore claim check error
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [slug, isAuthenticated, user]);

  if (loading) {
    return <VeloopLoader messageIndex={2} fullPage={true} />;
  }

  if (!giveaway) {
    return (
      <div className="container py-5 text-center">
        <AlertCircle size={56} className="text-warning mb-3" />
        <h2 className="fw-bold">Giveaway Not Found</h2>
        <p className="text-muted">The requested giveaway "{slug}" could not be loaded from active records.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Back to All Giveaways
        </Link>
      </div>
    );
  }

  const handleJoinClick = async () => {
    setErrorMessage(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setJoining(true);

    try {
      await joinGiveawayApi(slug);
      setParticipated(true);
      setJoinSuccess(true);
      if (refreshUser) refreshUser();
    } catch (err) {
      if (err.code === 'ALREADY_PARTICIPATING') {
        setParticipated(true);
        setErrorMessage("You've already participated in this giveaway.");
      } else if (err.code?.startsWith('INSUFFICIENT')) {
        setErrorMessage(err.message || 'Insufficient VELOOP Points balance to join this giveaway.');
      } else {
        setErrorMessage(err.message || 'Unable to connect to the rewards service. Please try again.');
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Breadcrumb / Back button */}
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 font-semibold">
          <ArrowLeft size={16} /> Back to Giveaways
        </Link>
      </div>

      <div className="row g-4">
        {/* Left Column: Prize Image & Primary Details */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <PrizeImage type={giveaway.image} alt={giveaway.title || giveaway.name} height="360px" />
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-primary px-3 py-2 font-monospace">{giveaway.status}</span>
                <span className="text-muted small">Currency: {giveaway.entryCurrency || 'VELOOP Points'}</span>
              </div>
              <h2 className="fw-bold text-dark">{giveaway.title || giveaway.name}</h2>
              <p className="text-secondary lead fs-6 mt-3">{giveaway.description}</p>
              
              <hr className="my-4" />

              <h5 className="fw-bold mb-3">Prize Specifications</h5>
              <p className="text-muted small">{giveaway.prizeDescription || giveaway.description}</p>
            </div>
          </div>

          {/* Rules & Terms Accordion Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <ShieldCheck size={20} className="text-primary" /> Official Rules & Participation Terms
            </h5>
            <div className="accordion accordion-flush" id="rulesAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#eligibility">
                    Eligibility & Requirements
                  </button>
                </h2>
                <div id="eligibility" className="accordion-collapse collapse show">
                  <div className="accordion-body text-secondary small">
                    {giveaway.eligibility || 'Open to all verified platform members.'}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#terms">
                    Terms & Conditions
                  </button>
                </h2>
                <div id="terms" className="accordion-collapse collapse">
                  <div className="accordion-body text-secondary small">
                    {giveaway.terms || 'Standard VELOOP Rewards platform rules apply.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status, Join & Claim Widget */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
            <div className="mb-4">
              <span className="text-muted small fw-bold text-uppercase d-block mb-1">Giveaway Closes In</span>
              <Countdown secondsRemaining={giveaway.remainingTime || 86400 * 3} />
            </div>

            <div className="p-3 bg-light rounded-3 mb-4 border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-secondary small d-flex align-items-center gap-1">
                  <Users size={16} className="text-primary" /> Total Entries
                </span>
                <span className="fw-bold text-dark">{giveaway.participants || 0}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-secondary small d-flex align-items-center gap-1">
                  <Coins size={16} className="text-warning" /> Entry Cost
                </span>
                <span className="fw-bold text-primary">
                  {giveaway.entryAmount || 50} {giveaway.entryCurrency || 'VELOOP Points'}
                </span>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="alert alert-danger d-flex align-items-center gap-2 small mb-3" role="alert">
                <AlertCircle size={18} className="flex-shrink-0" />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Winner Announcement Banner */}
            {isWinner && (
              <div className="alert alert-warning p-3 rounded-3 mb-3 border-warning" role="alert">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Trophy size={22} className="text-warning" />
                  <strong className="text-dark">Congratulations! You Won.</strong>
                </div>
                <p className="small mb-3 text-secondary">
                  You have been selected as the winner for this reward event. Please submit your prize claim details.
                </p>

                {claimStatus ? (
                  <div className="badge bg-success w-100 py-2 fs-6">
                    <CheckCircle2 size={16} className="me-1 inline-block" /> Claim Status: {claimStatus}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-warning w-100 py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-2 shadow-sm"
                    onClick={() => setClaimModalOpen(true)}
                  >
                    <Award size={18} /> Claim Prize Now
                  </button>
                )}
              </div>
            )}

            {/* Success Participation Banner */}
            {(joinSuccess || (participated && !errorMessage && !isWinner)) && (
              <div className="alert alert-success p-3 rounded-3 mb-3" role="alert">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <CheckCircle2 size={20} className="text-success" />
                  <strong className="text-success">You're In!</strong>
                </div>
                <p className="small mb-0 text-success opacity-90">
                  Your entry ticket has been successfully recorded. The winner will be selected automatically when the countdown ends.
                </p>
              </div>
            )}

            {/* Join Action Button */}
            {!participated && !isWinner && (
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                onClick={handleJoinClick}
                disabled={joining || giveaway.status !== 'ACTIVE'}
              >
                {joining ? (
                  <span>Joining Giveaway...</span>
                ) : giveaway.status === 'ACTIVE' ? (
                  <>
                    <Gift size={20} /> {isAuthenticated ? 'Join Giveaway Now' : 'Sign In to Join Giveaway'}
                  </>
                ) : (
                  'Giveaway Concluded'
                )}
              </button>
            )}

            {participated && !isWinner && (
              <button
                type="button"
                className="btn btn-success btn-lg w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                disabled
              >
                <CheckCircle2 size={20} /> You Have Joined This Giveaway
              </button>
            )}

            <div className="text-center mt-3">
              <small className="text-muted">
                <Lock size={14} className="me-1" /> Verified Backend Winner System
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Claim Modal */}
      <PrizeClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        giveawayId={slug}
        prizeType={giveaway.prizeType || 'PHYSICAL'}
        giveawayTitle={giveaway.title || giveaway.name}
        onClaimSuccess={() => {
          setClaimStatus('SUBMITTED');
        }}
      />
    </div>
  );
};

export default GiveawayDetails;
