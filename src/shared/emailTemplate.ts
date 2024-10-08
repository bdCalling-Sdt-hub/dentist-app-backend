import {
  ICreatePatientTemplate,
  IForgetPasswordTemplate,
} from '../types/emailTypes';

const forgetPassword = (values: IForgetPasswordTemplate) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/CxR60Th4/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px;" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #12354E; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
        <div style="font-size: 14px; color: #999; text-align: center; ">
            <p>&copy; 2024 Dental Clinic. All rights reserved.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const createPatient = (values: ICreatePatientTemplate) => {
  const data = {
    to: values.email,
    subject: 'Your account credential for login',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/CxR60Th4/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px;" />
        <div style="text-align: center;">
            <h2 style="color: #12354E; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Smile Club Account Credentials</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Please find below the login credentials for the account:</p>
            <div style="background-color: #12354E; width: 80%; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 18px; margin: 20px auto;">
                <p style="color: #fff;">Email: ${values.email}</p>
                <p style="color: #fff;">Pin: ${values.pin}</p>
                <p style="color: #fff;">Password: ${values.password}</p>
            </div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Please ensure that these credentials are kept confidential and secure. Should you encounter any issues or require further assistance, do not hesitate to reach out.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

export const emailTemplate = {
  forgetPassword,
  createPatient,
};
