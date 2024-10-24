export const DB_NAME = 'userInfo';

export const otpSendHtml = (verificationCode) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="text-align: center; color: #0044cc;">North Star Matrix</h2>
          <p>Hello,</p>
          <p>We have received a request to verify your identity. Please use the following OTP to complete your verification process:</p>
          <p style="font-size: 24px; font-weight: bold; color: #0044cc; text-align: center; padding: 10px; border: 1px solid #0044cc; border-radius: 8px; display: inline-block;">
            ${verificationCode}
          </p>
          <p>This code is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not request this OTP, please contact our support team immediately at <a href="mailto:support@northstarmatrix.com" style="color: #0044cc; text-decoration: none;">support@northstarmatrix.com</a>.</p>
          <p>Thank you,<br>North Star Matrix Team</p>
          <hr style="border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #888888; text-align: center;">
            © 2024 North Star Matrix. All rights reserved.
          </p>
        </div>
      `

      export const forgotPasswordHtml = (resetCode) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="text-align: center; color: #0044cc;">Dikuss</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Please use the following code to reset your password:</p>
          <p style="font-size: 24px; font-weight: bold; color: #0044cc; text-align: center; padding: 10px; border: 1px solid #0044cc; border-radius: 8px; display: inline-block;">
            ${resetCode}
          </p>
          <p>This code is valid for <strong>5 minutes</strong>.</p>
          <p>If you did not request this code, please contact our support team immediately at <a href="mailto:support@dikuss.com" style="color: #0044cc; text-decoration: none;">support@dikuss.com</a>.</p>
          <p>Thank you,<br>Dikuss Team</p>
          <hr style="border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 12px; color: #888888; text-align: center;">
            © 2024 Dikuss. All rights reserved.
          </p>
        </div>
      `;


// export const tooManyAttempts = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
//         <h2 style="text-align: center; color: #0044cc;">North Star Matrix</h2>
//         <p>Hello,</p>
//         <p>We have received too many request to verify your identity. Please register after sometime</p>
//         <p style="font-size: 24px; font-weight: bold; color: #0044cc; text-align: center; padding: 10px; border: 1px solid #0044cc; border-radius: 8px; display: inline-block;">
//           Too many attempts
//         </p>
//         <p>If you did not request this OTP, please contact our support team immediately at <a href="mailto:support@northstarmatrix.com" style="color: #0044cc; text-decoration: none;">support@northstarmatrix.com</a>.</p>
//         <p>Thank you,<br>North Star Matrix Team</p>
//         <hr style="border: none; border-top: 1px solid #ddd;" />
//         <p style="font-size: 12px; color: #888888; text-align: center;">
//           © 2024 North Star Matrix. All rights reserved.
//         </p>
//       </div>
//     `

export const otpSendText = (verificationCode) => `Hello, your OTP for Diskuss is ${verificationCode}. This code is valid for 5 minutes. If you did not request this OTP, please contact our support team immediately at @ntsmetrics.support.com. Thank you, North Star Matrix Team`