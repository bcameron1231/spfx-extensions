import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import {
  IPersonaProps,
  Persona,
  PersonaSize,
  PersonaPresence
} from 'office-ui-fabric-react';

import styles from './PersonField.module.scss';



export interface IPersonFieldProps {
  imageUrl: string
  imageInitials: string,
  primaryText: string,
  secondaryText: string,
  tertiaryText: string,
  optionalText: string
}

const LOG_SOURCE: string = 'PersonField';


export default class PersonField extends React.Component<IPersonFieldProps, {}> {
  constructor(props:IPersonFieldProps){
    super(props);
  }

  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: PersonField mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: PersonField unmounted');
  }

  @override
  public render(): React.ReactElement<IPersonFieldProps> {
    let persona = {
      imageUrl: this.props.imageUrl,
      imageInitials: this.props.imageInitials,
      primaryText: this.props.primaryText,
      secondaryText: this.props.secondaryText,
      tertiaryText: this.props.tertiaryText,
      optionalText: this.props.optionalText
    };
    debugger;
    return (
      <div id="thisid" className={styles.cell}>
         <Persona
          { ...persona }
          size={ PersonaSize.small }
          presence={ PersonaPresence.none }
          hidePersonaDetails={ false }
        />
      </div>
    );
  }
}
