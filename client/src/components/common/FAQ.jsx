import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import styles from './FAQ.module.css';

const faqList = [
  {
    id: 'faq-1',
    q: 'What is VELOOP Rewards?',
    a: 'VELOOP Rewards is an interactive promotional giveaway platform where members participate in reward events, complete platform activities, and earn entry tickets for electronics, gift vouchers, and premium gadgets.'
  },
  {
    id: 'faq-2',
    q: 'How do I participate?',
    a: 'Simply create a free account, complete daily eligible activities to collect VELOOP Points, browse active giveaways, and submit your points for giveaway entry tickets.'
  },
  {
    id: 'faq-3',
    q: 'What are entries?',
    a: 'Entries represent your digital tickets in a giveaway draw. Each entry ticket holds an equal probability during the automated random winner drawing.'
  },
  {
    id: 'faq-4',
    q: 'What happens after I join?',
    a: 'Your entry ticket is registered immediately. You can track the live countdown timer on the giveaway page while waiting for the drawing.'
  },
  {
    id: 'faq-5',
    q: 'How are winners selected?',
    a: 'Winners are chosen automatically using a cryptographically secure pseudo-random seed draw algorithm as soon as the countdown timer reaches zero.'
  },
  {
    id: 'faq-6',
    q: 'When are winners announced?',
    a: 'Winners are announced publicly within 1 hour after the giveaway countdown concludes and are published on the Winners page.'
  },
  {
    id: 'faq-7',
    q: 'How do I claim my prize?',
    a: 'If you win, an automated email and in-app banner will prompt you to complete the Prize Claim form. Physical items are shipped to your address, while digital gift cards are emailed directly.'
  },
  {
    id: 'faq-8',
    q: 'Can I participate in multiple giveaways?',
    a: 'Yes! Members can enter as many active giveaways as they wish, provided they have sufficient points and comply with the single-entry-per-account rule.'
  }
];

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState('faq-1');

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className={styles.faqSection}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="text-center mb-5">
          <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fw-semibold rounded-pill mb-2">
            <HelpCircle size={14} className="me-1 inline-block" /> Got Questions?
          </span>
          <h2 className="fw-bold display-6">Frequently Asked Questions</h2>
          <p className="text-secondary">
            Everything you need to know about VELOOP Rewards participation and claims.
          </p>
        </div>

        <div className={styles.accordionContainer}>
          {faqList.map((item) => {
            const isOpen = openFaq === item.id;
            return (
              <div key={item.id} className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`answer-${item.id}`}
                >
                  <span className="pe-3">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp size={20} className="text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-muted flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div id={`answer-${item.id}`} className={styles.faqAnswer} role="region">
                    {item.a}
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

export default FAQ;
