import { SetMetadata } from "@nestjs/common"
import { TokenType, userRole } from "src/common"

export const Token_Type="tokentype"
export const Token=(tokenType:TokenType=TokenType.access)=>{
    return SetMetadata(Token_Type,tokenType)
}

export const Access_Role="Access_Role"
export const AuthoToken=(Role:userRole[]=[userRole.user] )=>{
    return SetMetadata(Access_Role,Role)
}