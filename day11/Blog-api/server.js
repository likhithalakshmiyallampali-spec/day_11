const express = require('express');
const logger = require('./middleware/logger');
const postRoutes = require('./routes/posts');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/posts', postRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));