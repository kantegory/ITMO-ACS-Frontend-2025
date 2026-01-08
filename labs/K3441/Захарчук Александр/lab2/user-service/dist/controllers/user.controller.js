"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const user_service_1 = require("../services/user.service");
const user_create_dto_1 = require("../dto/user/user-create.dto");
const user_login_dto_1 = require("../dto/user/user-login.dto");
const user_update_dto_1 = require("../dto/user/user-update.dto");
const user_response_dto_1 = require("../dto/user/user-response.dto");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth.middleware");
const user_token_validate_dto_1 = require("../dto/user/user-token-validate.dto");
let UserController = class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async getAll() {
        return this.userService.findAll();
    }
    async getById(id) {
        const user = await this.userService.findOne(id);
        if (!user)
            throw new routing_controllers_1.NotFoundError("User not found");
        return user;
    }
    async register(body) {
        return this.userService.create(body);
    }
    async login(body) {
        return this.userService.login(body.username, body.password);
    }
    async validateToken(body) {
        return this.userService.validate(body.token);
    }
    async update(id, body, user) {
        this.userService.validateCurrentUser(user.id, id);
        const updated = await this.userService.update(id, body);
        if (!updated)
            throw new routing_controllers_1.NotFoundError("User not found");
        return updated;
    }
    async delete(id, user) {
        this.userService.validateCurrentUser(user.id, id);
        await this.userService.delete(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, routing_controllers_1.UseBefore)(jwt_auth_middleware_1.JwtAuthMiddleware),
    (0, routing_controllers_1.Get)(),
    (0, routing_controllers_openapi_1.ResponseSchema)(user_response_dto_1.UserResponseDto, { isArray: true }),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Get all users", security: [{ bearerAuth: [] }] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.UseBefore)(jwt_auth_middleware_1.JwtAuthMiddleware),
    (0, routing_controllers_1.Get)('/:id'),
    (0, routing_controllers_openapi_1.ResponseSchema)(user_response_dto_1.UserResponseDto),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Get user by ID", security: [{ bearerAuth: [] }] }),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
__decorate([
    (0, routing_controllers_1.Post)("/register"),
    (0, routing_controllers_1.HttpCode)(201),
    (0, routing_controllers_openapi_1.ResponseSchema)(user_response_dto_1.UserResponseDto),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Register a new user" }),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.UserCreateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, routing_controllers_1.Post)("/login"),
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Login user and return token" }),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, routing_controllers_1.Post)("/validate"),
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Validate user token" }),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_token_validate_dto_1.TokenValidateDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "validateToken", null);
__decorate([
    (0, routing_controllers_1.UseBefore)(jwt_auth_middleware_1.JwtAuthMiddleware),
    (0, routing_controllers_1.Patch)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(user_response_dto_1.UserResponseDto),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Update user profile", security: [{ bearerAuth: [] }] }),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __param(2, (0, routing_controllers_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_update_dto_1.UserUpdateDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.UseBefore)(jwt_auth_middleware_1.JwtAuthMiddleware),
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.HttpCode)(204),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Delete user by ID", security: [{ bearerAuth: [] }] }),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
exports.UserController = UserController = __decorate([
    (0, routing_controllers_1.JsonController)("/users"),
    (0, routing_controllers_openapi_1.OpenAPI)({ tags: ["Users"] }),
    __metadata("design:paramtypes", [])
], UserController);
//# sourceMappingURL=user.controller.js.map