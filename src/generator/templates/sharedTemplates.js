import { stripComments } from '../utils/commentStripper.js';

export function generateEnvConstants(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  code += `const envConstants = {\n`;
  code += `    PORT: 5000,\n`;
  code += `    NODE_ENV: 'development',\n`;
  code += `    MONGO_URI: 'mongodb://localhost:27017/${config.projectName}',\n`;
  code += `    ACCESS_TOKEN_SECRET: "youraccesstokensecret",\n`;
  code += `    REFRESH_TOKEN_SECRET: "yourrefreshtokensecret",\n`;
  code += `    FRONTEND_URL: "http://localhost:3000",\n`;
  code += `    SMTP_HOST: "localhost",\n`;
  code += `    SMTP_PORT: 587,\n`;
  code += `    SMTP_USER: "username",\n`;
  code += `    SMTP_PASS: "pass",\n`;
  code += `    SENDING_USER: "${config.projectName} <user>",\n`;
  code += `    GOOGLE_CLIENT_ID: "",\n`;
  code += `    GOOGLE_CLIENT_SECRET: "",\n`;
  code += `    GOOGLE_REDIRECT_URI: "http://localhost:5000/api/auth/google/callback",\n`;
  code += `    SEND_MAIL: false,\n`;
  code += `    REDIS_URL: "",\n`;
  code += `    REDIS_HOST: "127.0.0.1",\n`;
  code += `    REDIS_PORT: 6379,\n`;
  code += `    REDIS_PASSWORD: "",\n`;
  code += `}${isTS ? ' as const' : ''};\n\n`;

  if (isESM) {
    code += `export default envConstants;\n`;
  } else {
    code += `module.exports = envConstants;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateEnvConfig(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import { config } from "dotenv";\n`;
    code += `import z from "zod";\n`;
    code += `import envConstants from "../constants/env.constants${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const { config } = require("dotenv");\n`;
    code += `const z = require("zod");\n`;
    code += `const envConstants = require("../constants/env.constants");\n\n`;
  }

  code += `// loading environment variables\n`;
  code += `config();\n\n`;

  code += `// defining the schema for environment variables\n`;
  code += `const envSchema = z.object({\n`;
  code += `    PORT: z.coerce.number().default(envConstants.PORT),\n`;
  code += `    NODE_ENV: z.enum(["development", "production", "test"]).default(envConstants.NODE_ENV),\n`;
  code += `    MONGO_URI: z.string().default(envConstants.MONGO_URI),\n`;
  code += `    ACCESS_TOKEN_SECRET: z.string().default(envConstants.ACCESS_TOKEN_SECRET),\n`;
  code += `    REFRESH_TOKEN_SECRET: z.string().default(envConstants.REFRESH_TOKEN_SECRET),\n`;
  code += `    FRONTEND_URL: z.string().url().default(envConstants.FRONTEND_URL),\n`;
  code += `    SMTP_HOST: z.string().default(envConstants.SMTP_HOST),\n`;
  code += `    SMTP_PORT: z.coerce.number().default(envConstants.SMTP_PORT),\n`;
  code += `    SMTP_USER: z.string().default(envConstants.SMTP_USER),\n`;
  code += `    SMTP_PASS: z.string().default(envConstants.SMTP_PASS),\n`;
  code += `    SENDING_USER: z.string().default(envConstants.SENDING_USER),\n`;
  code += `    GOOGLE_CLIENT_ID: z.string().default(envConstants.GOOGLE_CLIENT_ID),\n`;
  code += `    GOOGLE_CLIENT_SECRET: z.string().default(envConstants.GOOGLE_CLIENT_SECRET),\n`;
  code += `    GOOGLE_REDIRECT_URI: z.string().url().default(envConstants.GOOGLE_REDIRECT_URI),\n`;
  code += `    SEND_MAIL: z.preprocess((val) => {\n`;
  code += `        if (typeof val === "string") return val.toLowerCase() === "true";\n`;
  code += `        return val;\n`;
  code += `    }, z.boolean()).default(envConstants.SEND_MAIL),\n`;
  code += `    REDIS_URL: z.string().default(envConstants.REDIS_URL),\n`;
  code += `    REDIS_HOST: z.string().default(envConstants.REDIS_HOST),\n`;
  code += `    REDIS_PORT: z.coerce.number().default(envConstants.REDIS_PORT),\n`;
  code += `    REDIS_PASSWORD: z.string().default(envConstants.REDIS_PASSWORD),\n`;
  code += `    GROQ_API_KEY: z.string().default(""),\n`;
  code += `});\n\n`;

  code += `// parsing and validating environment variables\n`;
  code += `const parsedEnv = envSchema.safeParse(process.env);\n\n`;

  code += `if (!parsedEnv.success) {\n`;
  code += `    console.error("Invalid environment variables:", parsedEnv.error.format());\n`;
  code += `    process.exit(1);\n`;
  code += `}\n\n`;

  code += `// getting the validated environment variables\n`;
  code += `const env = parsedEnv.data;\n\n`;

  if (isESM) {
    code += `export default env;\n`;
  } else {
    code += `module.exports = env;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateStatusCodes(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  code += `// defining status codes constants\n`;
  code += `const HTTP_STATUS = {\n`;
  code += `    OK: 200,\n`;
  code += `    CREATED: 201,\n`;
  code += `    NO_CONTENT: 204,\n`;
  code += `    BAD_REQUEST: 400,\n`;
  code += `    UNAUTHORIZED: 401,\n`;
  code += `    FORBIDDEN: 403,\n`;
  code += `    NOT_FOUND: 404,\n`;
  code += `    CONFLICT: 409,\n`;
  code += `    UNPROCESSABLE_ENTITY: 422,\n`;
  code += `    INTERNAL_SERVER_ERROR: 500,\n`;
  code += `}${isTS ? ' as const' : ''};\n\n`;

  if (isESM) {
    code += `export default HTTP_STATUS;\n`;
  } else {
    code += `module.exports = HTTP_STATUS;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateApiError(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  code += `// Extending the Error class to create a custom error class for API errors\n`;
  code += `class ApiError extends Error {\n\n`;
  if (isTS) {
    code += `    statusCode: number;\n`;
    code += `    data: unknown;\n\n`;
  }
  code += `    constructor(statusCode${isTS ? ': number' : ''}, message${isTS ? ': string' : ''}, data${isTS ? ': unknown' : ''} = null) {\n\n`;
  code += `        // calling the parent constructor\n`;
  code += `        super(message);\n\n`;
  code += `        // setting the status code and other properties\n`;
  code += `        this.statusCode = statusCode;\n`;
  code += `        this.message = message;\n`;
  code += `        this.data = data;\n\n`;
  code += `    }\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default ApiError;\n`;
  } else {
    code += `module.exports = ApiError;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateSubErrors(config, type) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  const statusMap = {
    BadRequest: { status: 'HTTP_STATUS.BAD_REQUEST', defaultMsg: 'Bad Request' },
    Unauthorized: { status: 'HTTP_STATUS.UNAUTHORIZED', defaultMsg: 'Unauthorized Access' },
    Forbidden: { status: 'HTTP_STATUS.FORBIDDEN', defaultMsg: 'Access Forbidden' },
    NotFound: { status: 'HTTP_STATUS.NOT_FOUND', defaultMsg: 'Resource Not Found' },
    Conflict: { status: 'HTTP_STATUS.CONFLICT', defaultMsg: 'Resource Conflict' }
  };

  const meta = statusMap[type] || statusMap.BadRequest;

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import ApiError from "../utils/ApiError.util${isTS ? '.js' : '.js'}";\n`;
    code += `import HTTP_STATUS from "../constants/StatusCodes.constants${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const ApiError = require("../utils/ApiError.util");\n`;
    code += `const HTTP_STATUS = require("../constants/StatusCodes.constants");\n\n`;
  }

  code += `// class for ${type} error\n`;
  code += `class ${type} extends ApiError {\n\n`;
  code += `    // constructor to initialize the error class\n`;
  code += `    constructor(message${isTS ? ': string' : ''} = "${meta.defaultMsg}") {\n\n`;
  code += `        // calling the parent class constructor\n`;
  code += `        super(${meta.status}, message);\n\n`;
  code += `        // setting the message for the error\n`;
  code += `        this.message = message;\n\n`;
  code += `    }\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default ${type};\n`;
  } else {
    code += `module.exports = ${type};\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateApiResponse(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Function to send API response\n`;
    if (isTS) {
      code += `import { Response } from "express";\n\n`;
    }
  } else {
    code += `// Function to send API response\n`;
  }
  code += `function ApiResponse${isTS ? '<T = unknown>' : ''}(res${isTS ? ': Response' : ''}, statusCode${isTS ? ': number' : ''}, message${isTS ? ': string' : ''}, data${isTS ? ': T | null' : ''} = null) {\n\n`;
  code += `    // sending the response\n`;
  code += `    return res.status(statusCode).json({\n`;
  code += `        success: true,\n`;
  code += `        status: statusCode,\n`;
  code += `        message: message,\n`;
  code += `        data: data\n`;
  code += `    });\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default ApiResponse;\n`;
  } else {
    code += `module.exports = ApiResponse;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateResponseHelpers(config, type) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  const map = {
    Ok: { status: 'HTTP_STATUS.OK', defaultMsg: 'Operation Successful' },
    Created: { status: 'HTTP_STATUS.CREATED', defaultMsg: 'Resource Created Successfully' },
    NoContent: { status: 'HTTP_STATUS.NO_CONTENT', defaultMsg: 'No Content' }
  };

  const meta = map[type] || map.Ok;

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    if (isTS) {
      code += `import { Response } from "express";\n`;
    }
    code += `import ApiResponse from "../utils/ApiResponse.util${isTS ? '.js' : '.js'}";\n`;
    code += `import HTTP_STATUS from "../constants/StatusCodes.constants${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const ApiResponse = require("../utils/ApiResponse.util");\n`;
    code += `const HTTP_STATUS = require("../constants/StatusCodes.constants");\n\n`;
  }

  code += `// function to send the API response\n`;
  code += `function ${type}${isTS ? '<T = unknown>' : ''}(res${isTS ? ': Response' : ''}, message${isTS ? ': string' : ''} = "${meta.defaultMsg}", data${isTS ? ': T | null' : ''} = null) {\n\n`;
  code += `    // sending the response with status code, message and data\n`;
  code += `    return ApiResponse(res, ${meta.status}, message, data);\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default ${type};\n`;
  } else {
    code += `module.exports = ${type};\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateHashingUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import bcrypt from "bcryptjs";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const bcrypt = require("bcryptjs");\n\n`;
  }

  code += `// salt rounds\n`;
  code += `const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? "10", 10);\n\n`;

  code += `// function to hash the password\n`;
  code += `async function hashPassword(password${isTS ? ': string' : ''}) {\n\n`;
  code += `    // hashing the password using bcrypt\n`;
  code += `    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);\n\n`;
  code += `    // returning the hashed password\n`;
  code += `    return hashedPassword;\n\n`;
  code += `}\n\n`;

  code += `// function to compare the password\n`;
  code += `async function comparePassword(password${isTS ? ': string' : ''}, hashedPassword${isTS ? ': string' : ''}) {\n\n`;
  code += `    // comparing the password using bcrypt\n`;
  code += `    const isMatch = await bcrypt.compare(password, hashedPassword);\n\n`;
  code += `    // returning the result\n`;
  code += `    return isMatch;\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export { hashPassword, comparePassword };\n`;
  } else {
    code += `module.exports = { hashPassword, comparePassword };\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateIndexMiddleware(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const hasMorgan = config.logger === 'Morgan';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import express${isTS ? ', { Express }' : ''} from "express";\n`;
    code += `import compression from "compression";\n`;
    code += `import cors from "cors";\n`;
    code += `import helmet from "helmet";\n`;
    code += `import cookieParser from "cookie-parser";\n`;
    if (hasMorgan) {
      code += `import morgan from "morgan";\n`;
    }
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const express = require("express");\n`;
    code += `const compression = require("compression");\n`;
    code += `const cors = require("cors");\n`;
    code += `const helmet = require("helmet");\n`;
    code += `const cookieParser = require("cookie-parser");\n`;
    if (hasMorgan) {
      code += `const morgan = require("morgan");\n`;
    }
    code += `const env = require("../config/env.config");\n\n`;
  }

  code += `// function to apply middlewares to the app\n`;
  code += `function applyMiddlewares(app${isTS ? ': Express' : ''}) {\n\n`;
  code += `    // applying middlewares\n`;
  code += `    app.use(compression());\n\n`;
  code += `    app.use(cors());\n\n`;
  code += `    app.use(helmet());\n\n`;
  code += `    app.use(cookieParser());\n\n`;
  if (hasMorgan) {
    code += `    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));\n\n`;
  }
  code += `    app.use(express.json({ limit: "100kb" }));\n\n`;
  code += `    app.use(express.urlencoded({ extended: true, limit: "100kb" }));\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default applyMiddlewares;\n`;
  } else {
    code += `module.exports = applyMiddlewares;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateErrorHandler(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    if (isTS) {
      code += `import { Request, Response, NextFunction } from "express";\n`;
    }
    code += `import logger from "../config/logger.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const logger = require("../config/logger.config");\n\n`;
  }

  code += `// function to handle errors in the application\n`;
  code += `function errorHandler(err${isTS ? ': Error & { statusCode?: number }' : ''}, req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}, next${isTS ? ': NextFunction' : ''}) {\n\n`;
  code += `    // logging the error\n`;
  code += `    logger.error(err);\n\n`;
  code += `    // sending the error response with status code and message\n`;
  code += `    return res.status(err.statusCode || 500).json({\n`;
  code += `        success: false,\n`;
  code += `        status: err.statusCode || 500,\n`;
  code += `        message: err.message || "Internal Server Error"\n`;
  code += `    });\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default errorHandler;\n`;
  } else {
    code += `module.exports = errorHandler;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateNotFoundHandler(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    if (isTS) {
      code += `import { Request, Response, NextFunction } from "express";\n`;
    }
    code += `import NotFound from "../errors/NotFound.error${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const NotFound = require("../errors/NotFound.error");\n\n`;
  }

  code += `// function to handle not found errors in the application\n`;
  code += `function notFoundHandler(req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}, next${isTS ? ': NextFunction' : ''}) {\n\n`;
  code += `    // throwing a not found error with message\n`;
  code += `    throw new NotFound("Resource not found");\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default notFoundHandler;\n`;
  } else {
    code += `module.exports = notFoundHandler;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateValidateMiddleware(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    if (isTS) {
      code += `import { Request, Response, NextFunction } from "express";\n`;
    }
    code += `import BadRequest from "../errors/BadRequest.error${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const BadRequest = require("../errors/BadRequest.error");\n\n`;
  }

  code += `// function to validate incoming requests\n`;
  code += `function validate(schema${isTS ? ': { safeParse?: (data: unknown) => { success: boolean } }' : ''}) {\n`;
  code += `    return (req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}, next${isTS ? ': NextFunction' : ''}) => {\n`;
  code += `        if (!schema) return next();\n`;
  code += `        const result = schema.safeParse ? schema.safeParse(req.body) : { success: true };\n`;
  code += `        if (!result.success) {\n`;
  code += `            throw new BadRequest("Validation failed");\n`;
  code += `        }\n`;
  code += `        next();\n`;
  code += `    };\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default validate;\n`;
  } else {
    code += `module.exports = validate;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateAuthMiddleware(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import jwt from "jsonwebtoken";\n`;
    if (isTS) {
      code += `import { Request, Response, NextFunction } from "express";\n`;
    }
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n`;
    code += `import Unauthorized from "../errors/Unauthorized.error${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const jwt = require("jsonwebtoken");\n`;
    code += `const env = require("../config/env.config");\n`;
    code += `const Unauthorized = require("../errors/Unauthorized.error");\n\n`;
  }

  code += `// Function to check if the user is authenticated or not\n`;
  code += `function authMiddleware(req${isTS ? ': Request & { user?: Record<string, unknown> }' : ''}, res${isTS ? ': Response' : ''}, next${isTS ? ': NextFunction' : ''}) {\n\n`;
  code += `    // getting the access token from the request headers\n`;
  code += `    const accessToken = req.headers?.authorization?.split(" ")[1];\n\n`;
  code += `    // if the access token is not present, return an error\n`;
  code += `    if (!accessToken) {\n\n`;
  code += `        throw new Unauthorized("User unauthenticated.");\n\n`;
  code += `    }\n\n`;
  code += `    try {\n\n`;
  code += `        // verifying the access token\n`;
  code += `        const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);\n\n`;
  code += `        // if the access token is valid, attach the decoded user to the request object\n`;
  code += `        req.user = decoded${isTS ? ' as Record<string, unknown>' : ''};\n\n`;
  code += `        next();\n\n`;
  code += `    } catch (error) {\n\n`;
  code += `        // if the access token is invalid, return an error\n`;
  code += `        throw new Unauthorized("Access token expired or invalid.");\n\n`;
  code += `    }\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default authMiddleware;\n`;
  } else {
    code += `module.exports = authMiddleware;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateRefreshMiddleware(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import jwt from "jsonwebtoken";\n`;
    if (isTS) {
      code += `import { Request, Response, NextFunction } from "express";\n`;
    }
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n`;
    code += `import Unauthorized from "../errors/Unauthorized.error${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const jwt = require("jsonwebtoken");\n`;
    code += `const env = require("../config/env.config");\n`;
    code += `const Unauthorized = require("../errors/Unauthorized.error");\n\n`;
  }

  code += `// function to get the refresh token from the cookie\n`;
  code += `function getRefreshTokenFromCookie(req${isTS ? ': Request & { session?: Record<string, unknown>; refreshToken?: string }' : ''}, res${isTS ? ': Response' : ''}, next${isTS ? ': NextFunction' : ''}) {\n\n`;
  code += `    // getting the refresh token from the cookie\n`;
  code += `    const refreshToken = req.cookies?.refreshToken;\n\n`;
  code += `    // if the refresh token is not present, return an error\n`;
  code += `    if (!refreshToken) {\n\n`;
  code += `        // if the refresh token is not present, throw an unauthorized error\n`;
  code += `        throw new Unauthorized("Refresh token not found in cookie.");\n\n`;
  code += `    }\n\n`;
  code += `    // decoding the refresh token to check if it is valid\n`;
  code += `    try {\n\n`;
  code += `        // verifying the refresh token\n`;
  code += `        const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);\n\n`;
  code += `        // if the refresh token is valid, attach the decoded user to the request object\n`;
  code += `        req.session = decoded${isTS ? ' as Record<string, unknown>' : ''};\n\n`;
  code += `    } catch (error) {\n\n`;
  code += `        // if the refresh token is invalid, return an error\n`;
  code += `        throw new Unauthorized("Refresh token expired or invalid.");\n\n`;
  code += `    }\n\n`;
  code += `    // if the refresh token is present, attach it to the request object\n`;
  code += `    req.refreshToken = refreshToken;\n\n`;
  code += `    next();\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default getRefreshTokenFromCookie;\n`;
  } else {
    code += `module.exports = getRefreshTokenFromCookie;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateDbConfig(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import mongoose from "mongoose";\n`;
    code += `import env from "./env.config${isTS ? '.js' : '.js'}";\n`;
    code += `import logger from "./logger.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const mongoose = require("mongoose");\n`;
    code += `const env = require("./env.config");\n`;
    code += `const logger = require("./logger.config");\n\n`;
  }

  code += `// function to connect to the database\n`;
  code += `async function connectDB() {\n\n`;
  code += `    try {\n\n`;
  code += `        // connecting to the database\n`;
  code += `        await mongoose.connect(env.MONGO_URI);\n`;
  code += `        logger.info("Connected to the database");\n\n`;
  code += `    }\n`;
  code += `    catch (error) {\n\n`;
  code += `        // logging the error\n        logger.error(error, "Error connecting to the database");\n\n`;
  code += `    }\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default connectDB;\n`;
  } else {
    code += `module.exports = connectDB;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateLogger(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const loggerType = String(config.logger || '').toLowerCase();

  let code = '';
  if (loggerType.includes('winston')) {
    if (isESM) {
      code += `// Importing modules\n`;
      code += `import winston from "winston";\n\n`;
    } else {
      code += `// Importing modules\n`;
      code += `const winston = require("winston");\n\n`;
    }
    code += `// creating a winston logger instance\n`;
    code += `const logger = winston.createLogger({\n`;
    code += `    level: "info",\n`;
    code += `    format: winston.format.json(),\n`;
    code += `    transports: [new winston.transports.Console()],\n`;
    code += `});\n\n`;
  } else if (loggerType === 'none' || loggerType === 'no logger' || loggerType === 'false') {
    code += `// creating a console fallback logger instance\n`;
    code += `const logger = {\n`;
    code += `    info: (...args${isTS ? ': unknown[]' : ''}) => console.log(...args),\n`;
    code += `    error: (...args${isTS ? ': unknown[]' : ''}) => console.error(...args),\n`;
    code += `    warn: (...args${isTS ? ': unknown[]' : ''}) => console.warn(...args),\n`;
    code += `    debug: (...args${isTS ? ': unknown[]' : ''}) => console.debug(...args),\n`;
    code += `};\n\n`;
  } else {
    if (isESM) {
      code += `// Importing modules\n`;
      code += `import pino from "pino";\n`;
      code += `import env from "./env.config${isTS ? '.js' : '.js'}";\n\n`;
    } else {
      code += `// Importing modules\n`;
      code += `const pino = require("pino");\n`;
      code += `const env = require("./env.config");\n\n`;
    }

    code += `// creating a logger instance\n`;
    code += `const logger = pino({\n`;
    code += `    level: env.NODE_ENV === "production" ? "info" : "debug",\n`;
    code += `    ...(env.NODE_ENV !== "production" && {\n`;
    code += `        transport: {\n`;
    code += `            target: "pino-pretty",\n`;
    code += `            options: {\n`;
    code += `                colorize: true,\n`;
    code += `                translateTime: "SYS:standard",\n`;
    code += `                ignore: "pid,hostname",\n`;
    code += `            },\n`;
    code += `        },\n`;
    code += `    }),\n`;
    code += `});\n\n`;
  }

  if (isESM) {
    code += `export default logger;\n`;
  } else {
    code += `module.exports = logger;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateUserDao(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isClass = config.programmingStyle === 'Class Based';
  const isModular = config.folderStructure === 'Modular';

  const userModelPath = isModular ? '../../shared/models/user.model' : '../models/user.model';

  let code = '';
  if (isESM) {
    code += `// Importing modules \n`;
    code += `import User from "${userModelPath}${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules \n`;
    code += `const User = require("${userModelPath}");\n\n`;
  }

  if (isClass) {
    code += `// class to handle user data access operations\n`;
    code += `class UserDao {\n\n`;
    if (isTS) {
      code += `    UserModel: typeof User;\n\n`;
    }
    code += `    constructor() {\n`;
    code += `        // initializing the user model\n`;
    code += `        this.UserModel = User;\n`;
    code += `    }\n\n`;
    code += `    // function to create a new user\n`;
    code += `    async createUser(userData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `        const user = await this.UserModel.create(userData);\n`;
    code += `        return user;\n`;
    code += `    }\n\n`;
    code += `    // function to find a user by email\n`;
    code += `    async findUserByEmail(email${isTS ? ': string' : ''}) {\n`;
    code += `        return await this.UserModel.findOne({ email });\n`;
    code += `    }\n\n`;
    code += `    // function to find a user by id\n`;
    code += `    async findUserById(id${isTS ? ': string' : ''}) {\n`;
    code += `        return await this.UserModel.findById(id);\n`;
    code += `    }\n\n`;
    code += `    // function to update a user by id\n`;
    code += `    async updateUserById(id${isTS ? ': string' : ''}, updateData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `        return await this.UserModel.findByIdAndUpdate(id, updateData, { returnDocument: "after" });\n`;
    code += `    }\n\n`;
    code += `    // function to delete a user by id\n`;
    code += `    async deleteUserById(id${isTS ? ': string' : ''}) {\n`;
    code += `        return await this.UserModel.findByIdAndDelete(id);\n`;
    code += `    }\n`;
    code += `}\n\n`;
    if (isESM) {
      code += `export default UserDao;\n`;
    } else {
      code += `module.exports = UserDao;\n`;
    }
  } else {
    code += `// function to create a new user\n`;
    code += `async function createUser(userData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `    const user = await User.create(userData);\n`;
    code += `    return user;\n`;
    code += `}\n\n`;
    code += `// function to find a user by email\n`;
    code += `async function findUserByEmail(email${isTS ? ': string' : ''}) {\n`;
    code += `    return await User.findOne({ email });\n`;
    code += `}\n\n`;
    code += `// function to find a user by id\n`;
    code += `async function findUserById(id${isTS ? ': string' : ''}) {\n`;
    code += `    return await User.findById(id);\n`;
    code += `}\n\n`;
    code += `// function to update a user by id\n`;
    code += `async function updateUserById(id${isTS ? ': string' : ''}, updateData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `    return await User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });\n`;
    code += `}\n\n`;
    code += `// function to delete a user by id\n`;
    code += `async function deleteUserById(id${isTS ? ': string' : ''}) {\n`;
    code += `    return await User.findByIdAndDelete(id);\n`;
    code += `}\n\n`;
    if (isESM) {
      code += `export { createUser, findUserByEmail, findUserById, updateUserById, deleteUserById };\n`;
    } else {
      code += `module.exports = { createUser, findUserByEmail, findUserById, updateUserById, deleteUserById };\n`;
    }
  }

  return config.comments ? code : stripComments(code);
}

