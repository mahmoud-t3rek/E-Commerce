import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { HUserDocument } from "src/DB";
import { TokenType } from "../enums";

export interface UserRequest extends Request{
    user?:HUserDocument,
    decoded?:JwtPayload,
    tokenTypes:TokenType
}