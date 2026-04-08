import React from 'react';
import { GoodButton, BadButtonNoBorder, BadCustomButton, GoodInputButton, BadInputButtonNoBorder } from './index';

export const TestComponents: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Contrast Lens Test Components</h1>
    <p>These components are designed to test accessibility rules:</p>

    <h2>Good Buttons (Should Pass)</h2>
    <GoodButton onClick={() => alert('Good button clicked!')}>Good Button</GoodButton>
    <br /><br />
    <GoodInputButton value="Good Input Button" onClick={() => alert('Good input button clicked!')} />

    <h2>Bad Buttons (Should Fail)</h2>
    <BadButtonNoBorder onClick={() => alert('Bad button clicked!')}>Bad Button (No Border)</BadButtonNoBorder>
    <br /><br />
    <BadCustomButton onClick={() => alert('Bad custom button clicked!')}>Bad Custom Button (role="button")</BadCustomButton>
    <br /><br />
    <BadInputButtonNoBorder value="Bad Input Button (No Border)" onClick={() => alert('Bad input button clicked!')} />
  </div>
);

export default TestComponents;
