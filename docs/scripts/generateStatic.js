const {writeFileSync} = require('fs');
const HTML = require("../build/backend").default;

writeFileSync("index.html", HTML);

console.log('Done!');
