const Donation = require('../models/donation_schema');
const nodemailer = require('nodemailer');

exports.donate = async (req, res) => {
    try {
        const { firstName, lastName, email, pack, randomAmount } = req.body;

        // Backend validation
        if (!firstName || !lastName || !email) {
            return res.json({ status: "Failed", message: "Please fill in all required fields." });
        }
        // Email regex
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.json({ status: "Failed", message: "Please enter a valid email." });
        }
        // Ensure amount is present and valid
        let amount = 0;
        if (pack && ['p1', 'p2', 'p3'].includes(pack)) {
            if (pack === 'p1') amount = 500;
            else if (pack === 'p2') amount = 70;
            else if (pack === 'p3') amount = 3500; // average surgery cost
        }
        if (randomAmount && Number(randomAmount) > 0) {
            amount = Number(randomAmount);
        }
        if (amount <= 0) {
            return res.json({ status: "Failed", message: "Please select a package or enter a valid amount." });
        }

        // Save donation (never save card/cvv!)
        const donation = new Donation({
            firstName,
            lastName,
            email,
            package: pack || null,
            amount
        });
        await donation.save();

        // Prepare and send receipt email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // set in .env
                pass: process.env.EMAIL_PASS  // set in .env
            }
        });

        const mailOptions = {
            from: '"Petco Donations" <petcopaws24@gmail.com>',
            to: email,
            subject: 'Donation Receipt - Petco Adoption',
            text: `Dear ${firstName} ${lastName},

Thank you for your generous donation to Petco Adoption!

Donation Details:
- Amount: ${amount} L.E.
- Date: ${new Date().toLocaleDateString()}
${pack ? `- Package: ${pack}` : ''}

We appreciate your support!

Best regards,
Petco Adoption Team`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ status: "Success", message: "Donation successful! Receipt sent to your email." });
    } catch (err) {
        console.error(err);
        return res.json({ status: "Failed", message: "Server error during donation." });
    }
};