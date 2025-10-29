import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { userGender, userProvider, userRole } from "src/common/enums";
import { Document, HydratedDocument } from "mongoose";
import { HOtpDocument } from "./otp.model";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, minLength: 3, maxLength: 10, required: true, trim: true })
  fName: string;

  @Prop({ type: String, minLength: 3, maxLength: 10, required: true, trim: true })
  lName: string;

  @Prop({ type: String, required: function(){
    return this.provider===userProvider.google ? false : true 
  }, trim: true })
  password: string;

  @Prop({ type: String, unique: true, required: true, trim: true })
  email: string;

  @Prop({ type: Number, min: 18, max: 60, required: function(){
    return this.provider===userProvider.google ? false : true 
  } })
  age: number;

  @Prop({ type: String, required: function(){
    return this.provider===userProvider.google ? false : true 
  }})
  phone: string;

  @Prop({ type: String, enum: userRole, required: function(){
    return this.provider===userProvider.google ? false : true 
  }, default: userRole.user })
  role: userRole;

  @Prop({ type: String, enum: userProvider, required: true, default: userProvider.system })
  provider: userProvider;

  @Prop({ type: String, enum: userGender, required: function(){
    return this.provider===userProvider.google ? false : true 
  }, default: userGender.male })
  gender: userGender;

  @Prop({ type: Boolean }) 
  confirmed: boolean;
  otp?:HOtpDocument[]
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('otp',{
  localField:"_id",
  foreignField:"createdBy",
  ref:"Otp",
   justOne: false

})
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.virtual('userName')
  .get(function () {
    return `${this.fName} ${this.lName}`;
  })
  .set(function (v: string) {
    const parts = v.split(' ');
    this.fName = parts[0];
    this.lName = parts[1];
  });

export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);

export type HUserDocument=HydratedDocument<User>