export function generateUserSanitizer(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  code += `// function to sanitize the user data\n`;
  code += `function sanitizeUser(user${isTS ? ': Record<string, unknown> | null | undefined' : ''}) {\n\n`;
  code += `    // if user is null or undefined, return null\n`;
  code += `    if (!user) {\n`;
  code += `        return null;\n`;
  code += `    }\n\n`;
  code += `    // return sanitized user object\n`;
  code += `    const u = ${isTS ? '(user as Record<string, unknown>)' : 'user'};\n`;
  code += `    return {\n`;
  code += `        _id: u._id,\n`;
  code += `        name: u.name,\n`;
  code += `        email: u.email,\n`;
  code += `        isVerified: u.isVerified,\n`;
  code += `    };\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default sanitizeUser;\n`;
  } else {
    code += `module.exports = sanitizeUser;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateValidateErrorsUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import { validationResult } from "express-validator";\n`;
    code += `${isTS ? 'import { Request, Response, NextFunction } from "express";\n' : ''}`;
    code += `import BadRequest from "../errors/BadRequest.error${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const { validationResult } = require("express-validator");\n`;
    code += `const BadRequest = require("../errors/BadRequest.error");\n\n`;
  }

  code += `// function to validate errors from the request\n`;
  if (isESM) {
    code += `export const validateErrors = (req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}, next${isTS ? ': NextFunction' : ''}) => {\n\n`;
  } else {
    code += `const validateErrors = (req, res, next) => {\n\n`;
  }
  code += `    // getting the errors from the request\n`;
  code += `    const errors = validationResult(req);\n\n`;
  code += `    // if there are errors, throw a bad request error with the first error message\n`;
  code += `    if (!errors.isEmpty()) {\n\n`;
  code += `        // getting the first error message\n`;
  code += `        const firstError = errors.array()[0];\n\n`;
  code += `        // throwing a bad request error with the first error message\n`;
  code += `        throw new BadRequest(firstError.msg);\n`;
  code += `    }\n\n`;
  code += `    // if there are no errors, call the next middleware\n`;
  code += `    next();\n`;
  code += `};\n\n`;

  if (isESM) {
    code += `export default validateErrors;\n`;
  } else {
    code += `module.exports = validateErrors;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateTokensConstants(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isMultiToken = typeof config.multiToken === 'boolean' ? config.multiToken : (config.tokenStrategy ? config.tokenStrategy.includes('Multi Token') : true);

  const exp = isESM ? 'export ' : '';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const env = require("../config/env.config");\n\n`;
  }

  code += `${exp}const EXPIRY = {\n`;
  code += `    ACCESS_TOKEN: env.NODE_ENV === "development" ? "5m" : "15m",\n`;
  code += `    REFRESH_TOKEN: env.NODE_ENV === "development" ? "2h" : "7d",\n`;
  code += `    SINGLE_TOKEN: "30d",\n`;
  code += `}${isTS ? ' as const' : ''};\n\n`;

  code += `${exp}const COOKIE_EXPIRY_TIME = ${isMultiToken ? 'env.NODE_ENV === "development" ? 2 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000' : '30 * 24 * 60 * 60 * 1000'};\n\n`;

  code += `${exp}const REFRESH_TOKEN_COOKIE_OPTIONS = {\n`;
  code += `    httpOnly: true,\n`;
  code += `    secure: env.NODE_ENV === "production",\n`;
  code += `    sameSite: env.NODE_ENV === "production" ? "none"${isTS ? ' as const' : ''} : "lax"${isTS ? ' as const' : ''},\n`;
  code += `    maxAge: COOKIE_EXPIRY_TIME,\n`;
  code += `};\n\n`;

  code += `${exp}const SINGLE_TOKEN_COOKIE_OPTIONS = {\n`;
  code += `    httpOnly: true,\n`;
  code += `    secure: env.NODE_ENV === "production",\n`;
  code += `    sameSite: env.NODE_ENV === "production" ? "none"${isTS ? ' as const' : ''} : "lax"${isTS ? ' as const' : ''},\n`;
  code += `    maxAge: 30 * 24 * 60 * 60 * 1000,\n`;
  code += `};\n\n`;

  code += `${exp}const OTP_EXPIRY_TIME = env.NODE_ENV === "development" ? 5 * 60 * 1000 : 10 * 60 * 1000;\n\n`;

  code += `${exp}const RESET_PASSWORD_TOKEN_EXPIRY_TIME = env.NODE_ENV === "development" ? 5 * 60 * 1000 : 10 * 60 * 1000;\n`;

  if (!isESM) {
    code += `\nmodule.exports = { EXPIRY, COOKIE_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS, SINGLE_TOKEN_COOKIE_OPTIONS, OTP_EXPIRY_TIME, RESET_PASSWORD_TOKEN_EXPIRY_TIME };\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateSessionModel(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import mongoose from "mongoose";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const mongoose = require("mongoose");\n\n`;
  }

  code += `// creating the schema for the session\n`;
  code += `const sessionSchema = new mongoose.Schema({\n\n`;
  code += `    userId: {\n`;
  code += `        type: mongoose.Schema.Types.ObjectId,\n`;
  code += `        ref: "User",\n`;
  code += `        required: true,\n`;
  code += `    },\n\n`;
  code += `    refreshToken: {\n`;
  code += `        type: String,\n`;
  code += `        required: true,\n`;
  code += `    },\n\n`;
  code += `    expiresAt: {\n`;
  code += `        type: Date,\n`;
  code += `        required: true,\n`;
  code += `        index: {\n`;
  code += `            expires: 0,\n`;
  code += `        }\n`;
  code += `    }\n\n`;
  code += `});\n\n`;

  code += `// making the model for the session schema\n`;
  code += `const Session = mongoose.model("Session", sessionSchema);\n\n`;

  if (isESM) {
    code += `// exporting the session model\n`;
    code += `export default Session;\n`;
  } else {
    code += `// exporting the session model\n`;
    code += `module.exports = Session;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateTokenModel(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import mongoose from "mongoose";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const mongoose = require("mongoose");\n\n`;
  }

  code += `// Defining the schema for the Token model\n`;
  code += `const tokenSchema = new mongoose.Schema({\n\n`;
  code += `    email: {\n`;
  code += `        type: String,\n`;
  code += `        required: false,\n`;
  code += `    },\n\n`;
  code += `    type: {\n`;
  code += `        type: String,\n`;
  code += `        required: true,\n`;
  code += `        enum: ['otp', 'reset', 'invitation']\n`;
  code += `    },\n\n`;
  code += `    value: {\n`;
  code += `        type: String,\n`;
  code += `        required: true,\n`;
  code += `        unique: true\n`;
  code += `    },\n\n`;
  code += `    expiresAt: {\n`;
  code += `        type: Date,\n`;
  code += `        required: true,\n`;
  code += `        index: {\n`;
  code += `            expires: 0\n`;
  code += `        }\n`;
  code += `    }\n\n`;
  code += `});\n\n`;

  code += `// Making the model for the Token schema\n`;
  code += `const Token = mongoose.model("Token", tokenSchema);\n\n`;

  if (isESM) {
    code += `export default Token;\n`;
  } else {
    code += `module.exports = Token;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateSessionDao(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isClass = config.programmingStyle === 'Class Based';
  const isModular = config.folderStructure === 'Modular';

  const sessionModelName = isModular ? 'sessions.model' : 'session.model';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import Session from "../models/${sessionModelName}${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const Session = require("../models/${sessionModelName}");\n\n`;
  }

  if (isClass) {
    code += `// class to handle session data access operations\n`;
    code += `class SessionDao {\n\n`;
    if (isTS) {
      code += `    SessionModel: typeof Session;\n\n`;
    }
    code += `    constructor() {\n`;
    code += `        // initializing the session model\n`;
    code += `        this.SessionModel = Session;\n`;
    code += `    }\n\n`;
    code += `    // function to create a new session\n`;
    code += `    async createSession(sessionData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `        const session = await this.SessionModel.create(sessionData);\n`;
    code += `        return session;\n`;
    code += `    }\n\n`;
    code += `    // function to find a session by refresh token\n`;
    code += `    async findSessionByRefreshTokenandSessionId(refreshToken${isTS ? ': string' : ''}, sessionId${isTS ? ': string' : ''}) {\n`;
    code += `        return await this.SessionModel.findOne({\n`;
    code += `            refreshToken: refreshToken,\n`;
    code += `            _id: sessionId\n`;
    code += `        }).populate("userId", "-password -__v");\n`;
    code += `    }\n\n`;
    code += `    // function to delete a session by refresh token\n`;
    code += `    async deleteSessionByRefreshTokenandSessionId(refreshToken${isTS ? ': string' : ''}, sessionId${isTS ? ': string' : ''}) {\n`;
    code += `        return await this.SessionModel.findOneAndDelete({\n`;
    code += `            refreshToken: refreshToken,\n`;
    code += `            _id: sessionId\n`;
    code += `        });\n`;
    code += `    }\n\n`;
    code += `    async deleteSessionByUserId(userId${isTS ? ': unknown' : ''}) {\n`;
    code += `        return await this.SessionModel.deleteMany({\n`;
    code += `            userId: userId\n`;
    code += `        });\n`;
    code += `    }\n\n`;
    code += `    async updateSessionByRefreshTokenandSessionId(refreshToken${isTS ? ': string' : ''}, sessionId${isTS ? ': string' : ''}, updateData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `        return await this.SessionModel.findOneAndUpdate({\n`;
    code += `            refreshToken: refreshToken,\n`;
    code += `            _id: sessionId\n`;
    code += `        }, updateData, { returnDocument: "after" });\n`;
    code += `    }\n\n`;
    code += `    async findById(id${isTS ? ': string' : ''}) {\n`;
    code += `        return await this.SessionModel.findById(id).populate("userId");\n`;
    code += `    }\n`;
    code += `}\n\n`;
    if (isESM) {
      code += `export default SessionDao;\n`;
    } else {
      code += `module.exports = SessionDao;\n`;
    }
  } else {
    code += `async function createSession(sessionData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `    return await Session.create(sessionData);\n`;
    code += `}\n\n`;
    code += `async function findSessionByRefreshTokenandSessionId(refreshToken${isTS ? ': string' : ''}, sessionId${isTS ? ': string' : ''}) {\n`;
    code += `    return await Session.findOne({\n`;
    code += `        refreshToken: refreshToken,\n`;
    code += `        _id: sessionId\n`;
    code += `    }).populate("userId", "-password -__v");\n`;
    code += `}\n\n`;
    code += `async function deleteSessionByRefreshTokenandSessionId(refreshToken${isTS ? ': string' : ''}, sessionId${isTS ? ': string' : ''}) {\n`;
    code += `    return await Session.findOneAndDelete({\n`;
    code += `        refreshToken: refreshToken,\n`;
    code += `        _id: sessionId\n`;
    code += `    });\n`;
    code += `}\n\n`;
    code += `async function deleteSessionByUserId(userId${isTS ? ': unknown' : ''}) {\n`;
    code += `    return await Session.deleteMany({\n`;
    code += `        userId: userId\n`;
    code += `    });\n`;
    code += `}\n\n`;
    code += `async function updateSessionByRefreshTokenandSessionId(refreshToken${isTS ? ': string' : ''}, sessionId${isTS ? ': string' : ''}, updateData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `    return await Session.findOneAndUpdate({\n`;
    code += `        refreshToken: refreshToken,\n`;
    code += `        _id: sessionId\n`;
    code += `    }, updateData, { returnDocument: "after" });\n`;
    code += `}\n\n`;
    code += `async function findById(id${isTS ? ': string' : ''}) {\n`;
    code += `    return await Session.findById(id).populate("userId");\n`;
    code += `}\n\n`;
    if (isESM) {
      code += `export { createSession, findSessionByRefreshTokenandSessionId, deleteSessionByRefreshTokenandSessionId, deleteSessionByUserId, updateSessionByRefreshTokenandSessionId, findById };\n`;
    } else {
      code += `module.exports = { createSession, findSessionByRefreshTokenandSessionId, deleteSessionByRefreshTokenandSessionId, deleteSessionByUserId, updateSessionByRefreshTokenandSessionId, findById };\n`;
    }
  }

  return config.comments ? code : stripComments(code);
}

export function generateTokenDao(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isClass = config.programmingStyle === 'Class Based';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import Token from "../models/token.model${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const Token = require("../models/token.model");\n\n`;
  }

  if (isClass) {
    code += `// class for the Token Data Access Object (DAO)\n`;
    code += `class TokenDAO {\n\n`;
    if (isTS) {
      code += `    tokenModel: typeof Token;\n\n`;
    }
    code += `    constructor() {\n`;
    code += `        this.tokenModel = Token;\n`;
    code += `    }\n\n`;
    code += `    // method to create a new token\n`;
    code += `    async createToken(tokenData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `        const token = await this.tokenModel.create(tokenData);\n`;
    code += `        return token;\n`;
    code += `    }\n\n`;
    code += `    // method to find a token by its value\n`;
    code += `    async findTokenByValue(value${isTS ? ': string' : ''}) {\n`;
    code += `        const token = await this.tokenModel.findOne({ value: value });\n`;
    code += `        return token;\n`;
    code += `    }\n\n`;
    code += `    // method to delete a token by its value\n`;
    code += `    async deleteTokenByValue(value${isTS ? ': string' : ''}) {\n`;
    code += `        const result = await this.tokenModel.deleteOne({ value: value });\n`;
    code += `        return result;\n`;
    code += `    }\n\n`;
    code += `    // method to delete a token by its email and type\n`;
    code += `    async deleteTokenByEmail(email${isTS ? ': string' : ''}, type${isTS ? ': string' : ''}) {\n`;
    code += `        const result = await this.tokenModel.deleteMany({ email: email, type: type });\n`;
    code += `        return result;\n`;
    code += `    }\n`;
    code += `}\n\n`;
    if (isESM) {
      code += `export default TokenDAO;\n`;
    } else {
      code += `module.exports = TokenDAO;\n`;
    }
  } else {
    code += `async function createToken(tokenData${isTS ? ': Record<string, unknown>' : ''}) {\n`;
    code += `    const token = await Token.create(tokenData);\n`;
    code += `    return token;\n`;
    code += `}\n\n`;
    code += `async function findTokenByValue(value${isTS ? ': string' : ''}) {\n`;
    code += `    const token = await Token.findOne({ value: value });\n`;
    code += `    return token;\n`;
    code += `}\n\n`;
    code += `async function deleteTokenByValue(value${isTS ? ': string' : ''}) {\n`;
    code += `    const result = await Token.deleteOne({ value: value });\n`;
    code += `    return result;\n`;
    code += `}\n\n`;
    code += `async function deleteTokenByEmail(email${isTS ? ': string' : ''}, type${isTS ? ': string' : ''}) {\n`;
    code += `    const result = await Token.deleteMany({ email: email, type: type });\n`;
    code += `    return result;\n`;
    code += `}\n\n`;
    if (isESM) {
      code += `export { createToken, findTokenByValue, deleteTokenByValue, deleteTokenByEmail };\n`;
    } else {
      code += `module.exports = { createToken, findTokenByValue, deleteTokenByValue, deleteTokenByEmail };\n`;
    }
  }

  return config.comments ? code : stripComments(code);
}

