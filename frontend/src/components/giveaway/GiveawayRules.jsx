import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert, CheckCircle, Clock, Gift, Lock } from 'lucide-react';
import styles from './GiveawayRules.module.css';

const rulesData = [
  {
    id: 'rule-1',
    title: '1. Account Eligibility Requirements',
    icon: <CheckCircle size={20} className="text-success me-2 inline-block" />,
    content: 'Participation is open to verified VELOOP Rewards account holders aged 18 years or older. Accounts must complete basic verification (email confirmation and anti-bot check) to qualify.'
  },
  {
    id: 'rule-2',
    title: '2. One Participation Per Giveaway',
    icon: <Lock size={20} className="text-primary me-2 inline-block" />,
    content: 'Each registered user is limited to a single valid entry per giveaway event. Creating duplicate accounts, using automated scripts, or attempting multiple entries will trigger automatic anti-fraud disqualification.'
  },
  {
    id: 'rule-3',
    title: '3. Transparent Winner Selection',
    icon: <Clock size={20} className="text-info me-2 inline-block" />,
    content: 'Winners are selected using a cryptographically random draw protocol immediately after the giveaway countdown expires. All drawings are logged on the VELOOP transparent ledger.'
  },
  {
    id: 'rule-4',
    title: '4. Claim Process & Notification',
    icon: <Gift size={20} className="text-warning me-2 inline-block" />,
    content: 'Selected winners receive an official email and dashboard notification. Winners must claim their prize within 7 calendar days by providing valid shipping or digital delivery information.'
  },
  {
    id: 'rule-5',
    title: '5. Regional Restrictions & Compliance',
    icon: <ShieldAlert size={20} className="text-danger me-2 inline-block" />,
    content: 'Prizes are dispatched globally where legal. If physical delivery is restricted by local customs, an equivalent digital voucher or alternative reward will be provided.'
  }
];

const GiveawayRules = () => {
  const [openId, setOpenId] = useState('rule-1');

  const toggleRule = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="rules" className="py-5 bg-white">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-5">
          <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 fw-semibold rounded-pill mb-2">
            Platform Governance
          </span>
          <h2 className="fw-bold display-6">Official Giveaway Rules</h2>
          <p className="text-secondary">
            Clear guidelines designed to ensure 100% fair participation for every user.
          </p>
        </div>

        <div className={styles.rulesAccordion}>
          {rulesData.map((rule) => {
            const isOpen = openId === rule.id;
            return (
              <div key={rule.id} className={styles.ruleItem}>
                <button
                  type="button"
                  className={styles.ruleHeader}
                  onClick={() => toggleRule(rule.id)}
                  aria-expanded={isOpen}
                >
                  <span className="d-flex align-items-center">
                    {rule.icon}
                    {rule.title}
                  </span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {isOpen && (
                  <div className={styles.ruleBody}>
                    {rule.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GiveawayRules;
