

const dotenv = require('dotenv');
const bunyan = require('bunyan');

const APP_NAME = 'twitterOAuth';

dotenv.config({
    path: '.env'
});



const {
    PORT,
    MONGODB_PROD_URI,
    MONGODB_LOCAL_URI,
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_CALL_BACK_URL,
    JWT_SECRET_KEY,
    COOKIE_SECRET,
    NODE_ENV = 'development',
} = process.env;


// export configuration
module.exports = {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_CALL_BACK_URL,
    JWT_SECRET_KEY,
    COOKIE_SECRET,
    applicationName: APP_NAME,
    port: PORT,
    logger: bunyan.createLogger({ name: APP_NAME }),
    mongodb: {
        dsn: NODE_ENV === 'production' ? MONGODB_PROD_URI : MONGODB_LOCAL_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            autoIndex: false,
        },
    },
    production: NODE_ENV === 'production',
};