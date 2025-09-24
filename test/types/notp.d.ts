declare module 'notp' {
  export namespace totp {
    interface TOTPOptions {
      time?: number;
      window?: number;
    }
    
    function gen(secret: Buffer, options?: TOTPOptions): string;
    function verify(token: string, secret: Buffer, options?: TOTPOptions): boolean;
  }
}