import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import { debounce, size, update } from 'lodash';
import styles from './styles.scss';
import '@servicenow/now-icon';
import '@servicenow/now-button';
import '@servicenow/now-card';
import '@servicenow/now-modal';
import '@servicenow/now-loader';
import '@servicenow/now-rich-text';
import '@servicenow/now-button';
import { createHttpEffect } from '@servicenow/ui-effect-http';

const requestSearchResults = ({ properties, dispatch }) => {
	if (properties.searchText) {
		dispatch('SEARCH_RESULTS_REQUESTED', {
			table: properties.table,
			sysparm_query: `${properties.field}LIKE${properties.searchText}`
		});
	}
};

const view = (state, { updateState }) => {
	return (
		<div>
			<p>Table: {state.properties.table}, field: {state.properties.field}</p>
			<now-card>{
				state.showLoading ? (
					<now-loader />
				) : (
					<ul>
						{state.searchResults.length ? (
							state.searchResults.map(result => (
								<li>
									<now-button-iconic
										bare
										icon="circle-info-outline"
										size="md"
										on-click={() => { updateState({ selectedResult: result }); }}
									></now-button-iconic>
									{result.short_description}</li>
							))
						) : (
							<li>No matches found</li>
						)}
					</ul>
				)}

				{
					state.selectedResult ? (
						<now-modal
							opened={state.selectedResult}
							size='lg'
							footer-actions={[
								{
									label: 'Done',
									variant: 'secondary',
									clickActionType: 'OPENED_TEST'
								}
							]}
						>
							<now-rich-text html={state.selectedResult.text}></now-rich-text>
						</now-modal>
					) : null
				}
			</now-card>
		</div>
	);
};

createCustomElement('bp-search-results', {
	renderer: { type: snabbdom },
	initialState: {
		showLoading: false,
		searchResults: []
	},
	properties: {
		searchText: { default: "email" },
		selectedResult: {},
		table: { 'default': 'kb_knowledge' },
		field: { 'default': 'short_description' },
	},
	view,
	actionHandlers: {
		[actionTypes.COMPONENT_CONNECTED]:
			requestSearchResults,
		[actionTypes.COMPONENT_PROPERTY_CHANGED]:
			debounce(requestSearchResults, 250),
		SEARCH_RESULTS_REQUESTED: createHttpEffect('/api/now/table/:table', {
			method: 'GET',
			pathParams: ['table'],
			queryParams: ['sysparm_query'],
			startActionType: 'SEARCH_RESULTS_STARTED',
			successActionType: 'SEARCH_RESULTS_FETCHED'
		}),
		SEARCH_RESULTS_STARTED: ({ updateState }) => updateState({ showLoading: true }),
		SEARCH_RESULTS_FETCHED: ({ action, updateState }) => updateState({
			searchResults: action.payload.result,
			showLoading: false
		}),
		OPENED_TEST: ({ updateProperties }) => {
			console.log('zoran');
			updateProperties({ selectedResult: {} });
		}
	},
	styles
});
