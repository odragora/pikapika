/* 
    A model for Pokemon types.
    The list of Pokemon types is taken from the API and stored here.
    Also we use it to know what types are already fetched
    and what is the status of type fetch operation.  
*/

export const PokemonTypes = {
    state: {
        isFetched: false,
        isFetching: false,
        items: {},
    },

    reducers: {
        fetchListStart(state, payload) {
            return {
                ...state,
                isFetched: false,
                isFetching: true,
                error: null,
            }
        },
        fetchListCompleted(state, payload) {
            const items = {}
            for (let item of payload.types) {
                items[item.name] = {
                    isFetched: false,
                    isFetching: false,
                }
            }
            return {
                ...state,
                isFetched: true,
                isFetching: false,
                error: null,
                items,
            }
        },
        fetchListFailed(state, payload) {
            return {
                ...state,
                isFetched: false,
                isFetching: false,
                error: payload.error,
            }
        },
        fetchTypeStart(state, payload) {
            return {
                ...state,
                items: {
                    ...state.items,
                    [payload.id]: {
                        ...state.items[payload.id],
                        isFetched: false,
                        isFetching: true,
                        error: null,
                    }
                },
            }
        },
        fetchTypeCompleted(state, payload) {
            return {
                ...state,
                items: {
                    ...state.items,
                    [payload.id]: {
                        ...state.items[payload.id],
                        isFetched: true,
                        isFetching: false,
                        error: null,
                    }
                },
            }
        },
        fetchTypeFailed(state, payload) {
            return {
                ...state,
                items: {
                    ...state.items,
                    [payload.id]: {
                        ...state.items[payload.id],
                        isFetched: false,
                        isFetching: false,
                        error: payload.error,
                    }
                },
            }
        },
    },

    effects: (dispatch) => ({
        async fetchList(payload, rootState) {
            dispatch.PokemonTypes.fetchListStart()
            try {
                let result = await fetch(`https://pokeapi.co/api/v2/type/`)
                if (!result.ok) {
                    dispatch.PokemonTypes.fetchListFailed({error: result.status})
                    throw new Error(result.status)
                } else {
                    result = await result.json()
                    dispatch.PokemonTypes.fetchListCompleted({types: result.results})
                    return result
                }
            } catch(error) {
                dispatch.PokemonTypes.fetchListFailed({error})
                throw new Error(error)
            }
        },
        async fetchType(payload, rootState) {
            dispatch.PokemonTypes.fetchTypeStart({id: payload.id})
            try {
                let result = await fetch(`https://pokeapi.co/api/v2/type/${payload.id}/`)
                if (!result.ok) {
                    dispatch.PokemonTypes.fetchTypeFailed(result.status)
                    throw new Error(result.status)
                } else {
                    result = await result.json()
                    dispatch.PokemonTypes.fetchTypeCompleted({id: payload.id})
                    dispatch.PokemonEntries.typesUpdate({name: payload.id, data: result.pokemon})
                    return result
                }
            } catch(error) {
                dispatch.PokemonTypes.fetchTypeFailed({error})
                throw new Error(error)
            }
        }
    })
}
