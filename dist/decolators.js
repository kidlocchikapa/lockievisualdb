"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.UserRole = void 0;
const common_1 = require("@nestjs/common");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
    UserRole["PHOTOGRAPHER"] = "photographer";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
