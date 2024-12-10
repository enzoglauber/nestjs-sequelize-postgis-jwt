import { Inject, Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize'
import { ADDRESS_REPOSITORY } from './address.providers'
import { AddressDto } from './dto/address.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { Address } from './entities/address.entity'

@Injectable()
export class AddressService {
  constructor(@Inject(ADDRESS_REPOSITORY) private readonly addressRepository: typeof Address) {}

  async create(createAddressDto: CreateAddressDto) {
    const address = createAddressDto.toEntity()
    const created = await this.addressRepository.create<Address>(address)
    return new AddressDto(created.get({ plain: true }))
  }

  async findAll(): Promise<AddressDto[]> {
    const addresses = await this.addressRepository.findAll()
    return addresses.map((address) => new AddressDto(address.get({ plain: true })))
  }

  async findAllWithLocation(): Promise<AddressDto[]> {
    const addresses = await Address.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          'ST_DWithin',
          Sequelize.col('location'),
          Sequelize.fn('ST_SetSRID', Sequelize.fn('ST_Point', -46.5, -23.5), 4326),
          5000 // Raio de 5 km
        ),
        true
      )
    })

    return addresses.map((address) => new AddressDto(address.get({ plain: true })))
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
