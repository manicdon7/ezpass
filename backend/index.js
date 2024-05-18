const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const admin = require("firebase-admin");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.keyid,
  key_secret: process.env.keysecret
});


const serviceAccount = require("./ticket2-b1147-firebase-adminsdk-93xxm-5626a22e27.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ticket2-b1147-default-rtdb.firebaseio.com/"
});
dbURI = 'mongodb+srv://manikandan05082003:Manicdon07%40@cluster0.scriurb.mongodb.net/Ticket2'

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection;

const eventSchema = new mongoose.Schema({
  name: String,
  location: String,
  totalTickets: Number,
  price: Number,
  date: Date,
  time: String,
  imageUrl: String,
  contentType: String,
  hostedBy: String,
  bookedBy: [String],
  approvalStatus: { type: String, default: "Pending" },
});

const approvalSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  bookingDetails: {
    type: Object,
    required: true
  }
});


const Event = mongoose.model("Event", eventSchema);
const Approval = mongoose.model('Approval', approvalSchema);

app.use(cors(["https://ezpass-backend.vercel.app/","http://localhost:3000/"]));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

const verifyToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authorizationHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.userEmail = decodedToken.email;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, limits: { fileSize: 25 * 1024 * 1024 } });

app.get("/", async (req,res) => {
    res.json({ message: "Welcome to the Events API!" })
})

app.post("/api/host", verifyToken, upload.single("image"), async (req, res) => {
  const { name, location, totalTickets, price, date, time, imageUrl } = req.body;
  const email = req.userEmail;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const newEvent = new Event({
      name,
      location,
      totalTickets: parseInt(totalTickets),
      price: parseInt(price),
      date: date ? new Date(date) : null,
      time,
      imageUrl,
      hostedBy: email,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event hosted successfully" });
  } catch (error) {
    console.error("Error hosting event:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});


app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) {
      return res.status(404).json({ error: "No events found" });
    }
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/events/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/events/book/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: "User email is required" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.bookedBy.includes(userEmail)) {
      return res.status(400).json({ error: "You have already booked a ticket for this event" });
    }

    if (event.totalTickets <= 0) {
      return res.status(400).json({ error: "No available tickets" });
    }

    event.bookedBy.push(userEmail);
    event.totalTickets -= 1;
    await event.save();

    res.status(200).json({ message: "Ticket booked successfully" });
  } catch (error) {
    console.error("Error booking tickets:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) {
      return res.status(404).json({ error: "No events found" });
    }
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/events/approve/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const { approvalStatus } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.approvalStatus = approvalStatus;
    await event.save();

    res.status(200).json({ message: "Event approval status updated successfully" });
  } catch (error) {
    console.error("Error updating event approval status:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

app.post('/api/approval-request', async (req, res) => {
  const { eventId, userEmail, ...bookingDetails } = req.body;
  console.log('Received approval request:');
  console.log('Event ID:', eventId);
  console.log('User Email:', userEmail);
  console.log('Booking Details:', bookingDetails);

  try {

    const existingApproval = await Approval.findOne({ eventId, userEmail });
    if (existingApproval) {
      return res.status(400).json({ message: 'User has already requested approval for this event' });
    }

    const newApproval = new Approval({
      eventId,
      userEmail,
      bookingDetails
    });

    await newApproval.save();

    res.status(200).json({ message: 'Approval request received successfully' });
  } catch (error) {
    console.error('Error storing approval request:', error);
    res.status(500).json({ error: 'Failed to store approval request' });
  }
});

app.post('/api/approve-request/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { userEmail, approve } = req.body;

  try {

    const approval = await Approval.findOne({ eventId, userEmail });

    if (!approval) {
      return res.status(404).json({ error: "Approval request not found" });
    }

    if (approve) {

      const event = await Event.findOneAndUpdate(
        { _id: eventId, totalTickets: { $gt: 0 } },
        { $push: { bookedBy: userEmail },
          $inc: { totalTickets:-1 } },
        { new: true }
      );

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
    }

    await Approval.deleteOne({ eventId, userEmail });

    return res.status(200).json({ message: "Approval/Rejection handled successfully" });
  } catch (error) {
    console.error("Error handling approval/rejection request:", error);
    res.status(500).json({ error: "Failed to handle approval/rejection request" });
  }
}); 


app.get("/api/approval/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const approvalRequests = await Approval.find({ eventId: id });
    res.json(approvalRequests);
  } catch (error) {
    console.error("Error fetching approval requests:", error);
    res.status(500).json({ error: "Failed to fetch approval requests" });
  }
});

const generatePaymentLink = (eventId) => {
  // Construct the payment link based on the eventId
  const paymentLink = `http://localhost:3000/payment/${eventId}`;
  return paymentLink;
};

app.post("/api/payment-link/:eventId", async (req, res) => {
  const { eventId } = req.params; // Extracting eventId from request params

  try {
    // Generate the payment link based on the eventId
    const paymentLink = generatePaymentLink(eventId);

    // Send the payment link to the client
    res.json({ paymentLink });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
