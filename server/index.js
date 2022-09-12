'use strict';

const Hapi = require('@hapi/hapi');
const sqlite3 = require('sqlite3').verbose();
const request = require('request');

let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';

const callAPI = async (method, url, headers, body, done) => {
    await request({
        method,
        url,
        headers,
        body
    }, function (err, res, responseBody) {
        if (err) {
            console.log(err);
            done(err, null);
        } else {
            console.log('JSON.parse(responseBody)', JSON.parse(responseBody));
            done(null, JSON.parse(responseBody));
        }
    });
}

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/auth',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {

            const payload = await request.payload;
            let res = {
                statusCode: 500,
                error: true,
                message: "An internal server error occurred"
            };

            return new Promise((resolve, reject) => {
                try {
                    db.serialize(async () => {

                        db.get(`SELECT email, password FROM user where email = "${payload.email}"`, [], (err, row) => {
                            if (err) {
                                reject(res);
                            } else {
                                if (row) {
                                    res = {
                                        ...res,
                                        message: "Your email was already used, please choose another one!"
                                    };
                                    resolve(res);
                                } else {
                                    db.run(`INSERT INTO user(email, password) VALUES("${payload.email}", "${payload.password}")`, (err, row) => {
                                        if (err) {
                                            res = {
                                                ...res,
                                                message: err.message
                                            };
                                            reject(res);
                                        } else {
                                            res = {
                                                ...res,
                                                statusCode: 200,
                                                error: false,
                                                message: "Successfully created!"
                                            };
                                            resolve(res);
                                        }
                                    });
                                }
                            }
                        });

                    });
                } catch (error) {
                    console.log(`Error: \r\n ${error}`)
                    res = {
                        ...res,
                        message: error
                    };
                    reject(res);
                }
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/api/auth',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {

            const payload = await request.query;
            let res = {
                statusCode: 500,
                error: true,
                message: "An internal server error occurred"
            };
            const query = `SELECT email, password FROM user where email = "${payload.email}" and password = "${payload.password}"`;

            return new Promise((resolve, reject) => {
                try {
                    db.serialize(() => {
                        db.get(query, [], (err, row) => {
                            if (err) {
                                res = {
                                    ...res,
                                    message: err.message
                                };
                                reject(res);
                            } else {
                                if (row) {
                                    res = {
                                        ...res,
                                        statusCode: 200,
                                        error: false,
                                        message: "Successfully logged in!",
                                        user: row
                                    };
                                    resolve(res);
                                } else {
                                    res = {
                                        ...res,
                                        message: "Email or password is invalid!"
                                    };
                                    resolve(res);
                                }
                            }
                        });
                    });
                } catch (error) {
                    console.log(`Error With Select ALL(): \r\n ${error}`)
                    res = {
                        ...res,
                        message: error
                    };
                    reject(res);
                }
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/api/auth',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (req, h) => {

            const payload = await req.payload;
            var access_token = "";
            var email = "";

            let res = {
                statusCode: 500,
                error: true,
                message: "An internal server error occurred"
            };

            return new Promise((resolve, reject) => {
                request.post({
                    url: "https://www.linkedin.com/oauth/v2/accessToken",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        grant_type: 'authorization_code',
                        code: payload.code,
                        redirect_uri: 'http://localhost:8080/login',
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                    }
                }, function (err, resp, responseBody) {
                    if (err) {
                        console.log(err);
                    } else {
                        access_token = JSON.parse(responseBody).access_token;

                        request.get({
                            url: "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                            headers: {
                                "Authorization": `Bearer ${access_token}`
                            },
                        }, function (err, resp, resBody) {
                            if (err) {
                                console.log(err);
                            } else {
                                email = JSON.parse(resBody).elements[0]["handle~"].emailAddress;

                                try {
                                    db.serialize(async () => {

                                        db.get(`SELECT email, password FROM user where email = "${email}"`, [], (err, row) => {
                                            if (err) {
                                                console.log(err)
                                                reject()
                                                // return res;

                                            } else {
                                                if (row) {
                                                    res = {
                                                        ...res,
                                                        message: "Your email was already used, please choose another one!"
                                                    };
                                                    resolve(res)
                                                    // return res;
                                                } else {
                                                    db.run(`INSERT INTO user(email, password) VALUES("${email}", "admin12345")`, (err, row) => {
                                                        if (err) {
                                                            res = {
                                                                ...res,
                                                                message: err.message
                                                            };
                                                            reject()
                                                            // return res;

                                                        } else {
                                                            res = {
                                                                ...res,
                                                                statusCode: 200,
                                                                error: false,
                                                                message: "Successfully created!"
                                                            };
                                                            console.log('row', row)
                                                            resolve(res)
                                                            // return res;
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    });
                                } catch (error) {
                                    console.log(`Error: \r\n ${error}`)
                                    res = {
                                        ...res,
                                        message: error
                                    };
                                    reject()
                                    // return res;
                                }
                            }
                        })
                    }
                })
            });
        }
    });

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    process.exit(1);
});

init();
