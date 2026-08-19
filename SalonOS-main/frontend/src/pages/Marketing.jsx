import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Send, CheckCircle2, Sparkles, Gift, Clock, Receipt, Smartphone } from 'lucide-react';

export default function Marketing() {
  const { org, customers, addToast } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState('reminder');
  const [targetPhone, setTargetPhone] = useState('+91 98765 11223');
  const [clientName, setClientName] = useState('Neha Kapoor');
  const [promoCode, setPromoCode] = useState('FESTIVE20');

  const templates = [
    {
      id: 'reminder',
      name: 'Appointment Reminder (24h Prior)',
      icon: Clock,
      type: 'Transactional',
      text: (name) => `Hello ${name}! ✨ This is a friendly reminder for your appointment at *${org.name}* tomorrow at 10:30 AM with Stylist Aarav. Reply *CONFIRM* to secure or *RESCHEDULE* if needed. See you soon! ✂️`,
    },
    {
      id: 'invoice',
      name: 'Digital Invoice & Review Request',
      icon: Receipt,
      type: 'Billing',
      text: (name) => `Dear ${name}, thank you for visiting *${org.name}* today! 🌟 Your total invoice of ₹4,810 has been processed. View your e-receipt here: https://salonos.app/inv/1001. We would love your rating! ⭐⭐⭐⭐⭐`,
    },
    {
      id: 'birthday',
      name: 'Birthday Special Pamper Offer',
      icon: Gift,
      type: 'Retention',
      text: (name) => `Happy Birthday ${name}! 🎂🎉 The team at *${org.name}* wishes you a fabulous day! Enjoy an exclusive *25% OFF* on all luxury hair & spa treatments this birthday week. Use code: *BDAY25*. 💆‍♀️✨`,
    },
    {
      id: 'festival',
      name: 'Festival Festive Glam Promo',
      icon: Sparkles,
      type: 'Marketing',
      text: (name) => `Get Festive Ready with *${org.name}*! 🪔 Exclusive festive bridal and hair packages available this week with a complimentary Diamond Glow Facial. Book now: ${org.phone} or reply *BOOK*.`,
    },
  ];

  const activeTpl = templates.find((t) => t.id === selectedTemplate) || templates[0];
  const renderedMessage = activeTpl.text(clientName);

  const handleSimulateSend = () => {
    addToast(`WhatsApp message simulated & queued for ${targetPhone}!`);
  };

  const handleOpenWhatsAppWeb = () => {
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(renderedMessage);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>WhatsApp Marketing & Automation Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Automated appointment alerts, digital receipts, birthday wishes, and festival campaigns.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Template Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Choose Campaign Template</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = selectedTemplate === tpl.id;

              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`glass-card ${isSelected ? 'glass-card-interactive' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? 'var(--accent-gold)' : 'var(--text-muted)',
                    }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{tpl.name}</div>
                      <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>{tpl.type}</span>
                    </div>
                  </div>

                  {isSelected && <CheckCircle2 size={20} color="var(--accent-gold)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live WhatsApp Preview Phone */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={20} color="var(--color-success)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Live WhatsApp Simulator</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Mobile Number</label>
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* WhatsApp Chat Bubble UI */}
          <div style={{
            background: '#0b141a',
            border: '1px solid #222d34',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
            <div style={{
              background: '#005c4b',
              color: '#e9edef',
              padding: '0.875rem 1rem',
              borderRadius: '8px 8px 0px 8px',
              maxWidth: '85%',
              alignSelf: 'flex-end',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
              position: 'relative',
            }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{renderedMessage}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textAlign: 'right', marginTop: '0.25rem' }}>
                10:32 AM • ✓✓
              </div>
            </div>
          </div>

          {/* Trigger Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSimulateSend} className="btn btn-secondary" style={{ flex: 1 }}>
              <Send size={16} />
              <span>Simulate API Trigger</span>
            </button>
            <button onClick={handleOpenWhatsAppWeb} className="btn btn-primary" style={{ flex: 1 }}>
              <MessageSquare size={16} />
              <span>Open in WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
