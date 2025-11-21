import {
  IsBoolean,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { userGender, userProvider, userRole } from 'src/common/enums';
import { IsMatchFeilds } from 'src/common/decorators/user.decrator';

export class SignUpDto {
  @IsString()
  @Length(3, 8)
  @IsNotEmpty()
  fName: string;

  @IsString()
  @Length(3, 8)
  @IsNotEmpty()
  lName: string;

  @IsNumber()
  @Min(18)
  @Max(60)
  @IsNotEmpty()
  age: number;

  @IsString()
  @Length(11, 11)
  @IsNotEmpty()
  phone: string;

  @IsEnum(userProvider)
  provider: userProvider;

  @IsEnum(userGender)
  gender: userGender;

  @IsEnum(userRole)
  role: userRole;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ValidateIf((data: SignUpDto) => Boolean(data.password))
  @IsMatchFeilds(['password'])
  @IsNotEmpty()
  Cpassword: string;

}
export class resendOtpDto {
  @IsEmail()
   @IsNotEmpty()
   email: string;
}
export class confirmEmailDto extends resendOtpDto {
  @IsString()
  @IsNotEmpty()
 
   otp:string
}
export class signInDto extends resendOtpDto{
  @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password:string
}
export class loginWithgmail{
  @IsString()
  @IsNotEmpty()
  idToken:string
}
export class resetPasswordDto extends confirmEmailDto{
   @IsStrongPassword()
  @IsString()
  @IsNotEmpty()
  password:string
  @ValidateIf((data: SignUpDto) => Boolean(data.password))
  @IsMatchFeilds(['password'])
  @IsNotEmpty()
  Cpassword: string;
}