export default `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>mail body</title>
    <link rel="stylesheet">
    <style>
        #div1 {
            width: 700px;
            margin: 0 auto;
            padding: 10px;
            position: relative;
            background-color: royalblue;
        }
        #div2 {
            height: 400px;
            padding: 50px;
            position: relative;
            background-color: white;
            text-align: center;
            margin: 50px auto 0;
        }
        h1 {
            color: white;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }
        h2 {
            color: royalblue;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            font-size: 40px;
        }
        h3,h4 {
            color: black;
            font-weight: lighter;
        }
        #link {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>
<body>
    <div id="div1"><h1>qutobia</h1><div id="div2"><h2>Verify your email address</h2>
    <h3>Welcome to qutobia! Click on the following button to verify your email address</h3>
    <a id="link" href="{{APP_URL}}/verify/{{userId}}" target="_blank">Verify email address</a><br>
    <h4>If you didn't request this email or if you think something is wrong, feel free to contact our support team at 
        hello@qutobia.com. We're here to help!</h4></div>
    </div>
</body>
</html>`