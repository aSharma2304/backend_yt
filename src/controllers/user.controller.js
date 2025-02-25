import asyncHandler from "../utils/asyncHandler.js";

const registerNewUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "All ok" });
});

export { registerNewUser };
