"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = void 0;
const entities = require("./entities");
const getTypeOrmConfig = async (configService) => ({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    entities: Object.values(entities),
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [__dirname + 'dist/migrations/*{.ts,.js}'],
    ssl: configService.get('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
});
exports.getTypeOrmConfig = getTypeOrmConfig;
//# sourceMappingURL=TypeORMconfig.js.map