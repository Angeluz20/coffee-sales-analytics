import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'username', description: 'The username of the User' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'user@example.com', description: 'The email of the User' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the User' })
    @IsNotEmpty()
    password: string;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;
}
