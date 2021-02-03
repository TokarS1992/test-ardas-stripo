export namespace NInMemoryData {
  export interface ITemplate {
    id: number;
    name: string;
    template: string;
    modified: number | string | Date;
  }

  export type TKeyTemplate = keyof ITemplate;
}
