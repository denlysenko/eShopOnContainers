import { AggregateRoot } from '../../AggregateRoot';
import { OrderCancelledDomainEvent } from '../../events/OrderCancelledDomainEvent';
import { OrderShippedDomainEvent } from '../../events/OrderShippedDomainEvent';
import { OrderStartedDomainEvent } from '../../events/OrderStartedDomainEvent';
import { OrderStatusChangedToAwaitingValidationDomainEvent } from '../../events/OrderStatusChangedToAwaitingValidationDomainEvent';
import { OrderStatusChangedToPaidDomainEvent } from '../../events/OrderStatusChangedToPaidDomainEvent';
import { OrderStatusChangedToStockConfirmedDomainEvent } from '../../events/OrderStatusChangedToStockConfirmedDomainEvent';
import { OrderingDomainException } from '../../exceptions/OrderingDomainException';
import { PaymentMethodProps } from '../buyer/PaymentMethod';
import { Address } from './Address';
import { OrderItem, OrderItemProps } from './OrderItem';
import { OrderStatus } from './OrderStatus';

interface OrderProps {
  id: number;
  orderDate?: Date;
  description?: string;
  address: Address;
  buyerId?: number;
  paymentMethodId?: number;
  orderStatusId?: number;
  orderItems?: OrderItem[];
  cardProps?: Omit<PaymentMethodProps, 'id' | 'alias'> & {
    userId: string;
    userName?: string;
  };
}

export class Order extends AggregateRoot {
  private _orderDate: Date;
  private _orderStatusId: number;
  private _buyerId: number;
  private _description: string;
  private _isDraft: boolean;
  private _paymentMethodId: number;
  private _address: Address;
  private _orderItems: OrderItem[];

  public static create(props: OrderProps) {
    const order = new Order(props.id);

    order._buyerId = props.buyerId;
    order._paymentMethodId = props.paymentMethodId;
    order._orderStatusId = props.orderStatusId || OrderStatus.SUBMITTED;
    order._orderDate = props.orderDate || new Date();
    order._description = props.description;
    order._address = props.address;
    order._orderItems = props.orderItems || [];
    order._isDraft = false;

    if (!props.orderDate) {
      order.addDomainEvent(
        new OrderStartedDomainEvent(
          order,
          props.cardProps.userId,
          props.cardProps.userName,
          props.cardProps.cardTypeId,
          props.cardProps.cardNumber,
          props.cardProps.cardSecurityNumber,
          props.cardProps.cardHolderName,
          props.cardProps.cardExpiration
        )
      );
    }

    return order;
  }

  public static newDraft(): Order {
    const order = new Order();
    order._isDraft = true;
    order._orderItems = [];

    return order;
  }

  private constructor(id?: number) {
    super(id);
  }

  get description(): string {
    return this._description;
  }

  get address(): Address {
    return this._address;
  }

  get orderItems(): OrderItem[] {
    return this._orderItems;
  }

  get orderDate(): Date {
    return this._orderDate;
  }

  get paymentMethodId(): number {
    return this._paymentMethodId;
  }

  get buyerId(): number {
    return this._buyerId;
  }

  get orderStatusId(): number {
    return this._orderStatusId;
  }

  public addOrderItem(props: OrderItemProps): void {
    const existingOrderItem = this._orderItems.find(
      (item) => props.id && item.id === props.id
    );

    if (existingOrderItem) {
      if (props.discount > existingOrderItem.discount) {
        existingOrderItem.setNewDiscount(props.discount);
      }

      existingOrderItem.addUnits(props.units);
    } else {
      const orderItem = OrderItem.create(props);
      this._orderItems.push(orderItem);
    }
  }

  public setPaymentId(id: number): void {
    this._paymentMethodId = id;
  }

  public setBuyerId(id: number): void {
    this._buyerId = id;
  }

  public setAwaitingValidationStatus(): void {
    if (this._orderStatusId === OrderStatus.SUBMITTED) {
      this._orderStatusId = OrderStatus.AWAITING_VALIDATION;
      this.addDomainEvent(
        new OrderStatusChangedToAwaitingValidationDomainEvent(
          this.id,
          this._orderItems
        )
      );
    }
  }

  public setStockConfirmedStatus(): void {
    if (this._orderStatusId === OrderStatus.AWAITING_VALIDATION) {
      this._orderStatusId = OrderStatus.STOCK_CONFIRMED;
      this._description = 'All the items were confirmed with available stock.';
      this.addDomainEvent(
        new OrderStatusChangedToStockConfirmedDomainEvent(this.id)
      );
    }
  }

  public setPaidStatus(): void {
    if (this._orderStatusId === OrderStatus.STOCK_CONFIRMED) {
      this._orderStatusId = OrderStatus.PAID;
      this._description =
        'The payment was performed at a simulated "American Bank checking bank account ending on XX35071"';
      this.addDomainEvent(
        new OrderStatusChangedToPaidDomainEvent(this.id, this._orderItems)
      );
    }
  }

  public setShippedStatus(): void {
    if (this._orderStatusId !== OrderStatus.PAID) {
      throw new OrderingDomainException(
        `Is not possible to change the order status from ${
          OrderStatus[this._orderStatusId]
        } to ${OrderStatus[OrderStatus.SHIPPED]}`
      );
    }

    this._orderStatusId = OrderStatus.SHIPPED;
    this._description = 'The order was shipped.';
    this.addDomainEvent(new OrderShippedDomainEvent(this));
  }

  public setCancelledStatus(): void {
    if (
      this._orderStatusId === OrderStatus.PAID ||
      this._orderStatusId === OrderStatus.SHIPPED
    ) {
      throw new OrderingDomainException(
        `Is not possible to change the order status from ${
          OrderStatus[this._orderStatusId]
        } to ${OrderStatus[OrderStatus.CANCELLED]}`
      );
    }

    this._orderStatusId = OrderStatus.CANCELLED;
    this._description = 'The order was cancelled.';
    this.addDomainEvent(new OrderCancelledDomainEvent(this));
  }

  public setCancelledStatusWhenStockIsRejected(
    orderStockRejectedItems: number[]
  ): void {
    if (this._orderStatusId === OrderStatus.AWAITING_VALIDATION) {
      this._orderStatusId = OrderStatus.CANCELLED;

      const itemsStockRejectedProductNames = this._orderItems
        .filter((item) => orderStockRejectedItems.includes(item.productId))
        .map((item) => item.productName);

      const itemsStockRejectedDescription =
        itemsStockRejectedProductNames.join(', ');

      this._description = `The product items don't have stock: (${itemsStockRejectedDescription})`;
    }
  }

  public getTotal(): number {
    return this._orderItems.reduce((acc, orderItem) => {
      acc += orderItem.units * orderItem.unitPrice;
      return acc;
    }, 0);
  }

  public toJSON() {
    return {
      id: this.id,
      description: this.description,
      address: this._address,
      orderItems: this.orderItems,
      orderDate: this.orderDate,
      paymentMethodId: this.paymentMethodId,
      buyerId: this.buyerId,
      orderStatusId: this.orderStatusId,
    };
  }
}
