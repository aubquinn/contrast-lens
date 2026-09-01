import React from 'react';

export const GoodButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px solid #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const DefaultBrowserButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => <button onClick={onClick}>{children}</button>;

export const GoodButtonWithShadow: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            boxShadow: '0 0 0 2px #000',
            backgroundColor: 'transparent',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonWithShadow: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: 'none',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonDotted: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px dotted #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonDashed: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px dashed #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonDouble: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '4px double #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonGroove: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px groove #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonRidge: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px ridge #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonInset: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px inset #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonOutset: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px outset #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonHidden: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px hidden',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadButtonNoBorder: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <button
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
);

export const BadCustomButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
    children,
    onClick,
}) => (
    <div
        role="button"
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px solid #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
            display: 'inline-block',
        }}
        tabIndex={0}
    >
        {children}
    </div>
);

export const GoodInputButton: React.FC<{ value: string; onClick?: () => void }> = ({ value, onClick }) => (
    <input
        type="button"
        value={value}
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: '2px solid #000',
            backgroundColor: '#fff',
            cursor: 'pointer',
        }}
    />
);

export const BadInputButtonNoBorder: React.FC<{ value: string; onClick?: () => void }> = ({ value, onClick }) => (
    <input
        type="button"
        value={value}
        onClick={onClick}
        style={{
            padding: '8px 16px',
            border: 'none',
            backgroundColor: '#28a745',
            color: '#fff',
            cursor: 'pointer',
        }}
    />
);

type StateButtonProps = {
    children: React.ReactNode;
    className: string;
    disabled?: boolean;
    ariaDisabled?: boolean;
};

const StateButton: React.FC<StateButtonProps> = ({ children, className, disabled, ariaDisabled }) => (
    <button
        className={className}
        disabled={disabled}
        aria-disabled={ariaDisabled || undefined}
        style={{
            padding: '8px 16px',
            border: '2px solid transparent',
            backgroundColor: '#fff',
            cursor: disabled ? 'not-allowed' : 'pointer',
        }}
    >
        {children}
    </button>
);

export const GoodButtonInteractionStates: React.FC = () => (
    <>
        <style>{`
      .good-button-states:hover,
      .good-button-states:active {
        border-color: Highlight;
      }
      .good-button-states:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: 2px;
      }
      .good-button-states:disabled {
        border-color: GrayText;
        color: GrayText;
      }
    `}</style>
        <StateButton className="good-button-states">Safe interaction states</StateButton>
    </>
);

export const BadButtonHoverNoBorder: React.FC = () => (
    <>
        <style>{`.bad-button-hover:hover { border: none; }`}</style>
        <StateButton className="bad-button-hover">Border removed on hover</StateButton>
    </>
);

export const BadButtonActiveNoBorder: React.FC = () => (
    <>
        <style>{`.bad-button-active:active { border-width: 0; }`}</style>
        <StateButton className="bad-button-active">Border removed while active</StateButton>
    </>
);

export const BadButtonFocusNoBorder: React.FC = () => (
    <>
        <style>{`.bad-button-focus:focus { border-style: none; }`}</style>
        <StateButton className="bad-button-focus">Border removed on focus</StateButton>
    </>
);

export const BadButtonFocusVisibleNoBorder: React.FC = () => (
    <>
        <style>{`.bad-button-focus-visible:focus-visible { border: 0; }`}</style>
        <StateButton className="bad-button-focus-visible">Border removed on focus-visible</StateButton>
    </>
);

export const BadButtonDisabledNoBorder: React.FC = () => (
    <>
        <style>{`.bad-button-disabled:disabled { border: none; }`}</style>
        <StateButton className="bad-button-disabled" disabled>
            Border removed when disabled
        </StateButton>
    </>
);

export const BadButtonAriaDisabledNoBorder: React.FC = () => (
    <>
        <style>{`.bad-button-aria-disabled[aria-disabled='true'] { border: none; }`}</style>
        <StateButton className="bad-button-aria-disabled" ariaDisabled>
            Border removed when aria-disabled
        </StateButton>
    </>
);
