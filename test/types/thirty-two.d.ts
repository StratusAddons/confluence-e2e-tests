declare module 'thirty-two' {
  export function decode(input: string): Buffer;
  export function encode(input: Buffer): string;
}