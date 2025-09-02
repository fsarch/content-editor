import { SectionBlockMapperBuilder } from "./SectionBlockMapperBuilder";
import { TListBlock, TListBlockChildren } from "./section-block.type";

type TEditorJsListItem = {
  content: string;
  items?: Array<TEditorJsListItem>;
}

export const ListSection = new SectionBlockMapperBuilder<TListBlock>('list')
  .fromEditorJs((block, { parseInlineBlocks }) => {
    const id = block.id ?? '';
    const listStyle = block.data.style === 'ordered' ? 'ordered' : 'unordered';

    const convertItems = (items: Array<TEditorJsListItem>, parentId: string) => {
      return items.map((item, index): TListBlockChildren => {
        if (!item.items?.length) {
          return {
            content: parseInlineBlocks(item.content),
          };
        }

        const id = `${parentId}_${index}`;

        return {
          content: parseInlineBlocks(item.content),
          childList: {
            id,
            type: 'list',
            data: {
              style: listStyle,
              children: convertItems(item.items, id),
            },
          },
        };
      });
    };

    return {
      id,
      type: 'list',
      data: {
        style: listStyle,
        children: convertItems(block.data.items, id),
      },
    };
  })
  .toEditorJs((block, { serializeInlineBlocks }) => {
    const convertItems = (items: Array<TListBlockChildren>): Array<TEditorJsListItem> => {
      return items.map(item => {
        return {
          content: serializeInlineBlocks(item.content),
          items: convertItems(item.childList?.data.children || []),
        };
      });
    }

    return {
      id: block.id,
      type: 'list',
      data: {
        style: block.data.style === 'ordered' ? 'ordered' : 'unordered',
        items: convertItems(block.data.children),
      },
    }
  })
  .build();
