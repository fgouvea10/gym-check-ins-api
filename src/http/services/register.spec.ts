import { compare } from 'bcrypt'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '~/repositories/in-memory/users-repository'
import { UserAlreadyExistsException } from './errors/user-already-exists'
import { RegisterService } from './register.service'

describe('Register Service', () => {
  it('should be able to register an user', async () => {
    const repository = new InMemoryUsersRepository()
    const registerService = new RegisterService(repository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const repository = new InMemoryUsersRepository()
    const registerService = new RegisterService(repository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    const repository = new InMemoryUsersRepository()
    const registerService = new RegisterService(repository)

    const email = 'johndoe@email.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(() => registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsException)
  })
})
