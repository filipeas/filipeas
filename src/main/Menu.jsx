import React, { Component } from "react";
import './Menu.css';

import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import $ from 'jquery'
import 'jquery.terminal';

export default class Portfolio extends Component {
    JQuerycode = () => {
        let welcome = `
┬ ┬┌─┐┬  ┌─┐┌─┐┌┬┐┌─┐
│││├┤ │  │  │ ││││├┤ 
└┴┘└─┘┴─┘└─┘└─┘┴ ┴└─┘`;

        $('#app').terminal({
            help: function () {
                this.echo("Here some commands for you!\n- profile (filipe's profile)\n- github (filipe's github)\n- projects (some cool projects!)\n- contacts (filipe's contacts)\n- help (get all commands of this terminal)\n- clear (clear terminal)");
            },
            profile: function () {
                fetch('https://api.github.com/users/filipeas')
                    .then((response) => response.json())
                    .then((data) => {
                        const div = $(`
                        <div style="display: flex; align-items: center;">
                            <img src="${data.avatar_url}" width="150" height="150" style="border-radius: 50%;">
                            <span style="margin-left: 10px;">
                            | Name: ${data.name}<br>
                            | Bio: ${data.bio}<br>
                            * <a href="https://drive.google.com/file/d/1dcsOn3RKn75j8BkU5qxByQ6KPTws0TBo/view">My resume</a><br>
                            ------------------------<br>
                            | SOFTWARE DEVELOPMENT SKILLS<br>
                            * PHP; Python; JS; TS; Nodejs; Laravel; Mysql; Docker; Keras; Tensorflow;<br><br>
                            | SOFTWARE ENGINEERS SKILLS<br>
                            * Design Patterns; SOLID; Clean Architecture; Kanban; UML;<br><br>
                            | LANGUAGES<br>
                            * Brazilian Portuguese: native; English: basic;
                            </span>
                        </div>
                        `)
                        this.echo(div);
                    })
            },
            github: function () {
                this.echo("Access my github: https://github.com/filipeas")
            },
            projects: function () {
                const httpLink = createHttpLink({
                    uri: 'https://api.github.com/graphql',
                });

                const authLink = setContext((_, { headers }) => {
                    // get the authentication token from local storage if it exists
                    const token = process.env.REACT_APP_GH_TOKEN;
                    // return the headers to the context so httpLink can read them
                    return {
                        headers: {
                            ...headers,
                            authorization: token ? `Bearer ${token}` : "",
                        }
                    }
                });

                const client = new ApolloClient({
                    link: authLink.concat(httpLink),
                    cache: new InMemoryCache()
                });

                client
                    .query({
                        query: gql`
                        query GetLocations {
                                user(login: "filipeas") {
                                    name
                                    company
                                    bio
                                    twitterUsername
                                    websiteUrl
                                    url
                                    pinnedItems(first: 6) {
                                        totalCount
                                        edges {
                                            node {
                                            ... on Repository {
                                                id
                                                name
                                                description
                                                url
                                                stargazerCount
                                                forkCount
                                                languages(first: 2, orderBy: { field: SIZE, direction: DESC }) {
                                                    edges {
                                                        node {
                                                        name
                                                        color
                                                        }
                                                    }
                                                }
                                                object(expression: "master:README.md") {
                                                    ... on Blob {
                                                        text
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                        }`,
                    })
                    .then((result) => {
                        result.data.user.pinnedItems.edges.map(pinned => {
                            const div = $(`
                            <div>
                            <span>| Project name: ${pinned.node.name} <a href="${pinned.node.url}" target="_blank">go to project</a></span><br>
                            <span>| Project name: ${pinned.node.description}</span><br>
                            <span>| Languages: ${pinned.node.languages.edges.map(language => language.node.name)}</span><br>
                            <span>--------------------</span><br>
                            </div>`
                            );

                            this.echo(div)
                        });
                    });
            },
            contacts: function () {
                const div = $(`
                        <span>
                        | <a href="https://drive.google.com/file/d/1dcsOn3RKn75j8BkU5qxByQ6KPTws0TBo/view">See my resume here</a><br>
                        | <a href="mailto:felipealvessampaio@hotmail.com">My Email</a><br>
                        | <a href="https://www.linkedin.com/in/filipe-a-s/">My LinkedIn</a>
                        </span>
                        `)
                this.echo(div);
            },
        }, {
            greetings: `${welcome} to filipe's terminal.\nDigit 'help' for more commands.`
        });
    }

    componentDidMount() {
        this.JQuerycode();
    }

    render() {
        return (
            <div className="bloco">
                <div className="menu">
                    <div className="buttons-flex">
                        <div className="button red"></div>
                        <div className="button yellow"></div>
                        <div className="button green"></div>
                    </div>
                    <div className="title">
                        <a href="https://github.com/filipeas" target="_blank" rel="noreferrer">
                            <h1><i className="fab fa-github"></i> github.com/filipeas</h1>
                        </a>
                    </div>
                </div>

                <div id="app"></div>
            </div>
        )
    }
}