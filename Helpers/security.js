 let jwt = require("jsonwebtoken");
 let bcrypt = require("bcrypt");
// const { valid } = require("joi");

//encrypt
function encrypt(text, key) {
  return new Promise((res, rej) => {
    jwt.sign(text, key, (error, token) => {
      if (error) {
        return rej(error);
      }
      return res(token);
    });
  });
}

//decrypt
function decrypt(text, key) {
  return new Promise((res, rej) => {
    jwt.verify(text, key, (error, token) => {
      if (error) {
        return rej(error);
      }
      return res(token);
    });
  });
}

//hash password
async function hash(pt, salt = 10) {
  let encrypt = await bcrypt.hash(pt, salt).catch((err) => {
    return {error:err};
  });
  if (!encrypt || (encrypt && encrypt.error)) {
    return { error: encrypt.error };
  }
  return { data: encrypt };
}

//compare passowrd
async function compare (PT,ET){
  let check = await bcrypt.compare(PT,ET).catch((err1)=>{
    return {error:err1};
  });
  if(!check || (check && check.error)) {
    return { error : check && check.error ? check.error : true };
  }
  return {data : true}
}

module.exports = {
  encrypt,decrypt,hash,compare
};
