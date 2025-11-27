import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { brandRepository, HUserDocument } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { Types } from 'mongoose';
import slugify from 'slugify';

import { randomUUID } from 'crypto';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';
import { ProductRepository } from 'src/DB/repository/Product.repositry';
import { CreateProductDto, QueryDto, UpdateProduct } from './DTO/Product.dto';
import { SubcategoryRepository } from 'src/DB/repository/supcatogeryrepositry';
import { promise } from 'zod';


@Injectable()
export class ProductService {
constructor(private readonly ProductRepo:ProductRepository,
private readonly categoryRepo:categoryRepository,
    private readonly s3Service:S3Service,
    private readonly brandRepo:brandRepository,
    private readonly brandvalid:BrandValidatorService,
    private readonly subCategoryRepo:SubcategoryRepository,
    private readonly productRepo:ProductRepository,
) {
    
}
async createProduct(
  ProductDto: CreateProductDto,
  user: HUserDocument,
  files: {mainImage:Express.Multer.File,subImage:Express.Multer.File[]},
) {
  let { name, brand, price,discount,category,description,stock,subCategory,quentity} = ProductDto;
 
  const [Category, brandexist, subCategoryExist] = await Promise.all([
    this.categoryRepo.findOne({ filter: { _id: category } }),
    this.brandRepo.findOne({ filter: { _id: brand } }),
    this.subCategoryRepo.findOne({ filter: { _id: subCategory } }),
  ]);

  if (!Category) throw new NotFoundException("Category not found");
  if (!brandexist) throw new NotFoundException("Brand not found");
  if (!subCategoryExist) throw new NotFoundException("Subcategory not found");
  
const slug = slugify(name, { replacement: "_", lower: false, trim: true })

const findProduct=await this.productRepo.findOne({filter:{
    slug
}})

if(findProduct){
throw new ConflictException("Product with the same name already exists");
}

 if(stock>quentity){
    throw new BadRequestException("stock must be less than quantity")
 }

if (discount && discount > 0) {
  price = price - (price * (discount / 100));
}

 


  if (!files?.mainImage) {
  throw new BadRequestException("Main image is required");
}



  const filePath=files.mainImage[0]
  const filesPath=files.subImage


  const [mainImage,subImage]=await Promise.all([
    this.s3Service.uploadFile({
      path: `category/${Category.assetFoldeId}/products/mainImage`,
      file:filePath
    }),
   this.s3Service.UploadFiles({
      path: `category/${Category.assetFoldeId}/products/subImage`,
      files:filesPath
    })
  ])

  
    const Product = await this.ProductRepo.create({
      name,
      description,
      mainImage,
      subCategory,
      slug,
      category,
      brand,
      stock,
      quentity,
      subImage,
      price,
      discount,
      createdBy:user._id as unknown as Types.ObjectId
    });
    if (!Product) {
        await Promise.all([
          this.s3Service.deleteFile({ Key: mainImage }),
          this.s3Service.deleteFiles({ urls: subImage })
        ])
      
      throw new InternalServerErrorException("Failed to create Product");
    }
    return Product;
 
}

async updateProduct(id: Types.ObjectId, ProductDto: UpdateProduct, user: HUserDocument, file: Express.Multer.File) {

  const product = await this.ProductRepo.findOne({
    filter: { _id: id, createdBy: user._id, deletedAt: { $exists: false } }
  });

  if (!product) {
    throw new NotFoundException("Product not found");
  }

  if (ProductDto.category) {
    const category = await this.categoryRepo.findOne({ filter: { _id: ProductDto.category } });
    if (!category) throw new NotFoundException("Category not found");
  }

  if (ProductDto.brand) {
    const brandExist = await this.brandRepo.findOne({ filter: { _id: ProductDto.brand } });
    if (!brandExist) throw new NotFoundException("Brand not found");
  }

  if (ProductDto.subCategory) {
    const subCategoryExist = await this.subCategoryRepo.findOne({ filter: { _id: ProductDto.subCategory } });
    if (!subCategoryExist) throw new NotFoundException("Subcategory not found");
  }

  if (ProductDto.stock !== undefined) {
    if (product.quentity < ProductDto.stock) {
      throw new BadRequestException("stock must be less than quantity");
    }
  }

  if (ProductDto.quentity !== undefined) {
    if (product.stock > ProductDto.quentity) {
      throw new BadRequestException("quantity must be greater than stock");
    }
  }

let finalPrice = ProductDto.price ?? product.price;
  if(ProductDto.price){
finalPrice = finalPrice - (finalPrice * (product.discount / 100));
  }else if(ProductDto.discount){
    finalPrice = finalPrice - (finalPrice * (ProductDto.discount / 100));
}


  
  const updateObject = {
    ...ProductDto,
    price: finalPrice
  };


const productUpdate = await this.ProductRepo.findOneAndUpdate(
  { _id: id, createdBy: user._id },
  updateObject,
  { new: true }
);

if (!productUpdate) {
  throw new BadRequestException("Product not updated");
}

return productUpdate;
}
// async updateProductImage(id:Types.ObjectId,user:HUserDocument,file:Express.Multer.File){  
//       const Product=await this.ProductRepo.findOne({filter:{_id:id,createdBy:user._id}})
//       if(!Product){
//         throw new NotFoundException("Product not found")
//       }
//         if(!file){
//               throw new BadRequestException("must send new Image")
//         }
//         // const Category=await this.categoryRepo.findOne({filter:{_id:Product.categoryId}})
//         // const assetFolderId = Product.assetFolderId;

//   let url: string | undefined;

//   // try {
//   //   url = await this.s3Service.uploadFile({
//   //     path: `category/${Category?.assetFoldeId}/${assetFolderId}/${file.originalname}`,
//   //     file
//   //   });

//     const updatedProduct = await this.ProductRepo.findByIdAndUpdate(
//       id,
//       { image: url },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       await this.s3Service.deleteFile({ Key: url });
//       throw new BadRequestException("Failed to update Product image");
//     }

    
//     if (Product.image) {
//       await this.s3Service.deleteFile({ Key: Product.image });
//     }

//     return updatedProduct;
//   } catch (err) {
//     if (url) await this.s3Service.deleteFile({ Key: url });
//     throw err;
//   }
// }
async freezeProduct(id:Types.ObjectId,user:HUserDocument){
  
const Product = await this.ProductRepo.findOneAndUpdate(
  { _id: id, deletedAt: {$exsits:false} },  
  { deletedAt: new Date(), updatedBy: user._id }, 
  { new: true }                   
);

if(!Product){
        throw new NotFoundException("Product not found")
  }
  
      return Product
}
async unfreezeProduct(id:Types.ObjectId,user:HUserDocument){
      const Product=await this.ProductRepo.findOneAndUpdate(
        {_id:id,deletedAt:{$exists:true},paranoid:false},
        {$unset:{deletedAt:""},restoreAt:new Date(),updatedBy:user._id},
        {new:true}
      )
      if(!Product){
        throw new NotFoundException("Product not found")
      }
      return Product
}
async deleteProduct(  categoryId:Types.ObjectId,user:HUserDocument){
      const Product=await this.ProductRepo.findOneAndDelete(
        {_id:categoryId,},
      )
      if(!Product){
        throw new NotFoundException("Product not found")
      }
    const filePath=Product.mainImage
  const filesPath=Product.subImage


 await Promise.all([
    this.s3Service.deleteFile({
     Key:filePath
    }),
   this.s3Service.deleteFiles({
      urls:filesPath
    })
  ])
      return Product
}
async getProducts(query:QueryDto){
  const {page=1,limit=2,search}=query
  const Products=await this.ProductRepo.paginate({filter:{
    ...(search?{$or:[{
     name:{$regex:search,$options:"i"}},
     {slogan:{$regex:search,$options:"i"}}
    ]}:{})
  },query:{page,limit}})
      if(!Products){
        throw new NotFoundException("no Product found")
      }
      return {...Products}

   
 }

}

 
  
