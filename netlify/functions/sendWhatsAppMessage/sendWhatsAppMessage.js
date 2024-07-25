import twilio from 'twilio';
import dotenv from 'dotenv';
import dayjs from 'dayjs';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function handler(event) {
  if (event.httpMethod === 'POST') {
    // Veriyi JSON formatında al
    const { firstName, lastName, birthdate, city, services, phoneNumber, instagram } = JSON.parse(event.body);

    // Tarih formatını dönüştür
    const formattedBirthdate = dayjs(birthdate).format('DD/MM/YYYY');

    try {
      // WhatsApp mesajını gönder
      await client.messages.create({
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
