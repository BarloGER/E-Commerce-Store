import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validateJoi } from "../middlewares/validateJoi.js";
import { userSchema } from "../joi/userSchema.js";
import { addressSchema } from "../joi/addressSchema.js";
import {
  getUser,
  editUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  // getAddress,
  getAllAddresses,
  addAddress,
  editAddress,
  deleteAddress,
} from "../controllers/addressController.js";

// ToDo: Check if getAddress is needed

export const authRouter = Router();

authRouter.get("/me", verifyToken, getUser);
authRouter.put("/me", verifyToken, validateJoi(userSchema), editUser);
authRouter.delete("/me", verifyToken, deleteUser);

authRouter.get("/me/addresses", verifyToken, getAllAddresses);
// authRouter.get("/me/addresses/:address_id", verifyToken, getAddress);
authRouter.post(
  "/me/addresses",
  verifyToken,
  validateJoi(addressSchema),
  addAddress
);
authRouter.put(
  "/me/addresses",
  verifyToken,
  validateJoi(addressSchema),
  editAddress
);
authRouter.delete("/me/addresses", verifyToken, deleteAddress);
