import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
    trim: true
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    index: true
  })
  slug: string;

  @Prop({
    type: String,
    required: true,
    minLength: 5,
    maxLength: 10000,
    trim: true
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: "User"
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User"
  })
  updatedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "Category",
    index: true
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "Brand",
    index: true
  })
  brand: Types.ObjectId;
  @Prop({
    type: Number,
   min:1
  })
  quentity:number
 @Prop({
    type: Number,
   min:1
  })
  stock:number
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: "Subcategory",
    index: true
  })
  subCategory: Types.ObjectId;

  @Prop({
    type: String,
    required: true
  })
  mainImage: string;

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length <= 10,
      message: "Maximum 10 sub-images allowed"
    }
  })
  subImage: string[];

  @Prop({
    type: Number,
    required: true,
    min: 0
  })
  price: number;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: 0
  })
  discount: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0
  })
  rateNum: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 5
  })
  rateAvg: number;

  @Prop({
    type: Date,
  })
  deletedAt: Date;

  @Prop({
    type: Date,
  })
  restoreAt: Date;

}

export type HProduct = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });


ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      replacement: "_",
      lower: false,
      trim: true
    });
  }
  next();
});


ProductSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update: any = this.getUpdate();
  const name = update?.name || update?.$set?.name;
  
  if (name) {
    const newSlug = slugify(name, {
      replacement: "_",
      lower: false,
      trim: true
    });
    
    if (update.name) {
      update.slug = newSlug;
    } else if (update.$set) {
      update.$set.slug = newSlug;
    }
  }
  next();
});


ProductSchema.pre(["findOne", "find", "findOneAndUpdate"], function(next) {
  const query = this.getQuery();
  const { paranoid, ...rest } = query;
  
  if (paranoid === false) {
    this.setQuery({ ...rest });
  } else {
    this.setQuery({ ...rest, deletedAt: { $exists: false } });
  }
  next();
});

export const ProductModel = MongooseModule.forFeature([{
    name: Product.name,
    schema: ProductSchema
}]);