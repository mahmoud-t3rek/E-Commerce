import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { dbRepository } from "./DB.repository ";
import { Cart } from "../models/cart.model";

@Injectable()
export class CartRepository extends dbRepository<Cart>{
constructor(@InjectModel(Cart.name) protected readonly model: Model<Cart>){
    super(model)
}
}