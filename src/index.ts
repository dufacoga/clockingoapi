import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import apiKeyAuth from './shared/interfaces/rest/apiKeyAuth';
import errorHandler from './shared/interfaces/rest/errorHandler';

import buildEntries from './modules/entries/interfaces/rest/EntryBuild';
import entriesRoutes from './modules/entries/interfaces/rest/EntryRoutes';

import buildExits from './modules/exits/interfaces/rest/ExitBuild';
import exitsRoutes from './modules/exits/interfaces/rest/ExitRoutes';

import buildLocations from './modules/locations/interfaces/rest/LocationBuild';
import locationsRoutes from './modules/locations/interfaces/rest/LocationRoutes';

import buildUsers from './modules/users/interfaces/rest/UserBuild';
import usersRoutes from './modules/users/interfaces/rest/UserRoutes';

import { swaggerUi, specs, uiOptions } from './shared/interfaces/swagger';

const app = express();
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET','POST','PATCH','DELETE'] }));
app.use(bodyParser.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, uiOptions));

app.use(apiKeyAuth);

const locationsUC = buildLocations();
const usersUC = buildUsers();
const entriesUC = buildEntries({
  userRepo: usersUC.userRepo,
  locationRepo: locationsUC.locationRepo,
});
const exitsUC = buildExits();

app.use('/entries', entriesRoutes(entriesUC));
app.use('/exits', exitsRoutes(exitsUC));
app.use('/locations', locationsRoutes(locationsUC));
app.use('/users', usersRoutes(usersUC));

app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`REST running on :${PORT}`));

export default app;