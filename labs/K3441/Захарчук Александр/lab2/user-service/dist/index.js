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
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const routing_controllers_2 = require("routing-controllers");
const swaggerUi = __importStar(require("swagger-ui-express"));
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const storage_1 = require("class-transformer/cjs/storage");
const data_source_1 = require("./data-source");
const user_controller_1 = require("./controllers/user.controller");
const subscription_controller_1 = require("./controllers/subscription.controller");
async function bootstrap() {
    await data_source_1.dataSource.initialize();
    const controllers = [user_controller_1.UserController, subscription_controller_1.SubscriptionController];
    const app = (0, routing_controllers_1.createExpressServer)({
        controllers: controllers,
        cors: true,
        classTransformer: true,
        validation: true,
        defaultErrorHandler: true,
        currentUserChecker: async (action) => {
            return action.response.user;
        },
    });
    const schemas = (0, class_validator_jsonschema_1.validationMetadatasToSchemas)({
        classTransformerMetadataStorage: storage_1.defaultMetadataStorage,
    });
    const storage = (0, routing_controllers_2.getMetadataArgsStorage)();
    const spec = (0, routing_controllers_openapi_1.routingControllersToSpec)(storage, { controllers }, {
        components: {
            schemas,
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        info: {
            title: "User Service API",
            version: "1.0.0",
        },
    });
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
    app.get("/swagger.json", (_req, res) => { res.json(spec); });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    });
}
bootstrap().catch((err) => {
    console.error('Failed to start server', err);
});
//# sourceMappingURL=index.js.map