import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  CellFormatter,
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';
import { HttpClient, HttpClientResponse } from "@microsoft/sp-http";
import {IAuthToken} from './IAuthToken';
import {ITranslationTokenResponse} from './TranslatorResponse';
import * as strings from 'translatedViewStrings';
import styles from './TranslatedView.module.scss';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITranslatedViewProperties {
  // This is an example; replace with your own property
  language?: string;
}

const LOG_SOURCE: string = 'TranslatedViewFieldCustomizer';
let globalAuthToken: string = '';

export default class TranslatedViewFieldCustomizer
  extends BaseFieldCustomizer<ITranslatedViewProperties> {
  constructor(){
    super();
    
  }

  @override
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated TranslatedViewFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "TranslatedView" and "${strings.Title}"`);
    return this.getAccessToken().then((authToken:IAuthToken) => {
      globalAuthToken = authToken.token;      
          return Promise.resolve<void>();
      });

  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.  The CellFormatter is a utility
    // that you can use to convert the cellValue to a text string.
    this.get(this.properties.language, event.cellValue).then((translatedString)=>{
      const text: string = CellFormatter.renderAsText(this.context.column, translatedString);

      translatedString != null ? event.cellDiv.innerText = text : event.cellDiv.innerText = event.cellValue;
    })
  }
    getAccessToken():  Promise<IAuthToken>{

      var url = 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken?Subscription-Key=<YOUR_KEY>';
       return this.context.httpClient.post(url, HttpClient.configurations.v1,{})
        .then((response: HttpClientResponse) =>{
          if (response.ok) {
            return response.text()
          }
        }).then((authToken:any) => {
             var result: IAuthToken = {token:authToken};
             //result.token = authToken.body
             return result;
        }).catch ((response: HttpClientResponse) => {
                // For now, any error does the same thing
                return null;
            });

    }
    get(language: string, stringToTranslate:string): Promise<string>{
        var url = "https://api.microsofttranslator.com/V2/Http.svc/Translate" +
                "?AppId=Bearer" + " " + globalAuthToken +
                "&from=" + encodeURIComponent("en") +
                "&to=" + encodeURIComponent(language) +
                "&text=" + encodeURIComponent(stringToTranslate) +
                "&Authorization=Bearer" + " " + globalAuthToken;
       return this.context.httpClient.get(url,
        HttpClient.configurations.v1,{})
        .then((response: HttpClientResponse): Promise<string> => {
          if (response.ok) {
            return response.text()
          } else {
            return Promise.resolve(null);
          }
        })
        .then((translation: string): string => {
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(translation,"text/xml");
          let newString = xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue;
          return newString;
        }).catch ((response: HttpClientResponse) => {
                // For now, any error does the same thing
                return null;
        });
    }


  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    super.onDisposeCell(event);
  }
}
