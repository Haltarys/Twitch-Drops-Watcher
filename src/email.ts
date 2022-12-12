import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface EmailSenderParameters {
  gmailAddress: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface SendEmailParameters {
  to: string;
  subject: string;
  html: string;
}

export default class GmailSender {
  private transporter: nodemailer.Transporter;
  private gmailAddress: string;

  /**
   * Constructs an GmailSender to programmatically send emails through a Gmail account.
   * @param options An options object to initialise the EmailSender with a Gmail account.
   */
  constructor({ gmailAddress, clientId, clientSecret, refreshToken }: EmailSenderParameters) {
    this.gmailAddress = gmailAddress;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: gmailAddress,
        clientId,
        clientSecret,
        refreshToken,
      },
    });
  }

  /**
   * Send an email with the Gmail account passed to the instance at initialisation.
   * @param options An options object to determine the receiver, subject, and content of the email to send.
   * @returns An Promise resolved upon completion or failure of the sending.
   */
  async sendEmail({ to, subject, html }: SendEmailParameters): Promise<SMTPTransport.SentMessageInfo> {
    return this.transporter.sendMail({ from: this.gmailAddress, to, subject, html });
  }
}
