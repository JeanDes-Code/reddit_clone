export const FIREBASE_ERRORS = {
  'Firebase: Error (auth/email-already-in-use).':
    'A user with that email already exists.',
  'Firebase: Error (auth/invalid-email).': 'The email address is not valid.',
  'Firebase: Error (auth/operation-not-allowed).':
    'Password sign-in is disabled for this project.',
  'Firebase: Error (auth/weak-password).': 'The password is not strong enough.',
  'Firebase: Error (auth/user-disabled).':
    'The user account has been disabled by an administrator.',
  'Firebase: Error (auth/user-not-found).': 'Invalid email or password.',
  'Firebase: Error (auth/wrong-password).': 'Invalid email or password.',
  'Firebase: Error (auth/invalid-verification-code).':
    'The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.',
  'Firebase: Error (auth/invalid-verification-id).':
    'The verification ID used to create the phone auth credential is invalid.',
  'Firebase: Error (auth/missing-verification-code).':
    'The phone auth credential was created with an empty SMS verification code.',
  'Firebase: Error (auth/missing-verification-id).':
    'The phone auth credential was created with an empty verification ID.',
  'Firebase: Error (auth/quota-exceeded).':
    'The SMS quota for the project has been exceeded.',
  'Firebase: Error (auth/captcha-check-failed).':
    'The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.',
  'Firebase: Error (auth/credential-already-in-use).':
    'This credential is already associated with a different user account.',
  'Firebase: Error (auth/invalid-credential).':
    'The supplied auth credential is malformed or has expired.',
  'Firebase: Error (auth/popup-closed-by-user).':
    'You closed the popup before completing the sign-in process.',
};
