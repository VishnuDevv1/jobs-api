require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const connectDB = require('./db/connect')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

const authUser = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

app.set('trust proxy', 1);

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(rateLimiter({
  windowMs: 15*60*1000,
  max:100
}))

app.get('/', (req,res)=>{
  res.send('JOBS API')
})
// routes
app.use('/api/v1/auth', authRouter )
app.use('/api/v1/jobs', authUser , jobsRouter )

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
