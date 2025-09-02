import { SectionBlockManager } from "./SectionBlockManager";
import { SectionBlockMapperBuilder } from "./SectionBlockMapperBuilder";
import { OutputBlockData } from "@editorjs/editorjs";
import { TParagraphBlock } from "./section-block.type";

export const SECTION_BLOCK_MANAGER = new SectionBlockManager([
  new SectionBlockMapperBuilder<TParagraphBlock>('paragraph')
    .fromEditorJs((block, { parseInlineBlocks }) => {
      const parsedHTML = parseInlineBlocks(block.data.text);

      return {
        id: block.id ?? '',
        type: 'paragraph',
        data: {
          children: parsedHTML,
        },
      };
    })
    .toEditorJs((block, { serializeInlineBlocks }): OutputBlockData => {
      console.log(block.data);

      return {
        id: block.id,
        type: 'paragraph',
        data: {
          text: serializeInlineBlocks(block.data.children),
        },
      };
    })
    .build(),
]);
