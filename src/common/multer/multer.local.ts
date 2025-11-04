import multer, { MulterError } from "multer";
import { Request } from "express";
import * as fs from "node:fs";
import { BadRequestException } from "@nestjs/common";

export const multerLocal = (
  { customPath = "General", filterEnum = [] }: { customPath?: string, filterEnum?: string[] } = {}
) => {
  const path = `./upload/${customPath}`;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  return {
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb: Function ) => {
        cb(null, path);
      },
      filename: (req: Request, file: Express.Multer.File, cb: Function) => {
       
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      if (filterEnum.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException("Invalid file type"), false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5, 
    },
  }
};