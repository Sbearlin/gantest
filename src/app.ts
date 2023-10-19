import { app } from './server';
import { importJson } from './data/addresses';

const port = 8080;

// Initialize dataset

importJson().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
