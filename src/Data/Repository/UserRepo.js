/**
 * @file Manages all database queries related to the User document(table)
 * @author Joseph <obochi2@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 *  Everytime you make changes to this file ensure to change the name, date and time
 * Last Modified: Joseph <obochi2@gmail.com> <16/09/2020 11:10pm>
 */

const UserModel = require('../Model/User');
const { findOneAndUpdate } = require('../Model/User');

/**
 * @class UserRepo
 * @classdesc  a class with static database query methods, this class will contain all the queries for our User model.
 */
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
     * @description A static method to find user by thier twitterId
     * @param twitterId-the user twitter media id
     * @returns {Promise<UserModel>}
     */

    static async findUserByTwitterId(profileId) {
        return UserModel.findOne({ twitter: profileId })
    }




    /**
     * @description A static method to find user by thier socialmedia id
     * @param ID-the user social media id
     * @returns {Promise<UserModel>}
     */

    static async updateOneById(profileId, data) {
        return UserModel.findOneAndUpdate({ _id: profileId }, data, { new: true })
    }




}

module.exports = userRepo