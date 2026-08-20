import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, CheckCheck, Send, ExternalLink, Sparkles } from 'lucide-react';

export default function WhatsAppModal() {
  const { whatsappPreview, closeWhatsApp, org } = useApp();

  if (!whatsappPreview) return null;

  const { type, data, timestamp } = whatsappPreview;

  let headerTitle = 'WhatsApp Automation Hub';
  let messageContent = '';

  if (type === 'booking_confirm') {
    headerTitle = '2-Way Slot Confirmation Bot';
    messageContent = `*${org.name}* ✨\n\nHi *${data.customer_name || 'Valued Client'}*! Your appointment for *${data.service_name}* with stylist *${data.staff_name}* is confirmed for *${data.start_time}* today.\n\n📍 *Location*: ${org.address}, ${org.city}\n🎟️ *Token*: #${data.id || 'T-101'}\n\n*Interactive Reply:*\n👉 Reply *1* to Confirm Arrival\n👉 Reply *2* to Reschedule`;
  } else if (type === 'invoice_receipt') {
    headerTitle = 'Digital PDF Receipt Dispatch';
    messageContent = `*${org.name}* 🧾\n\nThank you for visiting us, *${data.customer_name}*!\n\n📄 *Invoice*: ${data.invoice_number}\n💰 *Total Paid*: ${org.currency}${data.total_amount}\n💳 *Payment*: ${data.payment_method}\n🌟 *Loyalty Earned*: +${Math.round(data.total_amount / 100)} pts\n\n📥 Download Official Tax PDF: https://salonos.app/inv/${data.invoice_number}\n\nRate your stylist experience: ⭐⭐⭐⭐⭐`;
  } else if (type === 'reengagement') {
    headerTitle = 'Predictive Re-Booking Trigger';
    messageContent = `*${org.name}* 💇‍♂️\n\nHey *${data.customer_name}*, it has been 25 days since your last hair sculpt! Ready for a quick refresh?\n\n🎁 *Special VIP Deal*: Get flat 15% OFF this Tuesday–Thursday (12 PM - 4 PM).\n\nTap here to reserve your favorite chair: https://salonos.app/${org.slug}/book`;
  } else {
    headerTitle = 'WhatsApp Notification';
    messageContent = `*${org.name}*\n\n${data.message || 'Notification from SalonOS'}`;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={closeWhatsApp}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#0b141a',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(37, 211, 102, 0.25)',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Header */}
        <div
          style={{
            background: '#202c33',
            padding: '0.875rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#25d366',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
            >
              <MessageSquare size={20} fill="#000" />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#e9edef' }}>
                {org.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#25d366', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#25d366', display: 'inline-block' }}></span>
                SalonOS WhatsApp Cloud API (Verified)
              </div>
            </div>
          </div>
          <button
            onClick={closeWhatsApp}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8696a0',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div
          style={{
            background: '#0b141a',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            padding: '1.25rem 1rem',
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          {/* Security Banner */}
          <div
            style={{
              alignSelf: 'center',
              background: '#182229',
              color: '#ffd279',
              fontSize: '0.7rem',
              padding: '4px 10px',
              borderRadius: '6px',
              textAlign: 'center',
              marginBottom: '1rem',
              maxWidth: '85%',
            }}
          >
            🔒 Messages are end-to-end encrypted with SalonOS Multi-Tenant Gateway.
          </div>

          {/* Incoming Message Bubble */}
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#202c33',
              color: '#e9edef',
              padding: '0.75rem 1rem',
              borderRadius: '0 12px 12px 12px',
              maxWidth: '90%',
              fontSize: '0.85rem',
              lineHeight: '1.45',
              whiteSpace: 'pre-line',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            {messageContent}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '4px',
                marginTop: '6px',
                fontSize: '0.6875rem',
                color: '#8696a0',
              }}
            >
              <span>{timestamp || 'Just now'}</span>
              <CheckCheck size={14} color="#53bdeb" />
            </div>
          </div>
        </div>

        {/* Footer / Interactive Actions */}
        <div
          style={{
            background: '#202c33',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={closeWhatsApp}
              className="btn btn-sm btn-primary"
              style={{ flex: 1, background: '#25d366', color: '#000', fontWeight: '700', border: 'none' }}
            >
              Simulate Customer Reply "1 (Confirm)"
            </button>
            <button
              onClick={closeWhatsApp}
              className="btn btn-sm btn-secondary"
              style={{ color: '#e9edef' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
