"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const data_source_1 = require("../data-source");
class BaseService {
    constructor(entity) {
        this.repository = data_source_1.dataSource.getRepository(entity);
    }
    async findAll(relations = []) {
        return this.repository.find({ relations });
    }
    async findOne(id, relations = []) {
        return this.repository.findOne({ where: { id }, relations });
    }
    async create(data) {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map