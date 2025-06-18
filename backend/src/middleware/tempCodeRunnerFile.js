import dotenv from "dotenv";
dotenv.config();
import { MailSlurp } from "mailslurp-client";

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const mailslurp = new MailSlurp({
    apiKey: process.env.MAILSLURP_API,
  });
  const inbox = await mailslurp.inboxController.getInbox({
    inboxId: process.env.MAILSLURP_INBOXID,
  });
  const providerEmail = process.env.MAILSLURP_EMAIL;
  console.log("Email verifies", providerEmail);
});
