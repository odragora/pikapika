// TODO: errors handling, both an exception and status != 'ok'

/* 
    A model for Pokemon entries. 
    They store all the data of individual Pokemon accessible by name.
    It is separated the from the List model to keep the code 
    easy to read and to minimize nesting in the reducer.  
 */
export const PokemonEntries = {
    state: {},

    reducers: {
        fetchBatchStart(state, payload) {
            const result = {...state}
            for (let item of payload.ids) {
                result[item] = {
                    ...result[item],
                    isFetched: false,
                    isFetching: true,
                    error: null,
                }
            }
            return result
        },
        fetchBatchCompleted(state, payload) {
            const result = {...state}
            for (let item of payload.ids) {
                const types = {}
                for (let type of item.data.types) {
                    types[type.slot] = {...type}
                }
                const stats = {}
                for (let stat of item.data.stats) {
                    stats[stat.stat.name] = {...stat}
                }

                result[item.name] = {
                    ...result[item.name],
                    isFetched: true,
                    isFetching: false,
                    error: null,
                    data: {
                        ...result[item.name].data,
                        ...item.data,
                        types,
                        stats,
                    },
                }
            }
            return result
        },
        fetchBatchFailed(state, payload) {
            const result = {...state}
            for (let item of payload.ids) {
                result[item] = {
                    ...result[item],
                    isFetched: false,
                    isFetching: false,
                    error: `Batch error: ${payload.error}`,
                }
            }
            return result
        },
        initialPopulate(state, payload) {
            const result = {}
            for (let item of payload) {
                result[item.name] = {
                    isFetched: false,
                    isFetching: false,
                    error: null,
                    data: {
                        name: item.name,
                        image: null,
                        types: {1: null, 2: null},
                        stats: {},
                    },
                }
            }
            return result
        },
        typesUpdate(state, payload) {
            const result = {...state}
            for (let item of payload.data) {
                result[item.pokemon.name].data.types[item.slot] = {type: {name: payload.name}, slot: item.slot}
            }
            return result
        }
    },

    effects: (dispatch) => ({
        async fetchBatch(payload, rootState) {
            const {ids} = payload
            if (!ids.length) {
                return
            }
            dispatch.PokemonEntries.fetchBatchStart({ids})

            try {
                const result = await Promise.all(ids.map(item => fetch(`https://pokeapi.co/api/v2/pokemon/${item}/`)
                    .then(res => res.json())
                    .then(data => data)
                ))
                dispatch.PokemonEntries.fetchBatchCompleted({ids: result.map(item => ({
                    name: item.name,
                    data: {
                        name: item.name,
                        image: item.sprites.front_default,
                        types: item.types,
                        stats: item.stats,
                    },
                }))})
                return result
            } catch(err) {
                dispatch.PokemonEntries.fetchBatchFailed({ids, error: err})
                throw new Error(`Error: ${err}`)
            }
        },
    })
}
