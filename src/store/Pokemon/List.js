/* 
    A model for a list of Pokemon names. 
    They are being used to fetch individual entries on demand.
    It is separated the from the Entries model to keep the code 
    easy to read and to minimize nesting in the reducer.
    When the list of Pokemon names is fetched, we create an Entry for each name.
 */
export const PokemonList = {
    state: {
        isFetched: false,
        isFetching: false,
        error: null,
        items: [],
    },

    reducers: {
        fetchStart(state) {
            return {
                ...state,
                isFetched: false,
                isFetching: true,
                error: null,
            }
        },
        fetchCompleted(state, payload) {
            return {
                ...state,
                isFetched: true,
                isFetching: false,
                error: null,
                items: payload,
            }
        },
        fetchFailed(state, payload) {
            return {
                ...state,
                isFetched: false,
                isFetching: false,
                error: payload,
            }
        },
    },

    effects: (dispatch) => ({
        async fetch(payload, rootState) {
            dispatch.PokemonList.fetchStart()
            try {
                const result = await fetch('https://pokeapi.co/api/v2/pokemon/')
                if (result.ok) {
                    const data = await result.json()
                    dispatch.PokemonEntries.initialPopulate(data.results)
                    return dispatch.PokemonList.fetchCompleted(
                        data.results
                            .map((item, idx) => ({id: idx + 1, name: item.name}))
                    )
                } else {
                    dispatch.PokemonList.fetchFailed('Network error')
                    throw new Error('Network error')
                }
            } catch(e) {
                dispatch.PokemonList.fetchFailed(e)
                throw new Error(e)
            }
        }
    })
}
