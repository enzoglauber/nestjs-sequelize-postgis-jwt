import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { col, fn, literal, Op } from 'sequelize'
import { User } from 'src/user/entities/user.entity'
import { ADDRESS_REPOSITORY } from './address.providers'
import { AddressDto, AddressFullyDto } from './dto/address.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
import { Address } from './entities/address.entity'

@Injectable()
export class AddressService {
  constructor(@Inject(ADDRESS_REPOSITORY) private readonly addressRepository: typeof Address) {}

  private async entity(id: number) {
    const address = await this.addressRepository.findByPk(id)
    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND)
    }
    return address
  }

  async create(createAddressDto: CreateAddressDto) {
    const address = createAddressDto.toEntity()
    const created = await this.addressRepository.create<Address>(address)
    return new AddressDto(created.get({ plain: true }))
  }

  async findAll(): Promise<AddressDto[]> {
    const addresses = await this.addressRepository.findAll()
    return addresses.map((address) => new AddressDto(address.get({ plain: true })))
  }

  // Esse funciona:
  // SELECT
  //     id,
  //     ST_AsText(location) AS location,
  //     ST_Distance(location, ST_SetSRID(ST_GeomFromText('POINT(-23.53506 -46.525199)'), 4326)) AS distance
  // FROM "Addresses"
  // WHERE ST_DWithin(location, ST_SetSRID(ST_GeomFromText('POINT(-23.53506 -46.525199)'), 4326), 0.015)
  // ORDER BY distance ASC;

  async findAllWithLocation({
    page = 1,
    limit = 10,
    at,
    radius = 0.015,
    name,
    email,
    roles
  }: {
    page: number
    limit: number
    at?: [number, number]
    radius: number
    name?: string
    email?: string
    roles?: string
  }): Promise<AddressFullyDto[]> {
    const [lat, lng] = at
    const location = literal(`ST_SetSRID(ST_GeomFromText('POINT(${lat} ${lng})'), 4326)`)
    const distance = fn('ST_Distance', col('location'), location)

    const attributes: any[] = [...Object.keys(Address.getAttributes()), [distance, 'distance']]

    const userWhere: any = {}

    if (name) {
      userWhere.name = { [Op.iLike]: `%${name}%` }
    }

    if (email) {
      userWhere.email = { [Op.iLike]: `%${email}%` }
    }

    if (roles) {
      const rolesArray = roles.split(',')
      userWhere.roles = { [Op.overlap]: rolesArray }
    }

    const addresses = await Address.findAll({
      attributes,
      include: [{ model: User, where: Object.keys(userWhere).length ? userWhere : undefined }],
      where: fn('ST_DWithin', col('location'), location, radius),
      order: [[literal('"distance"'), 'ASC']],
      limit,
      offset: (page - 1) * limit
    })

    return addresses.map((address) => new AddressFullyDto(address.get({ plain: true })))
  }

  async findOne(id: number) {
    const address = await this.entity(id)
    return new AddressDto(address.get({ plain: true }))
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.entity(id)

    const updated = updateAddressDto.toEntity()
    await address.update(updated)
    return new AddressDto(address.get({ plain: true }))
  }

  async delete(id: number) {
    const address = await this.entity(id)
    await address.destroy()
    return new AddressDto(address.get({ plain: true }))
  }
}
