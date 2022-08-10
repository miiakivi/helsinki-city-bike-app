import React from 'react';
import ReactDOM from 'react-dom/client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

const client = new ApolloClient( {
	uri : 'http://localhost:4000/',
	cache : new InMemoryCache(),
	connectToDevTools: true,
} );

const root = ReactDOM.createRoot( document.getElementById( 'root' ) );

root.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);