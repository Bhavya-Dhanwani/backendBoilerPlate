import { stripComments } from '../utils/commentStripper.js';

export function generateUserModel(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isModular = config.folderStructure === 'Modular';
  const hasGoogle = Boolean(config.googleAuth);

  const hashUtilPath = isModular ? '../../shared/utils/hashing.util' : '../utils/hashing.util';

  let code = '';
  if (isESM) {
    code += `// Importing module\n`;
    code += `import mongoose from "mongoose";\n`;
    code += `import { hashPassword, comparePassword } from "${hashUtilPath}${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing module\n`;
    code += `const mongoose = require("mongoose");\n`;
    code += `const { hashPassword, comparePassword } = require("${hashUtilPath}");\n\n`;
  }

  code += `// defining the schema for the user model\n`;
  code += `const userSchema = new mongoose.Schema({\n\n`;
  code += `    name: {\n`;
  code += `        type: String,\n`;
  code += `        required: [true, "Name is required"],\n`;
  code += `        minlength: [3, "Name must be at least 3 characters long"],\n`;
  code += `    },\n\n`;
  code += `    email: {\n`;
  code += `        type: String,\n`;
  code += `        required: [true, "Email is required"],\n`;
  code += `        unique: [true, "Email already exists"],\n`;
  code += `        match: [/\\S+@\\S+\\.\\S+/, "Email is invalid"],\n`;
  code += `    },\n\n`;
  code += `    password: {\n`;
  code += `        type: String,\n`;
  code += `        required: false,\n`;
  code += `        minlength: [6, "Password must be at least 6 characters long"],\n`;
  code += `    },\n\n`;
  if (hasGoogle) {
    code += `    providers: {\n`;
    code += `        type: [String],\n`;
    code += `        enum: ["local", "google"],\n`;
    code += `        default: ["local"],\n`;
    code += `    },\n\n`;
    code += `    googleId: {\n`;
    code += `        type: String,\n`;
    code += `        required: false,\n`;
    code += `    },\n\n`;
  }
  code += `    isVerified: {\n`;
  code += `        type: Boolean,\n`;
  code += `        default: ${config.emailVerification ? 'false' : 'true'}\n`;
  code += `    },\n\n`;
  code += `});\n\n`;

  code += `// adding a pre-save hook to hash the password before saving the user\n`;
  code += `userSchema.pre("save", async function() {\n\n`;
  code += `    // checking if the password is modified or exists\n`;
  code += `    if (!this.isModified("password") || !this.password) return;\n\n`;
  code += `    // hashing the password\n`;
  code += `    this.password = await hashPassword(this.password);\n\n`;
  code += `});\n\n`;

  code += `// adding a method to compare the password\n`;
  code += `userSchema.methods.comparePassword = async function(password${isTS ? ': string' : ''}) {\n\n`;
  code += `    // checking if the user has a password\n`;
  code += `    if (!this.password) return false;\n\n`;
  code += `    // comparing the password with the hashed password\n`;
  code += `    const isMatch = await comparePassword(password, this.password);\n\n`;
  code += `    // returning the result of the comparison\n`;
  code += `    return isMatch;\n\n`;
  code += `};\n\n`;

  if (isESM) {
    code += `// making the model for the user schema\n`;
    code += `const User = mongoose.model("User", userSchema);\n\n`;
    code += `// exporting the user model\n`;
    code += `export default User;\n`;
  } else {
    code += `// making the model for the user schema\n`;
    code += `const User = mongoose.model("User", userSchema);\n\n`;
    code += `// exporting the user model\n`;
    code += `module.exports = User;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateAuthTypes(config) {
  const isMultiToken = typeof config.multiToken === 'boolean' ? config.multiToken : (config.tokenStrategy ? config.tokenStrategy.includes('Multi Token') : true);
  const hasGoogle = Boolean(config.googleAuth);
  const hasForgotPass = Boolean(config.forgotPassword);

  let code = '';
  code += `// Importing modules\n`;
  code += `import { Request } from "express";\n\n`;

  code += `// User payload interface\n`;
  code += `export interface IUserPayload {\n`;
  code += `    _id?: string;\n`;
  code += `    userId?: string;\n`;
  code += `    name?: string;\n`;
  code += `    email?: string;\n`;
  code += `    isVerified?: boolean;\n`;
  code += `    role?: string;\n`;
  code += `}\n\n`;

  if (isMultiToken) {
    code += `// Session payload interface\n`;
    code += `export interface ISessionPayload {\n`;
    code += `    sessionId: string;\n`;
    code += `    userId: string;\n`;
    code += `}\n\n`;
  }

  code += `// Authenticated request interface\n`;
  code += `export interface AuthenticatedRequest extends Request {\n`;
  code += `    user?: IUserPayload;\n`;
  code += `}\n\n`;

  if (isMultiToken) {
    code += `// Session request interface\n`;
    code += `export interface SessionRequest extends Request {\n`;
    code += `    session?: ISessionPayload;\n`;
    code += `    refreshToken?: string;\n`;
    code += `}\n\n`;
  }

  code += `// Signup request body interface\n`;
  code += `export interface SignupRequestBody {\n`;
  code += `    name: string;\n`;
  code += `    email: string;\n`;
  code += `    password?: string;\n`;
  code += `    token?: string;\n`;
  code += `}\n\n`;

  code += `// Login request body interface\n`;
  code += `export interface LoginRequestBody {\n`;
  code += `    email: string;\n`;
  code += `    password?: string;\n`;
  code += `    token?: string;\n`;
  code += `}\n\n`;

  if (hasGoogle) {
    code += `// Google login request body interface\n`;
    code += `export interface GoogleLoginRequestBody {\n`;
    code += `    credential: string;\n`;
    code += `}\n\n`;
  }

  if (hasForgotPass) {
    code += `// Forgot password request body interface\n`;
    code += `export interface ForgotPasswordRequestBody {\n`;
    code += `    email: string;\n`;
    code += `}\n\n`;

    code += `// Reset password request body interface\n`;
    code += `export interface ResetPasswordRequestBody {\n`;
    code += `    token: string;\n`;
    code += `    password?: string;\n`;
    code += `}\n\n`;
  }

  code += `export type SignupRequest = Request<Record<string, string>, unknown, SignupRequestBody>;\n`;
  code += `export type LoginRequest = Request<Record<string, string>, unknown, LoginRequestBody>;\n`;
  if (hasGoogle) {
    code += `export type GoogleLoginRequest = Request<Record<string, string>, unknown, GoogleLoginRequestBody>;\n`;
  }
  if (hasForgotPass) {
    code += `export type ForgotPasswordRequest = Request<Record<string, string>, unknown, ForgotPasswordRequestBody>;\n`;
    code += `export type ResetPasswordRequest = Request<Record<string, string>, unknown, ResetPasswordRequestBody>;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateAuthController(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isClass = config.programmingStyle === 'Class Based';
  const isModular = config.folderStructure === 'Modular';
  const isMultiToken = typeof config.multiToken === 'boolean' ? config.multiToken : (config.tokenStrategy ? config.tokenStrategy.includes('Multi Token') : true);
  const hasGoogle = Boolean(config.googleAuth);
  const hasEmailVerif = Boolean(config.emailVerification);
  const hasForgotPass = Boolean(config.forgotPassword);
  const hasTokenDao = hasEmailVerif || hasForgotPass;

  const relShared = isModular ? '../../../shared' : '..';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    if (isTS) {
      code += `import { Request, Response } from "express";\n`;
      let typeImports = ['AuthenticatedRequest', 'SignupRequest', 'LoginRequest'];
      if (isMultiToken) typeImports.push('SessionRequest');
      if (hasGoogle) typeImports.push('GoogleLoginRequest');
      if (hasForgotPass) typeImports.push('ForgotPasswordRequest', 'ResetPasswordRequest');
      code += `import { ${typeImports.join(', ')} } from "./auth.types.js";\n`;
    }
    code += `import env from "${relShared}/config/env.config${isTS ? '.js' : '.js'}";\n`;
    if (hasEmailVerif || hasForgotPass) {
      let constImports = [];
      if (hasEmailVerif) constImports.push('OTP_EXPIRY_TIME');
      if (hasForgotPass) constImports.push('RESET_PASSWORD_TOKEN_EXPIRY_TIME');
      code += `import { ${constImports.join(', ')} } from "${relShared}/constants/tokens.constants${isTS ? '.js' : '.js'}";\n`;
    }
    if (isClass) {
      code += `import UserDao from "${relShared}/dao/user.dao${isTS ? '.js' : '.js'}";\n`;
      if (isMultiToken) code += `import SessionDao from "${relShared}/dao/session.dao${isTS ? '.js' : '.js'}";\n`;
      if (hasTokenDao) code += `import TokenDao from "${relShared}/dao/token.dao${isTS ? '.js' : '.js'}";\n`;
    } else {
      code += `import { createUser, findUserByEmail, findUserById, updateUserById } from "${relShared}/dao/user.dao${isTS ? '.js' : '.js'}";\n`;
      if (isMultiToken) code += `import { createSession as createSessionInDb, findSessionByRefreshTokenandSessionId, deleteSessionByRefreshTokenandSessionId, deleteSessionByUserId } from "${relShared}/dao/session.dao${isTS ? '.js' : '.js'}";\n`;
      if (hasTokenDao) code += `import { createToken, findTokenByValue, deleteTokenByValue, deleteTokenByEmail } from "${relShared}/dao/token.dao${isTS ? '.js' : '.js'}";\n`;
    }
    code += `import NotFound from "${relShared}/errors/NotFound.error${isTS ? '.js' : '.js'}";\n`;
    code += `import Unauthorized from "${relShared}/errors/Unauthorized.error${isTS ? '.js' : '.js'}";\n`;
    code += `import Created from "${relShared}/responses/Created.response${isTS ? '.js' : '.js'}";\n`;
    code += `import Ok from "${relShared}/responses/Ok.response${isTS ? '.js' : '.js'}";\n`;
    code += `import createSession from "${relShared}/utils/createSession.util${isTS ? '.js' : '.js'}";\n`;
    if (hasGoogle) code += `import { getGoogleAuthorizationUrl, getGoogleUserFromCode, verifyGoogleToken } from "${relShared}/utils/googleAuth.util${isTS ? '.js' : '.js'}";\n`;
    if (hasTokenDao) code += `import sendMail from "${relShared}/utils/sendMail.util${isTS ? '.js' : '.js'}";\n`;
    if (hasTokenDao) {
      let tokenUtils = [];
      if (hasEmailVerif) tokenUtils.push('generateOTPToken');
      if (hasForgotPass || hasGoogle) tokenUtils.push('generateResetPasswordToken');
      if (tokenUtils.length > 0) {
        code += `import { ${tokenUtils.join(', ')} } from "${relShared}/utils/token.util${isTS ? '.js' : '.js'}";\n\n`;
      }
    } else if (hasGoogle) {
      code += `import { generateResetPasswordToken } from "${relShared}/utils/token.util${isTS ? '.js' : '.js'}";\n\n`;
    } else {
      code += `\n`;
    }
  } else {
    code += `// Importing modules\n`;
    code += `const env = require("${relShared}/config/env.config");\n`;
    if (hasEmailVerif || hasForgotPass) {
      let constImports = [];
      if (hasEmailVerif) constImports.push('OTP_EXPIRY_TIME');
      if (hasForgotPass) constImports.push('RESET_PASSWORD_TOKEN_EXPIRY_TIME');
      code += `const { ${constImports.join(', ')} } = require("${relShared}/constants/tokens.constants");\n`;
    }
    if (isClass) {
      code += `const UserDao = require("${relShared}/dao/user.dao");\n`;
      if (isMultiToken) code += `const SessionDao = require("${relShared}/dao/session.dao");\n`;
      if (hasTokenDao) code += `const TokenDao = require("${relShared}/dao/token.dao");\n`;
    } else {
      code += `const { createUser, findUserByEmail, findUserById, updateUserById } = require("${relShared}/dao/user.dao");\n`;
      if (isMultiToken) code += `const { createSession: createSessionInDb, findSessionByRefreshTokenandSessionId, deleteSessionByRefreshTokenandSessionId, deleteSessionByUserId } = require("${relShared}/dao/session.dao");\n`;
      if (hasTokenDao) code += `const { createToken, findTokenByValue, deleteTokenByValue, deleteTokenByEmail } = require("${relShared}/dao/token.dao");\n`;
    }
    code += `const NotFound = require("${relShared}/errors/NotFound.error");\n`;
    code += `const Unauthorized = require("${relShared}/errors/Unauthorized.error");\n`;
    code += `const Created = require("${relShared}/responses/Created.response");\n`;
    code += `const Ok = require("${relShared}/responses/Ok.response");\n`;
    code += `const createSession = require("${relShared}/utils/createSession.util");\n`;
    if (hasGoogle) code += `const { getGoogleAuthorizationUrl, getGoogleUserFromCode, verifyGoogleToken } = require("${relShared}/utils/googleAuth.util");\n`;
    if (hasTokenDao) code += `const sendMail = require("${relShared}/utils/sendMail.util");\n`;
    if (hasTokenDao) {
      let tokenUtils = [];
      if (hasEmailVerif) tokenUtils.push('generateOTPToken');
      if (hasForgotPass || hasGoogle) tokenUtils.push('generateResetPasswordToken');
      if (tokenUtils.length > 0) {
        code += `const { ${tokenUtils.join(', ')} } = require("${relShared}/utils/token.util");\n\n`;
      }
    } else if (hasGoogle) {
      code += `const { generateResetPasswordToken } = require("${relShared}/utils/token.util");\n\n`;
    } else {
      code += `\n`;
    }
  }

  if (isClass) {
    code += `// class to handle public authentication operations\n`;
    code += `class AuthController {\n`;
    if (isTS) {
      code += `\tuserDao: UserDao;\n`;
      if (isMultiToken) code += `\tsessionDao: SessionDao;\n`;
      if (hasTokenDao) code += `\ttokenDao: TokenDao;\n\n`;
    } else {
      code += `\n`;
    }
    code += `\tconstructor() {\n`;
    code += `\t\t// initializing the user dao\n`;
    code += `\t\tthis.userDao = new UserDao();\n\n`;
    if (isMultiToken) {
      code += `\t\t// initializing the session dao\n`;
      code += `\t\tthis.sessionDao = new SessionDao();\n\n`;
    }
    if (hasTokenDao) {
      code += `\t\t// initializing the token dao\n`;
      code += `\t\tthis.tokenDao = new TokenDao();\n`;
    }
    code += `\t}\n\n`;

    code += `\t// signup a new user\n`;
    code += `\tsignup = async (req${isTS ? ': SignupRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
    code += `\t\t// getting the user from the request body\n`;
    code += `\t\tconst { name, email, password, token } = req.body;\n\n`;
    code += `\t\t// creating a new user using the user dao\n`;
    code += `\t\tconst user = await this.userDao.createUser({\n`;
    code += `\t\t\tname,\n`;
    code += `\t\t\temail,\n`;
    code += `\t\t\tpassword,\n`;
    if (hasGoogle) code += `\t\t\tproviders: ["local"],\n`;
    code += `\t\t\tisVerified: ${hasEmailVerif ? 'token ? true : false' : 'true'},\n`;
    code += `\t\t});\n\n`;
    code += `\t\t// creating session and tokens\n`;
    code += `\t\tconst ${isMultiToken ? '{ sanitizedUser, accessToken }' : '{ sanitizedUser, token: authToken }'} = await createSession(\n`;
    code += `\t\t\tuser,\n`;
    code += `\t\t\tres,\n`;
    code += `\t\t);\n\n`;
    if (hasEmailVerif) {
      code += `\t\t// generating the otp to verify the user email\n`;
      code += `\t\tconst otp = generateOTPToken();\n\n`;
      code += `\t\t// setting otp in the database using the token dao\n`;
      code += `\t\tawait this.tokenDao.createToken({\n`;
      code += `\t\t\temail: user.email,\n`;
      code += `\t\t\ttype: "otp",\n`;
      code += `\t\t\tvalue: otp,\n`;
      code += `\t\t\texpiresAt: new Date(Date.now() + OTP_EXPIRY_TIME),\n`;
      code += `\t\t});\n\n`;
      code += `\t\tsendMail(\n`;
      code += `\t\t\tuser.email,\n`;
      code += `\t\t\t"Verify your email",\n`;
      code += `\t\t\t\`Your OTP is \${otp}. It will expire in \${OTP_EXPIRY_TIME / 60000} minutes.\`,\n`;
      code += `\t\t);\n\n`;
      code += `\t\t// returning otp verification response with access token\n`;
      code += `\t\treturn Created(res, "Otp Sent Successfully for verification", {\n`;
      code += `\t\t\tuser: sanitizedUser,\n`;
      code += `\t\t\t${isMultiToken ? 'accessToken: accessToken' : 'token: authToken'},\n`;
      code += `\t\t});\n`;
    } else {
      code += `\t\t// returning the registered user with access token\n`;
      code += `\t\treturn Created(res, "User signed up successfully", {\n`;
      code += `\t\t\tuser: sanitizedUser,\n`;
      code += `\t\t\t${isMultiToken ? 'accessToken: accessToken' : 'token: authToken'},\n`;
      code += `\t\t});\n`;
    }
    code += `\t};\n\n`;

    code += `\t// login an existing user\n`;
    code += `\tlogin = async (req${isTS ? ': LoginRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
    code += `\t\t// getting the user from the request body\n`;
    code += `\t\tconst { email, password } = req.body;\n\n`;
    code += `\t\t// finding the user using the user dao\n`;
    code += `\t\tconst user = await this.userDao.findUserByEmail(email);\n\n`;
    code += `\t\t// checking if the user exists\n`;
    code += `\t\tif (!user) {\n`;
    code += `\t\t\tthrow new NotFound("User not found");\n`;
    code += `\t\t}\n\n`;
    code += `\t\t// checking if the password is valid\n`;
    if (isTS) {
      code += `\t\tconst userWithAuth = user as unknown as { comparePassword(password: string): Promise<boolean> };\n`;
      code += `\t\tconst isPasswordValid = await userWithAuth.comparePassword(password || "");\n\n`;
    } else {
      code += `\t\tconst isPasswordValid = await user.comparePassword(password);\n\n`;
    }
    code += `\t\t// if the password is not valid, throw an unauthorized error\n`;
    code += `\t\tif (!isPasswordValid) {\n`;
    code += `\t\t\tthrow new Unauthorized("Invalid email or password");\n`;
    code += `\t\t}\n\n`;
    code += `\t\t// creating session and tokens\n`;
    code += `\t\tconst ${isMultiToken ? '{ sanitizedUser, accessToken }' : '{ sanitizedUser, token: authToken }'} = await createSession(\n`;
    code += `\t\t\tuser,\n`;
    code += `\t\t\tres,\n`;
    code += `\t\t);\n\n`;
    code += `\t\t// returning the logged in user with access token\n`;
    code += `\t\treturn Ok(res, "User Logged in Successfully", {\n`;
    code += `\t\t\tuser: sanitizedUser,\n`;
    code += `\t\t\t${isMultiToken ? 'accessToken: accessToken' : 'token: authToken'},\n`;
    code += `\t\t});\n`;
    code += `\t};\n\n`;

    code += `\t// get authenticated user profile\n`;
    code += `\tme = async (req${isTS ? ': AuthenticatedRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
    code += `\t\t// returning the authenticated user profile\n`;
    code += `\t\treturn Ok(res, "User profile fetched successfully", { user: req.user });\n`;
    code += `\t};\n\n`;

    if (isMultiToken) {
      code += `\t// refresh access token\n`;
      code += `\trefresh = async (req${isTS ? ': SessionRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\t// getting the session and refresh token from the request\n`;
      code += `\t\tconst { session, refreshToken } = req;\n\n`;
      code += `\t\t// checking if the session and refresh token are present\n`;
      code += `\t\tif (!session || !refreshToken) {\n`;
      code += `\t\t\tthrow new Unauthorized("Session expired or invalid");\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// getting the session id from the decoded session\n`;
      code += `\t\tconst sessionId = (session${isTS ? ' as unknown as Record<string, unknown>' : ''}).sessionId${isTS ? ' as string' : ''};\n\n`;
      code += `\t\t// finding the session in the database\n`;
      code += `\t\tconst dbSession = await this.sessionDao.findSessionByRefreshTokenandSessionId(refreshToken, sessionId);\n\n`;
      code += `\t\t// checking if the session exists\n`;
      code += `\t\tif (!dbSession) {\n`;
      code += `\t\t\tthrow new Unauthorized("Session expired or invalid");\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// getting the user from the session\n`;
      code += `\t\tconst dbUserId = String((dbSession${isTS ? ' as unknown as Record<string, unknown>' : ''}).userId || "");\n`;
      code += `\t\tconst user = await this.userDao.findUserById(dbUserId);\n\n`;
      code += `\t\t// checking if the user exists\n`;
      code += `\t\tif (!user) {\n`;
      code += `\t\t\tthrow new Unauthorized("Session expired or invalid");\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// creating session and tokens\n`;
      code += `\t\tconst { sanitizedUser, accessToken } = await createSession(\n`;
      code += `\t\t\tuser,\n`;
      code += `\t\t\tres,\n`;
      code += `\t\t);\n\n`;
      code += `\t\t// deleting the old session\n`;
      code += `\t\tawait this.sessionDao.deleteSessionByRefreshTokenandSessionId(refreshToken, sessionId);\n\n`;
      code += `\t\t// returning the refreshed tokens\n`;
      code += `\t\treturn Ok(res, "Token refreshed successfully", {\n`;
      code += `\t\t\tuser: sanitizedUser,\n`;
      code += `\t\t\taccessToken: accessToken,\n`;
      code += `\t\t});\n`;
      code += `\t};\n\n`;
    }

    code += `\t// logout user\n`;
    code += `\tlogout = async (req${isTS ? ': ' + (isMultiToken ? 'SessionRequest' : 'AuthenticatedRequest') : ''}, res${isTS ? ': Response' : ''}) => {\n`;
    if (isMultiToken) {
      code += `\t\t// getting the session and refresh token from the request\n`;
      code += `\t\tconst { session, refreshToken } = req;\n\n`;
      code += `\t\t// deleting the session if present\n`;
      code += `\t\tif (refreshToken && session) {\n`;
      code += `\t\t\tawait this.sessionDao.deleteSessionByRefreshTokenandSessionId(refreshToken, session.sessionId);\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// clearing the refresh token cookie\n`;
      code += `\t\tres.clearCookie("refreshToken");\n\n`;
    } else {
      code += `\t\t// clearing the token cookie\n`;
      code += `\t\tres.clearCookie("token");\n\n`;
    }
    code += `\t\t// returning success response\n`;
    code += `\t\treturn Ok(res, "Logged out successfully");\n`;
    code += `\t};\n\n`;

    if (isMultiToken) {
      code += `\t// logout user from all active sessions\n`;
      code += `\tlogoutAll = async (req${isTS ? ': AuthenticatedRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\t// getting the user id from the request\n`;
      code += `\t\tconst userId = (req.user?._id || req.user?.userId)${isTS ? ' as string' : ''};\n\n`;
      code += `\t\t// deleting all sessions for the user\n`;
      code += `\t\tawait this.sessionDao.deleteSessionByUserId(userId);\n\n`;
      code += `\t\t// clearing the refresh token cookie\n`;
      code += `\t\tres.clearCookie("refreshToken");\n\n`;
      code += `\t\t// returning success response\n`;
      code += `\t\treturn Ok(res, "Logged out from all sessions successfully");\n`;
      code += `\t};\n\n`;
    }

    if (hasGoogle) {
      code += `\t// login via google credential token\n`;
      code += `\tgoogleLogin = async (req${isTS ? ': GoogleLoginRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\t// getting the credential from the request body\n`;
      code += `\t\tconst { credential } = req.body;\n\n`;
      code += `\t\t// verifying the Google credential token\n`;
      code += `\t\tconst googleUser = await verifyGoogleToken(credential);\n\n`;
      code += `\t\t// finding the user by email\n`;
      code += `\t\tlet user = await this.userDao.findUserByEmail(googleUser.email);\n\n`;
      code += `\t\tif (user) {\n`;
      code += `\t\t\t// checking if the user already has google provider\n`;
      code += `\t\t\tif (!user.providers.includes("google")) {\n`;
      code += `\t\t\t\t// adding google to the providers list and setting googleId\n`;
      code += `\t\t\t\tuser = await this.userDao.updateUserById(${isTS ? 'user._id.toString()' : 'user._id'}, {\n`;
      code += `\t\t\t\t\t$addToSet: { providers: "google" },\n`;
      code += `\t\t\t\t\tgoogleId: googleUser.googleId,\n`;
      code += `\t\t\t\t});\n`;
      code += `\t\t\t}\n`;
      code += `\t\t} else {\n`;
      code += `\t\t\t// creating a new user with google provider\n`;
      code += `\t\t\tuser = await this.userDao.createUser({\n`;
      code += `\t\t\t\tname: googleUser.name,\n`;
      code += `\t\t\t\temail: googleUser.email,\n`;
      code += `\t\t\t\tproviders: ["google"],\n`;
      code += `\t\t\t\tgoogleId: googleUser.googleId,\n`;
      code += `\t\t\t\tisVerified: true,\n`;
      code += `\t\t\t});\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// creating session and tokens\n`;
      code += `\t\tconst ${isMultiToken ? '{ sanitizedUser, accessToken }' : '{ sanitizedUser, token: authToken }'} = await createSession(\n`;
      code += `\t\t\tuser${isTS ? '!' : ''},\n`;
      code += `\t\t\tres,\n`;
      code += `\t\t);\n\n`;
      code += `\t\t// returning the google logged in user with access token\n`;
      code += `\t\treturn Ok(res, "User Logged in Successfully via Google", {\n`;
      code += `\t\t\tuser: sanitizedUser,\n`;
      code += `\t\t\t${isMultiToken ? 'accessToken: accessToken' : 'token: authToken'},\n`;
      code += `\t\t});\n`;
      code += `\t};\n\n`;

      code += `\t// redirect user to google oauth authorization page\n`;
      code += `\tgoogleRedirect = (req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\tconst state = generateResetPasswordToken(32);\n\n`;
      code += `\t\t// setting the google oauth state cookie\n`;
      code += `\t\tres.cookie("googleOAuthState", state, {\n`;
      code += `\t\t\thttpOnly: true,\n`;
      code += `\t\t\tsecure: env.NODE_ENV === "production",\n`;
      code += `\t\t\tsameSite: "lax",\n`;
      code += `\t\t\tmaxAge: 10 * 60 * 1000,\n`;
      code += `\t\t});\n\n`;
      code += `\t\t// capturing client origin from referer or query\n`;
      code += `\t\tlet clientOrigin = env.FRONTEND_URL;\n`;
      code += `\t\tif (req.headers.referer) {\n`;
      code += `\t\t\ttry {\n`;
      code += `\t\t\t\tclientOrigin = new URL(req.headers.referer).origin;\n`;
      code += `\t\t\t} catch (err) {\n`;
      code += `\t\t\t\t// ignore invalid URL referers\n`;
      code += `\t\t\t}\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// setting the google oauth origin cookie\n`;
      code += `\t\tres.cookie("googleOAuthOrigin", clientOrigin, {\n`;
      code += `\t\t\thttpOnly: true,\n`;
      code += `\t\t\tsecure: env.NODE_ENV === "production",\n`;
      code += `\t\t\tsameSite: "lax",\n`;
      code += `\t\t\tmaxAge: 10 * 60 * 1000,\n`;
      code += `\t\t});\n\n`;
      code += `\t\t// returning the redirect to google authorization url\n`;
      code += `\t\treturn res.redirect(getGoogleAuthorizationUrl(state));\n`;
      code += `\t};\n\n`;

      code += `\t// handle google oauth callback\n`;
      code += `\tgoogleCallback = async (req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\tconst { code, state, error } = req.query;\n`;
      code += `\t\tconst cookies = ${isTS ? '(req.cookies as Record<string, string>)' : 'req.cookies'};\n`;
      code += `\t\tconst clientOrigin = cookies?.googleOAuthOrigin || env.FRONTEND_URL;\n`;
      code += `\t\tconst redirectToLogin = \`\${clientOrigin}/login?googleError=1\`;\n\n`;
      code += `\t\t// redirecting to login if state is invalid or error\n`;
      code += `\t\tconst isStateValid = state && state === cookies?.googleOAuthState;\n`;
      code += `\t\tif (\n`;
      code += `\t\t\terror ||\n`;
      code += `\t\t\t!code ||\n`;
      code += `\t\t\t!state ||\n`;
      code += `\t\t\t(!isStateValid && env.NODE_ENV === "production")\n`;
      code += `\t\t) {\n`;
      code += `\t\t\tres.clearCookie("googleOAuthState");\n`;
      code += `\t\t\tres.clearCookie("googleOAuthOrigin");\n`;
      code += `\t\t\treturn res.redirect(redirectToLogin);\n`;
      code += `\t\t}\n\n`;
      code += `\t\tres.clearCookie("googleOAuthState");\n`;
      code += `\t\tres.clearCookie("googleOAuthOrigin");\n\n`;
      code += `\t\t// fetching the google user using the authorization code\n`;
      code += `\t\tconst googleUser = await getGoogleUserFromCode(${isTS ? 'code as string' : 'code'});\n`;
      code += `\t\tlet user = await this.userDao.findUserByEmail(googleUser.email);\n\n`;
      code += `\t\tif (user && !user.providers.includes("google")) {\n`;
      code += `\t\t\t// adding google provider to existing user\n`;
      code += `\t\t\tuser = await this.userDao.updateUserById(${isTS ? 'user._id.toString()' : 'user._id'}, {\n`;
      code += `\t\t\t\t$addToSet: { providers: "google" },\n`;
      code += `\t\t\t\tgoogleId: googleUser.googleId,\n`;
      code += `\t\t\t\tisVerified: true,\n`;
      code += `\t\t\t});\n`;
      code += `\t\t} else if (!user) {\n`;
      code += `\t\t\t// creating a new user from google profile\n`;
      code += `\t\t\tuser = await this.userDao.createUser({\n`;
      code += `\t\t\t\tname: googleUser.name,\n`;
      code += `\t\t\t\temail: googleUser.email,\n`;
      code += `\t\t\t\tproviders: ["google"],\n`;
      code += `\t\t\t\tgoogleId: googleUser.googleId,\n`;
      code += `\t\t\t\tisVerified: true,\n`;
      code += `\t\t\t});\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// creating session for the authenticated user\n`;
      code += `\t\tawait createSession(user${isTS ? '!' : ''}, res);\n\n`;
      code += `\t\t// returning redirect to dashboard\n`;
      code += `\t\treturn res.redirect(\`\${clientOrigin}/dashboard\`);\n`;
      code += `\t};\n\n`;
    }

    if (hasForgotPass) {
      code += `\t// send password reset email\n`;
      code += `\tforgotPassword = async (req${isTS ? ': ForgotPasswordRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\t// getting the email from the request body\n`;
      code += `\t\tconst { email } = req.body;\n\n`;
      code += `\t\t// deleting any existing reset token for this email\n`;
      code += `\t\tawait this.tokenDao.deleteTokenByEmail(email, "reset");\n\n`;
      code += `\t\t// generating the new reset token\n`;
      code += `\t\tconst resetToken = generateResetPasswordToken();\n\n`;
      code += `\t\t// setting the reset token in the database\n`;
      code += `\t\tawait this.tokenDao.createToken({\n`;
      code += `\t\t\temail: email,\n`;
      code += `\t\t\ttype: "reset",\n`;
      code += `\t\t\tvalue: resetToken,\n`;
      code += `\t\t\texpiresAt: new Date(Date.now() + RESET_PASSWORD_TOKEN_EXPIRY_TIME),\n`;
      code += `\t\t});\n\n`;
      code += `\t\t// sending the reset password token as a magic link to the email\n`;
      code += `\t\tsendMail(\n`;
      code += `\t\t\temail,\n`;
      code += `\t\t\t"Your reset Password Link",\n`;
      code += `\t\t\t\`Click the link and reset your password <a href="\${env.FRONTEND_URL}/reset-password/\${resetToken}">Reset Your Password</a>\`,\n`;
      code += `\t\t);\n\n`;
      code += `\t\t// returning success response\n`;
      code += `\t\treturn Ok(res, "Reset password Mail sent Successfully");\n`;
      code += `\t};\n\n`;

      code += `\t// reset password using token\n`;
      code += `\tresetPassword = async (req${isTS ? ': ResetPasswordRequest' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
      code += `\t\t// getting the token from the request body\n`;
      code += `\t\tconst { token, password } = req.body;\n\n`;
      code += `\t\t// finding the reset token in the database\n`;
      code += `\t\tconst resetToken = await this.tokenDao.findTokenByValue(token);\n\n`;
      code += `\t\tif (!resetToken) {\n`;
      code += `\t\t\tthrow new NotFound("Reset token not found.");\n`;
      code += `\t\t}\n\n`;
      code += `\t\t// finding the user from the email\n\t\tconst tokenEmail = ${isTS ? '(resetToken as unknown as { email: string }).email' : 'resetToken.email'};\n\t\tconst user = await this.userDao.findUserByEmail(tokenEmail);\n\n`;
      code += `\t\t// setting the new password\n`;
      if (isTS) {
        code += `\t\tconst userDoc = user as unknown as { password?: string; save(): Promise<unknown> };\n`;
        code += `\t\tuserDoc.password = password;\n\n`;
        code += `\t\t// saving the user with the new password\n`;
        code += `\t\tawait userDoc.save();\n\n`;
      } else {
        code += `\t\tuser.password = password;\n\n`;
        code += `\t\t// saving the user with the new password\n`;
        code += `\t\tawait user.save();\n\n`;
      }
      code += `\t\t// deleting the token after successful reset\n`;
      code += `\t\tawait this.tokenDao.deleteTokenByValue(token);\n\n`;
      code += `\t\t// returning success response\n`;
      code += `\t\treturn Ok(res, "Password reset Successfully");\n`;
      code += `\t};\n`;
    }

    code += `}\n\n`;
    code += `${isESM ? 'export default AuthController;' : 'module.exports = AuthController;'}\n`;
  } else {
    // Function Based Controller
    code += `// function to signup a new user\n`;
    code += `async function signup(req${isTS ? ': SignupRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
    code += `    // getting the user data from the request body\n`;
    code += `    const { name, email, password, token } = req.body;\n\n`;
    code += `    // creating a new user\n`;
    code += `    const user = await createUser({\n`;
    code += `        name,\n`;
    code += `        email,\n`;
    code += `        password,\n`;
    if (hasGoogle) code += `        providers: ["local"],\n`;
    code += `        isVerified: ${hasEmailVerif ? 'token ? true : false' : 'true'},\n`;
    code += `    });\n\n`;
    code += `    // creating session and tokens\n`;
    code += `    const ${isMultiToken ? '{ sanitizedUser, accessToken }' : '{ sanitizedUser, token: authToken }'} = await createSession(user, res);\n\n`;
    if (hasEmailVerif) {
      code += `    // generating the otp to verify the user email\n`;
      code += `    const otp = generateOTPToken();\n\n`;
      code += `    // setting otp in the database\n`;
      code += `    await createToken({\n`;
      code += `        email: user.email,\n`;
      code += `        type: "otp",\n`;
      code += `        value: otp,\n`;
      code += `        expiresAt: new Date(Date.now() + OTP_EXPIRY_TIME),\n`;
      code += `    });\n\n`;
      code += `    // sending otp email for verification\n`;
      code += `    sendMail(\n`;
      code += `        user.email,\n`;
      code += `        "Verify your email",\n`;
      code += `        \`Your OTP is \${otp}. It will expire in \${OTP_EXPIRY_TIME / 60000} minutes.\`,\n`;
      code += `    );\n\n`;
      code += `    // returning otp verification response\n`;
      code += `    return Created(res, "Otp Sent Successfully for verification", {\n`;
      code += `        user: sanitizedUser,\n`;
      code += `        ${isMultiToken ? 'accessToken' : 'token: authToken'},\n`;
      code += `    });\n`;
    } else {
      code += `    // returning the created user\n`;
      code += `    return Created(res, "User signed up successfully", {\n`;
      code += `        user: sanitizedUser,\n`;
      code += `        ${isMultiToken ? 'accessToken' : 'token: authToken'},\n`;
      code += `    });\n`;
    }
    code += `}\n\n`;

    code += `// function to login an existing user\n`;
    code += `async function login(req${isTS ? ': LoginRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
    code += `    // getting the credentials from the request body\n`;
    code += `    const { email, password } = req.body;\n\n`;
    code += `    // finding the user by email\n`;
    code += `    const user = await findUserByEmail(email);\n\n`;
    code += `    // checking if the user exists\n`;
    code += `    if (!user) {\n`;
    code += `        throw new NotFound("User not found");\n`;
    code += `    }\n\n`;
    code += `    // checking if the password is valid\n`;
    if (isTS) {
      code += `    const userWithAuth = user as unknown as { comparePassword(password: string): Promise<boolean> };\n`;
      code += `    const isPasswordValid = await userWithAuth.comparePassword(password || "");\n\n`;
    } else {
      code += `    const isPasswordValid = await user.comparePassword(password);\n\n`;
    }
    code += `    // if the password is not valid, throw an unauthorized error\n`;
    code += `    if (!isPasswordValid) {\n`;
    code += `        throw new Unauthorized("Invalid email or password");\n`;
    code += `    }\n\n`;
    code += `    // creating session and tokens\n`;
    code += `    const ${isMultiToken ? '{ sanitizedUser, accessToken }' : '{ sanitizedUser, token: authToken }'} = await createSession(user, res);\n\n`;
    code += `    // returning the logged in user\n`;
    code += `    return Ok(res, "User Logged in Successfully", {\n`;
    code += `        user: sanitizedUser,\n`;
    code += `        ${isMultiToken ? 'accessToken' : 'token: authToken'},\n`;
    code += `    });\n`;
    code += `}\n\n`;

    code += `// function to get authenticated user profile\n`;
    code += `async function me(req${isTS ? ': AuthenticatedRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
    code += `    // returning the authenticated user profile\n`;
    code += `    return Ok(res, "User profile fetched successfully", { user: req.user });\n`;
    code += `}\n\n`;

    if (isMultiToken) {
      code += `// function to refresh access token\n`;
      code += `async function refresh(req${isTS ? ': SessionRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    // getting the session and refresh token from the request\n`;
      code += `    const { session, refreshToken } = req;\n\n`;
      code += `    // checking if the session and refresh token are present\n`;
      code += `    if (!session || !refreshToken) {\n`;
      code += `        throw new Unauthorized("Session expired or invalid");\n`;
      code += `    }\n\n`;
      code += `    // getting the session id from the decoded session\n`;
      code += `    const sessionId = (session${isTS ? ' as unknown as Record<string, unknown>' : ''}).sessionId${isTS ? ' as string' : ''};\n\n`;
      code += `    // finding the session in the database\n`;
      code += `    const dbSession = await findSessionByRefreshTokenandSessionId(refreshToken, sessionId);\n\n`;
      code += `    // checking if the session exists\n`;
      code += `    if (!dbSession) {\n`;
      code += `        throw new Unauthorized("Session expired or invalid");\n`;
      code += `    }\n\n`;
      code += `    // getting the user from the session\n`;
      code += `    const dbUserId = String((dbSession${isTS ? ' as unknown as Record<string, unknown>' : ''}).userId || "");\n`;
      code += `    const user = await findUserById(dbUserId);\n\n`;
      code += `    // checking if the user exists\n`;
      code += `    if (!user) {\n`;
      code += `        throw new Unauthorized("Session expired or invalid");\n`;
      code += `    }\n\n`;
      code += `    // creating new session and tokens\n`;
      code += `    const { sanitizedUser, accessToken } = await createSession(user, res);\n\n`;
      code += `    // deleting the old session\n`;
      code += `    await deleteSessionByRefreshTokenandSessionId(refreshToken, sessionId);\n\n`;
      code += `    // returning the refreshed tokens\n`;
      code += `    return Ok(res, "Token refreshed successfully", {\n`;
      code += `        user: sanitizedUser,\n`;
      code += `        accessToken,\n`;
      code += `    });\n`;
      code += `}\n\n`;
    }

    code += `// function to logout user\n`;
    code += `async function logout(req${isTS ? ': ' + (isMultiToken ? 'SessionRequest' : 'AuthenticatedRequest') : ''}, res${isTS ? ': Response' : ''}) {\n`;
    if (isMultiToken) {
      code += `    // getting the session and refresh token from the request\n`;
      code += `    const { session, refreshToken } = req;\n\n`;
      code += `    // deleting the session if present\n`;
      code += `    if (refreshToken && session) {\n`;
      code += `        await deleteSessionByRefreshTokenandSessionId(refreshToken, session.sessionId);\n`;
      code += `    }\n\n`;
      code += `    // clearing the refresh token cookie\n`;
      code += `    res.clearCookie("refreshToken");\n\n`;
    } else {
      code += `    // clearing the token cookie\n`;
      code += `    res.clearCookie("token");\n\n`;
    }
    code += `    // returning success response\n`;
    code += `    return Ok(res, "Logged out successfully");\n`;
    code += `}\n\n`;

    if (isMultiToken) {
      code += `// function to logout user from all active sessions\n`;
      code += `async function logoutAll(req${isTS ? ': AuthenticatedRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    // getting the user id from the request\n`;
      code += `    const userId = (req.user?._id || req.user?.userId)${isTS ? ' as string' : ''};\n\n`;
      code += `    // deleting all sessions for the user\n`;
      code += `    await deleteSessionByUserId(userId);\n\n`;
      code += `    // clearing the refresh token cookie\n`;
      code += `    res.clearCookie("refreshToken");\n\n`;
      code += `    // returning success response\n`;
      code += `    return Ok(res, "Logged out from all sessions successfully");\n`;
      code += `}\n\n`;
    }

    if (hasGoogle) {
      code += `// login via google credential token\n`;
      code += `async function googleLogin(req${isTS ? ': GoogleLoginRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    // getting the credential from the request body\n`;
      code += `    const { credential } = req.body;\n\n`;
      code += `    // verifying the google credential token\n`;
      code += `    const googleUser = await verifyGoogleToken(credential);\n\n`;
      code += `    // finding the user by email\n`;
      code += `    let user = await findUserByEmail(googleUser.email);\n\n`;
      code += `    if (user) {\n`;
      code += `        // checking if the user already has google provider\n`;
      code += `        if (!user.providers.includes("google")) {\n`;
      code += `            // adding google to the providers list\n`;
      code += `            user = await updateUserById(${isTS ? 'user._id.toString()' : 'user._id'}, {\n`;
      code += `                $addToSet: { providers: "google" },\n`;
      code += `                googleId: googleUser.googleId,\n`;
      code += `            });\n`;
      code += `        }\n`;
      code += `    } else {\n`;
      code += `        // creating a new user with google provider\n`;
      code += `        user = await createUser({\n`;
      code += `            name: googleUser.name,\n`;
      code += `            email: googleUser.email,\n`;
      code += `            providers: ["google"],\n`;
      code += `            googleId: googleUser.googleId,\n`;
      code += `            isVerified: true,\n`;
      code += `        });\n`;
      code += `    }\n\n`;
      code += `    // creating session and tokens\n`;
      code += `    const ${isMultiToken ? '{ sanitizedUser, accessToken }' : '{ sanitizedUser, token: authToken }'} = await createSession(user${isTS ? '!' : ''}, res);\n\n`;
      code += `    // returning the google logged in user\n`;
      code += `    return Ok(res, "User Logged in Successfully via Google", {\n`;
      code += `        user: sanitizedUser,\n`;
      code += `        ${isMultiToken ? 'accessToken' : 'token: authToken'},\n`;
      code += `    });\n`;
      code += `}\n\n`;

      code += `// redirect user to google oauth authorization page\n`;
      code += `function googleRedirect(req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    // generating a random state token\n`;
      code += `    const state = generateResetPasswordToken(32);\n\n`;
      code += `    // setting the google oauth state cookie\n`;
      code += `    res.cookie("googleOAuthState", state, {\n`;
      code += `        httpOnly: true,\n`;
      code += `        secure: env.NODE_ENV === "production",\n`;
      code += `        sameSite: "lax",\n`;
      code += `        maxAge: 10 * 60 * 1000,\n`;
      code += `    });\n\n`;
      code += `    // capturing client origin from referer\n`;
      code += `    let clientOrigin = env.FRONTEND_URL;\n`;
      code += `    if (req.headers.referer) {\n`;
      code += `        try {\n`;
      code += `            clientOrigin = new URL(req.headers.referer).origin;\n`;
      code += `        } catch (err) {\n`;
      code += `            // ignore invalid URL referers\n`;
      code += `        }\n`;
      code += `    }\n\n`;
      code += `    // setting the google oauth origin cookie\n`;
      code += `    res.cookie("googleOAuthOrigin", clientOrigin, {\n`;
      code += `        httpOnly: true,\n`;
      code += `        secure: env.NODE_ENV === "production",\n`;
      code += `        sameSite: "lax",\n`;
      code += `        maxAge: 10 * 60 * 1000,\n`;
      code += `    });\n\n`;
      code += `    // redirecting to google authorization url\n`;
      code += `    return res.redirect(getGoogleAuthorizationUrl(state));\n`;
      code += `}\n\n`;

      code += `// handle google oauth callback\n`;
      code += `async function googleCallback(req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    const { code, state, error } = req.query;\n`;
      code += `    const cookies = ${isTS ? '(req.cookies as Record<string, string>)' : 'req.cookies'};\n`;
      code += `    const clientOrigin = cookies?.googleOAuthOrigin || env.FRONTEND_URL;\n`;
      code += `    const redirectToLogin = \`\${clientOrigin}/login?googleError=1\`;\n\n`;
      code += `    // validating the state token\n`;
      code += `    const isStateValid = state && state === cookies?.googleOAuthState;\n\n`;
      code += `    // redirecting to login if state is invalid or error\n`;
      code += `    if (error || !code || !state || (!isStateValid && env.NODE_ENV === "production")) {\n`;
      code += `        res.clearCookie("googleOAuthState");\n`;
      code += `        res.clearCookie("googleOAuthOrigin");\n`;
      code += `        return res.redirect(redirectToLogin);\n`;
      code += `    }\n\n`;
      code += `    // clearing the oauth cookies\n`;
      code += `    res.clearCookie("googleOAuthState");\n`;
      code += `    res.clearCookie("googleOAuthOrigin");\n\n`;
      code += `    // fetching the google user using the authorization code\n`;
      code += `    const googleUser = await getGoogleUserFromCode(${isTS ? 'code as string' : 'code'});\n\n`;
      code += `    // finding or creating the user\n`;
      code += `    let user = await findUserByEmail(googleUser.email);\n\n`;
      code += `    if (user && !user.providers.includes("google")) {\n`;
      code += `        // adding google provider to existing user\n`;
      code += `        user = await updateUserById(${isTS ? 'user._id.toString()' : 'user._id'}, {\n`;
      code += `            $addToSet: { providers: "google" },\n`;
      code += `            googleId: googleUser.googleId,\n`;
      code += `            isVerified: true,\n`;
      code += `        });\n`;
      code += `    } else if (!user) {\n`;
      code += `        // creating a new user from google profile\n`;
      code += `        user = await createUser({\n`;
      code += `            name: googleUser.name,\n`;
      code += `            email: googleUser.email,\n`;
      code += `            providers: ["google"],\n`;
      code += `            googleId: googleUser.googleId,\n`;
      code += `            isVerified: true,\n`;
      code += `        });\n`;
      code += `    }\n\n`;
      code += `    // creating session for the authenticated user\n`;
      code += `    await createSession(user${isTS ? '!' : ''}, res);\n\n`;
      code += `    // redirecting to dashboard\n`;
      code += `    return res.redirect(\`\${clientOrigin}/dashboard\`);\n`;
      code += `}\n\n`;
    }

    if (hasForgotPass) {
      code += `// send password reset email\n`;
      code += `async function forgotPassword(req${isTS ? ': ForgotPasswordRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    // getting the email from the request body\n`;
      code += `    const { email } = req.body;\n\n`;
      code += `    // deleting any existing reset token for this email\n`;
      code += `    await deleteTokenByEmail(email, "reset");\n\n`;
      code += `    // generating the new reset token\n`;
      code += `    const resetToken = generateResetPasswordToken();\n\n`;
      code += `    // setting the reset token in the database\n`;
      code += `    await createToken({\n`;
      code += `        email: email,\n`;
      code += `        type: "reset",\n`;
      code += `        value: resetToken,\n`;
      code += `        expiresAt: new Date(Date.now() + RESET_PASSWORD_TOKEN_EXPIRY_TIME),\n`;
      code += `    });\n\n`;
      code += `    // sending the reset password link to the email\n`;
      code += `    sendMail(\n`;
      code += `        email,\n`;
      code += `        "Your reset Password Link",\n`;
      code += `        \`Click the link and reset your password <a href="\${env.FRONTEND_URL}/reset-password/\${resetToken}">Reset Your Password</a>\`,\n`;
      code += `    );\n\n`;
      code += `    // returning success response\n`;
      code += `    return Ok(res, "Reset password Mail sent Successfully");\n`;
      code += `}\n\n`;

      code += `// reset password using token\n`;
      code += `async function resetPassword(req${isTS ? ': ResetPasswordRequest' : ''}, res${isTS ? ': Response' : ''}) {\n`;
      code += `    // getting the token and password from the request body\n`;
      code += `    const { token, password } = req.body;\n\n`;
      code += `    // finding the reset token in the database\n`;
      code += `    const resetToken = await findTokenByValue(token);\n\n`;
      code += `    // checking if the reset token exists\n`;
      code += `    if (!resetToken) {\n`;
      code += `        throw new NotFound("Reset token not found.");\n`;
      code += `    }\n\n`;
      code += `    // finding the user from the token email\n`;
      code += `    const tokenEmail = ${isTS ? '(resetToken as unknown as { email: string }).email' : 'resetToken.email'};\n`;
      code += `    const user = await findUserByEmail(tokenEmail);\n\n`;
      code += `    // checking if the user exists\n`;
      code += `    if (!user) {\n`;
      code += `        throw new NotFound("User not found.");\n`;
      code += `    }\n\n`;
      code += `    // setting the new password\n`;
      if (isTS) {
        code += `    const userDoc = user as unknown as { password?: string; save(): Promise<unknown> };\n`;
        code += `    userDoc.password = password;\n\n`;
        code += `    // saving the user with the new password\n`;
        code += `    await userDoc.save();\n\n`;
      } else {
        code += `    user.password = password;\n\n`;
        code += `    // saving the user with the new password\n`;
        code += `    await user.save();\n\n`;
      }
      code += `    // deleting the token after successful reset\n`;
      code += `    await deleteTokenByValue(token);\n\n`;
      code += `    // returning success response\n`;
      code += `    return Ok(res, "Password reset Successfully");\n`;
      code += `}\n\n`;
    }

    let exportsList = ['signup', 'login', 'me', 'logout'];
    if (isMultiToken) exportsList.push('refresh', 'logoutAll');
    if (hasGoogle) exportsList.push('googleLogin', 'googleRedirect', 'googleCallback');
    if (hasForgotPass) exportsList.push('forgotPassword', 'resetPassword');

    if (isESM) {
      code += `export { ${exportsList.join(', ')} };\n`;
    } else {
      code += `module.exports = { ${exportsList.join(', ')} };\n`;
    }
  }

  return config.comments ? code : stripComments(code);
}

export function generateAuthValidators(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isModular = config.folderStructure === 'Modular';
  const hasGoogle = Boolean(config.googleAuth);
  const hasForgotPass = Boolean(config.forgotPassword);

  const validateErrorsPath = isModular ? '../../../shared/utils/validateErrors.util' : '../utils/validateErrors.util';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import { body } from "express-validator";\n`;
    code += `import validateErrors from "${validateErrorsPath}${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const { body } = require("express-validator");\n`;
    code += `const validateErrors = require("${validateErrorsPath}");\n\n`;
  }

  code += `const signupValidators = [\n\n`;
  code += `    // validating the name field\n`;
  code += `    body("name")\n`;
  code += `        .notEmpty()\n`;
  code += `        .withMessage("Name is required")\n`;
  code += `        .isLength({ min: 3 })\n`;
  code += `        .withMessage("Name must be at least 3 characters long"),\n\n`;
  code += `    // validating the email field\n`;
  code += `    body("email")\n`;
  code += `        .notEmpty()\n`;
  code += `        .withMessage("Email is required")\n`;
  code += `        .isEmail()\n`;
  code += `        .withMessage("Email is invalid"),\n\n`;
  code += `    // validating the password field\n`;
  code += `    body("password")\n`;
  code += `        .notEmpty()\n`;
  code += `        .withMessage("Password is required")\n`;
  code += `        .isLength({ min: 6 })\n`;
  code += `        .withMessage("Password must be at least 6 characters long"),\n\n`;
  code += `    // validating errors\n`;
  code += `    validateErrors\n\n`;
  code += `];\n\n`;

  code += `const loginValidators = [\n\n`;
  code += `    // validating the email field\n`;
  code += `    body("email")\n`;
  code += `        .notEmpty()\n`;
  code += `        .withMessage("Email is required")\n`;
  code += `        .isEmail()\n`;
  code += `        .withMessage("Email is invalid"),\n\n`;
  code += `    // validating the password field\n`;
  code += `    body("password")\n`;
  code += `        .notEmpty()\n`;
  code += `        .withMessage("Password is required"),\n\n`;
  code += `    // validating errors\n`;
  code += `    validateErrors\n\n`;
  code += `];\n\n`;

  if (hasForgotPass) {
    code += `const forgotPasswordValidators = [\n\n`;
    code += `    // validating the email field\n`;
    code += `    body("email")\n`;
    code += `        .notEmpty()\n`;
    code += `        .withMessage("Email is required")\n`;
    code += `        .isEmail()\n`;
    code += `        .withMessage("Email is invalid"),\n\n`;
    code += `    // validating errors\n`;
    code += `    validateErrors\n\n`;
    code += `];\n\n`;

    code += `const resetPasswordValidators = [\n\n`;
    code += `    // validating the reset token field\n`;
    code += `    body("token")\n`;
    code += `        .notEmpty()\n`;
    code += `        .withMessage("Reset Token is required"),\n\n`;
    code += `    // validating the new password field\n`;
    code += `    body("password")\n`;
    code += `        .notEmpty()\n`;
    code += `        .withMessage("Password is required")\n`;
    code += `        .isLength({ min: 6 })\n`;
    code += `        .withMessage("Password must be at least 6 characters long"),\n\n`;
    code += `    // validating errors\n`;
    code += `    validateErrors\n\n`;
    code += `];\n\n`;
  }

  if (hasGoogle) {
    code += `const googleLoginValidators = [\n\n`;
    code += `    // validating the credential field\n`;
    code += `    body("credential")\n`;
    code += `        .notEmpty()\n`;
    code += `        .withMessage("Google credential is required"),\n\n`;
    code += `    // validating errors\n`;
    code += `    validateErrors\n\n`;
    code += `];\n\n`;
  }

  let validatorExports = ['signupValidators', 'loginValidators'];
  if (hasForgotPass) validatorExports.push('forgotPasswordValidators', 'resetPasswordValidators');
  if (hasGoogle) validatorExports.push('googleLoginValidators');

  if (isESM) {
    code += `export { ${validatorExports.join(', ')} };\n`;
  } else {
    code += `module.exports = { ${validatorExports.join(', ')} };\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateAuthRoutes(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isClass = config.programmingStyle === 'Class Based';
  const isModular = config.folderStructure === 'Modular';
  const isMultiToken = typeof config.multiToken === 'boolean' ? config.multiToken : (config.tokenStrategy ? config.tokenStrategy.includes('Multi Token') : true);
  const hasGoogle = Boolean(config.googleAuth);
  const hasForgotPass = Boolean(config.forgotPassword);

  const controllerPath = isModular ? './auth.controller' : '../controllers/auth.controller';
  const validatorPath = isModular ? './auth.validator' : '../validators/auth.validator';
  const middlewarePath = isModular ? '../../../shared/middlewares' : '../middlewares';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import express from "express";\n`;
    if (isClass) {
      code += `import AuthController from "${controllerPath}${isTS ? '.js' : '.js'}";\n`;
    } else {
      let handlers = ['signup', 'login', 'me', 'logout'];
      if (isMultiToken) handlers.push('refresh', 'logoutAll');
      if (hasGoogle) handlers.push('googleLogin', 'googleRedirect', 'googleCallback');
      if (hasForgotPass) handlers.push('forgotPassword', 'resetPassword');
      code += `import { ${handlers.join(', ')} } from "${controllerPath}${isTS ? '.js' : '.js'}";\n`;
    }
    let validators = ['signupValidators', 'loginValidators'];
    if (hasForgotPass) validators.push('forgotPasswordValidators', 'resetPasswordValidators');
    if (hasGoogle) validators.push('googleLoginValidators');
    code += `import { ${validators.join(', ')} } from "${validatorPath}${isTS ? '.js' : '.js'}";\n`;
    code += `import authMiddleware from "${middlewarePath}/auth.middleware${isTS ? '.js' : '.js'}";\n`;
    if (isMultiToken) {
      code += `import refreshMiddleware from "${middlewarePath}/refresh.middleware${isTS ? '.js' : '.js'}";\n\n`;
    } else {
      code += `\n`;
    }
  } else {
    code += `// Importing modules\n`;
    code += `const express = require("express");\n`;
    if (isClass) {
      code += `const AuthController = require("${controllerPath}");\n`;
    } else {
      let handlers = ['signup', 'login', 'me', 'logout'];
      if (isMultiToken) handlers.push('refresh', 'logoutAll');
      if (hasGoogle) handlers.push('googleLogin', 'googleRedirect', 'googleCallback');
      if (hasForgotPass) handlers.push('forgotPassword', 'resetPassword');
      code += `const { ${handlers.join(', ')} } = require("${controllerPath}");\n`;
    }
    let validators = ['signupValidators', 'loginValidators'];
    if (hasForgotPass) validators.push('forgotPasswordValidators', 'resetPasswordValidators');
    if (hasGoogle) validators.push('googleLoginValidators');
    code += `const { ${validators.join(', ')} } = require("${validatorPath}");\n`;
    code += `const authMiddleware = require("${middlewarePath}/auth.middleware");\n`;
    if (isMultiToken) {
      code += `const refreshMiddleware = require("${middlewarePath}/refresh.middleware");\n\n`;
    } else {
      code += `\n`;
    }
  }

  code += `// making the router\n`;
  code += `const router = express.Router();\n\n`;

  if (isClass) {
    code += `// creating a auth controller instance\n`;
    code += `const authController = new AuthController();\n\n`;
  }

  code += `/*\n    @route POST /api/auth/signup\n    @desc Signup user\n    @access Public\n*/\n`;
  code += `router.post("/signup", signupValidators, ${isClass ? 'authController.signup' : 'signup'});\n\n`;

  code += `/*\n    @route POST /api/auth/login\n    @desc Login user\n    @access Public\n*/\n`;
  code += `router.post("/login", loginValidators, ${isClass ? 'authController.login' : 'login'});\n\n`;

  code += `/*\n    @route GET /api/auth/me\n    @desc Get authenticated user profile\n    @access Private\n*/\n`;
  code += `router.get("/me", authMiddleware, ${isClass ? 'authController.me' : 'me'});\n\n`;

  if (isMultiToken) {
    code += `/*\n    @route POST /api/auth/refresh\n    @desc Refresh access token\n    @access Public\n*/\n`;
    code += `router.post("/refresh", refreshMiddleware, ${isClass ? 'authController.refresh' : 'refresh'});\n\n`;
  }

  code += `/*\n    @route POST /api/auth/logout\n    @desc Logout user\n    @access Public\n*/\n`;
  code += `router.post("/logout", ${isMultiToken ? 'refreshMiddleware' : 'authMiddleware'}, ${isClass ? 'authController.logout' : 'logout'});\n\n`;

  if (isMultiToken) {
    code += `/*\n    @route POST /api/auth/logoutall\n    @desc Logout user from all active sessions\n    @access Private\n*/\n`;
    code += `router.post("/logoutall", authMiddleware, ${isClass ? 'authController.logoutAll' : 'logoutAll'});\n\n`;
  }

  if (hasGoogle) {
    code += `/*\n    @route POST /api/auth/google-login\n    @desc Login user via Google\n    @access Public\n*/\n`;
    code += `router.post("/google-login", googleLoginValidators, ${isClass ? 'authController.googleLogin' : 'googleLogin'});\n`;
    code += `router.get("/google", ${isClass ? 'authController.googleRedirect' : 'googleRedirect'});\n`;
    code += `router.get("/google/callback", ${isClass ? 'authController.googleCallback' : 'googleCallback'});\n\n`;
  }

  if (hasForgotPass) {
    code += `/*\n    @route POST /api/auth/forgot-password\n    @desc Forgot password\n    @access Public\n*/\n`;
    code += `router.post("/forgot-password", forgotPasswordValidators, ${isClass ? 'authController.forgotPassword' : 'forgotPassword'});\n\n`;

    code += `/*\n    @route POST /api/auth/reset-password\n    @desc Reset password\n    @access Public\n*/\n`;
    code += `router.post("/reset-password", resetPasswordValidators, ${isClass ? 'authController.resetPassword' : 'resetPassword'});\n\n`;
  }

  if (isESM) {
    code += `// exporting the router\n`;
    code += `export default router;\n`;
  } else {
    code += `// exporting the router\n`;
    code += `module.exports = router;\n`;
  }

  return config.comments ? code : stripComments(code);
}
