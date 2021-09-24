import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import { size } from 'lodash';
import '@servicenow/now-card';
import '@servicenow/now-button';
import '../x-694957-search-results';

const view = (state, { updateState, updateProperties }) => {
	const { properties } = state;
	return (
		<div>
			<header>
				<now-icon icon="magnifying-glass-outline"></now-icon>
				<input value={properties.searchText} on-input={e => {
					updateProperties({
						searchText: e.target.value
					});
				}} />
			</header>
			<bp-search-results searchText={properties.searchText}></bp-search-results>
			<now-button
				label="Fire Event"
				variant="secondary"
				size="md"
				icon="fire-fill"
				configAria={{ "button": { "aria-label": "" } }}
				tooltipContent="Fire an event"
			></now-button>
		</div>
	);
};

createCustomElement('x-694957-zoran-testing', {
	renderer: { type: snabbdom },
	initialState: {
	},
	properties: {
		searchText: {
			default: 'email'
		}
	},
	actionHandlers: {
		'NOW_BUTTON#CLICKED': ({ dispatch }) => {
			console.log('firing EVENT_FIRED');
			dispatch('EVENT_FIRED', {
				'event-payload': "I cannot believe this worked!!!"
			});
		}
	},
	view,
	styles
});
