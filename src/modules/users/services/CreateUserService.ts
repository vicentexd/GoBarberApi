import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

interface IResquest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, email, password }: IResquest): Promise<User> {
    const checkUserExists = await this.usersRepository.findbyEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassoword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassoword,
    });
    return user;
  }
}

export default CreateUserService;
