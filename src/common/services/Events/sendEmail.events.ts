import { OtpTypeEnum } from 'src/common/enums';
import { SendEmail, TempleteEmail } from '../email';
import { EventEmitter } from "events";
export const eventEmitter=new EventEmitter()



eventEmitter.on(OtpTypeEnum.confirm_Email,async(data)=>{
    const {email,otp}=data
    await SendEmail({to:email,subject:OtpTypeEnum.confirm_Email,html:TempleteEmail(otp,OtpTypeEnum.confirm_Email)})
})
eventEmitter.on(OtpTypeEnum.forget_Password,async(data)=>{
    const {email,otp}=data
    await SendEmail({to:email,subject:OtpTypeEnum.forget_Password,html:TempleteEmail(otp,OtpTypeEnum.forget_Password)})
})