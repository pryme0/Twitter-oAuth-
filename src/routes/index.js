var express = require('express');
var router = express.Router();
const asyncHandler = require('../utilities/asyncHandler')
const TwitterService = require('../Services/TwitterService')

//importing error modules
const { BadRequestError, AuthFailureError } = require('../utilities/ApiError');

//importing error response classes
const {
    SuccessResponse,
    TokenRefreshResponse,
    CreatedResponse,
} = require('../utilities/ApiResponse');

/* GET home page. */
router.get('/', asyncHandler(function(req, res, next) {
    res.render('index', { title: 'Express' });
}));

//facbook signup route
router.get(
    '/twitter',
    asyncHandler(async(req, res) => {
        let url = await TwitterService.url()
        res.redirect(url)
    })
);
//twitter authentication callback url
router.get(
    '/twittercallback',
    asyncHandler(async(req, res) => {
        if (req.query.error) throw new AuthFailureError()
            // get Access tokens and process user data
        let results = await TwitterService.getUserAccessTokens(req.query)
        if (results)
            req.session.user = results.user
        return res.redirect('/dashboard');

    })
);

router.get(
    '/dashboard',
    asyncHandler(async(req, res) => {
        const user = req.session.user
        if (user) {
            return res.render('dashboard', { user: user })
        }
        res.redirect('/')

    })
);
router.get(
    '/logout',
    asyncHandler(async(req, res) => {
        req.session.destroy()
        res.redirect('/')
    })
);


module.exports = router;