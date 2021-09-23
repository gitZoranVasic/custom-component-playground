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
import { createHttpEffect } from '@servicenow/ui-effect-http';

const requestSearchResults = ({ properties, dispatch }) => {
	if (properties.searchText) {
		dispatch('SEARCH_RESULTS_REQUESTED', {
			table: 'kb_knowledge',
			sysparm_query: `short_descriptionLIKE${properties.searchText}`
		});
	}
};

const view = (state, { updateState }) => {
	return (
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
						footerActions={[
							{
								label: 'Done',
								variant: 'secondary',
								clickActioyType: 'NOW_MODAL#OPENED_SEST'
							}
						]}
					>
						<now-rich-text html={state.selectedResult.text}></now-rich-text>
					</now-modal>
				) : null
			}
		</now-card>
	);
};

createCustomElement('bp-search-results', {
	renderer: { type: snabbdom },
	initialState: {
		showLoading: false,
		searchResults: []
	},
	properties: {
		searchText: {
			default: 'email'
		},
		selectedResult: {}
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
		})
	},
	styles
});
