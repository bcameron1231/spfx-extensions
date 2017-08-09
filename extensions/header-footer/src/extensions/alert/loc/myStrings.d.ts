declare interface IAlertStrings {
  Command1: string;
  Command2: string;
}

declare module 'alertStrings' {
  const strings: IAlertStrings;
  export = strings;
}
