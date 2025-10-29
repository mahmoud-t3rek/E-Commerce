import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OtpTypeEnum, userGender, userProvider, userRole } from 'src/common/enums';
import { dbRepository, HUserDocument, User, userRepository } from 'src/DB';
import { confirmEmailDto, loginWithgmail, resendOtpDto, resetPasswordDto, signInDto, SignUpDto } from './DTO'; 
import { CreateOTP, SendEmail, TempleteEmail } from 'src/common/services';
import { otpRepository } from 'src/DB/repository/otp.repository ';
import crypto from 'crypto-js';
import { compareHash, genreteHash } from 'src/common/services/Hash';
import { JwtService } from '@nestjs/jwt';
  import {OAuth2Client, TokenPayload} from 'google-auth-library';
import { GenerateToken } from 'src/common/services/Token/genreteToken';

@Injectable()
export class UserService {
  constructor(
  private readonly userRepo:userRepository,
  private readonly otpRepo:otpRepository,
  private jwtService:JwtService

  ) {}
  private async sendOtp(userId:Types.ObjectId,otpType?:OtpTypeEnum){
 const otp=await CreateOTP()
 await this.otpRepo.create({
  code:otp.toString(),
  createdBy:userId,
  otpEnum:otpType ,
  expireAt:new Date(Date.now()+60*1000),

 })
  }
  async signup(body:SignUpDto){
    const {fName,lName,gender,role,phone,provider,email,password,age}=body

    const checkUser=await this.userRepo.findOne({filter:{email}})
    if(checkUser){
      throw new ConflictException("email is already Exist");
    }
    const hashPhone=await crypto.AES.encrypt(phone,process.env.PHONE_SECRETKEY as unknown as string).toString();
    const hashPassword=await genreteHash(password)
    const user=await this.userRepo.create({fName,lName,gender,role,
      phone:hashPhone
      ,provider
      ,email
      ,password:hashPassword
      ,age
    })
    if(!user){
      throw new ConflictException("faild add user")
    }
   await this.sendOtp(user._id as unknown as Types.ObjectId,OtpTypeEnum.confirm_Email)
    return user
} 
async reSendOtp(body:resendOtpDto){
  const {email}=body
  const user=await this.userRepo.findOne({filter:{
    email,confirmed:{$exists:false} },
    options:{
      populate:{
        path:"otp"
      }
    }
, })
if(!user){
  throw new BadRequestException("user not exist")
}
if((user?.otp as any).length>0){
  throw new BadRequestException("otp is already sent")
}
await this.sendOtp(user._id as unknown as Types.ObjectId)
  return {massege:"otp send successfuilly"}
}
async confirmEmail(body:confirmEmailDto){
  const {email,otp}=body
  const user=await this.userRepo.findOne({filter:{
    email,confirmed:{$exists:false} },
    options:{
      populate:{
        path:"otp"
      }
    }
, })
if(!user){
  throw new BadRequestException("user not exist or confirmed")
}

if( !await compareHash(otp,(user.otp as any)[0].code)){
  throw new BadRequestException("otp is already sent")
}
 
user.confirmed=true
await user.save()
await this.otpRepo.DeleteOne({createdBy:user._id});
return {message:"email confirmed"}

}   
async Login(body:signInDto){
  const {email,password}=body
  const user=await this.userRepo.findOne({
    filter:{
    email,confirmed:{$exists:true} ,
    provider:userProvider.system
  }
})
if(!user){
  throw new BadRequestException("user not exist or confirmed")
}

if( !await compareHash(password,user.password)){
  throw new BadRequestException("password or email in incorrect")
}
 
const{access_Token,Refresh_Token}= await GenerateToken(user)
return {massege:"done",access_Token , Refresh_Token}

}    
async forgetPassword(body:resendOtpDto){
 const {email}=body
 const user=await this.userRepo.findOne({filter:{email,confirmed: true}})
 if(!user){
  throw new NotFoundException("email not exist or not confirmed");
 }
await this.sendOtp(user._id as unknown as Types.ObjectId,OtpTypeEnum.forget_Password)
return { message: "please check your email"}
}     
async resetPassword(body:resetPasswordDto){
 const {otp,password,Cpassword,email}=body
   const user=await this.userRepo.findOne({filter:{
    email,confirmed:true },
    options:{
      populate:{
        path:"otp"
      }
    }
, })
if(!user){
  throw new BadRequestException("user not exist or confirmed")
}

if( !await compareHash(otp,(user.otp as any)[0].code)){
    throw new BadRequestException("OTP is incorrect");
}
const hashPassword=await genreteHash(password)
user.password=hashPassword as unknown as string
await user.save()
await this.otpRepo.DeleteOne({createdBy:user._id});
return { message: "password reset sucess"}
}    
async loginWithgmail(body:loginWithgmail){
 const {idToken}=body
const client = new OAuth2Client();
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID!, 
      
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
      throw new BadRequestException('Invalid Google token');
    }
  
  return payload
  
}


const {email,name,email_verified,picture}=await verify() as TokenPayload
let user = await this.userRepo.findOne({filter:{ email:email} });

  const [fName, lName] = name?.split(' ') ?? ['User', ''];

if (!user) {
  user = await this.userRepo.create({
    email:email!,
    fName,
    lName,
    confirmed: email_verified!,
    provider: userProvider.google,
  });
}
if (user.provider === userProvider.system) {
  throw new BadRequestException("you must login on system");
}

const tokens= await GenerateToken(user)
return { message: "success LogIn", ...tokens }
}
}
