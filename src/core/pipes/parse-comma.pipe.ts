import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseCommaPipe implements PipeTransform {
  transform(value: string | undefined): string[] | undefined {
    if (!value) {
      return undefined
    }

    const collections = value
      .split(',')
      .map((collection) => collection.trim())
      .filter((collection) => collection)

    return collections
  }
}
