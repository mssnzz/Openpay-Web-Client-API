import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // Nota el segundo argumento 'jwt'
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tu_super_secreto', // Asegúrate de que esta variable de entorno esté definida
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // Puedes ajustar según tu payload
  }
}
