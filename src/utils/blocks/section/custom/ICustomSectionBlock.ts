import { ISectionBlockMapper } from "../ISectionBlockMapper";
import { TBaseBlock } from "../../../block.type";

export interface ICustomSectionBlock<T extends TBaseBlock> {
  mapper: ISectionBlockMapper<T>;

  class: unknown;
}
