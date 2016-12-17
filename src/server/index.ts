import * as express from 'express';
import * as path from 'path';

const app = express();

const listener = app.listen(3000, () => {
  console.log(`Listening on port ${listener.address().port}`)
});

app.get('/', (req, res) => {
  console.log("a");
  res.send('done');
});
app.set("view options", { layout: false });
app.use(express.static(path.join(__dirname, '../../dist')))