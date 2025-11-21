import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, IDDto, QueryDto, UpdateBrand } from './DTO/Brand.dto';
import { Auth } from '../../common/decorators/auth.dercrator';
import { fileValidation, multerCloud, TokenType, userRole } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { HUserDocument } from 'src/DB';
import { UserDecrator } from '../../common/decorators';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @UseInterceptors(
    FileInterceptor('attachments', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Post('addbrand')
  async createBrand(
    @Body() brandDto: CreateBrandDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const brand = await this.brandService.createBrand(brandDto, user, file);
    return { message: 'done', brand };
  }
  
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Patch('update/:id')
  async updateBrand(
    @Param() param:IDDto,
    @Body() brandDto: UpdateBrand,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const brand = await this.brandService.updateBrand(param.id,brandDto, user, file);
    return { message: 'done', brand };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
   @UseInterceptors(
    FileInterceptor('attachments', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Patch('updateImage/:id')
  async updateBrandImage(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const brand = await this.brandService.updateBrandImage(param.id, user, file);
    return { message: 'done', brand };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('freeze/:id')
  async freezebrand(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const brand = await this.brandService.freezebrand(param.id, user);
    return { message: 'done', brand };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('restore/:id')
  async unfreezebrand(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const brand = await this.brandService.unfreezebrand(param.id, user);
    return { message: 'done', brand };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Delete(':id')
  async deletebrand(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const brand = await this.brandService.deletebrand(param.id, user);
    return { message: 'done', brand };
  }
  @Get()
  async getBrands(
    @Query() query:QueryDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const brand = await this.brandService.getbrands(query);
    return { message: 'done', brand };
  }
}
