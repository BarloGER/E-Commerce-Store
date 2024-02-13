# E-Commerce-Store Documentation

This document outlines the architecture and key components of an E-commerce store designed with a microservice architecture. The system leverages various AWS services for deployment, ensuring scalability, reliability, and efficiency.

## System Overview

The E-commerce platform is structured around a microservice architecture to facilitate modular development, deployment, and scalability. Each microservice is dedicated to a specific function within the platform, such as account management, inventory, or payment processing, and operates independently with its own database. This approach enables individual services to be updated or scaled without impacting the entire system.

### Deployment Strategy

- **Frontend**: Deployed on AWS Amplify or Netlify for global distribution and scalability.
- **API Gateway**: Hosted on AWS EC2, acts as the entry point for all client requests, routing them to the appropriate microservice.
- **Microservices**: Also deployed on AWS EC2. Due to constraints on resource availability, all microservices are contained within a monorepo, simulating a distributed environment on a single EC2 instance.
- **Databases**: Each microservice utilizes its own database, choosing between PostgreSQL and MongoDB based on the data structure and access patterns.

---

## API Gateway Documentation

The API Gateway is central to the architecture, facilitating secure and efficient communication between the client applications and the backend microservices.

## Dependencies Overview

The API Gateway utilizes a robust set of dependencies to ensure smooth operation, security, and development efficiency. Here's an overview of the primary dependencies and their roles within the application:

### Production Dependencies

- **axios**: A promise-based HTTP client for making requests to external APIs. Used for proxying requests to microservices.
- **bcrypt**: A library for hashing and comparing passwords securely. Used in the authentication process to encrypt user passwords before storing them in the database.
- **cors**: A middleware that enables Cross-Origin Resource Sharing (CORS). This allows the API to accept requests from different domains, essential for a web application.
- **express**: A fast, unopinionated, minimalist web framework for Node.js. Serves as the backbone of the API Gateway, handling routing, middleware, and HTTP request processing.
- **joi**: A powerful schema description language and data validator for JavaScript. Used for validating request data against predefined schemas to ensure data integrity.
- **jsonwebtoken**: Implements JSON Web Tokens (JWT) for securely transmitting information between parties as a JSON object. Used for handling authentication and maintaining sessions.
- **pg**: A non-blocking PostgreSQL client for Node.js. Used for interacting with PostgreSQL databases.
- **winston**: A versatile logging library capable of logging errors and information. Used for maintaining logs, which helps in monitoring and debugging the application.

### Development Dependencies

- **axios-mock-adapter**: Allows mocking Axios requests for testing purposes, enabling developers to simulate server responses.
- **c8**: A code coverage tool that measures the effectiveness of tests. It checks which parts of the codebase are covered by tests.
- **chai**: An assertion library for Node.js and the browser that can be paired with any testing framework. It helps in writing more expressive tests.
- **cross-env**: Sets and uses environment variables across platforms without modification. Essential for running scripts that require environment-specific settings.
- **dotenv**: Loads environment variables from a `.env` file into `process.env`, providing a secure way to store configuration details.
- **eslint**: A static code analysis tool for identifying problematic patterns in JavaScript code, ensuring code quality and consistency.
- **eslint-config-prettier**: Disables all ESLint rules that are unnecessary or might conflict with Prettier, ensuring that the two tools coexist without issues.
- **eslint-config-standard**: Enforces a standard style guide for JavaScript, promoting clean and consistent code across the project.
- **eslint-plugin-import**, **eslint-plugin-n**, **eslint-plugin-prettier**, **eslint-plugin-promise**: Provide additional linting rules for managing imports, Node.js specifics, integration with Prettier, and handling promises, respectively.
- **mocha**: A feature-rich JavaScript test framework running on Node.js, making asynchronous testing simple and fun.
- **nodemon**: A utility that monitors for any changes in the source code and automatically restarts the server, improving development productivity.
- **prettier**: An opinionated code formatter that enforces a consistent style by parsing code and re-printing it with its own rules.
- **sinon**: Standalone test spies, stubs, and mocks for JavaScript. Works with any unit testing framework.
- **supertest**: A SuperAgent driven library for testing HTTP servers, allowing easy testing of endpoint responses.

