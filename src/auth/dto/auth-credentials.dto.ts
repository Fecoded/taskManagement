import { IsString, Matches, Max, MaxLength, MinLength } from "class-validator";
import { RoleStatus } from "src/enum/enum";

export class AuthCredentialsDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'password too weak'} )
    password: string;
        
    role?: RoleStatus;
}