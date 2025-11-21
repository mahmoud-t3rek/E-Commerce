import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { Auth } from '../../common/decorators/auth.dercrator';
import { fileValidation, multerCloud, TokenType, userRole } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { HUserDocument } from 'src/DB';
import { UserDecrator } from '../../common/decorators';
import { SubcategoryService } from './Subcatogery.service';
import { CreateSubcategoryDto, IDDto, QueryDto, UpdateSubcategory } from './DTO/SubCatogery.dto';



@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly SubcategoryService: SubcategoryService) {}

  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @UseInterceptors(
  FileInterceptor('file', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Post('addsubcategory/:Id')
  async createSubcategory(
    @Param() Param:IDDto,
    @Body() SubcategoryDto: CreateSubcategoryDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const Subcategory = await this.SubcategoryService.createSubcategory(Param.Id,SubcategoryDto, user, file);
    return { message: 'done', Subcategory };
  }
  
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Patch('update/:Id')
  async updateSubcategory(
    @Param() param:IDDto,
    @Body() SubcategoryDto: UpdateSubcategory,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const Subcategory = await this.SubcategoryService.updateSubcategory(param.Id,SubcategoryDto, user, file);
    return { message: 'done', Subcategory };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
   @UseInterceptors(
  FileInterceptor('file', multerCloud({ fileTypes: fileValidation.image })),
  )
  @Patch('updateImage/:Id')
  async updateSubcategoryImage(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    const Subcategory = await this.SubcategoryService.updateSubcategoryImage(param.Id, user, file);
    return { message: 'done', Subcategory };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('freeze/:Id')
  async freezeSubcategory(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Subcategory = await this.SubcategoryService.freezeSubcategory(param.Id, user);
    return { message: 'done', Subcategory };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Patch('restore/:Id')
  async unfreezeSubcategory(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Subcategory = await this.SubcategoryService.unfreezeSubcategory(param.Id, user);
    return { message: 'done', Subcategory };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Delete(':Id')
  async deleteSubcategory(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Subcategory = await this.SubcategoryService.deleteSubcategory(param.Id, user);
    return { message: 'done', Subcategory };
  }
  @Get()
  async getSubcategorys(
    @Query() query:QueryDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Subcategory = await this.SubcategoryService.getSubcategorys(query);
    return { message: 'done', Subcategory };
  }
}
