import type { TBaseBlock } from "../../block.type";
import type { OutputBlockData } from "@editorjs/editorjs";
import { TInlineBlock } from "../../html.type";

export type TToEditorJsContext = {
  serializeInlineBlocks: (blocks: Array<TInlineBlock>) => string;
};

export type TFromEditorJsContext = {
  parseInlineBlocks: (html: string) => Array<TInlineBlock>;
};

export interface ISectionBlockMapper<T extends TBaseBlock> {
  editorJsType: string;

  type: string;

  fromEditorJs(data: OutputBlockData, ctx: TFromEditorJsContext): T;

  toEditorJs(section: T, ctx: TToEditorJsContext): OutputBlockData;
}
