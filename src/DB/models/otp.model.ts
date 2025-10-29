import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument, Types } from "mongoose";
import { OtpTypeEnum } from "src/common/enums";
import { eventEmitter } from "src/common/services/Events/sendEmail.events";
import { genreteHash } from "src/common/services/Hash";



@Schema({timestamps:true})
export class Otp  extends Document{
@Prop({required:true,type:String,trim:true})
code:string

@Prop({type:Types.ObjectId,required:true,ref:"User"})
createdBy:Types.ObjectId
@Prop({required:true,enum:OtpTypeEnum,type:String})
otpEnum:OtpTypeEnum
@Prop({type:Date,required:true})
expireAt:Date
}
export const otpSchema=SchemaFactory.createForClass(Otp)
export const OtpModel = MongooseModule.forFeature([{ name: Otp.name, schema: otpSchema }]);
export type HOtpDocument=HydratedDocument<Otp>

otpSchema.pre("save",async function(this:HOtpDocument&{is_new:boolean,plaintext:string},next){
if(this.isModified("code")){
    this.plaintext=this.code
    this.is_new=this.isNew
    this.code=await genreteHash(this.code)
    await this.populate([
        {
            path:"createdBy",
            select:"email"
        }
    ])
   
}
next()
})
otpSchema.post("save",async function name(doc,next) {
    const that=this as HOtpDocument &{is_new:boolean,plaintext:string}
if(that.is_new){    
    
 eventEmitter.emit(doc.otpEnum,{otp:that.plaintext,email:(doc.createdBy as unknown as any ).email})

}
    next()
   
})
otpSchema.index({expireAt:1},{expireAfterSeconds:60*60})
