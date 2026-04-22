import React from 'react';

export const GoodButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px solid #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const DefaultBrowserButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button onClick={onClick}>
    {children}
  </button>
);

export const GoodButtonWithShadow: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      boxShadow: '0 0 0 2px #000',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonWithShadow: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: 'none',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonDotted: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px dotted #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonDashed: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px dashed #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonDouble: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '4px double #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonGroove: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px groove #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonRidge: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px ridge #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonInset: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px inset #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonOutset: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px outset #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonHidden: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px hidden',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadButtonNoBorder: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);

export const BadCustomButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick
}) => (
  <div
    role="button"
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px solid #000',
      backgroundColor: '#fff',
      cursor: 'pointer',
      display: 'inline-block'
    }}
    tabIndex={0}
  >
    {children}
  </div>
);

export const GoodInputButton: React.FC<{ value: string; onClick?: () => void }> = ({
  value,
  onClick
}) => (
  <input
    type="button"
    value={value}
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: '2px solid #000',
      backgroundColor: '#fff',
      cursor: 'pointer'
    }}
  />
);

export const BadInputButtonNoBorder: React.FC<{ value: string; onClick?: () => void }> = ({
  value,
  onClick
}) => (
  <input
    type="button"
    value={value}
    onClick={onClick}
    style={{
      padding: '8px 16px',
      border: 'none',
      backgroundColor: '#28a745',
      color: '#fff',
      cursor: 'pointer'
    }}
  />
);
