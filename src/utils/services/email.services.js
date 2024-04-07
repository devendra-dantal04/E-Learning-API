import { Resend } from "resend";
import { ApiError } from "../ApiError.js";

export const sendEmail = async (emailOptions) => {
  const resend = new Resend(`${process.env.RESEND_API_KEY}`);

  // Currenty because use of free tier plan i only able to send email to my registered email

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "devendra.dantal04@gmail.com",
      subject: emailOptions.subject,
      html: emailOptions.text,
    });

    if (error) {
      throw new ApiError(500, error.message);
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Unable to send email");
  }
};
