"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const base_service_1 = require("./base.service");
const subscription_entity_1 = require("../entities/subscription.entity");
const routing_controllers_1 = require("routing-controllers");
class SubscriptionService extends base_service_1.BaseService {
    constructor() { super(subscription_entity_1.Subscription); }
    async create(data) {
        if (data.follower_id === data.following_id) {
            throw new routing_controllers_1.BadRequestError();
        }
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }
    async deleteWithCheck(id, userId) {
        const subscription = await this.findOne(id);
        if (subscription.follower_id !== userId) {
            throw new routing_controllers_1.ForbiddenError();
        }
        await this.delete(id);
    }
    async findForUser(userId) {
        return await this.repository.findBy({ follower_id: userId });
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map