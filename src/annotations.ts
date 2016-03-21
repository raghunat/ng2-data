
import {ModelDecoratorConfigs} from "./interfaces";
/**
 * Model is a class decorator
 * 
 * @constructor
 */
export function Model (config: ModelDecoratorConfigs) {
  console.log(`Picking up model registration information`);

  return modelDecorator.bind(null, config);
}

function modelDecorator (config: ModelDecoratorConfigs, target: Function) {
  target['_model'] = config.model;

  return target;
}