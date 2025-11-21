import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
@Schema({ timestamps: true })
export class Category{
    @Prop({type:String,required:true,minLength:5,maxLength:30,trim:true,unique:true})
    name:string

    @Prop({type:String,function () {
    return slugify(this.name,{replacement:"_",lower:false,trim:true})
    }})
    slug:string

    @Prop({type:String,required:true,minLength:5,maxLength:30,trim:true})
   slogan:string
    @Prop({type:String})
   assetFoldeId:string

    @Prop({type:Types.ObjectId,required:true,ref:"User"})
    createdBy:Types.ObjectId
    @Prop({ type: [Types.ObjectId], ref: "Brand" })
       brands: Types.ObjectId[];

    @Prop({type:Types.ObjectId,ref:"User"})
    updatedBy:Types.ObjectId
    @Prop({type:String,required:true})
    image:string
      
    @Prop({type:Date})
    deletedAt:Date


    @Prop({type:Date})
    restoreAt:Date
}

export type HCategory=HydratedDocument<Category>

export const categorySchema=SchemaFactory.createForClass(Category)


export const categoryModel=MongooseModule.forFeature([{
    name:Category.name,
    schema:categorySchema
}])
categorySchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
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

categorySchema.pre(["findOne","find","findOneAndUpdate"],function(next){
  const query=this.getQuery()
  const{paranoid,...rest}=query
  if(paranoid===false){
    this.setQuery({...rest})
  }else{
    this.setQuery({...rest,deletedAt:{$exists:false}})
  }
  next()
})
