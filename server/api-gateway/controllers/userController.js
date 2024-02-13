import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { userDBPool } from "../db/index.js";
import { currentConfig } from "../configs/envConfig.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { email, password, username, first_name, last_name } = req.body;

  let emailCheckQuery = "SELECT user_id FROM users WHERE email = $1";
  let { rows: emailRows } = await userDBPool.query(emailCheckQuery, [email]);
  if (emailRows.length > 0) {
    throw new ErrorResponse({
      message: "Diese E-Mail existiert bereits!",
      statusCode: 409,
      errorType: "AuthenticationError",
      errorCode: "AUTH_001",
    });
  }

  let usernameCheckQuery = "SELECT user_id FROM users WHERE username = $1";
  let { rows: usernameRows } = await userDBPool.query(usernameCheckQuery, [
    username,
  ]);
  if (usernameRows.length > 0) {
    throw new ErrorResponse({
      message: "Dieser Benutzername existiert bereits!",
      statusCode: 409,
      errorType: "AuthenticationError",
      errorCode: "AUTH_002",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  let insertUserQuery =
    "INSERT INTO users (username, email, password, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING user_id";
  const newUser = await userDBPool.query(insertUserQuery, [
    username,
    email,
    hashPassword,
    first_name,
    last_name,
  ]);

  const loginUpdateQuery =
    "UPDATE users SET last_login = NOW() WHERE user_id = $1";
  await userDBPool.query(loginUpdateQuery, [newUser.rows[0].user_id]);

  const token = jwt.sign(
    { id: newUser.rows[0].user_id },
    currentConfig.SECRET_KEY,
    { expiresIn: "1d" },
  );
  res.status(201).json({ token, message: "Erfolgreich registriert." });
});

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const query = "SELECT user_id, email, password FROM users WHERE email = $1";
  const { rows } = await userDBPool.query(query, [email]);

  const user = rows[0];
  if (!user) {
    throw new ErrorResponse({
      message: "Es ist kein User mit dieser E-Mail registriert.",
      statusCode: 404,
      errorType: "AuthenticationError",
      errorCode: "AUTH_003",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ErrorResponse({
      message: "Falsches Passwort",
      statusCode: 401,
      errorType: "AuthenticationError",
      errorCode: "AUTH_004",
    });
  }

  const loginUpdateQuery =
    "UPDATE users SET last_login = NOW() WHERE user_id = $1";
  await userDBPool.query(loginUpdateQuery, [user.user_id]);

  const token = jwt.sign({ id: user.user_id }, currentConfig.SECRET_KEY, {
    expiresIn: "1d",
  });
  res.status(200).json({ token, message: "Erfolgreich angemeldet." });
});
