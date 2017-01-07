import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';

import Head from './components/Head';
import App from './components/App';

const headString = renderToStaticMarkup(<Head/>);
const appString = renderToString(<App/>);

const html = `<!doctype html>
<html lang="en">
  ${headString}
<body>
  <div id="appRoot">${appString}</div>
  <script src="build/frontend.js"></script>
</body>
</html>`;

export default html;