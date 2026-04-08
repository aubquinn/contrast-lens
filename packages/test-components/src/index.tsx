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
