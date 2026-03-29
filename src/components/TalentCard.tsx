import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TalentRecord } from '../types/talentRecord';

type Props = { professional: TalentRecord };

export default function TalentCard({ professional: p }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/talent/${p.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${hovered ? 'var(--sk-purple)' : 'var(--sk-card-border)'}`,
          borderRadius: 'var(--sk-radius-lg)',
          background: '#fff',
          padding: 20,
          boxShadow: hovered ? '0 8px 24px rgba(77, 47, 145, 0.08)' : '0 2px 8px rgba(26, 26, 46, 0.06)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 'var(--sk-radius-md)',
              background: p.avatarColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              flexShrink: 0,
            }}
            aria-hidden
          >
            {p.avatarText}
          </div>
          {p.verified ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: 'var(--sk-gold)',
                background: 'rgba(230, 168, 0, 0.14)',
                border: '1px solid rgba(230, 168, 0, 0.35)',
                padding: '4px 8px',
                borderRadius: 'var(--sk-radius-pill)',
                whiteSpace: 'nowrap',
              }}
            >
              SK Verified
            </span>
          ) : null}
        </div>

        <header style={{ marginBottom: 8 }}>
          <h3
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: 'var(--sk-navy)',
              margin: '0 0 4px 0',
              lineHeight: 1.25,
            }}
          >
            {p.name}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--sk-purple)', fontWeight: 500 }}>{p.role}</p>
        </header>

        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: 13,
            color: '#5c5470',
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {p.specialty}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--sk-navy)' }}>{p.rate}</span>
          <span style={{ fontSize: 13, color: '#6b5a88' }}>
            <span style={{ color: 'var(--sk-gold)' }} aria-hidden>
              ★
            </span>{' '}
            {p.rating.toFixed(1)} <span style={{ color: '#a8a0b8' }}>({p.reviews})</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {p.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 'var(--sk-radius-pill)',
                border: '1px solid rgba(77, 47, 145, 0.2)',
                color: 'var(--sk-purple)',
                background: 'var(--sk-purple-light)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: 11, color: p.available ? '#2d6a4f' : '#9a6b2e', fontWeight: 600 }}>
          {p.available ? 'Available for projects' : 'Currently booked'}
        </p>
      </article>
    </Link>
  );
}
