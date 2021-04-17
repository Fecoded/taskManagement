import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<any> {
        return this.userRepository.signUp(authCredentialsDTO);
    }

    async login(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string, message: string }> {
        const user = await this.userRepository.validateUserPassword(authCredentialsDTO)
        
        if(!user){
            throw new UnauthorizedException("Invalid Credentials");
        }

        const payload: JwtPayload = { id: user.id, role: user.role };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken, message: "login successful" };
    }

    async getUsers(): Promise<User[]> {
        return this.userRepository.getUsers();
    }
}
