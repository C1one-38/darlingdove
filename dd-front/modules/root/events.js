import Router from 'next/router';
import Actions from './actions';
import isServer from '../shared/utils/isServer';
import * as gtag from '../shared/utils/gtag';

const bindEvents = store => {
  // no need to listen on the server
  // can lead to memory leaks
  if (isServer) return;

  Router.events.on('routeChangeStart', () => {
    store.dispatch(Actions.Creators.setIsLoading(true));
  });
  Router.events.on('routeChangeComplete', () => {
    store.dispatch(Actions.Creators.setIsLoading(false));
    Router.events.on('routeChangeComplete', url => gtag.pageview(url));
  });
  Router.events.on('routeChangeError', () => {
    store.dispatch(Actions.Creators.setIsLoading(false));
  });
};

export default bindEvents;
