import { Post as PostResponse } from '../../clients/shitaraba-client';
import { generatePostId } from '../../utils';
import { Action } from '../actions';

export type Posts = Post[];

export interface Post extends PostResponse {
  type: 'shitaraba';
  ID: string;
  thread: string;
}

export default function posts(state: Post[] = [], action: Action): typeof state {
  switch (action.type) {
    case 'THREAD_FETCH_SUCCESS':
    case 'THREAD_UPDATE_SUCCESS': {
      if (action.thread.posts.length === 0) {
        return state;
      }

      const newPosts = action.thread.posts.map((post): Post => ({
        ...post,
        type: 'shitaraba',
        ID: generatePostId(action.url, post.number),
        thread: action.url,
      }));
      return state.concat(newPosts);
    }

    default:
      return state;
  }
}
