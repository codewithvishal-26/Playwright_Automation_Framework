// Single place where credentials are read. Values come from .env (local) or GitHub Secrets (CI).
// Do not hard-code passwords in tests.
require('dotenv').config();

module.exports = {
  // rahulshettyacademy.com/client (e-commerce practice app)
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  CLIENT_PASSWORD: process.env.CLIENT_PASSWORD,
};
