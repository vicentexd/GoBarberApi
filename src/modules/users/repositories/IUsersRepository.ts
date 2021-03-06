import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFinderAllProvidersDTO from '../dtos/IFinderAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFinderAllProvidersDTO): Promise<User[]>;
  findbyId(id: string): Promise<User | undefined>;
  findbyEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
