"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const bookings_module_1 = require("../bookings/bookings.module");
const auth_module_1 = require("../auth/auth.module");
const email_module_1 = require("../email.module");
const bookings_entity_1 = require("../entities/bookings.entity");
const user_entity_1 = require("../entities/user.entity");
const config_1 = require("@nestjs/config");
const feedback_module_1 = require("../feedback/feedback.module");
const contact_module_1 = require("../contact/contact.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([bookings_entity_1.Booking, user_entity_1.User]),
            bookings_module_1.BookingModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            feedback_module_1.FeedbackModule,
            contact_module_1.ContactModule,
        ],
        controllers: [admin_controller_1.AdminController],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map