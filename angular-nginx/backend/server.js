import express from 'express';

const app = express();

app.get('/test', (req, res) => {

  res.json({
    message: 'API Success',
    timestamp: new Date()
  });

});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});