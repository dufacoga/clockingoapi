const express = require('express');
const bodyParser = require('body-parser');

const buildEntries = require('./modules/entries/interfaces/rest/build');
const entriesRoutes = require('./modules/entries/interfaces/rest/routes');

const buildExits = require('./modules/exits/interfaces/rest/build');
const exitsRoutes = require('./modules/exits/interfaces/rest/routes');

const buildLocations = require('./modules/locations/interfaces/rest/build');
const locationsRoutes = require('./modules/locations/interfaces/rest/routes');

const buildUsers = require('./modules/users/interfaces/rest/build');
const usersRoutes = require('./modules/users/interfaces/rest/routes');

const errorHandler = require('./shared/interfaces/rest/errorHandler');

const app = express();
app.use(bodyParser.json());

const entriesUC = buildEntries();
const exitsUC = buildExits();
entriesUC.setExitRepo(exitsUC.exitRepo);
const locationsUC = buildLocations();
const usersUC = buildUsers();

app.use('/entries', entriesRoutes(entriesUC));
app.use('/exits', exitsRoutes(exitsUC));
app.use('/locations', locationsRoutes(locationsUC));
app.use('/users', usersRoutes(usersUC));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`REST running on :${PORT}`));