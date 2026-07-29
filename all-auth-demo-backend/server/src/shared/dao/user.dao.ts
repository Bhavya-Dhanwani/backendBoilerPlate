// Importing modules 
import User from "../../shared/models/user.model.js";

// class to handle user data access operations
class UserDao {

    UserModel: any;

    constructor() {

        // initializing the user model
        this.UserModel = User;

    }

    // function to create a new user
    async createUser(userData: any) {

        // creating a new user using the user model and returning the created user
        const user = this.UserModel.create(userData);
        return user;

    }

    // function to find a user by email
    async findUserByEmail(email: string) {

        // finding a user by email using the user model and returning the found user
        return await this.UserModel.findOne({
            email: email
        });

    }

    // function to find a user by id
    async findUserById(id: string) {

        // finding a user by id using the user model and returning the found user
        return await this.UserModel.findById(id);

    }

    // function to update a user by id
    async updateUserById(id: string, updateData: any) {

        // updating a user by id using the user model and returning the updated user
        return await this.UserModel.findByIdAndUpdate(id, updateData, {
            returnDocument: "after",
        });

    }

    // function to delete a user by id
    async deleteUserById(id: string) {
        return await this.UserModel.findByIdAndDelete(id);
    }

}

export default UserDao;
