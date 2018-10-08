import { h, Component } from 'preact';
import style from './style';


export class Stream extends Component {
  state = {
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // Note: `user` comes from the URL, courtesy of our router
  render(props, state, context) {
    console.log('QQQ: stream: ', props);
    // <h1>Stream: {JSON.stringify(props)} == {JSON.stringify(state)} == {JSON.stringify(context)}</h1>
    return (
      <div class={style.stream} comp="Stream" onClick={this.handleClick.bind(this)}>
        {props.posts.map(item => (
          <Post post={item}>
            <child1>child1</child1>
          </Post>
        ) )}
      </div>
    );
  }

  handleClick() {
    console.log('QQQ: stream clicked! ', this);
  }
}


export class Post extends Component {
  state = {
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // Note: `user` comes from the URL, courtesy of our router
  render(props, state, context) {
    console.log('QQQ: post: ', props);
    // onClick={this.handleClick.bind(this)}
    return (
      <div class={style.post} comp="Post" compk={'post/' + props.post.p}
          action="handleClick">
        Post is here: {props.post.p}
      </div>
    );
  }

  handleClick() {
    console.log('QQQ: post clicked! ', this.props.post.p);
  }
}
