import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@shared/services/config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.jwtSecret,
		});
	}

	async validate(payload: JwtPayload) {
		return { userId: payload.sub, email: payload.email };
	}
}
