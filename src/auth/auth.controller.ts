import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleStatus } from 'src/enum/enum';
import { AuthService } from './auth.service';
import { hasRoles } from './decorator/roles.decorator';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { RolesGuard } from './guard/roles.guard';
import { User } from './user.entity';

@Controller('api')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('/register')
    @UsePipes(ValidationPipe)
    signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<any> {
        return this.authService.signUp(authCredentialsDTO);
    }

    @Post('/login')
    login(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
            return this.authService.login(authCredentialsDTO);
    }

    @Get('/users')
    @UseGuards(AuthGuard(), RolesGuard)
    @hasRoles(RoleStatus.ADMIN)
    getUsers(): Promise<User[]> {
        return this.authService.getUsers();
    }
}
