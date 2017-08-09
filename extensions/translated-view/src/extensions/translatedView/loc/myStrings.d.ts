declare interface ITranslatedViewStrings {
  Title: string;
}

declare module 'translatedViewStrings' {
  const strings: ITranslatedViewStrings;
  export = strings;
}
