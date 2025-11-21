import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";

@Schema({ timestamps: true })
export class Subcategory {
    @Prop({ type: String, required: true, minLength: 5, maxLength: 30, trim: true })
    name: string;

    @Prop({ type: String })
    slug: string; 

    @Prop({ type: String, required: true, minLength: 5, maxLength: 30, trim: true })
    slogan: string;

    @Prop({ type: String }) 
    assetFolderId: string;

    @Prop({ type: Types.ObjectId, ref: "Category", required: true })
    categoryId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: "User" })
    createdBy: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: "Brand" })  
    brands: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: Types.ObjectId;

    @Prop({ type: String, required: true })
    image: string;

    @Prop({ type: Date })
    deletedAt: Date;

    @Prop({ type: Date })
    restoreAt: Date;
}

export type HSubcategory = HydratedDocument<Subcategory>;

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

SubcategorySchema.index({ slug: 1 });
SubcategorySchema.index({ categoryId: 1 });
SubcategorySchema.index({ brands: 1 }); 

SubcategorySchema.index(
  { name: 1, categoryId: 1 },
  { unique: true, partialFilterExpression: { deletedAt: { $exists: false } } }
);


SubcategorySchema.pre('save', function (next) {
    if (this.isNew || this.isModified('name')) {
        this.slug = slugify(this.name, { replacement: "_", lower: false, trim: true });
    }
    next();
});

SubcategorySchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
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

 SubcategorySchema.pre(["findOne", "find", "findOneAndUpdate", "updateOne", "deleteOne"], function (next) {
    const query = this.getQuery();
    const { paranoid, ...rest } = query;
    if (paranoid === false) {
        this.setQuery({ ...rest });
    } else {
        this.setQuery({ ...rest, deletedAt: { $exists: false } });
    }
    next();
});

export const SubcategoryModel = MongooseModule.forFeature([{
    name: Subcategory.name,
    schema: SubcategorySchema
}]);
