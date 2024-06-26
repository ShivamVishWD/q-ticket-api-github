/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var msal = require('@azure/msal-node');
const userModel = require('../models/employee');

var {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI
} = require('../authConfig');

const router = express.Router();
const msalInstance = new msal.ConfidentialClientApplication(msalConfig);
const cryptoProvider = new msal.CryptoProvider();

/**
 * Prepares the auth code request parameters and initiates the first leg of auth code flow
 * @param req: Express request object
 * @param res: Express response object
 * @param next: Express next function
 * @param authCodeUrlRequestParams: parameters for requesting an auth code url
 * @param authCodeRequestParams: parameters for requesting tokens using auth code
 */
async function redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams) {

    // Generate PKCE Codes before starting the authorization flow
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

    // Set generated PKCE codes and method as session vars
    req.session.pkceCodes = {
        challengeMethod: 'S256',
        verifier: verifier,
        challenge: challenge,
    };

    /**
     * By manipulating the request objects below before each request, we can obtain
     * auth artifacts with desired claims. For more information, visit:
     * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
     * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationcoderequest
     **/

    req.session.authCodeUrlRequest = {
        redirectUri: REDIRECT_URI,
        responseMode: 'form_post', // recommended for confidential clients
        codeChallenge: req.session.pkceCodes.challenge,
        codeChallengeMethod: req.session.pkceCodes.challengeMethod,
        ...authCodeUrlRequestParams,
    };

    req.session.authCodeRequest = {
        redirectUri: REDIRECT_URI,
        code: "",
        ...authCodeRequestParams,
    };

    // Get url to sign user in and consent to scopes needed for application
    try {
        const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
        console.log('authCodeUrlResponse', authCodeUrlResponse)
        res.redirect(authCodeUrlResponse);
    } catch (error) {
        next(error);
    }
};

router.get('/signin', async function (req, res, next) {

    // create a GUID for crsf
    req.session.csrfToken = cryptoProvider.createNewGuid();

    /**
     * The MSAL Node library allows you to pass your custom state as state parameter in the Request object.
     * The state parameter can also be used to encode information of the app's state before redirect.
     * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
     */
    const state = cryptoProvider.base64Encode(
        JSON.stringify({
            csrfToken: req.session.csrfToken,
            redirectTo: '/'
        })
    );

    const authCodeUrlRequestParams = {
        state: state,

        /**
         * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
         */
        scopes: [],
    };

    const authCodeRequestParams = {

        /**
         * By default, MSAL Node will add OIDC scopes to the auth code request. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
         */
        scopes: [],
    };

    // trigger the first leg of auth code flow
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
});

router.get('/acquireToken', async function (req, res, next) {

    // create a GUID for csrf
    req.session.csrfToken = cryptoProvider.createNewGuid();

    // encode the state param
    const state = cryptoProvider.base64Encode(
        JSON.stringify({
            csrfToken: req.session.csrfToken,
            redirectTo: '/users/profile'
        })
    );

    const authCodeUrlRequestParams = {
        state: state,
        scopes: ["User.Read"],
    };

    const authCodeRequestParams = {
        scopes: ["User.Read"],
    };

    // trigger the first leg of auth code flow
    return redirectToAuthCodeUrl(req, res, next, authCodeUrlRequestParams, authCodeRequestParams)
});

router.post('/microsoft/callback', async function (req, res, next) {
    if (req.body.state) {
        const state = JSON.parse(cryptoProvider.base64Decode(req.body.state));
        console.log('csrf token state',req.session.csrfToken);
        console.log('csrf token session',req.session.csrfToken);
        // check if csrfToken matches
        if (state.csrfToken === req.session.csrfToken) {
            req.session.authCodeRequest.code = req.body.code; // authZ code
            req.session.authCodeRequest.codeVerifier = req.session.pkceCodes.verifier // PKCE Code Verifier
            try {
                const tokenResponse = await msalInstance.acquireTokenByCode(req.session.authCodeRequest);
                console.log('tokenResponse  ',tokenResponse.account)
                console.log('tokenResponse111  ',JSON.stringify(tokenResponse.account))

                const uuemail = tokenResponse.account.username;
                const uemail = uuemail.toLowerCase();
                const uname = tokenResponse.account.name;
                console.log(uemail,uname)
                const userList = await userModel.find({email: uemail}).sort({_id:-1});
               // console.log(userList)
                //console.log(Object.keys(userList).length)
                if(Object.keys(userList).length == 0){
                    const udata = {
                        email:uemail,
                        name:uname
                    }
                    const EmployeeData = new userModel(udata);
                    const result = await EmployeeData.save();
                    if(result)
                        console.log('Employee created');
                }else{
                    console.log('Employee Allready created');
                }  
    
                req.session.userotken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;

                    req.session.userotken = jwtToken?.token;
                    req.session.userid = result[0]._id;
                    req.session.profile = 'admin';
                    req.session.username = result[0].Name;

                //res.redirect(state.redirectTo);
                res.redirect('/admin/login');
            } catch (error) {
                console.log('error', error);
                // next(error);
                res.redirect('/');

            }
        } else {
            console.log('csrf token does not match');
            // next(new Error('csrf token does not match'));
            res.redirect('/');
        }
    } else {
        console.log('state is missing');
        // next(new Error('state is missing'));
        res.redirect('/');
    }
});

router.get('/signout', function (req, res) {
    /**
     * Construct a logout URI and redirect the user to end the
     * session with Azure AD. For more information, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
     */
    const logoutUri = `${msalConfig.auth.authority}/oauth2/v2.0/logout?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;
    
    req.session.destroy(() => {
        res.redirect(logoutUri);
    });
});


router.get('/microsoft/logout', function (req, res) {
    res.redirect('/')
});

module.exports = router;