import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'fulano@teste.com',
      password: '123159',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'fulano2@teste.com',
      password: '123159',
    });

    const loggedUsers = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'fulano3@teste.com',
      password: '123159',
    });

    const providers = await listProviders.execute({
      user_id: loggedUsers.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
