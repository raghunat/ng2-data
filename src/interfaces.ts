import {AbstractModel, PropertyTypes} from "./types";

export interface ModelDecoratorConfigs {
  model: string
}

export interface PropertyDecoratorConfigs {
  type: PropertyTypes; // HAS_ONE | HAS_MANY | VALUE
}

export interface IActivator<T extends AbstractModel> {
  new (...args: any[]);
}