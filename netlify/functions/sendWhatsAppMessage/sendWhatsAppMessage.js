import twilio from 'twilio';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;
const whatsappTo = process.env.WHATSAPP_TO;

if (!accountSid || !authToken || !whatsappFrom || !whatsappTo) {
  throw new Error('Missing Twilio configuration in environment variables.');
}

const client = twilio(accountSid, authToken);

export async function handler(event) {
  if (event.httpMethod === 'POST') {
    try {
      const { firstName, lastName, birthdate, city, services, phoneNumber, instagram } = JSON.parse(event.body);
      const formattedBirthdate = dayjs(birthdate).format('DD/MM/YYYY');

      // Validate the data
      if (!firstName || !lastName || !birthdate || !city || !services || !phoneNumber) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Eksik veya geçersiz veri' }),
        };
      }

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
        from: `whatsapp:${whatsappFrom}`,
        to: `whatsapp:${whatsappTo}`,
        
      });

      console.log('WhatsApp mesajı gönderildi:', message.sid);

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
