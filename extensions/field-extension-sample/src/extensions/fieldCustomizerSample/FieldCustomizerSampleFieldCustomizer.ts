import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  CellFormatter,
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'fieldCustomizerSampleStrings';
import FieldCustomizerSample, { IFieldCustomizerSampleProps } from './components/FieldCustomizerSample';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFieldCustomizerSampleProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'FieldCustomizerSampleFieldCustomizer';

export default class FieldCustomizerSampleFieldCustomizer
  extends BaseFieldCustomizer<IFieldCustomizerSampleProperties> {

  @override
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated FieldCustomizerSampleFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "FieldCustomizerSample" and "${strings.Title}"`);
    return Promise.resolve<void>();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    debugger;
    if(this.context.field.internalName === 'Percent'){
      if(parseInt(event.cellValue) < 50){
         event.cellDiv.setAttribute('style','background-color:red;color:white;text-align:center;' );
      }
      else{
        event.cellDiv.setAttribute('style','background-color:green;color:white;text-align:center;' );
      }     
    }

    // Use this method to perform your custom cell rendering.  The CellFormatter is a utility
    // that you can use to convert the cellValue to a text string.
    const text: string = '[' + CellFormatter.renderAsText(this.context.column, event.cellValue) + ']';

    const fieldCustomizerSample: React.ReactElement<{}> =
      React.createElement(FieldCustomizerSample, { text } as IFieldCustomizerSampleProps);

    ReactDOM.render(fieldCustomizerSample, event.cellDiv);
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