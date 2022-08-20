// write a ceaser cipher function to encrypt & decrypt the password

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const encrypt = (password: string) => {
  console.log(password);
  password = password.toLowerCase();
  let encryptedPassword = "";
  for (let i = 0; i < password.length; i++) {
    if (alphabet.indexOf(password[i]) !== -1) {
      const index = alphabet.indexOf(password[i]);
      encryptedPassword = encryptedPassword + alphabet[index + 3];
    } else {
      encryptedPassword = encryptedPassword + password[i];
    }
  }
  // remove "undefined" from the encrypted password
  encryptedPassword = encryptedPassword.replace(/undefined/g, "");
  return encryptedPassword;
};

const decrypt = (encryptedPassword: string) => {
  encryptedPassword = encryptedPassword.toLowerCase();
  let password = "";
  for (let i = 0; i < encryptedPassword.length; i++) {
    if (alphabet.indexOf(encryptedPassword[i]) !== -1) {
      const index = alphabet.indexOf(encryptedPassword[i]);
      password = password + alphabet[index - 3];
    } else {
      password = password + encryptedPassword[i];
    }
  }

  return password;
};
