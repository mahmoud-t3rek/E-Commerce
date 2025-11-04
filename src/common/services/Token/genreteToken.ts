import { HUserDocument } from "src/DB";
import { v4 as uuidv4 } from "uuid";
import { userRole } from "../../enums/user.enum";
import { TokenService } from "./Token";
import { Injectable } from "@nestjs/common";
@Injectable()
export class GenerateTokens{
  constructor(
    private readonly tokenService:TokenService
  ){}
  Generate_access = async (user: HUserDocument) => {
    const jwtid = uuidv4();
  
    const access_Token=await this.tokenService.createToken({
      payload:
       {userId:user._id,email:user.email},
  options:{
     secret: user.role===userRole.admin?process.env.ACCSESS_TOKENADMIN:process.env.ACCSESS_TOKENUSER,
       expiresIn:"1d",jwtid
    }}
   
    
     
  )
  const Refresh_Token=await this.tokenService.createToken({
      payload:
       {userId:user._id,email:user.email},
    options:
    {
      secret:user.role===userRole.admin?process.env.REFRESCH_TOKENADMIN!:process.env.REFRESCH_TOKENUSER!,
      expiresIn:"1d",jwtid
    }
  }
  )
    return { access_Token, Refresh_Token };
  };
};