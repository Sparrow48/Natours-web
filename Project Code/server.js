const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException' , err =>{
  console.log(err.name, err.message);
  console.log('Uncaught Rejection shutting down!');
  
    process.exit(1);
});
 

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));
const port = process.env.PORT || 3000;
const server =app.listen(port, () =>{
    console.log(`App listening on port: ${port}`);
});

process.on('unhandledRejection', err =>{
  console.log(err.name, err.message);
  console.log('Unhandle Rejection shutting down!');
  server.close(()=>{
    process.exit(1);
  });
});
 
