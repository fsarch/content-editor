import { TBaseBlock } from "../../../block.type";
import { SectionBlockMapperBuilder } from "../SectionBlockMapperBuilder";
import { ICustomSectionBlock } from "./ICustomSectionBlock";
import { ISectionBlockMapper } from "../ISectionBlockMapper";

export class CustomSectionBlockBuilder<T extends TBaseBlock> {
  private mapper?: ISectionBlockMapper<T>;

  constructor(private readonly options: { type: string, editorJsType?: string, }) {
  }

  setMapper(cb: (mapper: SectionBlockMapperBuilder<T>)=> ISectionBlockMapper<T>): this {
    this.mapper = cb(new SectionBlockMapperBuilder<T>(this.options.type, this.options.editorJsType ?? this.options.type));

    return this;
  }

  

  buildClass() {
    return class CustomSectionBlockImpl {
      static get toolbox() {
        return {
          title: 'Image',
          icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        };
      }

      render() {
        const div = document.createElement('div');

        div.innerHTML = '<h1>Test</h1>';

        return div;
      }

      save(blockContent: unknown) {
        return {
          value: 'test',
        };
      }
    };
  }

  build(): ICustomSectionBlock<T> {
    const { mapper } = this;

    if (!mapper) {
      throw new Error('Mapper is not defined');
    }

    const CustomSection = this.buildClass();

    return {
      class: CustomSection,
      mapper,
    };
  }
}
