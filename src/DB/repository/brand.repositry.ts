import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
import { Brand } from "../models/brand.model";
@Injectable()
export class brandRepository extends dbRepository<Brand>{
constructor(@InjectModel(Brand.name) protected readonly model: Model<Brand>){
    super(model)
}
}