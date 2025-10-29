import { InjectModel } from "@nestjs/mongoose";
import { HUserDocument, User } from "../models";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
@Injectable()
export class userRepository extends dbRepository<User>{
constructor(@InjectModel(User.name) protected readonly model: Model<User>){
    super(model)
}
}