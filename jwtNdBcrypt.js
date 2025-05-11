/*
 ! JSON web token or JWT :
 ? json web token: Encryption token
 ? jwt is bearer token means those who has the key can have access the resources

! jwt-input-output
? claim mechanism between two ways communication

! encrypt data 
? jwt uses encryption algorithm to encrypt data.

? RED-STRING: 
* this string contains the algorithm of encryption, what type of token we use(redirect to jwt website) {alg,tyoe of token}
? PURPLE-STRING: 
* It contains the payload or data we want to send
* {sub or id, name, iat(issued at), eat(expired at)}
? BLUE-STRING
* It contains signature to verify
* (help to generaTe signature) that is secure at server
?authorization:Actions are allowed to performance, resource access or services access.
?authentication: Identification of users or client

?payload: It is data that we pass
* theoretical:
*stateless: those has token is the authenticated to understand. JWT is stateless.
*statefull: stored in somewhere.
*securely at client: local storage access token, session storage, cookies using flag, but expire is best
*authentication, authorization, payload
*expire time in nodejs can be set accordingly
*we send 401 access token expires.send refresh token, canbe renewed with refresh token that provide access token, refresh token add to db and it is statefull
*JWT vs Session
*3tier client db server : read and write multiple time because resources is using 
*valid token (stateless)
*if token is valid fetch the data
*if invalid token dont fetch the data
*
*session:set session id in cookies 
* same session in db
*require db call to validate
*it required always db call


! JWT :
*access token: 
?stateless token that is not stored in databse and expires with in small time frame. we use refresh token to get the new generated access token.
? we  create access token variable for encryption in env file and time with small expiry time frame like one day
it requires 3 object and generate with jwt.sign(
{payload(data that we want to send)}{(encryption code)}{time of expiring})

*JWT refresh tokens: 
?they are stored in database for refresh the access token. this token is statefull token. 
? we create same token generation but it has large expiry time than access token. 
it requires 3 object and generate with jwt.sign(
{payload(data that we want to send)}{(encryption code)}{time of expiring})

!bcrypt
*bcrypt helps to encrypt password with method hash.
?hashing: bcrypt.has(password)
?verify: bcrypt.compare(password, encryption password)

*/
