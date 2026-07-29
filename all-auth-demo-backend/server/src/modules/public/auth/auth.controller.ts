// Importing modules
import crypto from "crypto";
import env from "../../../shared/config/env.config.js";
import { COOKIE_EXPIRY_TIME, OTP_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS, RESET_PASSWORD_TOKEN_EXPIRY_TIME } from "../../../shared/constants/tokens.constants.js";
import SessionDao from "../../../shared/dao/session.dao.js";
import TokenDao from "../../../shared/dao/token.dao.js";
import UserDao from "../../../shared/dao/user.dao.js";
import BadRequest from "../../../shared/errors/BadRequest.error.js";
import NotFound from "../../../shared/errors/NotFound.error.js";
import Unauthorized from "../../../shared/errors/Unauthorized.error.js";
import Created from "../../../shared/responses/Created.response.js";
import Ok from "../../../shared/responses/Ok.response.js";
import sanitizeUser from "../../../shared/sanitizers/user.sanitizer.js";
import createSession from "../../../shared/utils/createSession.util.js";
import { getGoogleAuthorizationUrl, getGoogleUserFromCode, verifyGoogleToken } from "../../../shared/utils/googleAuth.util.js";
import sendMail from "../../../shared/utils/sendMail.util.js";
import { generateOTPToken, generateResetPasswordToken } from "../../../shared/utils/token.util.js";

// class to handle public authentication operations
class AuthController {

	userDao: any;
	sessionDao: any;
	tokenDao: any;

	constructor() {
		// initializing the user dao
		this.userDao = new UserDao();

		// initializing the session dao
		this.sessionDao = new SessionDao();

		// initializing the token dao
		this.tokenDao = new TokenDao();
	}

	// signup a new user
	signup = async (req: any, res: any) => {
		const { name, email, password } = req.body;

		const existingUser = await this.userDao.findUserByEmail(email);
		if (existingUser) {
			throw new BadRequest("Email already registered");
		}

		const user = await this.userDao.createUser({
			name,
			email,
			password,
			providers: ["local"],
			isVerified: false,
		});

		const { sanitizedUser, accessToken } = await createSession(user, res, this.sessionDao);

		const otp = generateOTPToken();
		await this.tokenDao.createToken({
			email: user.email,
			type: "otp",
			value: otp,
			expiresAt: new Date(Date.now() + OTP_EXPIRY_TIME),
		});

		sendMail(user.email, "Verify your email", `Your OTP is ${otp}.`);

		return Created(res, "Otp Sent Successfully for verification", {
			user: sanitizedUser,
			accessToken: accessToken
		});
	};

	// login an existing user
	login = async (req: any, res: any) => {
		const { email, password } = req.body;

		const user = await this.userDao.findUserByEmail(email);
		if (!user) {
			throw new NotFound("User not found");
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			throw new Unauthorized("Invalid email or password");
		}

		const { sanitizedUser, accessToken } = await createSession(user, res, this.sessionDao);

		return Ok(res, "User Logged in Successfully", {
			user: sanitizedUser,
			accessToken: accessToken
		});
	};

	// login via google credential token
	googleLogin = async (req: any, res: any) => {
		const { credential } = req.body;
		const googleUser = await verifyGoogleToken(credential);
		let user = await this.userDao.findUserByEmail(googleUser.email);

		if (user) {
			if (!user.providers.includes("google")) {
				user = await this.userDao.updateUserById(user._id, {
					$addToSet: { providers: "google" },
					googleId: googleUser.googleId,
				});
			}
		} else {
			user = await this.userDao.createUser({
				name: googleUser.name,
				email: googleUser.email,
				providers: ["google"],
				googleId: googleUser.googleId,
				isVerified: true,
			});
		}

		const { sanitizedUser, accessToken } = await createSession(user, res, this.sessionDao);
		return Ok(res, "User Logged in Successfully via Google", {
			user: sanitizedUser,
			accessToken: accessToken
		});
	};

	// redirect user to google oauth authorization page
	googleRedirect = (req: any, res: any) => {
		const state = crypto.randomUUID();
		res.cookie("googleOAuthState", state, {
			httpOnly: true,
			secure: env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 10 * 60 * 1000,
		});
		return res.redirect(getGoogleAuthorizationUrl(state));
	};

	// handle google oauth callback
	googleCallback = async (req: any, res: any) => {
		const { code, state } = req.query;
		const googleUser = await getGoogleUserFromCode(code as string);
		let user = await this.userDao.findUserByEmail(googleUser.email);

		if (!user) {
			user = await this.userDao.createUser({
				name: googleUser.name,
				email: googleUser.email,
				providers: ["google"],
				googleId: googleUser.googleId,
				isVerified: true,
			});
		}

		await createSession(user, res, this.sessionDao);
		return res.redirect(`${env.FRONTEND_URL}/dashboard`);
	};

	// send password reset email
	forgotPassword = async (req: any, res: any) => {
		const { email } = req.body;
		await this.tokenDao.deleteTokenByEmail(email, "reset");
		const resetToken = generateResetPasswordToken();
		await this.tokenDao.createToken({
			email: email,
			type: "reset",
			value: resetToken,
			expiresAt: new Date(Date.now() + RESET_PASSWORD_TOKEN_EXPIRY_TIME),
		});
		sendMail(email, "Your Reset Password Link", `Reset your password: ${env.FRONTEND_URL}/reset-password/${resetToken}`);
		return Ok(res, "Reset password mail sent successfully");
	};

	// reset password using token
	resetPassword = async (req: any, res: any) => {
		const { token, password } = req.body;
		const resetToken = await this.tokenDao.findTokenByValue(token);
		if (!resetToken) {
			throw new NotFound("Reset token not found");
		}
		const user = await this.userDao.findUserByEmail(resetToken.email);
		user.password = password;
		await user.save();
		await this.tokenDao.deleteTokenByValue(token);
		return Ok(res, "Password reset successfully");
	};

	// logout user
	logout = async (req: any, res: any) => {
		res.clearCookie("refreshToken");
		return Ok(res, "Logged out successfully");
	};
}

export default AuthController;
