const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51Rk5mYC6DM5ws9JSoMAIKEnY2hgHDiuKph88AMowCVg9hl8P093Thgx9frTpKauTJwAiad3HMnHOf71Fy9r68Eyz0021wohS5Q'); // remplace par ta clé secrète Stripe Test

module.exports = stripe;
