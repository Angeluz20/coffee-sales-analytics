import { UnauthorizedException } from '@nestjs/common';
import { AuthMessages } from 'src/common/messages/auth.messages';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super(AuthMessages.INVALID_CREDENTIALS);
  }
}
