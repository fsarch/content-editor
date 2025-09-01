import { htmlUtils } from './html.utils';
import { TInlineBlock } from "./html.type";
import { nanoid } from 'nanoid';

function stripIds(blocks: any): any {
  if (Array.isArray(blocks)) {
    return blocks.map(stripIds);
  }
  if (blocks && typeof blocks === 'object') {
    const { id, ...rest } = blocks;
    if (rest.data && rest.data.children) {
      return { ...rest, data: { ...rest.data, children: stripIds(rest.data.children) } };
    }
    if (rest.data && rest.data.items) {
      return { ...rest, data: { ...rest.data, items: stripIds(rest.data.items) } };
    }
    return rest;
  }
  return blocks;
}

describe('parseHTMLToBlocks', () => {
  it('should parse a simple paragraph', () => {
    const html = '<p>Hello <b>World</b>!</p>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(stripIds(blocks)).toEqual([
      {
        type: 'paragraph',
        data: {
          children: [
            { type: 'text', data: { value: 'Hello ' } },
            {
              type: 'bold',
              data: {
                children: [
                  { type: 'text', data: { value: 'World' } }
                ]
              }
            },
            { type: 'text', data: { value: '!' } }
          ]
        }
      }
    ]);
  });

  it('should parse headers', () => {
    const html = '<h2>Title</h2>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'header',
        data: { text: 'Title', level: 2 }
      }
    ]);
  });

  it('should parse unordered lists', () => {
    const html = '<ul><li>One</li><li>Two</li></ul>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'list',
        data: { style: 'unordered', items: ['One', 'Two'] }
      }
    ]);
  });

  it('should parse ordered lists', () => {
    const html = '<ol><li>First</li><li>Second</li></ol>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'list',
        data: { style: 'ordered', items: ['First', 'Second'] }
      }
    ]);
  });

  it('should parse blockquotes', () => {
    const html = '<blockquote>Quote</blockquote>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'quote',
        data: { text: 'Quote', caption: '' }
      }
    ]);
  });

  it('should parse images', () => {
    const html = '<img src="/img.png" alt="desc" />';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'image',
        data: {
          file: { url: '/img.png' },
          caption: 'desc',
          withBorder: false,
          stretched: false,
          withBackground: false
        }
      }
    ]);
  });

  it('should ignore unknown tags', () => {
    const html = '<foo>bar</foo>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([]);
  });

  it('should handle multiple blocks', () => {
    const html = '<h1>Headline</h1><p>Text</p>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'header',
        data: { text: 'Headline', level: 1 }
      },
      {
        type: 'paragraph',
        data: { text: 'Text' }
      }
    ]);
  });

  it('should parse <br> as newline block', () => {
    const html = '<p>foo<br>bar</p>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'paragraph',
        data: {
          children: [
            { type: 'text', data: { value: 'foo' } },
            { type: 'newline' },
            { type: 'text', data: { value: 'bar' } }
          ]
        }
      }
    ]);
  });

  it('should parse <i> as italic block', () => {
    const html = '<p>Hello <i>World</i>!</p>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'paragraph',
        data: {
          children: [
            { type: 'text', data: { value: 'Hello ' } },
            {
              type: 'italic',
              data: {
                children: [
                  { type: 'text', data: { value: 'World' } }
                ]
              }
            },
            { type: 'text', data: { value: '!' } }
          ]
        }
      }
    ]);
  });

  it('should parse <a> as anchor block', () => {
    const html = '<p>Go to <a href="https://example.com">Example</a>!</p>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks).toEqual([
      {
        type: 'paragraph',
        data: {
          children: [
            { type: 'text', data: { value: 'Go to ' } },
            {
              type: 'anchor',
              data: {
                href: 'https://example.com',
                children: [
                  { type: 'text', data: { value: 'Example' } }
                ]
              }
            },
            { type: 'text', data: { value: '!' } }
          ]
        }
      }
    ]);
  });

  it('should parse data-block-id from html', () => {
    const html = '<p data-block-id="abc123">Test</p>';
    const blocks = htmlUtils.parseHTMLToBlocks(html);
    expect(blocks[0].id).toBe('abc123');
  });
});

describe('blocksToHTML', () => {
  it('should convert a simple paragraph with bold and text', () => {
    const blocks: Array<TInlineBlock> = [
      {
        id: '00000',
        type: 'paragraph',
        data: {
          children: [
            { id: '', type: 'text', data: { value: 'Hello ' } },
            {
              id: '00001',
              type: 'bold',
              data: {
                children: [
                  { id: '', type: 'text', data: { value: 'World' } }
                ]
              }
            },
            { id: '', type: 'text', data: { value: '!' } }
          ]
        }
      }
    ];
    expect(htmlUtils.blocksToHTML(blocks)).toBe('<p>Hello <b>World</b>!</p>');
  });

  it('should convert a paragraph with a newline', () => {
    const blocks: Array<TInlineBlock> = [
      {
        id: '00000',
        type: 'paragraph',
        data: {
          children: [
            { id: '', type: 'text', data: { value: 'foo' } },
            { id: '', type: 'newline' },
            { id: '', type: 'text', data: { value: 'bar' } }
          ]
        }
      }
    ];
    expect(htmlUtils.blocksToHTML(blocks)).toBe('<p>foo<br>bar</p>');
  });

  it('should convert italic block to <i>', () => {
    const blocks: Array<TInlineBlock> = [
      {
        id: '00000',
        type: 'paragraph',
        data: {
          children: [
            { id: '', type: 'text', data: { value: 'foo' } },
            {
              id: '00001',
              type: 'italic',
              data: {
                children: [
                  { id: '', type: 'text', data: { value: 'bar' } }
                ]
              }
            }
          ]
        }
      }
    ];
    expect(htmlUtils.blocksToHTML(blocks)).toBe('<p>foo<i>bar</i></p>');
  });

  it('should convert anchor block to <a>', () => {
    const blocks: Array<TInlineBlock> = [
      {
        id: '00000',
        type: 'paragraph',
        data: {
          children: [
            { id: '', type: 'text', data: { value: 'foo ' } },
            {
              id: '00001',
              type: 'anchor',
              data: {
                href: 'https://example.com',
                children: [
                  { id: '', type: 'text', data: { value: 'bar' } }
                ]
              }
            }
          ]
        }
      }
    ];
    expect(htmlUtils.blocksToHTML(blocks)).toBe('<p>foo <a href="https://example.com">bar</a></p>');
  });

  it('should serialize id as data-block-id', () => {
    const blocks: Array<TInlineBlock> = [
      {
        id: 'testid',
        type: 'paragraph',
        data: {
          children: [
            { id: '', type: 'text', data: { value: 'foo' } }
          ]
        }
      }
    ];
    expect(htmlUtils.blocksToHTML(blocks)).toContain('data-block-id="testid"');
    expect(htmlUtils.blocksToHTML(blocks)).toContain('data-block-id="childid"');
  });
});
