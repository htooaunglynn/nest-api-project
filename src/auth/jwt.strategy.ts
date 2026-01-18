import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'changeme',
        });
    }

    async validate(payload: any) {
        // payload should contain { sub, email }
        const user = await this.usersService.findOne(payload.sub);
        if (!user) return null;
        const { password, ...result } = user as any;
        return result;
    }
}
