import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import '@servicenow/now-card';
import '../x-694957-search-results';

const view = (state, { updateState }) => {

	return (
		<div>
			<header>
				<now-icon icon="magnifying-glass-outline"></now-icon>
				<input value={state.searchText} on-input={e => {
					updateState({
						searchText: e.target.value
					});
				}} />
			</header>
			<bp-search-results searchText={state.searchText}></bp-search-results>
		</div>
	);
};


createCustomElement('x-694957-zoran-testing', {
	renderer: { type: snabbdom },
	initialState: {
		searchText: 'email'
	},
	view,
	styles
});
