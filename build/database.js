"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database.ts
var database_exports = {};
__export(database_exports, {
  knex: () => knex
});
module.exports = __toCommonJS(database_exports);
var import_knex = require("knex");

// knexfile.ts
var import_config = require("dotenv/config");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test", override: true });
} else {
  (0, import_dotenv.config)({ path: ".env" });
}
console.log(process.env.NODE_ENV + ": " + process.env.DATABASE_URL);
var envSchema = import_zod.z.object({
  DATABASE_URL: import_zod.z.string(),
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// knexfile.ts
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: {
    filename: env.DATABASE_URL
    // ou app.sqlite
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations/"
  }
};
var knexfile_default = config2;

// src/database.ts
var knex = (0, import_knex.knex)(knexfile_default);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  knex
});
