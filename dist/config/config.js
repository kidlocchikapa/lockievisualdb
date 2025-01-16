"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const feedback_entity_1 = require("../entities/feedback.entity");
const bookings_entity_1 = require("../entities/bookings.entity");
const dotenv_1 = require("dotenv");
const pg_connection_string_1 = require("pg-connection-string");
(0, dotenv_1.config)();
const databaseUrl = process.env.DATABASE_URL;
const isProduction = !!databaseUrl;
const parsed = databaseUrl ? (0, pg_connection_string_1.parse)(databaseUrl) : null;
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: isProduction ? parsed?.host : process.env.DB_HOST,
    port: isProduction
        ? parseInt(parsed?.port || '5432', 10)
        : parseInt(process.env.DB_PORT || '5432', 10),
    username: isProduction ? parsed?.user : process.env.DB_USERNAME,
    password: isProduction ? parsed?.password : process.env.DB_PASSWORD,
    database: isProduction ? parsed?.database : process.env.DB_DATABASE,
    entities: [user_entity_1.User, feedback_entity_1.Feedback, bookings_entity_1.Booking],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    ssl: isProduction
        ? {
            rejectUnauthorized: false,
        }
        : undefined,
});
