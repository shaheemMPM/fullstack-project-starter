import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
	userId: number;
	email: string;
}

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): CurrentUserData => {
		const request = ctx.switchToHttp().getRequest();
		return request.user;
	},
);
