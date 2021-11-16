import { Entity } from '../../Entity';
import { OrderingDomainException } from '../../exceptions/OrderingDomainException';

export interface OrderItemProps {
  id: number;
  productId: number;
  productName: string;
  pictureUrl: string;
  unitPrice: number;
  discount: number;
  units: number;
}

export class OrderItem extends Entity {
  private _pictureUrl: string;
  private _discount: number;
  private _units: number;
  private _productId: number;
  private _productName: string;
  private _unitPrice: number;

  static create(props: OrderItemProps) {
    if (props.units <= 0) {
      throw new OrderingDomainException('Invalid number of units');
    }

    if (props.unitPrice * props.units < props.discount) {
      throw new OrderingDomainException(
        'The total of order item is lower than applied discount'
      );
    }

    const order = new OrderItem(props.id);

    order._pictureUrl = props.pictureUrl;
    order._discount = props.discount;
    order._units = props.units;
    order._productId = props.productId;
    order._productName = props.productName;
    order._unitPrice = props.unitPrice;

    return order;
  }

  constructor(id: number) {
    super(id);
  }

  get discount(): number {
    return this._discount;
  }

  get units(): number {
    return this._units;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get productId(): number {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get pictureUrl(): string {
    return this._pictureUrl;
  }

  public setNewDiscount(discount: number): void {
    if (discount < 0) {
      throw new OrderingDomainException('Discount is not valid');
    }

    this._discount = discount;
  }

  public addUnits(units: number): void {
    if (units < 0) {
      throw new OrderingDomainException('Invalid units');
    }

    this._units += units;
  }
}
