import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { USER_REPOSITORY } from './users.providers'

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User
    // private readonly configService: ConfigService
  ) {
    // this.jwtPrivateKey = this.configService.jwtConfig.privateKey
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }

  async findAll() {
    return await this.userRepository.findAll<User>()
    // const users = await this.userRepository.findAll<User>()
    // return users.map((user) => new User(user))
  }

  //   async findAll(limit, page, at?: string): Promise<{ results: Property[], total: number }> {
  //     const locationArray = at.split(',');
  //     const lat = parseFloat(locationArray[0]);
  //     const lng = parseFloat(locationArray[1]);
  //     const attributes: any[] = Object.keys(Property.rawAttributes);

  //     const location = sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
  //     const distance = sequelize.fn('ST_Distance_Sphere', sequelize.col('geopoint'), location);
  //     attributes.push([ distance,'distance']);
  //     const total = await this.propertyRepository.count<Property>({});
  //     const properties = await this.propertyRepository.findAll<Property>({
  //         attributes,
  //         order: distance,
  //         limit,
  //         offset: ((page - 1) * limit)
  //     });
  //     return {
  //         results: properties,
  //         total,
  //     };
  // }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
