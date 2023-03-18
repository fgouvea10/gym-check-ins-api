import { compare } from 'bcrypt'
import { describe, expect, it, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '~/repositories/in-memory/users-repository'
import { UserAlreadyExistsException } from './errors/user-already-exists'
import { RegisterService } from './register.service'

let repository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new RegisterService(repository)
  })

  it('should be able to register an user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@email.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() => sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsException)
  })
})
