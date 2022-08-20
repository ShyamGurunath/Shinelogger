import { SmtpClient } from "../Shared/deps.ts";
import { isOnline } from "../Shared/deps.ts";
import { log } from "../Shared/deps.ts";

const sendEmail = async (data) => {
  try {
    const isInternetConnected = await isOnline();
    if (!isInternetConnected) {
      log.info("No internet connection, cannot send email");
      return {
        msg: "No internet connection, cannot send email",
      };
    }

    const client: SmtpClient = new SmtpClient();

    const connectconfig = {
      hostname: "smtp.gmail.com",
      port: 465,
      username: data.emailFrom,
      password: data.emailFromPassword,
    };

    await client.connectTLS(connectconfig);
    // send the email
    await client.send({
      from: data.emailFrom,
      to: data.emailToPrimary,
      subject: "ShineLogger Bot " + "- LogLevel " + data.emailLogLevel +
        " Reached",
      content: "Hello,\n\n" +
        "This is a message from the ShineLogger Bot.\n\n" +
        "The log level " + data.emailLogLevel + " has been reached.\n\n" +
        `This loggerName - ${data.loggerName} \n\n` +
        "The log level is " + data.logLevel + "\n\n" + "The Logmessage is " +
        data.logmessage + "\n\n" + "AdditionInfo - " + data.additionalInfo +
        "\n\n" + "Thank you,\n" + "ShineLogger Bot",
    });

    // send the email to secondary email if present
    if (data.emailToSecondary) {
      await client.send({
        from: data.emailFrom,
        to: data.emailToSecondary,
        subject: "ShineLogger Bot " + "- LogLevel " + data.emailLogLevel +
          " Reached",
        content: "Hello,\n\n" +
          "This is a message from the ShineLogger Bot.\n\n" +
          "The log level " + data.emailLogLevel + " has been reached.\n\n" +
          `This loggerName - ${data.loggerName} \n\n` +
          "The log level is " + data.logLevel + "\n\n" + "The Logmessage is " +
          data.logmessage + "\n\n" + "AdditionInfo -" + data.additionalInfo +
          "\n\n" + "Thank you,\n" + "ShineLogger Bot",
      });
    }

    await client.close();

    return {
      msg: "Email sent successfully",
    };
  } catch (err) {
    return {
      msg: "Error sending email" + " " + err,
    };
  }
};

export default sendEmail;
