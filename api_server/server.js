// server.js

const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware for parsing JSON bodies

// In-memory database for storing items
let items = [];

// Load the Swagger YAML file
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yml', 'utf8'));

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CRUD Routes

// GET all items
app.get('/items', (req, res) => {
  res.status(200).json(items);
});

// GET item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(item => item.id === parseInt(id)); // Ensure ID is parsed correctly as an integer
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.status(200).json(item);
});

// POST a new item
app.post('/items', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  const newItem = {
    id: items.length + 1, // ID is generated based on the array length (can be improved later)
    name,
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const itemIndex = items.findIndex(item => item.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  items[itemIndex].name = name;
  res.status(200).json(items[itemIndex]);
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const itemIndex = items.findIndex(item => item.id === parseInt(id));

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(itemIndex, 1);
  res.status(200).json({ message: 'Item deleted' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
