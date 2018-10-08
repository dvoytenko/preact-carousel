import { h, Component, render } from 'preact';
import style from './style';
import {Post, Stream} from '../../components/stream';

export default class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10,
		posts: [{p: 1}, {p: 2}, {p: 3}, {p: 4}, ],
	};

	componentDidMount() {
		console.log('QQQ: componentDidMount: ', this.state);
		const streamEl = document.getElementById('stream_element');
		const stream = new Stream();
		const buffer = document.createElement('div');
		// Emulate server-side rendering.
		// render(stream.render({posts: this.state.posts}, {}), streamEl);
		render(stream.render({posts: this.state.posts}, {}), buffer);
		streamEl.innerHTML = buffer.innerHTML;

		streamEl.addEventListener('click', e => {
			const {target} = e;
			const actionEl = target.closest('[action]');
			if (!actionEl) {
				return;
			}
			const compEl = actionEl.hasAttribute('comp') ?
					actionEl : actionEl.closest('[comp]');
			if (!compEl._component) {
				const comp = compEl.getAttribute('comp');
				const compk = actionEl.getAttribute('compk');
				console.log('QQQ: restore component: ', compEl, comp, compk);
				const postId = parseInt(compk.match('post/(.*)')[1], 10);
				const res = render(h(Post, {post: {p: postId}}), compEl.parentElement, compEl);
			}
			const action = actionEl.getAttribute('action');
			const handler = compEl._component[action];
			handler.call(compEl._component, []);
		});
	}

	componentWillUnmount() {
	}

	// Note: `user` comes from the URL, courtesy of our router
	render(props, state, context) {
				// <h1>List of things: {JSON.stringify(props)} == {JSON.stringify(state)} == {JSON.stringify(context)}</h1>
					//<Stream posts={state.posts}/>
		return (
			<div style="padding-top: 40px;">
				<h1>List of things</h1>
				<div id="stream_element">
				</div>
			</div>
		);
	}
}
