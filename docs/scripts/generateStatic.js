import {writeFileSync} from 'fs';
import HTML from "../src/backend";

writeFileSync("index.html", HTML);
console.log('Done!');
