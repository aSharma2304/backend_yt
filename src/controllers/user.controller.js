import asyncHandler from "../utils/asyncHandler.js";
import z from "zod";
import { ApiError } from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import prisma from "../db/prismaClient.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  comparePassword,
  generateAcessToken,
  generateRefreshToken,
} from "../utils/jwtUtils.js";

const registerSchema = z.object({
  fullname: z.string(),
  username: z.string().min(2, "Username must of length 2 or longer"),
  email: z.string().email("Not a valid email"),
  password: z.string().min(8, "Password must of of length 8 or longer"),
});

const loginSchema = z.object({
  email: z.string().email("Not a valid email"),
  password: z.string().min(8, "Password must be of length 8 or longer"),
});

const registerNewUser = asyncHandler(async (req, res) => {
  const userData = req.body;

  const parsedData = registerSchema.safeParse(userData);
  if (!parsedData.success) {
    throw new ApiError(400, parsedData.error);
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userData.email }, { username: userData.username }],
    },
  });
  if (existingUser) {
    // 409 code is generally used in these cases
    throw new ApiError(409, "User Already exists with same username or emal");
  }

  // just like req.body  because we used multer and used it as middleware it gives us access to req.files to access files
  // we get path of file in local system from path property on each image's object which is a array of object
  console.log("i ran till here ");
  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // we here are making it mandatory to upload a avatar
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is requuired");
  }
  const avatarImage = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarImage) {
    throw new ApiError(400, "Avatar is required");
  }

  const newUser = await prisma.user.create({
    data: {
      fullname: userData.fullname,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      avatar: avatarImage.url,
      coverImage: coverImage?.url || "",
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      email: true,
      avatar: true,
      coverImage: true,
      createdAt: true,
      // Exclude password and refreshToken by not including them here
    },
  });

  if (!newUser) {
    throw new ApiError(500, "An error while creating user");
  }
  const response = new ApiResponse(200, newUser, "User created Successfully");
  res.status(200).json(response);
});

const loginUser = asyncHandler(async (req, res) => {
  const userData = req.body;
  const parsedData = loginSchema.safeParse(userData);
  if (!parsedData.success) {
    throw new ApiError(400, parsedData.error);
  }
  const userInDb = await prisma.user.findFirst({
    where: {
      email: userData.email,
    },
  });

  if (!userInDb) {
    throw new ApiError(400, "User dosen't exists with this email");
  }

  const isPasswordCorrect = await comparePassword(
    userData.password,
    userInDb.password
  );
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }

  const accessToken = await generateAcessToken(userInDb);
  const refreshToken = await generateRefreshToken(userInDb);

  userInDb.refreshToken = refreshToken;
  const updatedUser = await prisma.user.update({
    where: {
      email: userInDb.email,
    },
    data: {
      refreshToken,
    },
  });

  if (!updatedUser) {
    throw new ApiError(500, "An error occured while updating database");
  }

  const excludeFields = ["password", "refreshToken"];

  const filteredUser = Object.fromEntries(
    Object.entries(updatedUser).filter(([key]) => !excludeFields.includes(key))
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, filteredUser, "Logged In Successfully"));
});

export { registerNewUser, loginUser };
