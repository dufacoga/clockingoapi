import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const SERVER_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'ClockInGo — API Tester',
      version: '1.0.0',
      description:
        'Swagger UI para **probar** endpoints de Users, Locations, Entries, Exits y Roles.\n' +
        'Usa el candado Authorize y coloca tu `x-api-key` para empezar.',
    },
    servers: [
      { url: SERVER_URL, description: 'Default Server' },
      { url: 'http://localhost:3000', description: 'Local Dev' },
    ],
    tags: [
      { name: 'Users', description: 'Módulo Users' },
      { name: 'Locations', description: 'Módulo Locations' },
      { name: 'Entries', description: 'Módulo Entries' },
      { name: 'Exits', description: 'Módulo Exits' },
      { name: 'Roles', description: 'Módulo Roles' } // ← NUEVO
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
      },
      requestBodies: {
        CreateUser: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                Name: 'Douglas Cortes',
                Username: 'douglas',
                AuthToken: 'tok_abcdef123456',
                RoleId: 1,
                Phone: '+1-415-555-0000',
              },
            },
          },
        },
        UpdateUser: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { Name: 'Douglas C.', RoleId: 2 },
            },
          },
        },
        CreateLocation: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                Code: 'SF-HQ',
                Address: '1 Market St',
                City: 'San Francisco',
                CreatedBy: 1,
                IsCompanyOffice: true,
              },
            },
          },
        },
        UpdateLocation: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { Address: '2 Market St', City: 'San Francisco' },
            },
          },
        },
        CreateEntry: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                UserId: 1,
                LocationId: 10,
                EntryTime: '2025-09-25T10:30:00Z',
                DeviceId: 'ios-iphone-15',
              },
            },
          },
        },
        UpdateEntry: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { IsSynced: true },
            },
          },
        },
        CreateExit: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                UserId: 1,
                LocationId: 10,
                ExitTime: '2025-09-25T18:00:00Z',
                EntryId: 39,
                Result: 'OK',
                ReviewedByAdmin: false,
              },
            },
          },
        },
        UpdateExit: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: { ReviewedByAdmin: true, Result: 'OK' },
            },
          },
        }
        // Nota: Roles no requiere requestBodies porque solo exponemos GETs
      },
    },
    security: [{ ApiKeyAuth: [] }],

    paths: {
      // ===== USERS =====
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Listar usuarios',
          description: 'Devuelve `{ items, page, pageSize, total }`. Solo registros con `IsDeleted=0`.',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'pageSize', schema: { type: 'integer', example: 50 } },
          ],
          responses: { '200': { description: 'OK' } },
        },
        post: {
          tags: ['Users'],
          summary: 'Crear usuario',
          requestBody: { $ref: '#/components/requestBodies/CreateUser' },
          responses: { '201': { description: 'Creado' } },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Obtener usuario por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 1 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
        patch: {
          tags: ['Users'],
          summary: 'Actualizar usuario (parcial)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 1 } }],
          requestBody: { $ref: '#/components/requestBodies/UpdateUser' },
          responses: { '200': { description: 'OK' } },
        },
        delete: {
          tags: ['Users'],
          summary: 'Soft delete usuario',
          description: 'Marca `IsDeleted=1` (no elimina físicamente).',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 1 } }],
          responses: { '204': { description: 'Sin contenido (soft-deleted)' }, '404': { description: 'No encontrado' } },
        },
      },
      '/users/username/{username}': {
        get: {
          tags: ['Users'],
          summary: 'Obtener usuario por Username',
          parameters: [{ in: 'path', name: 'username', required: true, schema: { type: 'string', example: 'douglas' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
      },

      // ===== LOCATIONS =====
      '/locations': {
        get: {
          tags: ['Locations'],
          summary: 'Listar locations',
          description: 'Devuelve `{ items, page, pageSize, total }`. Solo registros con `IsDeleted=0`.',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'pageSize', schema: { type: 'integer', example: 50 } },
          ],
          responses: { '200': { description: 'OK' } },
        },
        post: {
          tags: ['Locations'],
          summary: 'Crear location',
          requestBody: { $ref: '#/components/requestBodies/CreateLocation' },
          responses: { '201': { description: 'Creado' } },
        },
      },
      '/locations/{id}': {
        get: {
          tags: ['Locations'],
          summary: 'Obtener location por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 10 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
        patch: {
          tags: ['Locations'],
          summary: 'Actualizar location (parcial)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 10 } }],
          requestBody: { $ref: '#/components/requestBodies/UpdateLocation' },
          responses: { '200': { description: 'OK' } },
        },
        delete: {
          tags: ['Locations'],
          summary: 'Soft delete location',
          description: 'Marca `IsDeleted=1`.',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 10 } }],
          responses: { '204': { description: 'Sin contenido (soft-deleted)' }, '404': { description: 'No encontrado' } },
        },
      },
      '/locations/code/{code}': {
        get: {
          tags: ['Locations'],
          summary: 'Obtener location por Code',
          parameters: [{ in: 'path', name: 'code', required: true, schema: { type: 'string', example: 'SF-HQ' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
      },

      // ===== ENTRIES =====
      '/entries': {
        get: {
          tags: ['Entries'],
          summary: 'Listar entries',
          description: 'Devuelve `{ items, page, pageSize, total }`. Solo registros con `IsDeleted=0`.',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'pageSize', schema: { type: 'integer', example: 50 } },
          ],
          responses: { '200': { description: 'OK' } },
        },
        post: {
          tags: ['Entries'],
          summary: 'Crear entry',
          requestBody: { $ref: '#/components/requestBodies/CreateEntry' },
          responses: { '201': { description: 'Creado' } },
        },
      },
      '/entries/{id}': {
        get: {
          tags: ['Entries'],
          summary: 'Obtener entry por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 39 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
        patch: {
          tags: ['Entries'],
          summary: 'Actualizar entry (parcial)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 39 } }],
          requestBody: { $ref: '#/components/requestBodies/UpdateEntry' },
          responses: { '200': { description: 'OK' } },
        },
        delete: {
          tags: ['Entries'],
          summary: 'Soft delete entry',
          description: 'Marca `IsDeleted=1`.',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 39 } }],
          responses: { '204': { description: 'Sin contenido (soft-deleted)' }, '404': { description: 'No encontrado' } },
        },
      },
      '/entries/last/{userId}': {
        get: {
          tags: ['Entries'],
          summary: 'Último entry por usuario',
          parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer', example: 1 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
      },

      // ===== EXITS =====
      '/exits': {
        get: {
          tags: ['Exits'],
          summary: 'Listar exits',
          description: 'Devuelve `{ items, page, pageSize, total }`. Solo registros con `IsDeleted=0`.',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'pageSize', schema: { type: 'integer', example: 50 } },
          ],
          responses: { '200': { description: 'OK' } },
        },
        post: {
          tags: ['Exits'],
          summary: 'Crear exit',
          requestBody: { $ref: '#/components/requestBodies/CreateExit' },
          responses: { '201': { description: 'Creado' } },
        },
      },
      '/exits/{id}': {
        get: {
          tags: ['Exits'],
          summary: 'Obtener exit por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 11 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
        patch: {
          tags: ['Exits'],
          summary: 'Actualizar exit (parcial)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 11 } }],
          requestBody: { $ref: '#/components/requestBodies/UpdateExit' },
          responses: { '200': { description: 'OK' } },
        },
        delete: {
          tags: ['Exits'],
          summary: 'Soft delete exit',
          description: 'Marca `IsDeleted=1`.',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 11 } }],
          responses: { '204': { description: 'Sin contenido (soft-deleted)' }, '404': { description: 'No encontrado' } },
        },
      },
      '/exits/by-entry/{entryId}': {
        get: {
          tags: ['Exits'],
          summary: 'Obtener exit por EntryId',
          parameters: [{ in: 'path', name: 'entryId', required: true, schema: { type: 'integer', example: 39 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
      },

      // ===== ROLES =====  ← NUEVO
      '/roles': {
        get: {
          tags: ['Roles'],
          summary: 'Listar roles',
          description: 'Devuelve `{ items, page, pageSize, total }`.',
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', example: 1 } },
            { in: 'query', name: 'pageSize', schema: { type: 'integer', example: 50 } },
          ],
          responses: { '200': { description: 'OK' } },
        },
      },
      '/roles/{id}': {
        get: {
          tags: ['Roles'],
          summary: 'Obtener role por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer', example: 1 } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
      }
    },
  },
  apis: [],
};

export const specs = swaggerJSDoc(options);

export const uiOptions: any = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    defaultModelRendering: 'example',
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: -1,
  },
  customSiteTitle: 'ClockInGo — API Tester 🚀',
};

export { swaggerUi };
