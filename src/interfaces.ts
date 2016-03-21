import {AbstractModel} from "./types";

export interface ModelDecoratorConfigs {
  model: string
}

export interface IActivator<T extends AbstractModel> {
  new (...args: any[]): T;
}