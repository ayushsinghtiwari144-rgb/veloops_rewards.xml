import React from 'react';
import { UserPlus, CheckCircle2, Ticket, Trophy } from 'lucide-react';
import styles from './HowToParticipate.module.css';

const steps = [
  {
    number: '01',
    title: 'Sign Up / Login',
    description: 'Create your free VELOOP Rewards account or log in to manage your points and entries.',
    icon: <UserPlus size={24} />
  },
  {
    number: '02',
    title: 'Complete Eligible Activities',
    description: 'Participate in daily check-ins, platform challenges, or community tasks to unlock rewards.',
    icon: <CheckCircle2 size={24} />
  },
  {
    number: '03',
    title: 'Earn Entries',
    description: 'Redeem earned VELOOP Points for official giveaway entry tickets.',
    icon: <Ticket size={24} />
  },
  {
    number: '04',
    title: 'Participate & Wait for Winner',
    description: 'Submit your entry tickets before countdown ends and track live automated winner draws.',
    icon: <Trophy size={24} />
  }
];

const HowToParticipate = () => {
  return (
    <section id="how-it-works" className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold rounded-pill mb-2">
            Simple 4-Step Process
          </span>
          <h2 className="fw-bold display-6">How To Participate</h2>
          <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            Joining VELOOP Rewards giveaways is transparent, secure, and straightforward.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((step) => (
            <div key={step.number} className="col-md-6 col-lg-3">
              <div className={styles.stepCard}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className={styles.stepNumber}>{step.number}</div>
                  <div className="text-primary opacity-75">{step.icon}</div>
                </div>
                <h5 className={styles.stepTitle}>{step.title}</h5>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToParticipate;
