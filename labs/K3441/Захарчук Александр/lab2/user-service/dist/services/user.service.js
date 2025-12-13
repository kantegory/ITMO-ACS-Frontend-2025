"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const routing_controllers_1 = require("routing-controllers");
const user_entity_1 = require("../entities/user.entity");
const base_service_1 = require("./base.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
const comparePassword = async (hash, password) => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
};
class UserService extends base_service_1.BaseService {
    constructor() { super(user_entity_1.User); }
    validateCurrentUser(userId, requestedUserId) {
        if (userId !== requestedUserId) {
            throw new routing_controllers_1.ForbiddenError();
        }
    }
    async create(data) {
        const entity = this.repository.create({ ...data, password: await hashPassword(data.password) });
        return this.repository.save(entity);
    }
    async update(id, data) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        await this.repository.update(id, data);
        return this.findOne(id);
    }
    async login(username, password) {
        const user = await this.repository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.username = :username", { username })
            .getOne();
        if (!user)
            throw new routing_controllers_1.UnauthorizedError();
        const passwordMatch = await comparePassword(user.password, password);
        if (!passwordMatch)
            throw new routing_controllers_1.UnauthorizedError();
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { token };
    }
    validate(token) {
        const secret = process.env.JWT_SECRET;
        try {
            const payload = jwt.verify(token, secret);
            return { user_id: payload.id };
        }
        catch {
            throw new routing_controllers_1.UnauthorizedError();
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map