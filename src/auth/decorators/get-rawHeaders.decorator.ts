import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetHeaders = createParamDecorator(
    (data:string , ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        console.log(req)
        const headers = req.rawHeaders;
        if(!headers)
            throw new InternalServerErrorException('User not found (request)')
        return headers;
    }
);