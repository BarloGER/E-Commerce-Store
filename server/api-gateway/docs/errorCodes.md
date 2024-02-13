# Error Code Documentation

This document provides a detailed overview of the error codes used in the application, along with links to their descriptions and the files where they are defined.

## Authentication Errors

- [`AUTH_001`](#auth_001) - Email Address Already Exists
- [`AUTH_002`](#auth_002) - Incorrect Password

## Validation Errors

- [`VAL_001`](#val_001) - Invalid Input Format or Values
- [`VAL_002`](#val_002) - Detailed Validation Error

## Database Errors

- [`DB_001`](#db_001) - Database Connection Error

## Network Errors

- [`NET_001`](#net_001) - Gateway Timeout

## API Errors

- [`API_001`](#api_001) - Error Communicating with External API

## Internal Errors

- [`INT_001`](#int_001) - Unexpected Server Error

---

## Authentication Errors

### `AUTH_001`

**Description**: This error occurs when an email address already exists in the system.

**Solution**: The user should try to log in instead of signing up or use a different email address.

**File**: `controllers/userController.js`

### `AUTH_002`

**Description**: Incorrect password.

**Solution**: The user should try to enter the correct password or use the password reset feature to create a new password.

**File**: `controllers/userController.js`

## Validation Errors

### `VAL_001`

**Description**: Validation error when input data does not meet expected format or values.

**Solution**: The user should check the input data and submit it in the correct format.

**File**: `middlewares/validateJoi.js`

### `VAL_002`

**Description**: Detailed validation error when specific input data does not meet the validation criteria.

**Solution**: The user should carefully review the provided error message, correct the specific issues with the input data, and resubmit.

**File**: `middlewares/validateJoi.js`

## Database Errors

### `DB_001`

**Description**: Database connection error.

**Solution**: This is typically a server-side error and not something the user can fix. Contact support.

**File**: `db/index.js`

## Network Errors

### `NET_001`

**Description**: Gateway Timeout.

**Solution**: The user should try the request again after some time.

**File**: `utils/proxy.js`

## API Errors

### `API_001`

**Description**: Error communicating with an external API.

**Solution**: This error is usually temporary. Try the request again later.

**File**: `utils/proxy.js`

## Internal Errors

### `INT_001`

**Description**: Unexpected server error.

**Solution**: This error indicates an unhandled exception on the server. Contact support.

**File**: `middlewares/errorHandler.js`
