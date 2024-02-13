import { expect } from "chai";
import {
  validateEnvs,
  getDBConnectionConfig,
} from "../../configs/envConfig.js";

describe("Environment Variables Validation", function () {
  let envBackup;
  const requiredEnvs = [
    "ACCOUNT_SERVICE_BASE_URL",
    "CART_SERVICE_BASE_URL",
    "INVENTORY_SERVICE_BASE_URL",
    "ORDER_STATUS_SERVICE_BASE_URL",
    "PAYMENT_SERVICE_BASE_URL",
    "PLACE_ORDER_SERVICE_BASE_URL",
    "PRODUCT_REVIEW_SERVICE_BASE_URL",
    "RECOMMENDATION_SERVICE_BASE_URL",
    "RECOMMENDATION_GENERATION_SERVICE_BASE_URL",
    "SEARCH_SERVICE_BASE_URL",
    "SHIPPING_SERVICE_BASE_URL",
    "SECRET_KEY",
    "PG_BASE_CONNECTIONSTRING",
  ];

  beforeEach(function () {
    envBackup = { ...process.env };
    // Set all required environment variables for the test setup
    requiredEnvs.forEach((env) => (process.env[env] = "dummy_value"));
  });

  afterEach(function () {
    process.env = envBackup;
  });

  requiredEnvs.forEach((env) => {
    it(`should throw an error if ${env} is missing`, function () {
      delete process.env[env];
      expect(validateEnvs).to.throw(
        Error,
        `Environment variable ${env} is not defined.`,
      );
    });
  });

  it("should not throw an error if all required environment variables are defined", function () {
    expect(validateEnvs).not.to.throw();
  });
});

describe("Database Connection Configuration", function () {
  it("should return the correct connection string for the test environment", function () {
    const config = getDBConnectionConfig("test");
    expect(config.connectionString).to.include("testUserDB");
  });

  it("should return the correct connection string for the production environment", function () {
    const config = getDBConnectionConfig("production");
    expect(config.connectionString).to.include("userDB");
  });
});
