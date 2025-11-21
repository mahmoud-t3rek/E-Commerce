import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { CreateBrandDto, IDDto, QueryDto, UpdateBrand } from './DTO/Brand.dto';
import { brandRepository, HUserDocument } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { Types } from 'mongoose';
import slugify from 'slugify';

@Injectable()
export class BrandService {
constructor(private readonly brandRepo:brandRepository,
    private readonly s3Service:S3Service
) {
    
}
  async createBrand(brandDto:CreateBrandDto,user:HUserDocument,file:Express.Multer.File){

        const {name,slogan}=brandDto
    
        
        const findName=await this.brandRepo.findOne({filter:{name}})
        if(findName){
            throw new BadRequestException("name is already exist")
        }
      const url=await this.s3Service.uploadFile({
        path:"brand",
        file
      })
      const brand=await this.brandRepo.create({
        name:name,
        slogan:slogan,
        createdBy:user._id as unknown as Types.ObjectId,
        image:url,
        slug:slugify(name, { replacement: "_", lower: false, trim: true })
      })
      
    
      
      if(!brand){
        await this.s3Service.deleteFile({
            Key:url
        })
        throw new InternalServerErrorException("faild create brand")
      }
      return brand
    }

async updateBrand(id:Types.ObjectId,brandDto:UpdateBrand,user:HUserDocument,file:Express.Multer.File){
      const {name,slogan}=brandDto
      const brand=await this.brandRepo.findOne({filter:{_id:id,createdBy:user._id}})
      if(!brand){
        throw new NotFoundException("brand not found")
      }
      if(name){ 
        if (name === brand.name) {
         throw new ConflictException("same name is not allowed");
       }
        const findname=await this.brandRepo.findOne({filter:{name}})
        
        if(findname){
          throw new ConflictException("name is already exist")
        }
       

      }
      
      const updateBrand=await this.brandRepo.findByIdAndUpdate(id,{name,slogan},{new:true})
      return updateBrand
    }
async updateBrandImage(id:Types.ObjectId,user:HUserDocument,file:Express.Multer.File){
      const brand=await this.brandRepo.findOne({filter:{_id:id,createdBy:user._id}})
      if(!brand){
        throw new NotFoundException("brand not found")
      }
      if(!file){
        throw new BadRequestException("must send new Image")
      }
         const url = await this.s3Service.uploadFile({ path: "brand", file });

      const updateBrand=await this.brandRepo.findByIdAndUpdate(id,{image:url},{new:true})
      if(!updateBrand){
        await this.s3Service.deleteFile({
          Key:url
        })
        throw new BadRequestException("faild update")
      }
      await this.s3Service.deleteFile({
        Key:brand.image
      })

      return updateBrand

}
async freezebrand(id:Types.ObjectId,user:HUserDocument){
  
const brand = await this.brandRepo.findOneAndUpdate(
  { _id: id, deletedAt: {$exsits:false} },  
  { deletedAt: new Date(), updatedBy: user._id }, 
  { new: true }                   
);

if(!brand){
        throw new NotFoundException("brand not found")
  }
      return brand
}
async unfreezebrand(id:Types.ObjectId,user:HUserDocument){
      const brand=await this.brandRepo.findOneAndUpdate(
        {_id:id,deletedAt:{$exists:true},paranoid:false},
        {$unset:{deletedAt:""},restoreAt:new Date(),updatedBy:user._id},
        {new:true}
      )
      if(!brand){
        throw new NotFoundException("brand not found")
      }
      return brand
}
async deletebrand(id:Types.ObjectId,user:HUserDocument){
      const brand=await this.brandRepo.findOneAndDelete(
        {_id:id,},
      )
      if(!brand){
        throw new NotFoundException("brand not found")
      }
      await this.s3Service.deleteFile({
        Key:brand.image
      })
      return brand
}
async getbrands(query:QueryDto){
  const {page=1,limit=2,search}=query
  const brands=await this.brandRepo.paginate({filter:{
    ...(search?{$or:[{
     name:{$regex:search,$options:"i"}},
     {slogan:{$regex:search,$options:"i"}}
    ]}:{})
  },query:{page,limit}})
      if(!brands){
        throw new NotFoundException("no brand found")
      }
      return {...brands}

   
 }

}

 
  
