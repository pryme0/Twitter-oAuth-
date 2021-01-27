

const UserModel = require('../Model/User');
class userRepo {
    /**
     * @description A static method to create a new user.
     * @param userData - The user credentials
     * @returns {Promise<UserModel>}
     */
    static async create(userData) {
        const user = await UserModel.create(userData);
        return user;
    }

    /**
     * @description A static method to find user by thier emails
     * @param userEmail -the user email
     * @returns {Promise<UserModel>}
     */

    static async findUserByEmail(email) {
        return UserModel.findOne({ email }).exec()
    }

    /**
     * @description A static method to find user by their twitterId
     * @param twitterId-the user twitter id
     * @returns {Promise<UserModel>}
     */

    static async findUserByTwitterId(profileId) {
        return UserModel.findOne({ twitter: profileId })
    }
    /**
     * @description A static method to update user information using their id
     * @param ID-User Id
     * @returns {Promise<UserModel>}
     */
    static async updateOneById(profileId, data) {
        return UserModel.findOneAndUpdate({ _id: profileId }, data, { new: true })
    }




}

module.exports = userRepo