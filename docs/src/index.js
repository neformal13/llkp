import {ABNF} from 'llkp';

// let zipCode  = ABNF('5DIGIT ["-" 4DIGIT]');
// let state    = ABNF('2ALPHA');
// let townName = ABNF('1*(ALPHA / SP)');
// let zipPart = ABNF(
//     'townName "," SP state 1*2SP zipCode [LF]',
//     {
//         townName,
//         state,
//         zipCode
//     });
//
// let streetName = ABNF('1*VCHAR');
// let houseNum = ABNF ('1*8(DIGIT / ALPHA)');
// let apt = ABNF('1*4DIGIT');
// let street  = ABNF(
//     '[apt SP] houseNum SP streetName LF',
//     {
//         apt,
//         houseNum,
//         streetName
//     });
// let suffix = ABNF('("Jr." / "Sr." / 1*("I" / "V" / "X"))');
// let lastName = ABNF('*ALPHA');
// let initial = ABNF('ALPHA');
// let firstName = ABNF('*ALPHA');
// let personalPart = ABNF('firstName / (initial ".")', {firstName, initial});
// let namePart = ABNF('(*(personalPart SP) lastName [SP suffix] LF) / (personalPart LF)', {personalPart, lastName, suffix});
// let postalAddress = ABNF(`namePart street zipPart`, {zipPart, street, namePart});
//
// document.forms[0].addEventListener(
//     "submit",
//     (ev)=> {
//         ev.stopPropagation();
//         ev.preventDefault();
//
//         let form = document.forms[0];
//         let text = form.elements["input"].value;
//
//         console.log(text);
//         console.log(postalAddress.exec(text));
//     }
// );