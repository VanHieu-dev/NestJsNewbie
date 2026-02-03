/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { ROLES_KEY } from 'src/decorator/roles.decorator'
import { Role } from '../enum/role.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true // Nếu không yêu cầu quyền gì thì cho qua
    }
    // console.log('roles:', requiredRoles)
    const { user } = context.switchToHttp().getRequest()
    // 3. Kiểm tra xem quyền của user có nằm trong danh sách quyền được phép không
    return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
