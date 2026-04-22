import React from 'react';
import { GoodButton, BadButtonNoBorder, BadCustomButton, GoodInputButton, BadInputButtonNoBorder, DefaultBrowserButton, GoodButtonWithShadow, BadButtonWithShadow, BadButtonDotted, BadButtonDashed, BadButtonDouble, BadButtonGroove, BadButtonRidge, BadButtonInset, BadButtonOutset, BadButtonHidden } from './index';

export const TestComponents: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Contrast Lens Test Components</h1>
    <p>These components are designed to test accessibility rules:</p>

    <h2>Good Buttons (Should Pass)</h2>
    <GoodButton onClick={() => alert('Good button clicked!')}>Good Button</GoodButton>
    <br /><br />
    <DefaultBrowserButton onClick={() => alert('Default browser button clicked!')}>Default Browser Button</DefaultBrowserButton>
    <br /><br />
    <GoodButtonWithShadow onClick={() => alert('Good button with shadow clicked!')}>Good Button with Shadow</GoodButtonWithShadow>
    <br /><br />
    <GoodInputButton value="Good Input Button" onClick={() => alert('Good input button clicked!')} />

    <h2>Bad Buttons (Should Fail)</h2>
    <BadButtonNoBorder onClick={() => alert('Bad button clicked!')}>Bad Button (No Border)</BadButtonNoBorder>
    <br /><br />
    <BadButtonWithShadow onClick={() => alert('Bad button with shadow clicked!')}>Bad Button with Shadow</BadButtonWithShadow>
    <br /><br />
    <BadButtonDotted onClick={() => alert('Bad button dotted clicked!')}>Bad Button Dotted</BadButtonDotted>
    <br /><br />
    <BadButtonDashed onClick={() => alert('Bad button dashed clicked!')}>Bad Button Dashed</BadButtonDashed>
    <br /><br />
    <BadButtonDouble onClick={() => alert('Bad button double clicked!')}>Bad Button Double</BadButtonDouble>
    <br /><br />
    <BadButtonGroove onClick={() => alert('Bad button groove clicked!')}>Bad Button Groove</BadButtonGroove>
    <br /><br />
    <BadButtonRidge onClick={() => alert('Bad button ridge clicked!')}>Bad Button Ridge</BadButtonRidge>
    <br /><br />
    <BadButtonInset onClick={() => alert('Bad button inset clicked!')}>Bad Button Inset</BadButtonInset>
    <br /><br />
    <BadButtonOutset onClick={() => alert('Bad button outset clicked!')}>Bad Button Outset</BadButtonOutset>
    <br /><br />
    <BadButtonHidden onClick={() => alert('Bad button hidden clicked!')}>Bad Button Hidden</BadButtonHidden>
    <br /><br />
    <BadCustomButton onClick={() => alert('Bad custom button clicked!')}>Bad Custom Button (role="button")</BadCustomButton>
    <br /><br />
    <BadInputButtonNoBorder value="Bad Input Button (No Border)" onClick={() => alert('Bad input button clicked!')} />
  </div>
);

export default TestComponents;
