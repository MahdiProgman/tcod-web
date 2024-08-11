export default function getHTMLEmailVerification(verificationCode) {
  return `
        <!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تایید ایمیل</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            text-align: center;
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
        }
        .code {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 20px;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            letter-spacing: 2px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
    <body>
        <div class="container">
            <div class="header">
                <p>TCOD</p>
            </div>
            <div class="content">
                <h1>تایید ایمیل</h1>
                <p>برای تکمیل ثبت‌نام خود در tcod-web، لطفا کد تایید زیر را وارد کنید:</p>
                <div class="code">${verificationCode}</div>
                    <p>اگر شما این درخواست را نکرده‌اید، لطفا این ایمیل را نادیده بگیرید.</p>
                </div>
                <div class="footer">
                    <p>© 2024 tcod-web. تمامی حقوق محفوظ است.</p>
                </div>
            </div>
        </body>
    </html>
    `;
}
