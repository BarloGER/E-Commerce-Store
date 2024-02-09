import { asyncHandler } from "../../utils/asyncHandler.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";
import { userDBPool } from "../db/index.js";

// export const getAddress = asyncHandler(async (req, res, next) => {
//   const { address_id } = req.params;
//   const { userId } = req;

//   const addressQuery =
//     "SELECT * FROM addresses WHERE address_id = $1 AND user_id = $2";
//   const addressResult = await userDBPool.query(addressQuery, [
//     address_id,
//     userId,
//   ]);

//   if (addressResult.rows.length === 0) {
//     throw new ErrorResponse({
//       message:
//         "Adresse nicht gefunden oder gehört nicht zum angegebenen Benutzer.",
//       statusCode: 404,
//       errorType: "Not Found",
//       errorCode: "ADDRESS_NOT_FOUND",
//     });
//   }

//   res.status(200).json({
//     message: "Adresse gefunden.",
//     address: addressResult.rows[0],
//   });
// });

export const getAllAddresses = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  const addressQuery = "SELECT * FROM addresses WHERE user_id = $1";
  const addressResult = await userDBPool.query(addressQuery, [userId]);

  if (addressResult.rows.length === 0) {
    throw new ErrorResponse({
      message: "Adresse nicht gefunden.",
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "ADDRESS_NOT_FOUND",
    });
  }

  res.status(200).json({
    message: "Adresse gefunden.",
    address: addressResult.rows,
  });
});

export const addAddress = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const {
    effective_date,
    address_type,
    address_line1,
    address_line2,
    city,
    country,
    zip,
  } = req.body;

  const userExistsQuery = "SELECT user_id FROM users WHERE user_id = $1";
  const userExistsResult = await userDBPool.query(userExistsQuery, [userId]);
  if (userExistsResult.rows.length === 0) {
    throw new ErrorResponse({
      message: "Benutzer nicht gefunden",
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "USER_NOT_FOUND",
    });
  }

  const insertAddressQuery = `
    INSERT INTO addresses (user_id, effective_date, address_type, address_line1, address_line2, city, country, zip)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING address_id;
  `;
  const addressParams = [
    userId,
    effective_date,
    address_type,
    address_line1,
    address_line2,
    city,
    country,
    zip,
  ];
  const addressResult = await userDBPool.query(
    insertAddressQuery,
    addressParams
  );

  res.status(201).json({
    message: "Adresse erfolgreich hinzugefügt",
    addressId: addressResult.rows[0].address_id,
  });
});

export const editAddress = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const {
    address_id,
    effective_date,
    address_type,
    address_line1,
    address_line2,
    city,
    country,
    zip,
  } = req.body;

  const addressExistsQuery =
    "SELECT * FROM addresses WHERE address_id = $1 AND user_id = $2";
  const addressExistsResult = await userDBPool.query(addressExistsQuery, [
    address_id,
    userId,
  ]);

  if (addressExistsResult.rows.length === 0) {
    throw new ErrorResponse({
      message: "Adresse nicht gefunden.",
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "ADDRESS_NOT_FOUND",
    });
  }

  const updateAddressQuery = `
    UPDATE addresses
    SET effective_date = $1, address_type = $2, address_line1 = $3, address_line2 = $4, city = $5, country = $6, zip = $7
    WHERE address_id = $8 AND user_id = $9
  `;
  await userDBPool.query(updateAddressQuery, [
    effective_date,
    address_type,
    address_line1,
    address_line2,
    city,
    country,
    zip,
    address_id,
    userId,
  ]);

  res.status(200).json({
    message: "Adresse erfolgreich aktualisiert.",
  });
});

export const deleteAddress = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const { address_id } = req.body;

  const addressExistsQuery =
    "SELECT * FROM addresses WHERE address_id = $1 AND user_id = $2";
  const addressExistsResult = await userDBPool.query(addressExistsQuery, [
    address_id,
    userId,
  ]);

  if (addressExistsResult.rows.length === 0) {
    throw new ErrorResponse({
      message: "Adresse nicht gefunden.",
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "ADDRESS_NOT_FOUND",
    });
  }

  const deleteAddressQuery = "DELETE FROM addresses WHERE address_id = $1";
  await userDBPool.query(deleteAddressQuery, [address_id]);

  res.status(200).json({
    message: "Adresse erfolgreich gelöscht.",
  });
});
