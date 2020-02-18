/**Setting the connection */
const port = 27017
const hostname = 'localhost'
const dbName = `conFusion`
module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': `mongodb://${hostname}:${port}/${dbName}`
}