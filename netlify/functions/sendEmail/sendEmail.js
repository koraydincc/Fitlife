import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

export async function handler(event) {
  if (event.httpMethod === 'POST') {
    const { firstName, lastName, birthdate, city, services, phoneNumber, instagram } = JSON.parse(event.body);

    const formattedBirthdate = dayjs(birthdate).format('DD/MM/YYYY');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: 'TEST',
      text: `
        Ad: ${firstName}
        Soyad: ${lastName}
        Doğum Tarihi: ${formattedBirthdate}
        Şehir: ${city}
        Hizmetler: ${services.join(', ')}
        Telefon: ${phoneNumber}
        Instagram: ${instagram || 'Belirtilmemiş'}
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'E-posta başarıyla gönderildi' }),
      };
    } catch (error) {
      console.error('E-posta gönderme hatası:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'E-posta gönderme sırasında hata oluştu' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Yöntem Desteklenmiyor' }),
  };
}
