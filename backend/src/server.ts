import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';


const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL;

app.listen(PORT, () => {
  console.log(`Server listening on: ${BASE_URL}`);
});
