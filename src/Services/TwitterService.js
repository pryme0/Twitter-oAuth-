
const twitterApi = require('node-twitter-api')
const userRepo = require('../Data/Repository/UserRepo')
const _ = require('lodash')
const config = require('../config/index')


const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_CALL_BACK_URL } = config


const twitter = new twitterApi({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callback: TWITTER_CALL_BACK_URL
})


class TwitterService {
    static async url() {
        return new Promise((resolve, reject) => {
            twitter.getRequestToken((error, requestToken, requestTokenSecret, results) => {
                if (error) {
                    return reject(`Error getting OAuth request token : ${JSON.stringify(error)}`, 500);
                } else {
                        // assemble authorization URL
                    let url = `https://twitter.com/oauth/authorize?oauth_token=${requestToken}`;
                    return resolve({url:url,error:null});
                }
            })
        }).catch(err=>{
            if(err.message){
                return({error:err.message})
            }else{
                return({error:err})
            }
        })
    }


    //static method to get user access tokens and user data
    static async getUserAccessTokens(userTokens) {
        return new Promise((resolve, reject) => {
            twitter.getAccessToken(userTokens.oauth_token, process.env.requestTokenSecret, userTokens.oauth_verifier, (error, accessToken, accessTokenSecret, results) => {
                if (error) throw ({error:error});
                return resolve(TwitterService.processUser({ accessToken: accessToken, accessTokenSecret: accessTokenSecret,error:null ,message:'operation successful'}))
            })
        }).catch(err=>{
            if(err.message){
                return({error:err.message});
            }else{
                return ({error:err});
            }
        })
    }

    //process user 
    static async processUser(userData) {
        return new Promise((resolve, reject) => {
            twitter.verifyCredentials(userData.accessToken, userData.accessTokenSecret, { include_email: true, skip_status: true }, async(error, data, response) => {
                if (error) throw({error:'error getting user credentials from twitter',message:error.message|| null});
                //get user data from the data object returnd sand save to database
                let user = await userRepo.findUserByEmail(data.email)
                if (user) {
                    let updatedUser = await userRepo.updateOneById(user._id, {
                        twitterTokens: {
                            accessToken: process.env.accessToken,
                            accessTokenSecret: process.env.accessTokenSecret,
                        },
                    })
                    // extract only required fields
                    updatedUser = _.pick(updatedUser, [
                        '_id',
                        'firstName',
                        'lastName',
                        'email',
                        'updatedAt',
                        'twitterTokens'
                    ]);
                    return resolve({ user: updatedUser, data: null });
                }
                const userData = {
                    firstName: data.name.toLowerCase(),
                    lastName: data.screen_name.toLowerCase(),
                    email: data.email,
                    twitter: data.id.toString(),
                    twitterTokens: {
                        accessToken: process.env.accessToken,
                        accessTokenSecret: process.env.accessTokenSecret,
                    },
                    profileImage: data.profile_image_url,
                }

                //save user information in the database
                user = await userRepo.create(userData)
                    //create token
                const token = user.createToken() //TODO- decide if we'll generate 
                //return user data to frontend
                return resolve({ 'User': user, 'message': 'User created successfully',error:null })
            })
        }).catch((err)=>{
            if(err.message){
                return({error:err.message});
            }else{
                return({error:err});
            }
        })
    }

}

module.exports = TwitterService