const emailTemplates = {
  register: (username) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Platform!</title>
        <style>
            /* Add your email styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
                text-align: center;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #333333;
            }

            p {
                color: #666666;
                line-height: 1.6;
            }

            .button {
                display: inline-block;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 20px;
            }

            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Our Platform!</h1>
            <p>Dear ${username} ,</p>
            <p>Thank you for registering on our platform. You are now part of our community! Start your upskilling journey from our platform.</p>
            <p>Feel free to explore our features and start enjoying the benefits.</p>
            <p>If you have any questions or need assistance, don't hesitate to contact us.</p>
            <a href="#" class="button">Login to Your Account</a>
        </div>
    </body>
    </html>`;
  },
  enrollment: () => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You for Enrolling in Our Course!</title>
            <style>
                /* Add your email styles here */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333333;
                }

                p {
                    color: #666666;
                    line-height: 1.6;
                }

                .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 20px;
                }

                .button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Thank You for Enrolling in Our Course!</h1>
                <p>Dear Student,</p>
                <p>Thank you for choosing our course. We're excited to have you on board!</p>
                <p>You've taken a great step toward your goals, and we're here to support you every step of the way.</p>
                <p>Feel free to start learning at your own pace and explore the course materials.</p>
                <p>If you have any questions or need assistance, don't hesitate to contact us.</p>
                <a href="#" class="button">Access Your Course</a>
            </div>
        </body>
        </html>
        `;
  },
  resetPassword: (user, resetUrl) => {
    return `
    Hi ${user?.name},
    You recently requested to reset the password for your account. Follow this link to proceed:
    ${resetUrl}

    Thanks, E Learning Platform team
    `;
  },
  updatePassword: () => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset/Update Successful</title>
            <style>
                /* Add your email styles here */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    text-align: center;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333333;
                }

                p {
                    color: #666666;
                    line-height: 1.6;
                }

                .button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 20px;
                }

                .button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset/Update Successful</h1>
                <p>Dear User,</p>
                <p>Your password has been successfully reset/updated.</p>
                <p>If you initiated this action, you can now log in to your account using your new password.</p>
                <p>If you did not request this change, please contact our support team immediately.</p>
                <p>Thank you for choosing our platform!</p>
                <a href="#" class="button">Log In to Your Account</a>
            </div>
        </body>
        </html>
        `;
  },
};

export default emailTemplates;
