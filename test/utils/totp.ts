import * as base32 from "thirty-two";
import * as notp from "notp";

export class TOTPGenerator {
  private static secret: string = process.env.TOTP_KEY || "";

  public static generateCode(): string {
    if (!this.secret) {
      throw new Error("TOTP_KEY environment variable is not set");
    }

    try {
      const decodedSecret = base32.decode(this.secret);
      const token = notp.totp.gen(decodedSecret, { time: 30 });
      return token;
    } catch (error) {
      throw new Error(`Failed to generate TOTP code: ${error}`);
    }
  }

  public static isValidSecret(): boolean {
    return !!this.secret && this.secret.length > 0;
  }
}
