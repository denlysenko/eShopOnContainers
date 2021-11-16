import { ValueObject } from '../../ValueObject';

interface AddressProps {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export class Address extends ValueObject {
  private _street: string;
  private _city: string;
  private _state: string;
  private _country: string;
  private _zipCode: string;

  public static create(props: AddressProps): Address {
    // validation of incoming params could be added here
    return new Address(props);
  }

  private constructor(props: AddressProps) {
    super();
    this._street = props.street;
    this._city = props.city;
    this._state = props.state;
    this._country = props.country;
    this._zipCode = props.zipCode;
  }

  get street(): string {
    return this._street;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get country(): string {
    return this._country;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  public getEqualityComponents(): Record<string, unknown> {
    return {
      street: this._street,
      city: this._city,
      state: this._state,
      country: this._country,
      zipCode: this._zipCode,
    };
  }
}
