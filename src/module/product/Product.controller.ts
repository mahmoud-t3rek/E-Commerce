import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';

import { Auth } from '../../common/decorators/auth.dercrator';
import { fileValidation, multerCloud, TokenType, userRole } from 'src/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

import type { HUserDocument } from 'src/DB';
import { UserDecrator } from '../../common/decorators';
import { ProductService } from './Product.service';
import { CreateProductDto, IDDto, QueryDto, UpdateProduct } from './DTO/Product.dto';




@Controller('Products')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @UseInterceptors(
  FileFieldsInterceptor([
    {name:"mainImage",maxCount:1},
    {name:"subImage",maxCount:5},
  ], multerCloud({ fileTypes: fileValidation.image })),
  )
  @Post()
  async createProduct(
    @Body() ProductDto: CreateProductDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFiles() files: {mainImage:Express.Multer.File,subImage:Express.Multer.File[]},
  ) {
    
    const Product = await this.ProductService.createProduct(ProductDto, user, files);
    return { message: 'done', Product };
  }
  
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Patch('update/:Id')
  async updateProduct(
    @Param() param:IDDto,
    @Body() ProductDto: UpdateProduct,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const Product = await this.ProductService.updateProduct(param.Id,ProductDto, user, file);
    return { message: 'done', Product };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
   @UseInterceptors(
  FileInterceptor('file', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Patch('updateImage/:Id')
  async updateProductImage(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    // const Product = await this.ProductService.updateProductImage(param.Id, user, file);
    // return { message: 'done', Product };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('freeze/:Id')
  async freezeProduct(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Product = await this.ProductService.freezeProduct(param.Id, user);
    return { message: 'done', Product };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('restore/:Id')
  async unfreezeProduct(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Product = await this.ProductService.unfreezeProduct(param.Id, user);
    return { message: 'done', Product };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Delete(':Id')
  async deleteProduct(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Product = await this.ProductService.deleteProduct(param.Id, user);
    return { message: 'done', Product };
  }
  @Get()
  async getProducts(
    @Query() query:QueryDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Product = await this.ProductService.getProducts(query);
    return { message: 'done', Product };
  }
}
