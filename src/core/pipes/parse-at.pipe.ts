import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseAtPipe implements PipeTransform {
  transform(value: string | undefined): [number, number] | undefined {
    if (!value) {
      return undefined
    }

    const coords = value.split(',')
    if (coords.length !== 2) {
      throw new BadRequestException('Invalid "at" parameter. Expected format: lat,long (e.g., -23.53506,-46.525199)')
    }

    const [lat, lng] = coords.map((coord) => parseFloat(coord))
    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Invalid "at" parameter. Latitude and longitude must be valid numbers.')
    }

    return [lat, lng]
  }
}
