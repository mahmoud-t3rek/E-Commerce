
import { userRole } from "src/common/enums";
import { HUserDocument } from "src/DB";
import { v4 as uuidv4 } from "uuid";
import { JwtService } from '@nestjs/jwt';
const jwtService=new JwtService()


export const GenerateToken = async (user: HUserDocument) => {
  const jwtid = uuidv4();

  const access_Token=await jwtService.signAsync(
  {userId:user._id,email:user.email},
  {
    secret:user.role===userRole.admin?process.env.ACCSESS_TOKENADMIN:process.env.ACCSESS_TOKENUSER,
     expiresIn:"1d",jwtid
  }
   
)
const Refresh_Token=await jwtService.signAsync(
  {
    userId:user._id,email:user.email
  },
  {
    secret:user.role===userRole.admin?process.env.REFRESCH_TOKENADMIN!:process.env.REFRESCH_TOKENUSER!,
    expiresIn:"1d",jwtid
  }
)
  return { access_Token, Refresh_Token };
};