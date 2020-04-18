import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Resquest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Resquest): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error('Email address already used.');
    }

    const hashedPassoword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassoword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
