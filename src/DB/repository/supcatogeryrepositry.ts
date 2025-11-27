import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
import { Category } from "../models/category.model";
import { Subcategory } from "../models/subcategory.model";

@Injectable()
export class SubcategoryRepository extends dbRepository<Subcategory>{
constructor(@InjectModel(Subcategory.name) protected readonly model: Model<Subcategory>){
    super(model)
}
}