import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// console.log("G_MAIL:", process.env.G_MAIL);
// console.log("G_PWD:", process.env.G_PWD );

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.G_MAIL,
    pass: process.env.G_PWD,
  },
  tls: {
    rejectUnauthorized: false, // Add this for local development
  },
});

// Verify SMTP connection
// transporter.verify((error) => {
//   if (error) {
//     console.error("SMTP connection error:", error);
//   } else {
//     console.log("SMTP server is ready to send emails");
//   }
// });

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Function to send tour email
export const sendTourEmail = async (req, res) => {
  try {
    const { email, tour, destinationList, bookingData, pdfBuffer } = req.body;
    // console.log(process.env.G_MAIL);

    // console.log("Sending email to:", email);
    // console.log("Tour title:", tour?.title);
    // console.log("PDF buffer exists:", !!pdfBuffer);

    if (!email || !tour || !pdfBuffer) {
      return res.status(400).json({
        success: false,
        message: "Email, tour data, and PDF content are required",
      });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(pdfBuffer, "base64");

    const mailOptions = {
      from: process.env.G_MAIL,
      to: [email, "renukatours94@gmail.com"],
      subject: `Your Tour Itinerary: ${tour.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1F2937;">${tour.title}</h2>
          <p>Thank you for your interest in our tour package. Please find attached the detailed itinerary for your tour.</p>
          
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Tour Overview</h3>
            <p>Duration: ${tour.days} days</p>
            <p>Destinations: ${tour.destinations?.length -1 || 0} locations</p>
            ${
              bookingData
                ? `
              <h3 style="color: #374151;">Booking Details</h3>
              <p>Guest Name: ${bookingData.fullName}</p>
              <p>Travel Date: ${formatDate(bookingData.bookAt)}</p>
              <p>Group Size: ${bookingData.guestSize} persons</p>
            `
                : ""
            }
          </div>
          
          <p>For any questions or modifications to your booking, please don't hesitate to contact us.</p>
          <p style="color: #6B7280; font-size: 0.9em;">This is an automated email. Please do not reply directly.</p>
        </div>
      `,
      attachments: [
        {
          filename: `${tour.title}_itinerary.pdf`,
          content: buffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Tour details sent to your email successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send email. Please try again.",
    });
  }
};
