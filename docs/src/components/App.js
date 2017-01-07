import React from 'react';
import Highlight from "react-highlight";
import 'highlight.js/styles/solarized-light.css';

const code =
`import {ABNF} from 'llkp';

const zipCode       = ABNF(\`5DIGIT ["-" 4DIGIT]\`);
const state         = ABNF('2ALPHA');
const townName      = ABNF('1*(ALPHA / SP)');
const zipPart       = ABNF(
    'townName "," SP state 1*2SP zipCode [LF]',
    { townName, state, zipCode});

const streetName    = ABNF('1*VCHAR');
const houseNum      = ABNF ('1*8(DIGIT / ALPHA)');
const apt           = ABNF('1*4DIGIT');
const street        = ABNF(
    '[apt SP] houseNum SP streetName LF',
    {apt, houseNum, streetName});
    
const suffix        = ABNF('("Jr." / "Sr." / 1*("I" / "V" / "X"))');
const lastName      = ABNF('*ALPHA');
const initial       = ABNF('ALPHA');
const firstName     = ABNF('*ALPHA');
const personalPart  = ABNF('firstName / (initial ".")', {firstName, initial});
const namePart      = ABNF(
    '(*(personalPart SP) lastName [SP suffix] LF) / (personalPart LF)',
     {personalPart, lastName, suffix});
     
const postalAddress = ABNF('namePart street zipPart', {zipPart, street, namePart});

const text = 
\`John Dou
1234 123A Oak
Vancouver, BC 12345-1234\`

console.log(postalAddress.exec(text), postalAddress);
`;

const App = () => (
    <article>
        <h2>Example</h2>
        <p>The postal address example given in the augmented Backus–Naur form (ABNF) page may be specified as follows:</p>
        <Highlight>{code}</Highlight>
    </article>

);

export default App;