global.__basedir = __dirname;
/**
    I know what you're thinking: oh no a global! 😫
    And I would normally agree, but I think this technique is a fair exception.
    Here's why:
    *   There really isn't a consistent way to references the base dir without it.
    *   It's a fair requirement to set if you're worried about reusing modules.
    *   It's a lot easier and more stable than using ../../../file.js all the time.
    *   It shares the same naming convention as __dirname and __filename.
 **/
const express = require('express');
const routes = require('./routes/appRoutes.js');

const PORT = 3000;
const app = express();

app.use(routes);
app.listen(PORT, () => console.log('Ready for import'));