import { ISectionBlockMapper } from "./ISectionBlockMapper";
import { ICustomSectionBlock } from "./custom/ICustomSectionBlock";

export class SectionBlockManager {
  private readonly blockMappers: Array<ISectionBlockMapper<any>> = [];
  private readonly blocks: Array<ICustomSectionBlock<any>> = [];

  constructor(
    blocks: Array<ICustomSectionBlock<any>> = [],
    blockMappers: Array<ISectionBlockMapper<any>> = [],
  ) {
    this.register = this.register.bind(this);
    this.registerBlockMapper = this.registerBlockMapper.bind(this);

    blockMappers.forEach(this.registerBlockMapper);
  }

  public registerBlockMapper(block: ISectionBlockMapper<any>): void {
    this.blockMappers.push(block);
  }

  public register(block: ICustomSectionBlock<any>): void {
    this.blocks.push(block);
    this.blockMappers.push(block.mapper);
  }

  getMapperByEditorJsType(type: string) {
    return this.blockMappers.find(block => block.editorJsType === type) ?? null;
  }

  getMapperByType(type: string) {
    return this.blockMappers.find(block => block.type === type) ?? null;
  }

  getAllBlocks() {
    return Object.fromEntries(this.blocks.map((b) => [b.mapper.editorJsType, b]));
  }
}
