import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { Product } from "./product.model";
@Schema({ timestamps: true })
export class CartProduct{
  
      
    @Prop({type:Types.ObjectId,required:true,ref:"Product"})
    productId:Types.ObjectId


    @Prop({type:Number,required:true})
    quentity:number
     @Prop({type:Number})
    price:number
}
@Schema({ timestamps: true })
export class Cart{
  
      
    @Prop({type:[CartProduct]})
    products:CartProduct[]

    @Prop({type:Types.ObjectId,required:true,ref:"User"})
    createdBy:Types.ObjectId

     @Prop({type:Number})
    subTotal:number
    

    @Prop({type:Date})
    restoreAt:Date
    @Prop({type:Date})
    deletedAt:Date
}

export type HCartModel=HydratedDocument<Cart>

export const CartSchema=SchemaFactory.createForClass(Cart)


export const CartModel=MongooseModule.forFeature([{
    name:Cart.name,
    schema:CartSchema
}])

CartSchema.pre("save",function(next){
  this.subTotal=this.products.reduce((total,Product)=>total+(Product.quentity * Product.price),0)
  next()
})
CartSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update: any = this.getUpdate();


  const name = update?.name || update?.$set?.name;

  if (name) {
    const newSlug = slugify(name, { replacement: "_", lower: false, trim: true });

    if (update.name) {
      update.slug = newSlug;
    } else if (update.$set) {
      update.$set.slug = newSlug;
    }
  }

  next();
});

CartSchema.pre(["findOne","find","findOneAndUpdate"],function(next){
  const query=this.getQuery()
  const{paranoid,...rest}=query
  if(paranoid===false){
    this.setQuery({...rest})
  }else{
    this.setQuery({...rest,deletedAt:{$exists:false}})
  }
  next()
})
