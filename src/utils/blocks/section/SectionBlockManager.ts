import { ISectionBlockMapper } from "./ISectionBlockMapper";

export class SectionBlockManager {
  private readonly blocks: Array<ISectionBlockMapper<any>> = [];

  constructor(
    blocks: Array<ISectionBlockMapper<any>> = [],
  ) {
    this.register = this.register.bind(this);

    blocks.forEach(this.register);
  }

  public register(block: ISectionBlockMapper<any>): void {
    this.blocks.push(block);
  }

  getByEditorJsType(type: string) {
    return this.blocks.find(block => block.editorJsType === type) ?? null;
  }

  getByType(type: string) {
    return this.blocks.find(block => block.type === type) ?? null;
  }
}
