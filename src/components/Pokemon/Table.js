import React from 'react'
import memoize from 'memoize-one'

import { Table, Avatar, Input, Tag } from 'antd'

const TYPES_COLORS = {
    normal: '#e0e0e0',
    fire: '#ff8a65',
    water: '#4dd0e1',
    grass: '#81c784',
    electric: '#ffd54f',
    ice: '#90a4ae',
    fighting: '#c75b39',
    poison: '#ba68c8',
    ground: '#dce775',
    flying: '#7986cb',
    psychic: '#f06292',
    bug: '#aed581',
    rock: '#ffb74d',
    ghost: '#b388ff',
    dark: '#a1887f',
    dragon: '#49599a',
    steel: '#c1d5e0',
    fairy: '#ffa4a2',
}

export default class PokemonTable extends React.Component {
    state = {
        nameFilter: '',
        typeFilter: null,
        isTypeFetching: false,
        pagination: {
            size: 10,
            page: 1,
        },
    }
    componentDidMount = () => {
        this.props.fetchList()
        this.props.fetchTypesList()
    }
    getIsReady() {
        return this.props.pokemonList.isFetched && this.props.pokemonTypes.isFetched
    }
    getIsLoading() {
        return this.props.pokemonList.isFetching ||
        this.props.pokemonTypes.isFetching ||
        this.state.isTypeFetching
    }
    getFiltered = memoize((items, entries, nameFilter, typeFilter) => {
        let result = items
        if (nameFilter) {
            result = items.filter((item) => item.name.includes(nameFilter.toLowerCase()))
        }
        if (typeFilter) {
            result = result.filter((item) => {
                const entry = entries[item.name]
                for (let typeObj of Object.values(entry.data.types)) {
                    if (typeObj && typeObj.type.name === typeFilter) {
                        return true
                    }
                }
            })
        }
        return result
    })
    getPaginated = memoize((items, size, page) => {
        const begin = size * (page - 1)
        const end = begin + size
        return items.slice(begin, end)
    })
    getData = memoize((isFetching, list, entries, size, page, nameFilter, typeFilter) => {
        if (isFetching) {
            return []
        }
        const filtered = this.getFiltered(list, entries, nameFilter, typeFilter)
        const paginated = this.getPaginated(filtered, size, page)
        for (let item of filtered) {
            item.key = item.name
            item.details = entries[item.name]
        }
        // Dispatch 'fetch entry' for each item in the subset, if an entry isn't fetched yet
        const entriesToFetch = []
        for (let item of paginated) {
            const entry = entries[item.name]
            if (entry && !entry.isFetched && !entry.isFetching && !entry.error) {
                entriesToFetch.push(item.name)
            }
        }
        this.props.fetchEntries({ ids: entriesToFetch })

        return filtered
    })
    handleTableChange = (pagination, filters) => {
        this.setState(prevState => {
            let { isTypeFetching } = prevState
            let typeFilter = null
            if (filters['details.data.types']) {
                typeFilter = filters['details.data.types'][0]
            }
            if (typeFilter && prevState.typeFilter !== typeFilter) {
                isTypeFetching = true
                this.props.fetchType({ id: typeFilter })
                    .then(() => this.setState({ isTypeFetching: false }))
            }

            return {
                pagination: {
                    size: pagination.pageSize,
                    page: pagination.current,
                },
                typeFilter,
                isTypeFetching,
            }
        })
    }

    render() {
        return (
            <div>
                <Input.Search
                    placeholder={'Start typing name'}
                    onChange={e => this.setState({ nameFilter: e.target.value })}
                />
                <Table
                    loading={this.getIsLoading()}
                    columns={[
                        {
                            title: 'Image',
                            dataIndex: 'details.data.image',
                            render: src => <Avatar src={src} size={80} />,
                        },
                        {
                            title: 'Name',
                            dataIndex: 'name',
                            render: name => name[0].toUpperCase() + name.slice(1),
                        },
                        // {
                        //     title: 'Color',
                        //     dataIndex: 'color',
                        // },
                        {
                            title: 'Types',
                            dataIndex: 'details.data.types',
                            render: types => this.getIsReady()
                                ? (
                                    <div>
                                        {Object.values(types)
                                            .filter(item => item)
                                            .sort((a, b) => a.slot > b.slot)
                                            .map(
                                                item => item
                                                    ? <TypeTag name={item.type.name} key={item.slot} />
                                                    : null
                                            )
                                        }
                                    </div>
                                )
                                : null,
                            filters: Object.entries(this.props.pokemonTypes.items).map(item => ({
                                text: item[0], value: item[0],
                            })),
                            filterMultiple: false,
                        },
                        {
                            title: 'Stats',
                            children: [
                                {
                                    title: 'ATK',
                                    dataIndex: 'details.data.stats.attack',
                                    key: 'atk',
                                    render: data => data
                                        ? `${data.base_stat} [${data.effort} EV]`
                                        : null
                                    ,
                                },
                                {
                                    title: 'DEF',
                                    dataIndex: 'details.data.stats.defense',
                                    key: 'def',
                                    render: data => data
                                        ? `${data.base_stat} [${data.effort} EV]`
                                        : null
                                    ,
                                },
                                {
                                    title: 'SP-ATK',
                                    dataIndex: 'details.data.stats.special-attack',
                                    key: 'spatk',
                                    render: data => data
                                        ? `${data.base_stat} [${data.effort} EV]`
                                        : null
                                    ,
                                },
                                {
                                    title: 'SP-DEF',
                                    dataIndex: 'details.data.stats.special-defense',
                                    key: 'spdef',
                                    render: data => data
                                        ? `${data.base_stat} [${data.effort} EV]`
                                        : null
                                    ,
                                },
                                {
                                    title: 'HP',
                                    dataIndex: 'details.data.stats.hp',
                                    key: 'hp',
                                    render: data => data
                                        ? `${data.base_stat} [${data.effort} EV]`
                                        : null
                                    ,
                                },
                                {
                                    title: 'SPD',
                                    dataIndex: 'details.data.stats.speed',
                                    key: 'spd',
                                    render: data => data
                                        ? `${data.base_stat} [${data.effort} EV]`
                                        : null
                                    ,
                                },
                            ],
                        },
                    ]}
                    dataSource={this.getData(
                        !this.getIsReady() || this.getIsLoading(),
                        this.props.pokemonList.items, this.props.pokemonEntries,
                        this.state.pagination.size, this.state.pagination.page,
                        this.state.nameFilter, this.state.typeFilter
                    )}
                    onChange={this.handleTableChange}
                    pagination={{ showSizeChanger: true }}
                />
            </div>
        )
    }
}

const TypeTag = (props) => {
    const { name } = props
    return (
        <Tag color={TYPES_COLORS[name]} style={{
            cursor: 'default',
        }}>{name}</Tag>
    )
}
