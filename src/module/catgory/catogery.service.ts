import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { brandRepository, HUserDocument } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { Types } from 'mongoose';
import slugify from 'slugify';

import { randomUUID } from 'crypto';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { CreateCategoryDto, QueryDto, Updatecategory } from './DTO/Catogery.dto';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';

@Injectable()
export class categoryService {
constructor(private readonly categoryRepo:categoryRepository,
    private readonly s3Service:S3Service,
    private readonly brandRepo:brandRepository,
    private readonly brandvalid:BrandValidatorService,
) {
    
}
async createCategory(
  categoryDto: CreateCategoryDto,
  user: HUserDocument,
  file: Express.Multer.File
) {
  const { name, slogan, brands } = categoryDto;


  const findName = await this.categoryRepo.findOne({
    filter: { name: { $regex: `^${name}$`, $options: 'i' } }
  });
  if (findName) {
    throw new BadRequestException("Category name already exists");
  }

  

  const {strictBrands} = await this.brandvalid.checkBrands(brands)



  if (!file) {
    throw new BadRequestException("Must send an image");
  }

  const assetFolderId = randomUUID();

 
  const url = await this.s3Service.uploadFile({
    path: `category/${assetFolderId}`,
    file
  });


  let category;
  try {
    category = await this.categoryRepo.create({
      name,
      slogan,
      createdBy: user._id as unknown as Types.ObjectId,
      image: url,
      slug: slugify(name, { replacement: "_", lower: false, trim: true }),
      assetFoldeId:assetFolderId,
      brands: strictBrands
    });

    if (!category) {
     
      await this.s3Service.deleteFile({ Key: url });
      throw new InternalServerErrorException("Failed to create category");
    }
  } catch (err) {
   
    await this.s3Service.deleteFile({ Key: url });
    throw err;
  }

  return category;
}


async updatecategory(id:Types.ObjectId,categoryDto:Updatecategory,user:HUserDocument,file:Express.Multer.File){
      const {name,slogan,brands}=categoryDto
      const category=await this.categoryRepo.findOne({filter:{_id:id,createdBy:user._id}})
      if(!category){
        throw new NotFoundException("category not found")
      }
      if(name){ 
        if (name === category.name) {
         throw new ConflictException("same name is not allowed");
       }
        const findname=await this.categoryRepo.findOne({filter:{name}})
        
        if(findname){
          throw new ConflictException("name is already exist")
        }
       

      }
      const strictIds=[...new Set(brands)]
      if (brands && brands.length > 0) {
 
    const existingBrands = category.brands.filter(b => strictIds.includes(b));
    if (existingBrands.length > 0) {
        throw new ConflictException(`Brands already exist: ${existingBrands.join(", ")}`);
    }
  }
      
      
      const updatecategory=await this.categoryRepo.findByIdAndUpdate(id,{name,slogan,$addToSet: { brands: { $each: strictIds } }},{new:true})
      return updatecategory
    }
async updatecategoryImage(id:Types.ObjectId,user:HUserDocument,file:Express.Multer.File){  
      const category=await this.categoryRepo.findOne({filter:{_id:id,createdBy:user._id}})
      if(!category){
        throw new NotFoundException("category not found")
      }
        if(!file){
              throw new BadRequestException("must send new Image")
        }
      const assetFoldeId=randomUUID()
         const url = await this.s3Service.uploadFile({ path: `category/${assetFoldeId}`, file });

      const updatecategory=await this.categoryRepo.findByIdAndUpdate(id,{image:url,assetFoldeId:assetFoldeId},{new:true})
      if(!updatecategory){
        await this.s3Service.deleteFile({
          Key:url
        })
        throw new BadRequestException("faild update")
      }
      await this.s3Service.deleteFile({
        Key:category.image
      })

      return updatecategory

}
async freezecategory(id:Types.ObjectId,user:HUserDocument){
  
const category = await this.categoryRepo.findOneAndUpdate(
  { _id: id, deletedAt: {$exsits:false} },  
  { deletedAt: new Date(), updatedBy: user._id }, 
  { new: true }                   
);

if(!category){
        throw new NotFoundException("category not found")
  }
      return category
}
async unfreezecategory(id:Types.ObjectId,user:HUserDocument){
      const category=await this.categoryRepo.findOneAndUpdate(
        {_id:id,deletedAt:{$exists:true},paranoid:false},
        {$unset:{deletedAt:""},restoreAt:new Date(),updatedBy:user._id},
        {new:true}
      )
      if(!category){
        throw new NotFoundException("category not found")
      }
      return category
}
async deletecategory(id:Types.ObjectId,user:HUserDocument){
      const category=await this.categoryRepo.findOneAndDelete(
        {_id:id,},
      )
      if(!category){
        throw new NotFoundException("category not found")
      }
      await this.s3Service.deleteFile({
        Key:category.image
      })
      return category
}
async getcategorys(query:QueryDto){
  const {page=1,limit=2,search}=query
  const categorys=await this.categoryRepo.paginate({filter:{
    ...(search?{$or:[{
     name:{$regex:search,$options:"i"}},
     {slogan:{$regex:search,$options:"i"}}
    ]}:{})
  },query:{page,limit}})
      if(!categorys){
        throw new NotFoundException("no category found")
      }
      return {...categorys}

   
 }

}

 
  
