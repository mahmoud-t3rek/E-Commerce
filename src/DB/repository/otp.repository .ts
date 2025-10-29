import { InjectModel } from "@nestjs/mongoose";
import { HOtpDocument, HUserDocument, Otp, User } from "../models";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
@Injectable()
export class otpRepository extends dbRepository<Otp>{
constructor(@InjectModel(Otp.name) protected readonly model: Model<Otp>){
    super(model)
}
}