import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { col, fn, literal, where } from 'sequelize'
import { ADDRESS_REPOSITORY } from './address.providers'
import { AddressDto } from './dto/address.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdateAddressDto } from './dto/update-address.dto'
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

  // Esse funciona:
  // SELECT
  //     id,
  //     ST_AsText(location) AS location,
  //     ST_Distance(location, ST_SetSRID(ST_GeomFromText('POINT(-23.53506 -46.525199)'), 4326)) AS distance
  // FROM "Addresses"
  // WHERE ST_DWithin(location, ST_SetSRID(ST_GeomFromText('POINT(-23.53506 -46.525199)'), 4326), 0.015)
  // ORDER BY distance ASC;

  async findAllWithLocation(
    at: string = `-46.633308,-23.550520`,
    radius: number = 500,
    page: number = 1,
    limit: number = 10
  ): Promise<AddressDto[]> {
    const locationArray = at.split(',')
    const lat = parseFloat(locationArray[0])
    const lng = parseFloat(locationArray[1])

    // Constrói o literal para localização usando o SRID 4326
    const location = literal(`ST_SetSRID(ST_GeomFromText('POINT(${lng} ${lat})'), 4326)`)
    const distance = fn('ST_Distance', col('location'), location)

    // Obtém os atributos do modelo Address e adiciona a coluna de distância
    const attributes: any[] = [...Object.keys(Address.getAttributes()), [distance, 'distance']]

    // Executa a consulta no banco de dados
    const addresses = await Address.findAll({
      attributes,
      where: where(fn('ST_DWithin', col('location'), location, radius), true),
      order: [[literal('"distance"'), 'ASC']],
      limit,
      offset: (page - 1) * limit
    })

    // Mapeia os resultados para o DTO
    return addresses.map((address) => new AddressDto(address.get({ plain: true })))
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} address`
  // }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findByPk(id)
    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND)
    }

    const updated = updateAddressDto.toEntity()
    await address.update(updated)
    return new AddressDto(address.get({ plain: true }))
  }

  // remove(id: number) {
  //   return `This action removes a #${id} address`
  // }
}
