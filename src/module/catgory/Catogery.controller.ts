import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { Auth } from '../../common/decorators/auth.dercrator';
import { fileValidation, multerCloud, TokenType, userRole } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { HUserDocument } from 'src/DB';
import { UserDecrator } from '../../common/decorators';
import { categoryService } from './catogery.service';
import { CreateCategoryDto, IDDto, QueryDto, Updatecategory } from './DTO/Catogery.dto';



@Controller('category')
export class categoryController {
  constructor(private readonly categoryService: categoryService) {}

  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @UseInterceptors(
  FileInterceptor('file', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Post('addcategory')
  async createcategory(
    @Body() categoryDto: CreateCategoryDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const category = await this.categoryService.createCategory(categoryDto, user, file);
    return { message: 'done', category };
  }
  
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Patch('update/:id')
  async updatecategory(
    @Param() param:IDDto,
    @Body() categoryDto: Updatecategory,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const category = await this.categoryService.updatecategory(param.id,categoryDto, user, file);
    return { message: 'done', category };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
   @UseInterceptors(
  FileInterceptor('file', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Patch('updateImage/:id')
  async updatecategoryImage(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const category = await this.categoryService.updatecategoryImage(param.id, user, file);
    return { message: 'done', category };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('freeze/:id')
  async freezecategory(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const category = await this.categoryService.freezecategory(param.id, user);
    return { message: 'done', category };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('restore/:id')
  async unfreezecategory(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const category = await this.categoryService.unfreezecategory(param.id, user);
    return { message: 'done', category };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Delete(':id')
  async deletecategory(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const category = await this.categoryService.deletecategory(param.id, user);
    return { message: 'done', category };
  }
  @Get()
  async getcategorys(
    @Query() query:QueryDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const category = await this.categoryService.getcategorys(query);
    return { message: 'done', category };
  }
}
