export abstract class ValueObject {
  public abstract getEqualityComponents(): Record<string, unknown>;

  public equals(vo?: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    return (
      JSON.stringify(this.getEqualityComponents()) ===
      JSON.stringify(vo.getEqualityComponents())
    );
  }
}
