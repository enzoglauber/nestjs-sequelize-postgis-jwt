import { Inject, Injectable } from '@nestjs/common'
import { ADDRESS_REPOSITORY } from './address.providers'
import { AddressDto } from './dto/address.dto'
import { Address } from './entities/address.entity'

@Injectable()
export class AddressService {
  constructor(@Inject(ADDRESS_REPOSITORY) private readonly addressRepository: typeof Address) {}

  // create(createAddressDto: CreateAddressDto) {
  //   return 'This action adds a new address'
  // }
  async findAll(): Promise<AddressDto[]> {
    const users = await this.addressRepository.findAll()
    return users.map((user) => new AddressDto(user.get({ plain: true })))
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} address`
  // }
  // update(id: number, updateAddressDto: UpdateAddressDto) {
  //   return `This action updates a #${id} address`
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} address`
  // }
}
