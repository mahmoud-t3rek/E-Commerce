import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
import { Category } from "../models/catogery.model";

@Injectable()
export class categoryRepository extends dbRepository<Category>{
constructor(@InjectModel(Category.name) protected readonly model: Model<Category>){
    super(model)
}
}