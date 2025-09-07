import { SectionBlockManager } from "./SectionBlockManager";
import { SectionBlockMapperBuilder } from "./SectionBlockMapperBuilder";
import { OutputBlockData } from "@editorjs/editorjs";
import { TParagraphBlock } from "./section-block.type";
import { ListSection } from "./ListSection";
import { HeadlineSection } from "./HeadlineSection";

export const registerDefaultSectionBlocks = (sectionBlockManager: SectionBlockManager) => {
  // PARAGRAPH
  sectionBlockManager.register(
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
      .toEditorJs((block: TParagraphBlock, { serializeInlineBlocks }): OutputBlockData => {
        return {
          id: block.id,
          type: 'paragraph',
          data: {
            text: serializeInlineBlocks(block.data.children),
          },
        };
      })
      .build()
  );

  sectionBlockManager.register(ListSection);
  sectionBlockManager.register(HeadlineSection);
};
