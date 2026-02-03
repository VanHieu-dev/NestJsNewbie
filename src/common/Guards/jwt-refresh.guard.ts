import { AuthGuard } from '@nestjs/passport'

export class JwtRefreshTokenAuthGuard extends AuthGuard('jwt-refresh') {}
