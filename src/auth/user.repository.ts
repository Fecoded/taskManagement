import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'; 
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<any> {
        const { username, password, role } = authCredentialsDTO;
    
        const user = new User();

        function transform(value: any) {
            value = value.toUpperCase();
    
            return value;
        }
    

        user.username = username;
        user.role = transform(role);
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save(); 

            return { message: "User was created successfully"};
        } catch (err) {
            if(err.code === '23505') {
                throw new ConflictException("Username already exists");
            } else {
                throw new InternalServerErrorException(err);
            }
        }
       
    }

    async validateUserPassword(authCredentialsDTO: AuthCredentialsDTO): Promise<User> {
        const { username, password } = authCredentialsDTO;
        const user = await this.findOne({ username });

        if(user && await user.validatePassword(password)) {
            return user;
        } else {
            return null
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async getUsers(): Promise<User[]> {
        const user = await this.find();

        return user;
    }
}