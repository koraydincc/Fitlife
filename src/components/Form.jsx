import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Checkbox,
  message,
  ConfigProvider,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import logo from "../assets/logo.png";
import Result from "./Result";

dayjs.locale("tr");

const MyForm = () => {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    try {
      const whatsappResponse = await fetch("/.netlify/functions/sendWhatsAppMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const emailResponse = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const whatsappResult = await whatsappResponse.json();
      const emailResult = await emailResponse.json();

      if (whatsappResponse.ok && emailResponse.ok) {
        setSubmitted(true);
        message.success('İletişim Formu Gönderildi.');
      } else {
        message.error(`Hata: ${whatsappResult.message || emailResult.message}`);
      }
    } catch (error) {
      message.error("WhatsApp ve e-posta gönderiminde hata oluştu.");
    }
  };

  if (submitted) {
    return <Result />;
  }

  return (
    <ConfigProvider locale={{ locale: "tr", DatePicker: { lang: { locale: "tr" } } }}>
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="w-25 h-20 rounded-full" />
        </div>

        <Form
          form={form}
          name="contact"
          layout="vertical"
          onFinish={onFinish}
          className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
        >
          <Form.Item
            name="firstName"
            className="font-bold"
            label="Ad"
            rules={[{ required: true, message: "Lütfen adınızı girin" }]}
          >
            <Input
              placeholder="Adınız"
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            className="font-bold"
            label="Soyad"
            rules={[{ required: true, message: "Lütfen soyadınızı girin" }]}
          >
            <Input
              placeholder="Soyadınız"
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </Form.Item>

          <Form.Item
            name="birthdate"
            className="font-bold"
            label="Doğum Tarihi"
            rules={[{ required: true, message: "Lütfen doğum tarihinizi girin" }]}
          >
            <DatePicker
              placeholder="GG/AA/YYYY"
              format="DD/MM/YYYY"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </Form.Item>

          <Form.Item
            name="city"
            className="font-bold"
            label="Yaşadığı Şehir"
            rules={[{ required: true, message: "Lütfen yaşadığınız şehri girin" }]}
          >
            <Input
              placeholder="Yaşadığınız şehir"
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </Form.Item>

          <Form.Item
            name="services"
            className="font-bold"
            label="İletişim Nedeniniz"
            rules={[{ required: true, message: "Lütfen iletişim nedeninizi seçiniz" }]}
          >
            <Checkbox.Group>
              <Checkbox value="Cilt-Bakimi" className="text-gray-700">
                Cilt Bakımı
              </Checkbox>
              <Checkbox value="Vucut-Analizi" className="text-gray-700">
                Vücut Analizi
              </Checkbox>
              <Checkbox value="Is-Firsati" className="text-gray-700">
                İş Fırsatı
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            className="font-bold"
            label="Telefon Numaranız"
            rules={[{ required: true, message: "Lütfen telefon numaranızı girin" }]}
          >
            <Input
              type="tel"
              placeholder="Telefon numaranız"
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </Form.Item>

          <Form.Item
            name="instagram"
            className="font-bold"
            label="Instagram Adresiniz"
            rules={[{ type: "username", message: "Lütfen geçerli bir URL girin" }]}
          >
            <Input
              placeholder="Instagram Kullanıcı Adınız"
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Gönder
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default MyForm;
