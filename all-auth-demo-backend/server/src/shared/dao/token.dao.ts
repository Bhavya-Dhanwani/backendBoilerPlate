// Importing modules
import Token from "../models/token.model.js";

// class for the Token Data Access Object (DAO)
class TokenDAO {

    tokenModel: any;

    constructor() {
        this.tokenModel = Token;
    }

    // method to create a new token
    async createToken(tokenData: any) {
        const token = await this.tokenModel.create(tokenData);
        return token;
    }

    // method to find a token by its value
    async findTokenByValue(value: string) {
        return await this.tokenModel.findOne({ value }).lean();
    }

    // method to delete a token by its value
    async deleteTokenByValue(value: string) {
        return await this.tokenModel.deleteOne({ value });
    }

    // method to find the tokens by email
    async deleteTokenByEmail(email: string, type: string) {
        return await this.tokenModel.deleteOne({ email, type });
    }
}

export default TokenDAO;
