import twilio from 'twilio';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log('TWILIO_ACCOUNT_SID:', accountSid);
console.log('TWILIO_AUTH_TOKEN:', authToken);

const client = twilio(accountSid, authToken);

export async function handler(event) {
  if (event.httpMethod === 'POST') {
    const { firstName, lastName, birthdate, city, services, phoneNumber, instagram } = JSON.parse(event.body);
    const formattedBirthdate = dayjs(birthdate).format('DD/MM/YYYY');

    try {
      const message = await client.messages.create({
        body: `
          Ad: ${firstName}
          Soyad: ${lastName}
          Doğum Tarihi: ${formattedBirthdate}
          Şehir: ${city}
          Hizmetler: ${services.join(', ')}
          Telefon: ${phoneNumber}
          Instagram: ${instagram || 'Belirtilmemiş'}
        `,
        from: process.env.TWILIO_WHATSAPP_FROM, 
        to: process.env.WHATSAPP_TO, 
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'WhatsApp mesajı başarıyla gönderildi' }),
      };
    } catch (error) {
      console.error('WhatsApp mesajı gönderme hatası:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'WhatsApp mesajı gönderme sırasında hata oluştu' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Yöntem Desteklenmiyor' }),
  };
}
