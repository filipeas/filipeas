import React, { Component } from "react";
// import 'https://cdn.jsdelivr.net/npm/jquery.terminal/css/jquery.terminal.min.css';
import './Terminal.css';

import $ from 'jquery';
import 'jquery.terminal';

export default class Terminal extends Component {
    componentDidMount() {
        // ignore command
        var { interpreter, command, ...options } = this.props;
        this.terminal = $(this.node).terminal(interpreter, options);

        console.log(this.props)
        console.log($(this.node))
    }
    componentWillUnmount() {
        this.terminal.destroy();
    }
    isCommandControlled() {
        return this.props.command !== undefined;
    }
    render() {
        if (this.terminal && this.isCommandControlled()) {
            this.terminal.set_command(this.props.command, true);
        }
        return (
            <div ref={(node) => this.node = node}></div>
        );
    }
}