This comprehensive suite of dependencies ensures the API Gateway is secure, efficient, and developer-friendly, facilitating seamless integration with the microservices architecture of the e-commerce store.

### Proxy

The API Gateway employs a proxy to forward requests to the corresponding microservices. It uses `axios` for HTTP communication, enhancing security by removing sensitive headers and utilizing logging for transparency.

#### Example of Proxy Workflow

When a request is made to access the Account Service (e.g., `localhost:8080/account`), the API Gateway performs the following actions:

1. **Receives Request**: The client sends a request to the API Gateway.
2. **Sanitizes Headers**: The Gateway strips the `Authorization` header to safeguard security.
3. **Logs the Request**: It logs the request path and destination for monitoring and troubleshooting.
4. **Forwards Request**: The request is forwarded to the Account Service at its specific location (e.g., `localhost:8081/`).
5. **Processes and Responds**: The Account Service processes the request and returns the response through the API Gateway to the client.

This process ensures that the client's interaction with the backend services is streamlined and secure.

### Authentication

Authentication is handled through two primary endpoints: `signup` for registering new users and `signin` for logging in existing users. These endpoints validate user input and manage secure token generation.

### POST /auth/signup

This endpoint registers a new user, requiring a payload that includes username, email, password, first name, and last name. It enforces specific validation rules to ensure the integrity and security of user data.

#### Requirement body

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string"
}
```

#### Validation rules

- `username`: Alphanumeric, 3-20 characters long
- `email`: Must be a valid e-mail address (supports `.com`, `.net`, `.de`)
- `password`: At least 8 characters long, maximum 30, must contain at least one lowercase letter, one uppercase letter, one number and one special character
- `first_name`: Maximum 100 characters, may only contain letters and certain special characters
- `last_name`: Maximum 100 characters, may only contain letters and certain special characters.

#### Answers

- `200 OK` if successful
- `400 Bad Request` for validation errors
- `500 Internal Server Error` for server errors

### POST /auth/signin

This endpoint authenticates a user, allowing them to log in by providing their email and password. Successful authentication returns a token, granting the user access to secured routes.

#### Requirement body

```json
{
  "email": "string",
  "password": "string"
}
```

#### Answers

- `200 OK` if successful, with token in the body
- `401 Unauthorized` for invalid login data
- `500 Internal Server Error` for server errors

## Error Code Documentation

All error messages of the API gateway are listed here.

#### Authentication Errors

- [`AUTH_001`](#auth_001) - Email Address Already Exists
- [`AUTH_002`](#auth_002) - Incorrect Password

#### Validation Errors

- [`VAL_001`](#val_001) - Invalid Input Format or Values
- [`VAL_002`](#val_002) - Detailed Validation Error

#### Database Errors

- [`DB_001`](#db_001) - Database Connection Error

#### Network Errors

- [`NET_001`](#net_001) - Gateway Timeout

#### API Errors

- [`API_001`](#api_001) - Error Communicating with External API

#### Internal Errors

- [`INT_001`](#int_001) - Unexpected Server Error

---

## Microservices Documentation

Each microservice, from Account to Shipping, is designed to operate independently with its dedicated database. This section would detail the endpoints, operations, and specifics of interacting with each service, ensuring a clear understanding of the system's capabilities.

- [Account Service](#account)
- [Cart Service](#cart)
- [Inventory Service](#inventory)
- [Order Status Service](#order-status)
- [Payment Service](#payment)
- [Place Order Service](#place-order)
- [Product Review Service](#product-review)
- [Recommendation Service](#recommendation)
- [Recommendation Generation Service](#recommendation-generation)
- [Search Service](#search)
- [Shipping Service](#shipping)
