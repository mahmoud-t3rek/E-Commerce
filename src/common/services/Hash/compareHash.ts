import {compare} from 'bcrypt';
export const  compareHash=async(plainText:string,cipherText:string)=>{
    return compare(plainText,cipherText)
}