import React from 'react';
import { Button, Result as AntdResult } from 'antd';

const Result = () => (
  <AntdResult
    status="success"
    title="Başarıyla Gönderildi!"
    subTitle="Formunuz başarıyla gönderildi. Kısa süre içinde sizinle iletişime geçeceğiz."
  />
);

export default Result;
