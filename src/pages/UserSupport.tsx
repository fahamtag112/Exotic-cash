import { useState } from 'react';
import '../styles/UserPages.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function UserSupport() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'How do I deposit funds?',
      answer: 'You can deposit funds by clicking the Deposit button on your dashboard. We accept bank transfers, credit/debit cards, and cryptocurrency.',
    },
    {
      id: 2,
      question: 'What are the withdrawal limits?',
      answer: 'Minimum withdrawal is $10 and maximum is $100,000 per transaction. Daily withdrawal limit is $500,000.',
    },
    {
      id: 3,
      question: 'How long do withdrawals take?',
      answer: 'Most withdrawals are processed within 1-3 business days. Bank holidays may affect processing times.',
    },
    {
      id: 4,
      question: 'Is my account secure?',
      answer: 'Yes! We use SSL encryption, 2FA authentication, and comply with all security standards.',
    },
    {
      id: 5,
      question: 'Can I transfer to another user?',
      answer: 'Yes, you can transfer funds to other users. Just enter their username and amount on the Transfer page.',
    },
    {
      id: 6,
      question: 'What fees do you charge?',
      answer: 'We charge a 2.5% processing fee on withdrawals. Deposits and transfers between users are free.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! Our support team will respond within 24 hours.');
    setMessage('');
  };

  return (
    <div className="user-page">
      <header className="user-header">
        <div className="user-header-content">
          <h1>💬 Support & Help</h1>
          <div className="user-info">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="user-page-container">
        <main className="user-page-main">
          <section className="page-section">
            <div className="support-container">
              <div className="quick-contact">
                <h2>📞 Quick Contact</h2>
                <div className="contact-cards">
                  <div className="contact-card">
                    <div className="icon">📧</div>
                    <h4>Email</h4>
                    <p>support@exoticcash.com</p>
                    <p className="response-time">Usually responds in 24 hours</p>
                  </div>
                  <div className="contact-card">
                    <div className="icon">💬</div>
                    <h4>Live Chat</h4>
                    <p>Available 9 AM - 5 PM EST</p>
                    <button className="start-chat">Start Chat</button>
                  </div>
                  <div className="contact-card">
                    <div className="icon">📱</div>
                    <h4>Phone</h4>
                    <p>+1 (800) 555-0123</p>
                    <p className="response-time">Mon-Fri, 9 AM - 5 PM EST</p>
                  </div>
                </div>
              </div>

              <div className="contact-form-section">
                <h2>✉️ Send us a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Subject</label>
                    <select required>
                      <option>Select a subject</option>
                      <option>Account Issues</option>
                      <option>Deposit/Withdrawal</option>
                      <option>Security Concerns</option>
                      <option>Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      rows={5}
                      placeholder="Describe your issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn">Send Message</button>
                </form>
              </div>

              <div className="faq-section">
                <h2>❓ Frequently Asked Questions</h2>
                <div className="faq-list">
                  {faqs.map(faq => (
                    <div key={faq.id} className="faq-item">
                      <div
                        className="faq-question"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <span>{faq.question}</span>
                        <span className="toggle-icon">{expandedFAQ === faq.id ? '▼' : '▶'}</span>
                      </div>
                      {expandedFAQ === faq.id && (
                        <div className="faq-answer">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="resources-section">
                <h2>📚 Additional Resources</h2>
                <ul className="resource-list">
                  <li><a href="#">Getting Started Guide</a></li>
                  <li><a href="#">How to Deposit</a></li>
                  <li><a href="#">How to Withdraw</a></li>
                  <li><a href="#">Security Best Practices</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
