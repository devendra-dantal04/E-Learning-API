import { Resend } from "resend";
import { ApiError } from "../ApiError.js";

export const sendEmail = async (emailTo, email_type) => {
  const resend = new Resend(`${process.env.RESEND_API_KEY}`);

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [emailTo],
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Unable to send email");
  }
};
