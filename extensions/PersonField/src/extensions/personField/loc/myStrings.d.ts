declare interface IPersonFieldStrings {
  Title: string;
}

declare module 'personFieldStrings' {
  const strings: IPersonFieldStrings;
  export = strings;
}
