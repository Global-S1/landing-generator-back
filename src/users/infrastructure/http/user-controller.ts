import { NextFunction, type Request, type Response } from 'express';
import { type UserUseCase } from '../../application/user-use-case';
import { Rsp } from '../../../utils/response';

export class UserController {
	constructor(private readonly userUseCase: UserUseCase) {}

	public register = async ({ body }: Request, res: Response, next: NextFunction) => {
		try {
			const user = await this.userUseCase.register(body);
			return Rsp.success(res, user, 201);
		} catch (error) {
			next(error)
		}
	};

	public login = async ({ body }: Request, res: Response, next: NextFunction) => {
		try {
			const user = await this.userUseCase.login(body);

			return Rsp.success(res, user, 200);
		} catch (error) {
            next(error)
		}
	};
    
    public getUser = async(req: Request, res: Response, next: NextFunction ) => {
        try {
            const id = req.params.id
            
            const user = await this.userUseCase.findByUid(id)
            
            return Rsp.success(res, user, 200);
    } catch (error) {
        next(error)
    }}
}