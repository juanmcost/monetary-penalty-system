import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL;

app.listen(PORT, () => {
  console.log(`Server listening on: ${BASE_URL}`);
});
