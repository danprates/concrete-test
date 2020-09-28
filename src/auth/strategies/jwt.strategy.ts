import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ENCRIPTION_SALT } from '../../config/constants.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENCRIPTION_SALT,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate({ userId }: any) {
    return { userId };
  }
}
