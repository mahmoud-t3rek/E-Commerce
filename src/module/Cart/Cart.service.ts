import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { brandRepository, HUserDocument, Product } from 'src/DB';
import { S3Service } from 'src/common/services/email/S3Config';
import { Types } from 'mongoose';
import slugify from 'slugify';

import { randomUUID } from 'crypto';
import { categoryRepository } from 'src/DB/repository/catogeryrepositry';
import { BrandValidatorService } from 'src/common/Utility/CheckBrands.utilty';
import { CartProduct, CreateCartDto, QueryDto, UpdateCart } from './DTO/Cart.dto';
import { SubcategoryRepository } from 'src/DB/repository/supcatogeryrepositry';
import { promise } from 'zod';
import { CartRepository } from 'src/DB/repository/Cartrepositry';
import { ProductRepository } from 'src/DB/repository/Product.repositry';
import { userRole } from 'src/common';


@Injectable()
export class CartService {
constructor(
  private readonly s3Service:S3Service,
private readonly ProductRepo:ProductRepository,
  private readonly CartRepo:CartRepository,
) {
    
}
async createCart(
  CartDto: CartProduct,
  user: HUserDocument,
) {
  let {productId,quentity } = CartDto;
 const product=await this.ProductRepo.findOne({filter:{
  _id:productId,
 }})
 if(!product){
  throw new NotFoundException("product not found ")
 }
 if(product.stock<quentity){
  throw new BadRequestException("quentity cannot exceed product stock")
 }
 const cart=await this.CartRepo.findOne({filter:{
  createdBy:user._id
 }})
 if(!cart){
  const newCart=await this.CartRepo.create({
    createdBy:user._id as unknown as Types.ObjectId,
     products:[
      {
        productId,
        quentity,
        price:product.price
      }
     ]
  })
  if(!newCart){
    throw new BadRequestException("faild add to cart")
  }
  return newCart;
 }

 const productCarts=cart.products.find((product)=>product.productId.toString()===productId.toString())
 if(productCarts){
  throw new BadRequestException("product already added")
 }
 cart.products.push({
  productId,
  quentity,
  price:product.price
 })

 await cart.save()
 return cart
}

async updateQuentity(
  productId: Types.ObjectId, 
  CartDto: UpdateCart, 
  user: HUserDocument
) {

  const { quentity } = CartDto;

  const product = await this.ProductRepo.findOne({
    filter: { _id: productId }
  });

  if (!product) {
    throw new NotFoundException("Product not found");
  }
  if (quentity! > product.stock) {
    throw new BadRequestException("quentity cannot exceed product stock");
  }

  
 
  const cart = await this.CartRepo.findOne({filter:{
    createdBy:user._id,
    products:{$elemMatch:{productId:productId}}
  }
    }
);

  if (!cart) {
    throw new NotFoundException("Product not found in cart");
  }
  cart.products = cart.products.map((item) => {
  if (item.productId.toString() === productId.toString()) {
    item.quentity = quentity as number
  }
  return item;
});

await cart.save();

  return cart;
}
 
async deleteProductFromCart(productId: Types.ObjectId, user: HUserDocument) {

  const cart = await this.CartRepo.findOne({
    filter: {
      createdBy: user._id,
      products: { $elemMatch: { productId: productId } },
    }
  });

  if (!cart) {
    throw new NotFoundException("Product not found in cart");
  }

  cart.products = cart.products.filter(
    (p) => p.productId.toString() !== productId.toString()
  );

  
  if (cart.products.length === 0) {
    await this.CartRepo.DeleteOne({ _id: cart._id });
    return { message: "Cart deleted" };
  }

  await cart.save();
  return cart;
}

async clearCarts(cartId: Types.ObjectId, user: HUserDocument) {
  const cart = await this.CartRepo.findOneAndDelete({
     
      _id: cartId,
      createdBy: user._id
    
  });

  if (!cart) {
    throw new NotFoundException("No cart found");
  }

  return { message: "Cart cleared" };
}


}

 
  
