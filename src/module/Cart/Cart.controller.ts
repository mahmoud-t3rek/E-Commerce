import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';

import { Auth } from '../../common/decorators/auth.dercrator';
import { fileValidation, multerCloud, TokenType, userRole } from 'src/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

import type {  HUserDocument } from 'src/DB';
import { UserDecrator } from '../../common/decorators';
import { CartService } from './Cart.service';
import { CartProduct, CreateCartDto, IDDto, QueryDto, UpdateCart } from './DTO/Cart.dto';




@Controller('carts')
export class CartController {
  constructor(private readonly CartService: CartService) {}

  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Post()
  async createCart(
    @Body() CartDto: CartProduct,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Cart = await this.CartService.createCart(CartDto, user);
    return { message: 'done', Cart };
  }
  
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Patch('update/:Id')
  async updateCart(
    @Param() param:IDDto,
    @Body() CartDto: UpdateCart,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Cart = await this.CartService.updateQuentity(param.Id,CartDto, user,);
    return { message: 'done', Cart };
  }
 
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  
  @Delete(':Id')
  async deleteCart(
    @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) {
    
    const Cart = await this.CartService.deleteProductFromCart(param.Id, user);
    return { message: 'done', Cart };
  }
  @Auth({
    role: [userRole.admin],
    typetoken: TokenType.access,
  })
  @Delete("/clear/:Id")
  async getCarts(
     @Param() param:IDDto,
    @UserDecrator() user: HUserDocument,
  ) { 
    
    const Cart = await this.CartService.clearCarts(param.Id,user);
    return { message: 'done', Cart };
  }
}
