const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle form submissions
app.post('/api/contact', (req, res) => {
  const formData = req.body;

  // Validate form data (optional)

  // Save form data to a JSON file
  saveFormData(formData)
    .then(() => {
      res.status(200).json({ message: 'Form data saved successfully' });
    })
    .catch((error) => {
      console.error('Error saving form data:', error);
      res.status(500).json({ message: 'Error saving form data' });
    });
});

// Function to save form data to a JSON file
function saveFormData(formData) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, 'form_data.json');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        // If file doesn't exist, create a new file with an empty array
        if (err.code === 'ENOENT') {
          fs.writeFile(filePath, '[]', (err) => {
            if (err) {
              reject(err);
            } else {
              saveFormDataToFile(filePath, formData, resolve, reject);
            }
          });
        } else {
          reject(err);
        }
      } else {
        saveFormDataToFile(filePath, formData, resolve, reject);
      }
    });
  });
}

function saveFormDataToFile(filePath, formData, resolve, reject) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      reject(err);
    } else {
      const formDataArray = JSON.parse(data);
      formDataArray.push(formData);

      fs.writeFile(filePath, JSON.stringify(formDataArray, null, 2), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
