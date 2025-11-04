import multer, { MulterError } from "multer";
import { Request } from "express";
import * as fs from "node:fs";
import { BadRequestException } from "@nestjs/common";
import { storageType } from "../enums";
import { fileValidation } from "./multer.validation";
import os from "os"

export const multerCloud= (
 {
    fileTypes=fileValidation.image,
    storetype=storageType.cloud,
    maxsize=5
}:{
fileTypes?:string[],
storetype?:storageType
maxsize?:number
}
) => {

  return {
    storage:storetype===storageType.cloud?multer.memoryStorage():multer.diskStorage({
destination:os.tmpdir(),
filename(req:Request, file:Express.Multer.File, cb){
cb(null,`${Date.now()}_${file.originalname}`)
}
}),
 fileFilter: (req:Request, file:Express.Multer.File, cb:Function)=>{
    if(!fileTypes.includes(file.mimetype)){
       throw new BadRequestException("invalid file type")
    }
    else{
     cb(null, false)
     }

}


  }
};