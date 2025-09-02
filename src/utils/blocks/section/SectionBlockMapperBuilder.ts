import { OutputBlockData } from "@editorjs/editorjs";
import { ISectionBlockMapper, TFromEditorJsContext, TToEditorJsContext } from "./ISectionBlockMapper";
import { TSectionBlock } from "./section-block.type";
import { TBaseBlock } from "../../block.type";

export class SectionBlockMapperBuilder<T extends TBaseBlock> {
  private fromEditorJsCb: ((data: OutputBlockData, ctx: TFromEditorJsContext) => TSectionBlock) | null = null;

  private toEditorJsCb: ((data: TSectionBlock, ctx: TToEditorJsContext) => OutputBlockData) | null = null;

  constructor(
    private readonly type: string,
    private readonly editorJsType: string = type,
  ) {
  }

  toEditorJs(cb: (data: TSectionBlock, ctx: TToEditorJsContext) => OutputBlockData): this {
    this.toEditorJsCb = cb;

    return this;
  }

  fromEditorJs(cb: (data: OutputBlockData, ctx: TFromEditorJsContext) => TSectionBlock): this {
    this.fromEditorJsCb = cb;

    return this;
  }

  private buildClass() {
    const { toEditorJsCb, fromEditorJsCb, type, editorJsType } = this;

    if (!toEditorJsCb) {
      throw new Error('toEditorJsCb is not defined');
    }

    if (!fromEditorJsCb) {
      throw new Error('fromEditorJsCb is not defined');
    }

    if (!type) {
      throw new Error('type is not defined');
    }

    if (!editorJsType) {
      throw new Error('editorJsType is not defined');
    }

    return class SectionBlockMapperImpl implements ISectionBlockMapper<T> {
      type = type;

      editorJsType = editorJsType;

      toEditorJs(section: TSectionBlock, ctx: TToEditorJsContext): OutputBlockData {
        return toEditorJsCb(section, ctx);
      }

      fromEditorJs(data: OutputBlockData, ctx: TFromEditorJsContext) {
        return fromEditorJsCb(data, ctx);
      }
    }
  }

  build() {
    const InlineBlockImpl = this.buildClass();

    return new InlineBlockImpl();
  }
}