export function generateTokenUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import jwt from "jsonwebtoken";\n`;
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n`;
    code += `import { EXPIRY } from "../constants/tokens.constants${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const jwt = require("jsonwebtoken");\n`;
    code += `const env = require("../config/env.config");\n`;
    code += `const { EXPIRY } = require("../constants/tokens.constants");\n\n`;
  }

  code += `// function to generate access token\n`;
  code += `function generateAccessToken(payload${isTS ? ': Record<string, unknown> | object' : ''}) {\n`;
  code += `    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: EXPIRY.ACCESS_TOKEN });\n`;
  code += `}\n\n`;

  code += `// function to generate refresh token\n`;
  code += `function generateRefreshToken(payload${isTS ? ': Record<string, unknown> | object' : ''}) {\n`;
  code += `    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: EXPIRY.REFRESH_TOKEN });\n`;
  code += `}\n\n`;

  code += `function generateOTPToken(length = 6) {\n`;
  code += `    const min = Math.pow(10, length - 1);\n`;
  code += `    const max = Math.pow(10, length) - 1;\n`;
  code += `    const otp = Math.floor(Math.random() * (max - min) + min);\n`;
  code += `    return otp.toString();\n`;
  code += `}\n\n`;

  code += `function generateResetPasswordToken(length = 32) {\n`;
  code += `    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';\n`;
  code += `    let token = '';\n`;
  code += `    for (let i = 0; i < length; i++) {\n`;
  code += `        token += characters.charAt(Math.floor(Math.random() * characters.length));\n`;
  code += `    }\n`;
  code += `    return token;\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export { generateAccessToken, generateRefreshToken, generateOTPToken, generateResetPasswordToken };\n`;
  } else {
    code += `module.exports = { generateAccessToken, generateRefreshToken, generateOTPToken, generateResetPasswordToken };\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateBuildTokenPayloadUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  code += `async function buildTokenPayload(user${isTS ? ': Record<string, unknown> | object' : ''}) {\n`;
  code += `    const u = ${isTS ? '(user as { _id: { toString(): string }; name?: string; email?: string; isVerified?: boolean })' : 'user'};\n`;
  code += `    const tokenPayload = {\n`;
  code += `        _id: u._id,\n`;
  code += `        userId: u._id.toString(),\n`;
  code += `        name: u.name,\n`;
  code += `        email: u.email,\n`;
  code += `        isVerified: u.isVerified,\n`;
  code += `    };\n`;
  code += `    return tokenPayload;\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default buildTokenPayload;\n`;
  } else {
    code += `module.exports = buildTokenPayload;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateCreateSessionUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isClass = config.programmingStyle === 'Class Based';
  const isMultiToken = typeof config.multiToken === 'boolean' ? config.multiToken : (config.tokenStrategy ? config.tokenStrategy.includes('Multi Token') : true);

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    if (isMultiToken) {
      code += `import mongoose from "mongoose";\n`;
      if (isClass) {
        code += `import SessionDao from "../dao/session.dao${isTS ? '.js' : '.js'}";\n`;
      } else {
        code += `import { createSession as createSessionInDb } from "../dao/session.dao${isTS ? '.js' : '.js'}";\n`;
      }
    }
    if (isTS) {
      code += `import { Response } from "express";\n`;
    }
    if (isMultiToken) {
      code += `import { COOKIE_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants/tokens.constants${isTS ? '.js' : '.js'}";\n`;
      code += `import { generateAccessToken, generateRefreshToken } from "./token.util${isTS ? '.js' : '.js'}";\n`;
    } else {
      code += `import { SINGLE_TOKEN_COOKIE_OPTIONS } from "../constants/tokens.constants${isTS ? '.js' : '.js'}";\n`;
      code += `import { generateAccessToken } from "./token.util${isTS ? '.js' : '.js'}";\n`;
    }
    code += `import buildTokenPayload from "./buildTokenPayload.util${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    if (isMultiToken) {
      code += `const mongoose = require("mongoose");\n`;
      if (isClass) {
        code += `const SessionDao = require("../dao/session.dao");\n`;
      } else {
        code += `const { createSession: createSessionInDb } = require("../dao/session.dao");\n`;
      }
      code += `const { COOKIE_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS } = require("../constants/tokens.constants");\n`;
      code += `const { generateAccessToken, generateRefreshToken } = require("./token.util");\n`;
    } else {
      code += `const { SINGLE_TOKEN_COOKIE_OPTIONS } = require("../constants/tokens.constants");\n`;
      code += `const { generateAccessToken } = require("./token.util");\n`;
    }
    code += `const buildTokenPayload = require("./buildTokenPayload.util");\n\n`;
  }

  if (isMultiToken) {
    code += `// function to create a session and return sanitized user with tokens\n`;
    code += `async function createSession(user${isTS ? ': Record<string, unknown> | object' : ''}, res${isTS ? ': Response' : ''}) {\n`;
    code += `    const u = ${isTS ? '(user as { _id: { toString(): string } })' : 'user'};\n`;
    code += `    const tokenPayload = await buildTokenPayload(user);\n`;
    code += `    const sessionId = new mongoose.Types.ObjectId();\n`;
    code += `    const refreshToken = generateRefreshToken({\n`;
    code += `        sessionId: sessionId.toString(),\n`;
    code += `        userId: u._id.toString()\n`;
    code += `    });\n\n`;
    if (isClass) {
      code += `    const sDao = new SessionDao();\n`;
      code += `    await sDao.createSession({\n`;
    } else {
      code += `    await createSessionInDb({\n`;
    }
    code += `        _id: sessionId,\n`;
    code += `        userId: u._id,\n`;
    code += `        refreshToken: refreshToken,\n`;
    code += `        expiresAt: new Date(Date.now() + COOKIE_EXPIRY_TIME)\n`;
    code += `    });\n\n`;
    code += `    const accessToken = generateAccessToken(tokenPayload);\n`;
    code += `    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);\n`;
    code += `    return { sanitizedUser: tokenPayload, accessToken };\n`;
    code += `}\n\n`;
  } else {
    code += `// function to create a single token and set 30-day cookie\n`;
    code += `async function createSession(user${isTS ? ': Record<string, unknown> | object' : ''}, res${isTS ? ': Response' : ''}) {\n`;
    code += `    const tokenPayload = await buildTokenPayload(user);\n`;
    code += `    const token = generateAccessToken(tokenPayload);\n`;
    code += `    res.cookie("token", token, SINGLE_TOKEN_COOKIE_OPTIONS);\n`;
    code += `    return { sanitizedUser: tokenPayload, token };\n`;
    code += `}\n\n`;
  }

  if (isESM) {
    code += `export default createSession;\n`;
  } else {
    code += `module.exports = createSession;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateMailConfig(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// importing modules\n`;
    code += `import nodemailer from "nodemailer";\n`;
    code += `import env from "./env.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// importing modules\n`;
    code += `const nodemailer = require("nodemailer");\n`;
    code += `const env = require("./env.config");\n\n`;
  }

  code += `// creating a transporter for sending emails\n`;
  code += `const transporter = nodemailer.createTransport({\n`;
  code += `    host: env.SMTP_HOST || "smtp.gmail.com",\n`;
  code += `    port: Number(env.SMTP_PORT || 587),\n`;
  code += `    auth: {\n`;
  code += `        user: env.SMTP_USER || "",\n`;
  code += `        pass: env.SMTP_PASS || ""\n`;
  code += `    }\n`;
  code += `});\n\n`;

  if (isESM) {
    code += `export default transporter;\n`;
  } else {
    code += `module.exports = transporter;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateSendMailUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import transporter from "../config/mail.config${isTS ? '.js' : '.js'}";\n`;
    code += `import logger from "../config/logger.config${isTS ? '.js' : '.js'}";\n`;
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const transporter = require("../config/mail.config");\n`;
    code += `const logger = require("../config/logger.config");\n`;
    code += `const env = require("../config/env.config");\n\n`;
  }

  code += `// function to send the mails\n`;
  code += `function sendMail(to${isTS ? ': string' : ''}, subject${isTS ? ': string' : ''}, html${isTS ? ': string' : ''}) {\n`;
  code += `    if (env.SEND_MAIL) {\n`;
  code += `        transporter.sendMail({\n`;
  code += `            from: env.SENDING_USER || "noreply@example.com",\n`;
  code += `            to,\n`;
  code += `            subject,\n`;
  code += `            html\n`;
  code += `        });\n`;
  code += `    } else {\n`;
  code += `        logger.info(\`[Mail Mock Log] To: \${to} | Subject: \${subject} | HTML: \${html}\`);\n`;
  code += `    }\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default sendMail;\n`;
  } else {
    code += `module.exports = sendMail;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateGoogleAuthUtil(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `import { google } from "googleapis";\n`;
    code += `import env from "../config/env.config${isTS ? '.js' : '.js'}";\n`;
    code += `import BadRequest from "../errors/BadRequest.error${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `const { google } = require("googleapis");\n`;
    code += `const env = require("../config/env.config");\n`;
    code += `const BadRequest = require("../errors/BadRequest.error");\n\n`;
  }

  code += `const createGoogleOAuthClient = () => new google.auth.OAuth2(\n`;
  code += `    env.GOOGLE_CLIENT_ID,\n`;
  code += `    env.GOOGLE_CLIENT_SECRET,\n`;
  code += `    env.GOOGLE_REDIRECT_URI\n`;
  code += `);\n\n`;

  code += `function getGoogleAuthorizationUrl(state${isTS ? ': string' : ''}) {\n`;
  code += `    return createGoogleOAuthClient().generateAuthUrl({\n`;
  code += `        access_type: "offline",\n`;
  code += `        scope: ["openid", "email", "profile"],\n`;
  code += `        prompt: "select_account",\n`;
  code += `        state,\n`;
  code += `    });\n`;
  code += `}\n\n`;

  code += `async function getGoogleUserFromCode(code${isTS ? ': string' : ''}) {\n`;
  code += `    try {\n`;
  code += `        const oauth2Client = createGoogleOAuthClient();\n`;
  code += `        const { tokens } = await oauth2Client.getToken(code);\n`;
  code += `        oauth2Client.setCredentials(tokens);\n`;
  code += `        const { data } = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });\n`;
  code += `        if (!data.id || !data.email || !data.verified_email) {\n`;
  code += `            throw new Error("Google account email is not verified");\n`;
  code += `        }\n`;
  code += `        return {\n`;
  code += `            googleId: data.id,\n`;
  code += `            email: data.email,\n`;
  code += `            name: data.name || data.email.split("@")[0],\n`;
  code += `            picture: data.picture,\n`;
  code += `        };\n`;
  code += `    } catch {\n`;
  code += `        throw new BadRequest("Google sign-in could not be completed");\n`;
  code += `    }\n`;
  code += `}\n\n`;

  code += `async function verifyGoogleToken(credential${isTS ? ': string' : ''}) {\n`;
  code += `    try {\n`;
  code += `        const ticket = await createGoogleOAuthClient().verifyIdToken({\n`;
  code += `            idToken: credential,\n`;
  code += `            audience: env.GOOGLE_CLIENT_ID,\n`;
  code += `        });\n`;
  code += `        const payload = ticket.getPayload();\n`;
  code += `        if (!payload || !payload.email || !payload.email_verified) throw new Error("Unverified email");\n`;
  code += `        return { googleId: payload.sub, email: payload.email, name: payload.name, picture: payload.picture };\n`;
  code += `    } catch {\n`;
  code += `        throw new BadRequest("Invalid Google credentials");\n`;
  code += `    }\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export { getGoogleAuthorizationUrl, getGoogleUserFromCode, verifyGoogleToken };\n`;
  } else {
    code += `module.exports = { getGoogleAuthorizationUrl, getGoogleUserFromCode, verifyGoogleToken };\n`;
  }

  return config.comments ? code : stripComments(code);
}
