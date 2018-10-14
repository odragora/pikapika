import {init} from '@rematch/core'

import {PokemonList} from './Pokemon/List'
import {PokemonEntries} from './Pokemon/Entries'
import {PokemonTypes} from './Pokemon/Types'

export const store = init({
    models: {PokemonList, PokemonEntries, PokemonTypes}
})

export const {dispatch} = store
