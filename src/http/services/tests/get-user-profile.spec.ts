import { hash } from 'bcrypt'
import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryUsersRepository } from '~/repositories/in-memory/users-repository'
import { ResourceNotExistsException } from '../errors'
import { GetUserService } from '../get-user-profile.service'

let usersRepository: InMemoryUsersRepository
let sut: GetUserService
    
describe('Get User profile service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const userData = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: userData.id
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id'
      }),
    ).rejects.toBeInstanceOf(ResourceNotExistsException)
  })
})
