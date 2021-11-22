import { Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { Dispatcher, request } from 'undici';

interface RequestOptions {
  headers?: IncomingHttpHeaders | string[] | null;
}

@Injectable()
export class HttpService {
  get(
    url: string,
    options: RequestOptions = {}
  ): Promise<Dispatcher.ResponseData> {
    return request(url, {
      method: 'GET',
      headers: options.headers,
    });
  }

  post(
    url: string,
    body: string,
    options: RequestOptions = {}
  ): Promise<Dispatcher.ResponseData> {
    return request(url, {
      method: 'POST',
      headers: options.headers,
      body,
    });
  }
}
