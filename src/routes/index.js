var express = require('express');
var router = express.Router();
const asyncHandler = require('../utilities/asyncHandler')
const TwitterService = require('../Services/TwitterService')


/* GET home page. */
router.get('/', asyncHandler(function(req, res, next) {
    res.render('index', { title: 'Twitter OAuth' });
}));

//route to initiate login with twitter
router.get(
    '/twitter',
    asyncHandler(async(req, res) => {
        let url = await TwitterService.url();    
        if(!url.error){
            res.redirect(url.url);
        }else{
            return res.redirect('/error');
        }
    })
);


//twitter authentication callback url
router.get(
'/twittercallback',asyncHandler(async(req, res) => {
        if (req.query.error) throw new AuthFailureError()
            // get Access tokens and process user data
        let results = await TwitterService.getUserAccessTokens(req.query)
        if (!results.error){
            req.session.user = results.user
            return res.redirect('/dashboard');
        }else{
            return res.redirect('/error');
        }
    })
);

//user dashboard route
router.get(
    '/dashboard',
    asyncHandler(async(req, res) => {
        const user = req.session.user
        if (user) {
            return res.render('dashboard', { user: user })
        }else{
            res.redirect('/error')
        }

    })
);

//user logout route
router.get(
    '/logout',
    asyncHandler(async(req, res) => {
        req.session.destroy()
        res.redirect('/')
    })
);


module.exports = router;