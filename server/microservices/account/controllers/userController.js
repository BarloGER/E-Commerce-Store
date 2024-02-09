import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ErrorResponse } from "../../utils/ErrorResponse.js";
import { userDBPool } from "../db/index.js";

export const getUser = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const query =
    "SELECT user_id, username, email, first_name, last_name FROM users WHERE user_id = $1";
  const { rows } = await userDBPool.query(query, [userId]);
  const user = rows[0];
  if (!user) {
    return next(new ErrorResponse("Benutzer nicht gefunden", 404));
  }
  res.status(200).json(user);
});

export const editUser = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const { email, username, password } = req.body;

  const { rows } = await userDBPool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [userId]
  );
  const user = rows[0];
  if (!user) {
    throw new ErrorResponse({
      message: `User nicht gefunden.`,
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "AUTH_005",
    });
  }

  const { rows: emailRows } = await userDBPool.query(
    "SELECT * FROM users WHERE email = $1 AND user_id != $2",
    [email, userId]
  );
  if (emailRows.length > 0) {
    throw new ErrorResponse({
      message: "E-Mail existiert bereits",
      statusCode: 403,
      errorType: "Validation Error",
      errorCode: "AUTH_001",
    });
  }

  const { rows: usernameRows } = await userDBPool.query(
    "SELECT * FROM users WHERE username = $1 AND user_id != $2",
    [username, userId]
  );
  if (usernameRows.length > 0) {
    throw new ErrorResponse({
      message: "Benutzername existiert bereits",
      statusCode: 403,
      errorType: "Validation Error",
      errorCode: "AUTH_002",
    });
  }

  let updateQuery = "UPDATE users SET ";
  const updateParams = [];
  if (password) {
    const hash = await bcrypt.hash(password, 5);
    updateParams.push(hash);
    updateQuery += `password = $${updateParams.length}`;
  }

  if (email) {
    if (updateParams.length > 0) updateQuery += ", ";
    updateParams.push(email);
    updateQuery += `email = $${updateParams.length}`;
  }
  if (username) {
    if (updateParams.length > 0) updateQuery += ", ";
    updateParams.push(username);
    updateQuery += `username = $${updateParams.length}`;
  }

  updateQuery += ` WHERE user_id = $${updateParams.length + 1}`;
  updateParams.push(userId);

  await userDBPool.query(updateQuery, updateParams);

  const token = jwt.sign({ _id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res
    .status(200)
    .json({ token, message: "Benutzer erfolgreich aktualisiert." });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { userId } = req;

  const checkUserQuery = "SELECT * FROM users WHERE user_id = $1";
  const checkResult = await userDBPool.query(checkUserQuery, [userId]);
  if (checkResult.rows.length === 0) {
    throw new ErrorResponse({
      message: `User nicht gefunden.`,
      statusCode: 404,
      errorType: "Not Found",
      errorCode: "AUTH_005",
    });
  }

  const deleteQuery = "DELETE FROM users WHERE user_id = $1";
  await userDBPool.query(deleteQuery, [userId]);

  res.status(200).json({ message: "User erfolgreich gelöscht." });
});
