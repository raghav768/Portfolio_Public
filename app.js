const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'build')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.get('/weather', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Use express session support
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));

// Use connect-flash for flash messages
app.use(flash());

app.post('/sendEmail', async function (req, res) {
    var data=req.body;
    // Add a timestamp
    data.timestamp = new Date(); // This adds a new property 'timestamp' to the data object

    // Add the client's IP address
    var ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
    data.ip = ip; // This adds a new property 'ip' to the data object
    // Connect the client to the server
    await client.connect();

    // Specify the database to use
    const db = client.db('raghav768');

    // Specify the collection to use
    const collection = db.collection('raghav768-portfolio');

    // Insert the data into the collection
    const result = await collection.insertOne(data);

    console.log(`Data saved to MongoDB Atlas: ${result.insertedId}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: "raghav.singh3177@gmail.com", // receiver
        subject: "Email from Portfolio", // subject
    };

    let htmlContent = '<div><h1>From Raghav_Portfolio Form Data</h1>';
    for (let key in data) {
        htmlContent += `<b>${key}</b>: ${data[key]} <br>`;
    }
    htmlContent += '</div>';

    mailOptions.html = htmlContent;
    transporter.sendMail(mailOptions, function (error, info) { //callback
        // if (error) {
        //     console.log(error);
        //     req.flash('error', 'Message not sent.');
        //     res.redirect('/');
        // } else {
        //     console.log("Message sent: " + info.response);
        //     req.flash('success', 'Message sent successfully.');
        //     res.redirect('/');
        // }
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Message not sent.', type: 'error' });
        } else {
            console.log("Message sent: " + info.response);
            res.status(200).send({ message: 'Message sent successfully.', type: 'success' });
        }

        let replyMailOptions = {
            from: process.env.EMAIL_USER,
            to: data.email,
            subject: "Thank you for contacting",
            html: '<div style="font-family: Arial, sans-serif;">' +
            '<h1 style="color: #737485;">This is Raghavendra Singh</h1>' +
            '<p style="color: #746d6d;">I have received your email and will respond to you soon. Please find the attached resume for your reference.</p>' +
            '</div>',
            attachments: [
                {
                    filename: 'file.pdf',
                    path: "./assets/Resume/Raghavendra_Frontend_Resume.pdf"
                }
            ]
        };
        transporter.sendMail(replyMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Confirmation sent: " + info.response);
            }
        });

        transporter.close();
    });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
