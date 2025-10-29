import {hash} from 'bcrypt';
export const  genreteHash=async(plainText:string,saltRounds:number=Number(process.env.SALT_ROUNDS))=>{
    return hash(plainText,saltRounds)
}
