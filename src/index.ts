import 'dotenv/config';
import express from 'express';
import cors, { CorsOptions } from 'cors';
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

import buildRole from './modules/users/interfaces/rest/RoleBuild';
import roleRoutes from './modules/users/interfaces/rest/RoleRoutes';

import buildUsers from './modules/users/interfaces/rest/UserBuild';
import usersRoutes from './modules/users/interfaces/rest/UserRoutes';

import healthRoutes from './shared/interfaces/rest/healthRoutes';

import { swaggerUi, specs, uiOptions } from './shared/interfaces/swagger';

const app = express();
app.use(helmet());
const rawAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
const allowedOrigins = rawAllowedOrigins
  ? rawAllowedOrigins.split(',').map((origin) => origin.trim()).filter(Boolean)
  : '*';

const allowedHeaders = ['Content-Type', 'X-API-Key', 'Authorization'];
const allowCredentials = process.env.CORS_ALLOW_CREDENTIALS === 'true';

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders,
  credentials: allowCredentials,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, uiOptions));

app.use(apiKeyAuth);

const usersUC = buildUsers();
const locationsUC = buildLocations({ userRepo: usersUC.userRepo });
const rolesUC = buildRole();
const entriesUC = buildEntries({
  userRepo: usersUC.userRepo,
  locationRepo: locationsUC.locationRepo,
});
const exitsUC = buildExits({
  userRepo: usersUC.userRepo,
  locationRepo: locationsUC.locationRepo,
  entryRepo: entriesUC.entryRepo,
});

entriesUC.setExitRepo(exitsUC.exitRepo);

app.use('/entries', entriesRoutes(entriesUC));
app.use('/exits', exitsRoutes(exitsUC));
app.use('/locations', locationsRoutes(locationsUC));
app.use('/roles', roleRoutes(rolesUC));
app.use('/users', usersRoutes(usersUC));
app.use(healthRoutes());

app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => console.log(`REST running on :${PORT}`));

export default app;