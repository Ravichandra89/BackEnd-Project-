// Write the Logic for to Register the User

import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    message: "Succesfully Sendes the response", 
  });
});

export { registerUser };
