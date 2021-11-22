import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '../http';
import { BasketReadDto } from './dto/basket-read.dto';

@Injectable()
export class BasketService {
  private readonly _baseUrl = `${process.env.BASKET_URL}/api/v1`;

  constructor(private readonly _httpService: HttpService) {}

  async getCustomerBasket(token: string): Promise<BasketReadDto> {
    const result = await this._httpService.get(`${this._baseUrl}/basket`, {
      headers: {
        authorization: token,
      },
    });

    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }
}
