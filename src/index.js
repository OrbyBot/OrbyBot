import express from 'express';
// import bodyParser from 'body-parser';

const app = express();
// app.use(bodyParser);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT || 3000);
