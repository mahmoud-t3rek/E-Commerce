import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
import { Product } from "../models/product.model";
@Injectable()
export class ProductRepository extends dbRepository<Product>{
constructor(@InjectModel(Product.name) protected readonly model: Model<Product>){
    super(model)
}
}