import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseRadiusPipe implements PipeTransform {
  transform(value: string | undefined): number | undefined {
    if (!value) {
      return undefined
    }

    return parseFloat(value) / 100
  }
}
