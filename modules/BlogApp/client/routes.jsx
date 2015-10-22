//import { Route, IndexRoute } from 'react-router';

import BlogApp from './BlogApp';
import BlogList from './components/bloglist/BlogList';
import BlogPost from './components/blogpost/BlogPost';
import SideBar from './components/blogutils/SideBar/SideBar.jsx';

/*
export default (
  <Route path="/" component={BlogApp}>
    <IndexRoute component={BlogMain} />
    <Route path="archive" component={BlogMain} />
    <Route path="post/:id" component={BlogMain} />
  </Route>
);
*/
FlowRouter.route('/', {
  action() {
    ReactLayout.render(BlogApp, {
      content: <BlogList />,
      aside: <SideBar isPost={false} />
    });
  }
});
FlowRouter.route('/archive', {
  action() {
    ReactLayout.render(BlogApp, {
      content: <BlogList />,
      aside: <SideBar isPost={false} />
    });
  }
});
FlowRouter.route('/post/:slug', {
  action(params, queryParams) {
    ReactLayout.render(BlogApp, {
      content: <BlogPost params={params} />,
      aside: <SideBar isPost={true} />
    });
  }
});

