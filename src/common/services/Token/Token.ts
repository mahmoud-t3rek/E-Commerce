import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import { TokenType } from "../../enums/token.enum";
import { userRepository } from "src/DB";
import { NotFoundError } from "rxjs";

@Injectable()
export class TokenService{
  constructor(
    private readonly userRepo:userRepository,
    private readonly jwtService:JwtService
  ){}
  createToken = async({ payload, options }: {
  payload: Object,
  options?: JwtSignOptions
}): Promise<string> => {
  return this.jwtService.signAsync(payload,options)
}

verifyToken = async ({
  token,
  signature,
  options,
}: {
  token: string;
  signature: string;
  options?: JwtVerifyOptions;
}): Promise<JwtPayload> => {
  return this.jwtService.verifyAsync(token, {
    ...options,
    secret: signature, 
  });
};


GetSignutre=(prefix:string,tokenType:TokenType=TokenType.access)=>{


    if(tokenType==TokenType.access){
       if(prefix=="bearer"){
        return process.env.ACCSESS_TOKENUSER
       }else if(prefix == "Admin"){
          return process.env.ACCSESS_TOKENADMIN
       }else{
        return null
       }
    }
    
    
     if(tokenType==TokenType.refresh){
       if(prefix=="bearer"){
        return process.env.REFRESCH_TOKENUSER
       }else if(prefix == "Admin"){
          return process.env.REFRESCH_TOKENADMIN
       }else{
        return null
       }
    }
    return null
}

Decoded_Token=async(token:string,signature: string, options?: JwtVerifyOptions)=>{  
  const decoded=await this.verifyToken({token,signature,options})
if(!decoded || !decoded.email){
throw new BadRequestException("Invalid token payload")
}

const user=await this.userRepo.findOne({filter:{email:decoded?.email}})

if(!user){
    throw new NotFoundError("email not found");
}
if(!user?.confirmed){
    throw new BadRequestException("please confirm your email");
}


// if(await _RovekeToken.findOne({TokenId: decoded?.jti})){
//   throw new AppError("token has been revoked",401);
// }
// if(user?.changeCardnality?.getTime()! > decoded.iat! * 1000){
// throw new AppError("token has been revoked",401);
// }
 
return {decoded,user}

}
}






