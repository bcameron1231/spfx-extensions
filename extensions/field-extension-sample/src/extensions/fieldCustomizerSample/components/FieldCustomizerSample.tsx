import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './FieldCustomizerSample.module.scss';

export interface IFieldCustomizerSampleProps {
  text: string;
}

const LOG_SOURCE: string = 'FieldCustomizerSample';

export default class FieldCustomizerSample extends React.Component<IFieldCustomizerSampleProps, {}> {
  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FieldCustomizerSample mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FieldCustomizerSample unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.cell}>
        { this.props.text }
      </div>
    );
  }
}
