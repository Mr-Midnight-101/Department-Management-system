/*
!bcrypt: core bcrypt
bcryptjs: optimized with zero dependencies, compatible with JS
both have same working

helps to hash your password
difference:


!JWT:Tokens

JSON web token: cryptography


!pre hook middleware: works on functionality

for enviroment variable load first when app is open we use experimental of loading in package.json file where nodemon script is written just add after nodemon and before filename
!"-r dotenv/config --experimental-json-modules"

?express:

*req.params:data comes from URL managed by params
*req.body: forms, json configure , body parser package is not requires
*req.cookie: data from cookies parsers

?CORS: cross origin
*can only setup by app and app only by express
*using use that uses for middleware execution.
*corsOptions({
!origin: "From frontend where we getting req"
!successStatus:200
*}) 

Important options:
1. origin: process.env.origin
!in .env
CORS_ORIGIN =*

2. credentials:true
3. whitelisting

!cookie-setting
cookieparser is used as middleware to store cookies in brower and perform crud operation on cookies

!for file we use multer:
*/