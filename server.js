const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');


const myMiddleware = (req, res, next) => {
  next();
};

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Connected to MongoDB');
// });

const app = express();
app.use(myMiddleware);

app.use(express.static(path.join(__dirname, 'build')));

// Serve files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(helmet());

const allowedOrigins = [
  '*', // Allow requests from localhost:3000
  // Add other allowed origins here
];

app.use(cors({
  origin: allowedOrigins,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const numWorkers = 4;
const workers = [];
let currentWorker = 0;

// Use the same app instance for all workers
for (let i = 0; i < numWorkers; i++) {
  workers.push(app);
}

app.use((req, res, next) => {
  workers[currentWorker].handle(req, res, next);
  currentWorker = (currentWorker + 1) % numWorkers;
});

const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
