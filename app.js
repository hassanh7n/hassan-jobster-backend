require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');


const authenticateUser = require('./middleware/authentication');
const express = require('express');
const app = express();

const connectDB = require('./db/connect');


// routers
const authRouters = require('./routes/auth');
const jobRoutes = require('./routes/job');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');




app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(helmet());

app.use(xss());
app.use(cors());

// routes
app.use('/api/v1/auth', authRouters)
app.use('/api/v1/jobs', authenticateUser,jobRoutes)

app.get('/', (req, res) => {
  res.status(200).json({
    msg : 'Hello'
  })
});



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
