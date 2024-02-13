export const validateEnvs = () => {
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

  requiredEnvs.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} is not defined.`);
    }
  });
  console.log("ENV validation successful");
};

export const currentConfig = {
  ACCOUNT_SERVICE_BASE_URL: process.env.ACCOUNT_SERVICE_BASE_URL,
  CART_SERVICE_BASE_URL: process.env.CART_SERVICE_BASE_URL,
  INVENTORY_SERVICE_BASE_URL: process.env.INVENTORY_SERVICE_BASE_URL,
  ORDER_STATUS_SERVICE_BASE_URL: process.env.ORDER_STATUS_SERVICE_BASE_URL,
  PAYMENT_SERVICE_BASE_URL: process.env.PAYMENT_SERVICE_BASE_URL,
  PLACE_ORDER_SERVICE_BASE_URL: process.env.PLACE_ORDER_SERVICE_BASE_URL,
  PRODUCT_REVIEW_SERVICE_BASE_URL: process.env.PRODUCT_REVIEW_SERVICE_BASE_URL,
  RECOMMENDATION_SERVICE_BASE_URL: process.env.RECOMMENDATION_SERVICE_BASE_URL,
  RECOMMENDATION_GENERATION_SERVICE_BASE_URL:
    process.env.RECOMMENDATION_GENERATION_SERVICE_BASE_URL,
  SEARCH_SERVICE_BASE_URL: process.env.SEARCH_SERVICE_BASE_URL,
  SHIPPING_SERVICE_BASE_URL: process.env.SHIPPING_SERVICE_BASE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  PG_BASE_CONNECTIONSTRING: process.env.PG_BASE_CONNECTIONSTRING,
};

export const getDBConnectionConfig = (env) => {
  const dbName = env === "test" ? "testUserDB" : "userDB";
  return {
    connectionString: `${currentConfig.PG_BASE_CONNECTIONSTRING}/${dbName}`,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};
