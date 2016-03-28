import {ModelDecoratorConfigs, PropertyDecoratorConfigs} from "./interfaces";
import {PropertyTypes, OneToManyRelationship, OneToOneRelationship} from "./types";

/**
 * Model is a class decorator
 *
 * @constructor
 */
export function Model (config: ModelDecoratorConfigs) {
  console.log(`Picking up model registration information`);


  return modelDecorator.bind(null, config);
}

export function HasOne (config: PropertyDecoratorConfigs) {
  return relationshipDecorator.bind(null, config);
}

function modelDecorator (config: ModelDecoratorConfigs, target: Function) {
  target['_model'] = config.model;

  return target;
}

function relationshipDecorator (config: PropertyDecoratorConfigs, target: Object, propertyKey: string) {
  // NOTE: To access the following dynamically defined properties
  // One must access the prototype.
  // For example:
  // >  User.prototype['_hasMany']
  console.log(`Picking up relationship registration information`, target, propertyKey);
  debugger;
  let modelType = target[propertyKey].constructor;

  switch (config.type) {
    case PropertyTypes.Value: break;
    case PropertyTypes.HasMany:
      target['_hasMany'] = target['_hasMany'] || {};
      target['_hasMany'][propertyKey] = new OneToManyRelationship(propertyKey, modelType);
      break;
    case PropertyTypes.HasOne:
      target['_hasOne'] = target['_hasOne'] || {};
      target['_hasOne'][propertyKey] = new OneToOneRelationship(propertyKey, modelType);
      break;
  }
}