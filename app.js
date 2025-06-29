const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;
// TRUST PROXY so Express looks at x-forwarded-for
app.set('trust proxy', true);

// Initialize MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db, collection;

// Connect once at server startup
async function connectDB() {
  try {
    await client.connect();
    db = client.db('raghav768');
    collection = db.collection('raghav768-portfolio');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Stop the server if DB connection fails
  }
}

// Initialize Express
const app = express();
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

// ==========================
// Visit Counter API
// ==========================
// app.get('/api/visit', async (req, res) => {
//   try {
//     const result = await collection.findOneAndUpdate(
//       { _id: 'visits' },
//       { $inc: { count: 1 } },
//       { upsert: true, returnDocument: 'after' }
//     );
//     //  console.log("Mongo result:", result);
//     const counter = result.count ? result.count : 1;
//     res.json({ visits: counter });
//   } catch (err) {
//     console.error('Visit counter error:', err);
//     res.status(500).json({ error: 'Failed to update visit count' });
//   }
// });

app.get('/api/visit', async (req, res) => {
  try {
    const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const today = new Date().toISOString().split('T')[0];

    const exists = await collection.findOne({ _id: `ip-${ip}-${today}` });

    await collection.updateOne(
      { _id: 'visits-total' },
      { $setOnInsert: { count: 0 } },
      { upsert: true }
    );
    if (!exists) {
      await collection.insertOne({
        _id: `ip-${ip}-${today}`,
        ip: ip,
        date: today,
        timestamp: new Date()
      });

      await collection.updateOne(
        { _id: `visits-${today}` },
        { $inc: { count: 1 } },
        { upsert: true }
      );

      await collection.updateOne(
        { _id: 'visits-total' },
        { $inc: { count: 1 } },
        { upsert: true }
      );
    }

    // Fetch current counts
    const todayDoc = await collection.findOne({ _id: `visits-${today}` });
    const totalDoc = await collection.findOne({ _id: 'visits-total' });

    res.json({
      today: todayDoc?.count || 0,
      total: totalDoc?.count || 0,
      unique: !exists
    });

  } catch (err) {
    console.error('Visit counter error:', err);
    res.status(500).json({ error: 'Failed to update visit count' });
  }
});



// ==========================
// Serve frontend
// ==========================
app.get('/weather', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ==========================
// Email form handler
// ==========================
app.post('/sendEmail', async function (req, res) {
  try {
    const data = {
      ...req.body,
      timestamp: new Date(),
      ip: req.headers['x-real-ip'] || req.socket.remoteAddress
    };

    const result = await collection.insertOne(data);
    console.log(`Data saved to MongoDB Atlas: ${result.insertedId}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "raghav.singh3177@gmail.com",
      subject: "Email from Portfolio",
      html: Object.entries(data).map(([key, value]) => `<b>${key}</b>: ${value}<br>`).join('')
    };

    await transporter.sendMail(mailOptions);
    console.log("Notification email sent");

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Thank you for contacting",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1 style="color: #737485;">This is Raghavendra Singh</h1>
          <p style="color: #746d6d;">I have received your email and will respond to you soon. Please find the attached resume for your reference.</p>
        </div>`,
      attachments: [
        {
          filename: 'Raghavendra_Frontend_Resume.pdf',
          path: "./assets/Resume/Raghavendra_Frontend_Resume.pdf"
        }
      ]
    });
    console.log("Confirmation email sent");

    res.status(200).send({ message: 'Message sent successfully.', type: 'success' });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send({ message: 'Message not sent.', type: 'error' });
  }
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('App listening on port 3000!');
  });
});
