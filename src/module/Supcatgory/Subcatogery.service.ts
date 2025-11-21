import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { brandRepository, HUserDocument } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { Types } from 'mongoose';
import slugify from 'slugify';

import { randomUUID } from 'crypto';
import { SubcategoryRepository } from 'src/DB/repository/supcatogeryrepositry';
import { CreateSubcategoryDto, IDDto, QueryDto, UpdateSubcategory } from './DTO/SubCatogery.dto';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';


@Injectable()
export class SubcategoryService {
constructor(private readonly SubcategoryRepo:SubcategoryRepository,
private readonly categoryRepo:categoryRepository,
    private readonly s3Service:S3Service,
    private readonly brandRepo:brandRepository,
    private readonly brandvalid:BrandValidatorService,
) {
    
}
async createSubcategory(
   categoryId:Types.ObjectId,
  SubcategoryDto: CreateSubcategoryDto,
  user: HUserDocument,
  file: Express.Multer.File,
) {
  const { name, slogan, brands } = SubcategoryDto;
 
 const Category=await this.categoryRepo.findOne({filter:{_id:categoryId}})
 if(!Category){
  throw new NotFoundException("Category not found")
 }
const slug = slugify(name, { replacement: "_", lower: false, trim: true });

  const findSlug = await this.SubcategoryRepo.findOne({
    filter: { 
      slug,
      categoryId: new Types.ObjectId(categoryId)
    }
  });
  if (findSlug) throw new BadRequestException("Subcategory with this name already exists in this category");



  const {strictBrands} = await this.brandvalid.checkBrands(brands)


  if (!file) {
    throw new BadRequestException("Must send an image");
  }
    const assetFolderId = randomUUID();
  let imageDeleted = false;
  let url: string | undefined;

    try {
    url = await this.s3Service.uploadFile({
      path: `category/${Category.assetFoldeId}/${assetFolderId}/${file.originalname}`,
      file
    });
    const Subcategory = await this.SubcategoryRepo.create({
      name,
      slogan,
      createdBy: user._id as unknown as Types.ObjectId,
      image: url,
      slug,  
      assetFolderId,
      brands: strictBrands,
      categoryId: new Types.ObjectId(categoryId),
    });
    if (!Subcategory) {
      await this.s3Service.deleteFile({ Key: url });
      imageDeleted = true;
      throw new InternalServerErrorException("Failed to create Subcategory");
    }
    return Subcategory;
  } catch (err) {
   if (url && !imageDeleted) {  
      await this.s3Service.deleteFile({ Key: url });
    throw err;
  }
}
}

async updateSubcategory(id:Types.ObjectId,SubcategoryDto:UpdateSubcategory,user:HUserDocument,file:Express.Multer.File){
      const {name,slogan,brands}=SubcategoryDto
      const Subcategory=await this.SubcategoryRepo.findOne({filter:{_id:id,createdBy:user._id}})
      if(!Subcategory){
        throw new NotFoundException("Subcategory not found")
      }
      if(name){ 
        if(name && name.toLowerCase() === Subcategory.name.toLowerCase()){
     throw new ConflictException("same name is not allowed");
     }
       const slug = slugify(name, { replacement: "_", lower: false, trim: true });
        const exists = await this.SubcategoryRepo.findOne({
      filter: { slug, categoryId: Subcategory.categoryId }
    });

    if (exists) throw new ConflictException("Name already exists");
       

      }
      let strictBrands = {};
     if (brands) {
      if (brands.some(b => Subcategory.brands.includes(b))) {
          throw new ConflictException("brand already exists");
        }
    const res = await this.brandvalid.checkBrands(brands);
    strictBrands = res.strictBrands;
  }
      
      
      const updateSubcategory=await this.SubcategoryRepo.findByIdAndUpdate(id,{name,slogan,$addToSet: { brands: { $each: strictBrands } }},{new:true})
      return updateSubcategory
    }
async updateSubcategoryImage(id:Types.ObjectId,user:HUserDocument,file:Express.Multer.File){  
      const Subcategory=await this.SubcategoryRepo.findOne({filter:{_id:id,createdBy:user._id}})
      if(!Subcategory){
        throw new NotFoundException("Subcategory not found")
      }
        if(!file){
              throw new BadRequestException("must send new Image")
        }
        const Category=await this.categoryRepo.findOne({filter:{_id:Subcategory.categoryId}})
        const assetFolderId = Subcategory.assetFolderId;

  let url: string | undefined;

  try {
    url = await this.s3Service.uploadFile({
      path: `category/${Category?.assetFoldeId}/${assetFolderId}/${file.originalname}`,
      file
    });

    const updatedSubcategory = await this.SubcategoryRepo.findByIdAndUpdate(
      id,
      { image: url },
      { new: true }
    );

    if (!updatedSubcategory) {
      await this.s3Service.deleteFile({ Key: url });
      throw new BadRequestException("Failed to update subcategory image");
    }

    
    if (Subcategory.image) {
      await this.s3Service.deleteFile({ Key: Subcategory.image });
    }

    return updatedSubcategory;
  } catch (err) {
    if (url) await this.s3Service.deleteFile({ Key: url });
    throw err;
  }
}
async freezeSubcategory(id:Types.ObjectId,user:HUserDocument){
  
const Subcategory = await this.SubcategoryRepo.findOneAndUpdate(
  { _id: id, deletedAt: {$exsits:false} },  
  { deletedAt: new Date(), updatedBy: user._id }, 
  { new: true }                   
);

if(!Subcategory){
        throw new NotFoundException("Subcategory not found")
  }
      return Subcategory
}
async unfreezeSubcategory(id:Types.ObjectId,user:HUserDocument){
      const Subcategory=await this.SubcategoryRepo.findOneAndUpdate(
        {_id:id,deletedAt:{$exists:true},paranoid:false},
        {$unset:{deletedAt:""},restoreAt:new Date(),updatedBy:user._id},
        {new:true}
      )
      if(!Subcategory){
        throw new NotFoundException("Subcategory not found")
      }
      return Subcategory
}
async deleteSubcategory(  categoryId:Types.ObjectId,user:HUserDocument){
      const Subcategory=await this.SubcategoryRepo.findOneAndDelete(
        {_id:categoryId,},
      )
      if(!Subcategory){
        throw new NotFoundException("Subcategory not found")
      }
      await this.s3Service.deleteFile({
        Key:Subcategory.image
      })
      return Subcategory
}
async getSubcategorys(query:QueryDto){
  const {page=1,limit=2,search}=query
  const Subcategorys=await this.SubcategoryRepo.paginate({filter:{
    ...(search?{$or:[{
     name:{$regex:search,$options:"i"}},
     {slogan:{$regex:search,$options:"i"}}
    ]}:{})
  },query:{page,limit}})
      if(!Subcategorys){
        throw new NotFoundException("no Subcategory found")
      }
      return {...Subcategorys}

   
 }

}

 
  
