// paymentController.js
const paypal = require('../config/payconfig');

//  Create PayPal Payment
// paymentController.js

exports.createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: "http://localhost:3000/payment/success",
        cancel_url: "http://localhost:3000/payment/cancel",
      },
      transactions: [
        {
          amount: { total: amount, currency: "USD" },
          description: "Doctor Appointment Payment",
        },
      ],
    };

    paypal.payment.create(paymentJson, (error, payment) => {
      if (error) {
        return res.status(500).json({ error });
      } else {
        const approvalUrl = payment.links.find((link) => link.rel === "approval_url").href;
        res.json({ approvalUrl });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Payment creation failed" });
  }
};


 


exports.executePayment = async (req, res) => {
  try {
    const { paymentId, PayerID } = req.query;

    // Check if both paymentId and PayerID exist in the query
    if (!paymentId || !PayerID) {
      return res.status(400).json({ error: "Invalid payment parameters" });
    }

    paypal.payment.execute(paymentId, { payer_id: PayerID }, (error, payment) => {
      if (error) {
        return res.status(500).json({ error });
      } else {
        // Redirect to frontend success page instead of sending JSON response
        return res.redirect(`http://localhost:3000/payment/success?paymentId=${paymentId}&PayerID=${PayerID}`);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Payment execution failed" });
  }
};



//  Cancel Payment
exports.cancelPayment = (req, res) => {
  res.status(400).json({ message: "Payment cancelled" });
};
