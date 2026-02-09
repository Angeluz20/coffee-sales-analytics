import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersMessages } from 'src/common/messages/users.messages';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(UsersMessages.NOT_FOUND);
  }
}

export class UserEmailAlreadyExistsException extends ConflictException {
  constructor() {
    super(UsersMessages.EMAIL_ALREADY_EXISTS);
  }
}