import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '../http';
import { CardTypeReadDto } from './dto/card-type-read.dto';
import { OrderReadDto } from './dto/order-read.dto';
import { OrderSummaryDto } from './dto/order-summary.dto';

@Injectable()
export class OrdersService {
  private readonly _baseUrl = `${process.env.ORDERING_URL}/api/v1`;

  constructor(private readonly _httpService: HttpService) {}

  async getCardTypes(token: string): Promise<CardTypeReadDto[]> {
    const result = await this._httpService.get(
      `${this._baseUrl}/orders/card-types`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }

  async getOrdersFromUser(token: string): Promise<OrderSummaryDto[]> {
    const result = await this._httpService.get(`${this._baseUrl}/orders`, {
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

  async getOrder(id: number, token: string): Promise<OrderReadDto> {
    const result = await this._httpService.get(
      `${this._baseUrl}/orders/${id}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    const response = await result.body.json();

    if (result.statusCode !== HttpStatus.OK) {
      throw new HttpException(response, result.statusCode);
    }

    return response;
  }
}
