import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (!user || user.password !== pass) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { password, ...result } = user as any;
        return result;
    }

    async signUp(createUserDto: CreateUserDto): Promise<any> {
        const existing = await this.usersService.findByEmail(createUserDto.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }
        const user = await this.usersService.create(createUserDto);
        const { password, ...result } = user as any;
        return result;
    }
}
