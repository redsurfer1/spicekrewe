const DEFAULT_ENTERPRISE_EMAIL = 'enterprise@spicekrewe.com';

type Props = {
  /** Defaults to enterprise sales inbox. */
  talkEmail?: string;
};

/**
 * High-impact B2B strip for food brands and restaurant groups (Phase 3 conversion).
 */
export default function B2BBanner({ talkEmail = DEFAULT_ENTERPRISE_EMAIL }: Props) {
  const mailto = `mailto:${encodeURIComponent(talkEmail)}?subject=${encodeURIComponent('Spice Krewe — Teams / retainer inquiry')}`;

  return (
    <section
      style={{
        background: 'var(--sk-purple)',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--sk-fg-on-dark-muted)',
          }}
        >
          For food brands + restaurants
        </p>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#fff',
            letterSpacing: '-0.02em',
            maxWidth: 640,
          }}
        >
          On-demand culinary R&amp;D — without the headcount
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--sk-fg-on-dark)',
            maxWidth: 560,
          }}
        >
          Retainer access to Spice Krewe&apos;s full professional network. Starting at $1,000/mo.
        </p>
        <a
          href={mailto}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
            padding: '12px 22px',
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 'var(--sk-radius-md)',
            background: 'var(--sk-gold)',
            color: 'var(--sk-navy)',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Talk to us
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
