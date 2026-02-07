import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
        @ApiProperty({ example: 'user@example.com', description: 'The email of the User' })
        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @ApiProperty({ example: 'password123', description: 'The password of the User' })
        @IsNotEmpty()
        password: string;
}
