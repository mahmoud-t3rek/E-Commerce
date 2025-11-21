
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { TokenService } from '../services';
import { Reflector } from '@nestjs/core';
import { Token_Type } from 'src/common/decorators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly tokenService:TokenService,
      private reflector:Reflector
    ){}
 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
     try {
    let req :any 
    let authorization:string=""
    const tokentype=this.reflector.get(Token_Type,context.getHandler())

        if(context.getType()=="http"){
       req= context.switchToHttp().getRequest(); 
       authorization=req.headers.authorization

    }
     const [prefix,token]=authorization?.split(" ") || []

     if(!prefix || !token){
        throw new BadRequestException("Invalid Token")
     }

     const signature=await this.tokenService.GetSignutre(prefix,tokentype)
     if(!signature){
        throw new BadRequestException("Invalid signature")
     }
     const {user,decoded}=await this.tokenService.Decoded_Token(token,signature)
     
     req.user=user
     req.decoded=decoded
     
    return true

     } catch (error) {
        throw new BadRequestException(error.message)
     } 
    
    }
}

  
