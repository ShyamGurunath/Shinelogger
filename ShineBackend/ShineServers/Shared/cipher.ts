// write a ceaser cipher function to encrypt & decrypt the password
import {base64Decode,base64Encode} from "./deps.ts";


const encrypt = (password: string) => {
  const textEncoder = new TextEncoder();
  const encodedValue = base64Encode(textEncoder.encode(password));
  return encodedValue;
};

const decrypt = (encryptedPassword: string) => {
  const textDecoder = new TextDecoder('utf-8');
  const decodedValue = textDecoder.decode(base64Decode(encryptedPassword));
  return decodedValue
};

export {encrypt,decrypt};
