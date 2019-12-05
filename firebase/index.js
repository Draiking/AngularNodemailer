const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
const serviceAccount = require("./testemail");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), //ссылка на ключ
    databaseURL: "https://my-data-url.firebaseio.com"
});


/**
 * Here we're using Gmail to send
 */
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'MyEmail',
        pass: 'MyPassword'
    },
    debug: true,
    logger: true
});


exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // отправка response OPTIONS
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');

        const body = req.body;
        const hash = body.hash;
        const email = body.email;
        console.log(email);
        console.log(hash);


        try {
            return admin.database().ref('Hash/' + hash).once('value', (snapshot) => {
                const value = snapshot.val();

                return admin.database().ref('Auth/' + value.hash).once('value', (snap) => {
                    const val = snap.val();

                    const link = 'Для восстановления пароля перейдите по ссылке: <a href="https://my-data-url.firebaseapp.com/recovery/' + val.userId + '">Восстановить пароль</a>>';


                    const mailOptions = {
                        from: 'MyEmail@gmail.com',
                        to: email,
                        subject: `Hello Word`,
                        html: link
                    };

                    // returning result
                    return transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            return res.send({error: JSON.stringify(value)});
                        }
                        return res.send({message: JSON.stringify(val.userId)});
                    });
                });
            })
        } catch (e) {
            console.log(e);
        }
    });
});


