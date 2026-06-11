// paymentController.js
const paypal = require('../config/payconfig');

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

//  Create PayPal Payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, doctorid } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${BACKEND_URL}/payment/execute?doctorid=${doctorid || ''}`,
        cancel_url: `${FRONTEND_URL}/payment/cancel`,
      },
      transactions: [
        {
          amount: { total: parseFloat(amount).toFixed(2), currency: "USD" },
          description: "Doctor Appointment Payment",
        },
      ],
    };

    paypal.payment.create(paymentJson, (error, payment) => {
      if (error) {
        console.log("PayPal Error:", JSON.stringify(error.response || error, null, 2));
        return res.status(500).json({ error: error.response || error });
      } else {
        const approvalUrl = payment.links.find((link) => link.rel === "approval_url").href;
        res.json({ approvalUrl });
      }
    });
  } catch (error) {
    console.log("Payment creation error:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
};

//  Execute PayPal Payment (called by PayPal redirect)
exports.executePayment = async (req, res) => {
  try {
    const { paymentId, PayerID, doctorid } = req.query;

    if (!paymentId || !PayerID) {
      return res.redirect(`${FRONTEND_URL}/payment/cancel`);
    }

    paypal.payment.execute(paymentId, { payer_id: PayerID }, (error, payment) => {
      if (error) {
        return res.redirect(`${FRONTEND_URL}/payment/cancel`);
      } else {
        if (doctorid) {
          return res.redirect(`${FRONTEND_URL}/booking/${doctorid}?paid=true&paymentId=${paymentId}`);
        }
        return res.redirect(`${FRONTEND_URL}/payment/success?paymentId=${paymentId}&PayerID=${PayerID}`);
      }
    });
  } catch (error) {
    res.redirect(`${FRONTEND_URL}/payment/cancel`);
  }
};

//  Cancel Payment
exports.cancelPayment = (req, res) => {
  res.redirect(`${FRONTEND_URL}/payment/cancel`);
};
