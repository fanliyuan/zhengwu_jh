import React, { PureComponent } from 'react';
import Result from '@/components/Result';
import styles from './AddDataSource.less';

class AddSuccess extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: 10,
    };
  }

  componentDidMount() {
    const { history } = this.props;
    let { time } = this.state;
    this.timer = setInterval(() => {
      if (time >= 1) {
        time -= 1;
        this.setState({
          time,
        });
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
    this.timerOut = setTimeout(history.goBack, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(this.timerOut);
  }

  back() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const { pageName, title } = this.props;
    const { time } = this.state;
    const description = (
      <span>
        页面将在 {time}秒 之后跳转到
        {pageName}
        页面，
        <a onClick={() => this.back()}>立即跳转</a>
      </span>
    );
    return (
      <Result type="success" title={title} description={description} className={styles.result} />
    );
  }
}

export default AddSuccess;
