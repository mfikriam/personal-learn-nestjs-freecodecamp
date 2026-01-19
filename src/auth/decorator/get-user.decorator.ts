import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    // 1. Use optional chaining to safely check for 'user'
    const user = request.user;

    // 2. If data (like 'email') is passed, return only that property
    if (data) {
      return user ? user[data] : undefined;
    }

    return user;
  },
);
