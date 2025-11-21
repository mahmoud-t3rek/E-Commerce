import { Body, Controller, Get, ParseFilePipe, Patch, Post, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { confirmEmailDto, loginWithgmail, resendOtpDto, resetPasswordDto, signInDto, SignUpDto } from './DTO/user.dto';
import { Request } from 'express';
import { Request as ExpressRequest } from 'express';
import { HUserDocument } from 'src/DB';
import{ AuthGuard, multerLocal, TokenType, type UserRequest } from 'src/common';
import { Token } from '../../common/decorators';
import { tokenType } from 'src/common/middlewares/authountcation';
import { FileInterceptor } from '@nestjs/platform-express';
export interface AuthRequest extends ExpressRequest {
  user?: HUserDocument;
}

@Controller('user')
export class UserController {
constructor(private readonly userService:UserService){}
@Post("/signup")
SignUp(@Body()body:SignUpDto){
return this.userService.signup(body)
}
@Post("/resendotp")
reSend(@Body() body:resendOtpDto){
return this.userService.reSendOtp(body)
}
@Patch("/confirmemail")
confirmEmail(@Body() body:confirmEmailDto){
return this.userService.confirmEmail(body)
}
@Post("/signin")
Login(@Body() body:signInDto){
return this.userService.Login(body)
}
@Post("/forgetPassword")
forgetPassword(@Body() body:resendOtpDto){
return this.userService.forgetPassword(body)
}
@Patch("/resetPassword")
resetPassword(@Body() body:resetPasswordDto){
return this.userService.resetPassword(body)
}
@Post("/loginwithGmail")
loginWithgmail(@Body() body:loginWithgmail){
return this.userService.loginWithgmail(body)
}

@Token()
@UseGuards(AuthGuard)
@Get("/getprofile")
getprofile(@Req()req:UserRequest){
return {user:req.user}
}
@Post('upload')
@UseInterceptors(FileInterceptor('attachments',multerLocal({filterEnum:['image/jpeg','image/png']})))
uploadFile(@UploadedFile(new ParseFilePipe({
  fileIsRequired:true
})) file: Express.Multer.File) {
  return {message:"done",file}
}

}
