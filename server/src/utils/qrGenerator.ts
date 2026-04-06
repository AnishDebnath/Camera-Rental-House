import QRCode from 'qrcode';

const generateQrBase64 = async (payload: any): Promise<string> =>
  QRCode.toDataURL(JSON.stringify(payload), {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
  });

export default generateQrBase64;
