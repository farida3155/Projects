const Donation = require('../models/donation_schema');
const nodemailer = require('nodemailer');

exports.donate = async (req, res) => {
    try {
        const { firstName, lastName, email, pack, randomAmount } = req.body;

        // Required field checks
        if (!firstName || !lastName || !email) {
            return res.json({ status: "Failed", message: "Please fill in all required fields." });
        }

        // Email format validation
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.json({ status: "Failed", message: "Please enter a valid email." });
        }

        // Optional fields logic: only one must be filled, not both or neither
        if ((!pack || pack === "") && (!randomAmount || randomAmount.trim() === "")) {
            return res.json({ status: "Failed", message: "Please select a package or enter an amount." });
        }

        if (pack && randomAmount && randomAmount.trim() !== "") {
            return res.json({ status: "Failed", message: "Please choose only one: either a package OR a custom amount — not both." });
        }

        // Custom amount validity check
        if (randomAmount && (isNaN(randomAmount) || Number(randomAmount) <= 0)) {
            return res.json({ status: "Failed", message: "Enter a valid donation amount." });
        }

        // Determine donation amount
        let amount = 0;
        if (pack && ['p1', 'p2', 'p3'].includes(pack)) {
            if (pack === 'p1') amount = 500;
            else if (pack === 'p2') amount = 70;
            else if (pack === 'p3') amount = 3500;
        }
        if (randomAmount && Number(randomAmount) > 0) {
            amount = Number(randomAmount);
        }

        if (amount <= 0) {
            return res.json({ status: "Failed", message: "Please select a package or enter a valid amount." });
        }

        // Save to DB
        const donation = new Donation({
            firstName,
            lastName,
            email,
            package: pack || null,
            amount
        });
        await donation.save();

        // Email setup
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
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

        // Send email
        await transporter.sendMail(mailOptions);

        return res.json({ status: "Success", message: "Donation successful! Receipt sent to your email." });
    } catch (err) {
        console.error(err);
        return res.json({ status: "Failed", message: "Server error during donation." });
    }
};
