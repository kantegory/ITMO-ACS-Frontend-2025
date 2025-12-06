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
exports.SubscriptionController = void 0;
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const subscription_service_1 = require("../services/subscription.service");
const subscription_create_dto_1 = require("../dto/subscription/subscription-create.dto");
const subscription_response_dto_1 = require("../dto/subscription/subscription-response.dto");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth.middleware");
let SubscriptionController = class SubscriptionController {
    constructor() {
        this.subscriptionService = new subscription_service_1.SubscriptionService();
    }
    async subscribe(body, user) {
        return this.subscriptionService.create({ ...body, follower_id: user.id });
    }
    async unsubscribe(subscriptionId, user) {
        await this.subscriptionService.deleteWithCheck(subscriptionId, user.id);
        return { "ok": true };
    }
    async getFollowing(user) {
        return this.subscriptionService.findForUser(user.id);
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, routing_controllers_1.Post)(),
    (0, routing_controllers_1.HttpCode)(201),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Subscribe to another user", security: [{ bearerAuth: [] }] }),
    (0, routing_controllers_openapi_1.ResponseSchema)(subscription_response_dto_1.SubscriptionResponseDto),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, routing_controllers_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_create_dto_1.SubscriptionCreateDto, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "subscribe", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.HttpCode)(204),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Unsubscribe from a user", security: [{ bearerAuth: [] }] }),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "unsubscribe", null);
__decorate([
    (0, routing_controllers_1.Get)(""),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: "Get users followed by a current user", security: [{ bearerAuth: [] }] }),
    (0, routing_controllers_openapi_1.ResponseSchema)(subscription_response_dto_1.SubscriptionResponseDto, { isArray: true }),
    __param(0, (0, routing_controllers_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getFollowing", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, routing_controllers_1.JsonController)("/subscriptions"),
    (0, routing_controllers_1.UseBefore)(jwt_auth_middleware_1.JwtAuthMiddleware),
    (0, routing_controllers_openapi_1.OpenAPI)({ tags: ["Subscriptions"] }),
    __metadata("design:paramtypes", [])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map