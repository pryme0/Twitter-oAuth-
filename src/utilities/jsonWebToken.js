/**
 * @file Creates and Verifies Json Web Tokens
 * @author JOSEPH <obochi2@gmail.com> <24/07/2020 09:15am>
 * @since 0.1.0
 * Last Modified: JOSEPH <obochi2@gmail.com> <16/09/2020 011:41pm>
 */

const jwt = require('jsonwebtoken');
const {
    BadTokenError,
    TokenExpiredError,
    AccessTokenError,
    BadRequestError,
} = require('./apiError');

const ALGORITHM = 'HS256';
const ISSUER = 'buzzroom';
const AUDIENCE = ['user', 'newUser'];

/**
 * @class JsonWebToken
 * @classdesc A class for creating and verifying Json Web Tokens.
 */
class JsonWebToken {
    constructor(payload) {
        this.expiresIn = '15m';
        this.algorithm = ALGORITHM;
        this.secret = process.env.JWT_SECRET_KEY;
        this.issuer = ISSUER;
        this.audience = AUDIENCE;
        this.payload = payload;
    }

    /**
     * @description generates jwt token by signing app and reserved claims and jwt secret
     * @return {String} - token
     */
    create() {
        return jwt.sign(
            this.getClaims().application,
            this.secret,
            this.getClaims().reserved
        );
    }

    /**
     * @description generates application and reserved claims
     * @return {{application: {name: string, email}, reserved: {expiresIn: string, audience: [string, string], subject, issuer: string, algorithm: string}}}
     */
    getClaims() {
        const claims = {
            reserved: {
                algorithm: this.algorithm,
                issuer: this.issuer,
                audience: this.payload.audience,
                expiresIn: this.expiresIn,
                subject: this.payload._id.toString(),
            },
            application: {
                name: `${this.payload.firstName} ${this.payload.lastName}`,
                email: this.payload.email,
            },
        };
        return claims;
    }

    /**
     * @description get jwt token from authorization headers
     * @param req - current request to the server
     * @return {string|null} - returns token or null if nothing found
     */
    static getToken(req) {
        if (
            req.headers &&
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
            return req.headers.authorization.split(' ')[1];
        } else {
            return req.params.token;
        }
        return null;
    }

    /**
     * @description claims to be validated when token is being verified
     * @return {{audience: [string, string], issuer: string, algorithm: string}}
     */
    static validateClaims() {
        return {
            algorithm: ALGORITHM,
            issuer: ISSUER,
            audience: AUDIENCE,
        };
    }

    /**
     * @description checks if token provided is valid, if yes set user property in request object
     * @return {Promise<*>}
     */
    // eslint-disable-next-line no-unused-vars
    static async verifyToken(req, res, next) {

        const token = JsonWebToken.getToken(req);

        if (token) {
            try {
                const decoded = await jwt.verify(
                    token,
                    process.env.JWT_SECRET_KEY,
                    JsonWebToken.validateClaims()
                );
                req.user = {
                    id: decoded.sub,
                    name: decoded.name,
                    email: decoded.email,
                    audience: decoded.aud,
                };
                next();
            } catch (e) {
                if (e.name === 'TokenExpiredError') next(new TokenExpiredError());
                if (e.message === 'jwt malformed') next(new BadTokenError());
                next(new AccessTokenError());
            }
        } else {
            next(
                new BadRequestError(
                    'No Token Provided',
                    "Please send an Authorization Header with value - Bearer 'Token'"
                )
            );
        }
    }
}

module.exports = JsonWebToken;