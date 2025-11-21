
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard, TokenType, userRole } from 'src/common';
import { AuthorizationGuard } from 'src/common/guards/authouraiztion.guard';
import { AuthoToken, Token } from './Token';
import { tokenType } from 'src/common/middlewares/authountcation';

export function Auth({typetoken=TokenType.access,role=[userRole.user]}:{typetoken:TokenType,role?:userRole[]}) {
  return applyDecorators(
    Token(typetoken),
    AuthoToken(role),
    UseGuards(AuthGuard, AuthorizationGuard),

    
  );
}
