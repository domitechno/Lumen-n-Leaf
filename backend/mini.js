import express from 'express';
const app = express();

app.get('/api/test', (req, res) => {
  res.json({ msg: "OK" });
});

app.listen(3000, () => console.log('Mini server running'));
