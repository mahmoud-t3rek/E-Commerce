import { BadGatewayException, BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request,Response,NextFunction } from "express";
import { TokenService } from "../services/Token";
import { UserRequest } from "../interfaces";
import { TokenType } from "../enums";

export const tokenType=(tokenType:TokenType=TokenType.access)=>{
    return (req:UserRequest,res:Response,next:NextFunction)=>{
        req.tokenTypes=tokenType
        next()
    }
}

@Injectable()
export class AuthountcationMiddleWare implements NestMiddleware{
    constructor(
        private readonly tokenService:TokenService
    ){}
   async use(req:UserRequest,res:Response,next:NextFunction){
      
     try {
         const {authorization}=req.headers
     const [prefix,token]=authorization?.split(" ") || []

     if(!prefix || !token){
        throw new BadRequestException("Invalid Token")
     }

     const signature=await this.tokenService.GetSignutre(prefix,req.tokenTypes)
     if(!signature){
        throw new BadRequestException("Invalid signature")
     }
     const {user,decoded}=await this.tokenService.Decoded_Token(token,signature)
     
     req.user=user
     req.decoded=decoded

        next()
     } catch (error) {
        throw new BadRequestException(error.message)
     } 
    
    }
}