import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  CellFormatter,
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'personFieldStrings';
import PersonField, { IPersonFieldProps } from './components/PersonField';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IPersonFieldProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'PersonFieldFieldCustomizer';

export default class PersonFieldFieldCustomizer
  extends BaseFieldCustomizer<IPersonFieldProperties> {

  @override
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated PersonFieldFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "PersonField" and "${strings.Title}"`);
    return Promise.resolve<void>();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.  The CellFormatter is a utility
    // that you can use to convert the cellValue to a text string.
    const text: string = '[' + CellFormatter.renderAsText(this.context.column, event.cellValue) + ']';
    debugger;

    var initials = event.cellValue[0].title.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

    const personField: React.ReactElement<{}> =
      React.createElement(PersonField, {imageUrl:event.cellValue[0].picture,imageInitials: initials, primaryText:event.cellValue[0].title,secondaryText:event.cellValue[0].jobTitle,tertiaryText: 'In a meeting',optionalText: 'Available at 4:00pm' } as IPersonFieldProps);

    ReactDOM.render(personField, event.cellDiv);
  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.cellDiv);
    super.onDisposeCell(event);
  }
}
