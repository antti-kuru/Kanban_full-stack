import {body} from "express-validator"


// This checks the criteria of registering
const registerCheck = [
    body("email").trim().isEmail().escape(),
    body("password").isLength({min: 8}).
    matches(/[A-Z]/).
    matches(/[a-z]/).
    matches(/[0-9]/).
    matches(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/),
    body("username").trim().isLength({min:3, max: 25}).escape()
]
// This checks criteria of logging in
const loginCheck = [
    body("email").trim().isEmail().escape()
]


export {registerCheck, loginCheck}