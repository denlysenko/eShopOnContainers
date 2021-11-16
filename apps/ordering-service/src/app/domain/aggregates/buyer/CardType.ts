export class CardType {
  public static Amex() {
    return new CardType(1, 'Amex');
  }

  public static Visa() {
    return new CardType(2, 'Visa');
  }

  public static MasterCard() {
    return new CardType(3, 'MasterCard');
  }

  constructor(public id: number, public name: string) {}
}
