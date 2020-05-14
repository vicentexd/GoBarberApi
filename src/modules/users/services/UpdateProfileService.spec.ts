import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'fulano@teste.com',
      password: '123159',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fulano de Tal',
      email: 'teste@teste.com',
    });

    expect(updatedUser.name).toBe('Fulano de Tal');
    expect(updatedUser.email).toBe('teste@teste.com');
  });

  it('should not be able to change to another user email ', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'teste1@teste.com',
      password: '123159',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'fulano@teste.com',
      password: '123159',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fulano de Tal',
        email: 'teste1@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'fulano@teste.com',
      password: '123159',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Fulano de Tal',
      email: 'teste@teste.com',
      old_password: '123159',
      password: '123213',
    });

    expect(updatedUser.password).toBe('123213');
  });

  it('should be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'fulano@teste.com',
      password: '123159',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fulano de Tal',
        email: 'teste@teste.com',
        password: '123213',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'fulano@teste.com',
      password: '123159',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Fulano de Tal',
        email: 'teste@teste.com',
        old_password: 'wrong-old-password',
        password: '123213',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing',
        name: 'N existe ',
        email: 'não existe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
