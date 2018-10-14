import React from 'react'
import { connect } from 'react-redux'

import PokemonTable from '../../components/Pokemon/Table'

export default class ScreenBase extends React.Component {
    render() {
        return (
            <PokemonTableContainer />
        )
    }
}

const mapState = state => ({
    pokemonList: state.PokemonList,
    pokemonEntries: state.PokemonEntries,
    pokemonTypes: state.PokemonTypes,
})
const mapDispatch = dispatch => ({
    fetchList: () => dispatch.PokemonList.fetch(),
    fetchEntry: id => dispatch.PokemonEntries.fetch(id),
    fetchEntries: ids => dispatch.PokemonEntries.fetchBatch(ids),
    fetchTypesList: () => dispatch.PokemonTypes.fetchList(),
    fetchType: id => dispatch.PokemonTypes.fetchType(id),
})
const PokemonTableContainer = connect(mapState, mapDispatch)(PokemonTable)
