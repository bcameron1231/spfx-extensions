import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  IListViewCommandSetRefreshEventParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';

import { SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';
import { IQuotation } from './components/IQuotation';
import { IGetQuotesResponse } from './components/SPResponse';

import * as strings from 'alertStrings';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAlertCommandSetProperties {
  // This is an example; replace with your own property
  disabledCommandIds: string[];
}

const LOG_SOURCE: string = 'AlertCommandSet';

export default class AlertCommandSet
  extends BaseListViewCommandSet<IAlertCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized AlertCommandSet');
    this.getRequest('Orders');
    return Promise.resolve<void>();
  }

  @override
  public onRefreshCommand(event: IListViewCommandSetRefreshEventParameters): void {
    event.visible = true; // assume true by default

    if (this.properties.disabledCommandIds) {
      if (this.properties.disabledCommandIds.indexOf(event.commandId) >= 0) {
        Log.info(LOG_SOURCE, 'Hiding command ' + event.commandId);
        event.visible = false;
      }
    }
  }

   public getRequest(listName: string): Promise<IQuotation[]> {

        var url = this.context.pageContext.web.absoluteUrl + "/_api/lists/GetByTitle('" + listName + "')/items(1)?$Select=Title";

        return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1,{
          headers: {
        'Accept': 'application/json;odata=verbose',
        'odata-version': ''
      }
        })
            .then ((response: SPHttpClientResponse) => {
                debugger;
                return response.json();
            })
            .then ((responseJSON: IGetQuotesResponse) => {
                debugger;
                var result: IQuotation[] = [];

                var responseItems = responseJSON.value;
                for (let q of responseItems) {
                    result.push ({
                        Title: q.Title,
                        Author: q.Author0
                    });
                }

                return result;
            })
            .catch ((response: SPHttpClientResponse) => {
                // For now, any error does the same thing
                return [];
            });
    }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.commandId) {
      case 'COMMAND_1':
        alert(`Clicked ${strings.Command1}`);
        break;
      case 'COMMAND_2':
        alert(`Clicked ${strings.Command2}`);
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
