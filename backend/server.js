const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const connectDB = require('./config/mongodb'); // Import db connection
const User = require('./models/User');
const Admin = require('./models/Admin');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const PetRequest = require('./models/PetRequest');
const userAuthRoutes = require('./routes/userAuth');
const adminAuthRoutes = require('./routes/adminAuth');
const AdoptionApplication = require('./models/AdoptionApplication');
const VolunteerApplication = require('./models/VolunteerApplication');
const approvedAdoptionsRoutes = require('./routes/approvedAdoptions');
const adoptionRequestsRoutes = require('./routes/adoptionRequests');
const volunteerRoutes = require('./routes/volunteerApplications');

const app = express();

const session = require('express-session');

app.use(session({
  secret: 'adoptly_secret_key', // Change to a secure key in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Set to true if using HTTPS
}));




app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', userAuthRoutes);
app.use('/api', adminAuthRoutes);
app.use('/api', approvedAdoptionsRoutes);
app.use('/api', adoptionRequestsRoutes);
app.use('/api', volunteerRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));


// Connect to MongoDB
connectDB();
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/adoptly_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });



// API Route

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User Registered successfully' });

  } catch (error) {
    res.status(400).json({ error: 'Registration failed', details: error });

  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid user or password' });

  


  res.json({ message: 'User Login successfully', username: user.username });
});


// Admin Register

app.post('/adminregister', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const admin = new Admin({ username, email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Admin Registered successfully' });

  } catch (error) {
    res.status(400).json({ error: 'Admin Registration failed', details: error });

  }
});

// Admin Login

app.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ error: 'Admin not found' });


  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid  Admin or password' });

  res.json({ message: 'Admin Login successfully', username: admin.username });
});



//  Adoption application 
app.post('/api/adoptionapplications', async (req, res) => {

  const { petId, applicantName, email, phone, address, reason, household_agreement } = req.body;
  try {
    const newAdoptionApplication = new AdoptionApplication({
      petId,
      applicantName,
      email,
      phone,
      address,
      reason,
      household_agreement,

    });

    await newAdoptionApplication.save(); // Save to MongoDB
    res.status(200).json({ message: 'Adoption application submitted successfully!' });

  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ error: 'Failed to submit Adoption application' });
  }
});




// Volunteer Application

app.post("/api/volunteerapplications", async (req, res) => {

  try {
    const newVolunteerApplication = new VolunteerApplication(req.body);
    await newVolunteerApplication.save();
    res.status(200).json({ message: "Volunteer application submission successfully !" });
  } catch (error) {
    console.error("Save error:", error.message);
    res.status(500).json({ message: "Volunteer application submission failed" });
  }
});


// Route to landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/index.html'));
});

// Route to admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/admin.html'));
});

// Routes
app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.send(newUser);
});

app.post('/admins', async (req, res) => {
  const newAdmin = new Admin(req.body);
  await newAdmin.save();
  res.send(newAdmin);
});


// pet post requests section 

// POST: User submits a pet
app.post('/api/pet-requests', upload.single('petImage'), async (req, res) => {
  try {
    const { name, species, age, breed, gender, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newPet = new PetRequest({
      name,
      species,
      age,
      breed,
      gender,
      description,
      image: imageUrl, // store the image URL
      status: 'pending',
      submitedAt: new Date()
    });

    await newPet.save();
    res.status(200).json({ message: 'Pet request submitted', data: newPet });
  } catch (error) {
    console.error('Error submitting pet request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET: Admin fetches pending requests
app.get('/api/pet-requests', async (req, res) => {
  const pendingRequests = await PetRequest.find({ status: 'pending' });
  res.json(pendingRequests);
});

app.get('/api/pet-requests/approved', async (req, res) => {
  try {
    const approvedPets = await PetRequest.find({ status: 'approved' });
    res.json(approvedPets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/pet-requests/:id', async (req, res) => {
  try {
    const updated = await PetRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

app.delete('/api/approved-pets/:id', async (req, res) => {
  try {
    // Step 1: Find the pet record
    const pet = await PetRequest.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Step 2: Get the filename from the image URL
    // Example: if pet.image is "/uploads/cat123.jpg", we extract "cat123.jpg"
    const filename = pet.image?.split('/').pop();
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Step 3: Delete the image file
    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error("Image deletion failed:", err.message);
        // Still delete the DB record even if image is missing
      }

      // Step 4: Delete the DB record
      await PetRequest.findByIdAndDelete(req.params.id);
      res.json({ message: "Pet and image deleted successfully." });
    });

  } catch (err) {
    console.error("Error deleting pet:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.patch('/api/approved-pets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expect the status field to be sent in the body

  try {
    const updatedPet = await PetRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet status updated successfully', pet: updatedPet });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




