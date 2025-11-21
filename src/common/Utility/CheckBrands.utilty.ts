import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { brandRepository } from "src/DB";


@Injectable()
export class BrandValidatorService {
    constructor(private readonly brandRepo:brandRepository){}


    async checkBrands(brands: Types.ObjectId[]) {
        const strictBrands = [...new Set(brands || [])];
    
    
      if (strictBrands.length > 0) {
        const foundBrands = await this.brandRepo.find({ filter: { _id: { $in: strictBrands } } });
        if (foundBrands.length !== strictBrands.length) {
          const missing = strictBrands.filter(
            b => !foundBrands.some(fb => fb._id.toString() === b.toString())
          );
          throw new NotFoundException(`Brands not found: ${missing.join(", ")}`);
        }
      }
      return {strictBrands}
    }
   
}


 
    
