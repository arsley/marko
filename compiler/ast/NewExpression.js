'use strict';

var Node = require('./Node');
var isCompoundExpression = require('../util/isCompoundExpression');

class NewExpression extends Node {
    constructor(def) {
        super('NewExpression');
        this.callee = def.callee;
        this.args = def.args;
    }

    generateCode(codegen) {
        var callee = this.callee;
        var args = this.args;



        codegen.write('new ');

        var wrap = isCompoundExpression(callee);

        if (wrap) {
            codegen.write('(');
        }

        codegen.generateCode(callee);

        if (wrap) {
            codegen.write(')');
        }

        codegen.write('(');

        if (args && args.length) {
            for (let i=0, argsLen = args.length; i<argsLen; i++) {
                if (i !== 0) {
                    codegen.write(', ');
                }

                let arg = args[i];
                if (!arg) {
                    throw new Error('Arg ' + i + ' is not valid for new expression: ' + JSON.stringify(this.toJSON()));
                }
                codegen.generateCode(arg);
            }
        }

        codegen.write(')');
    }

    isCompoundExpression() {
        return true;
    }

    toJSON() {
        return {
            type: 'NewExpression',
            callee: this.callee,
            args: this.args
        };
    }

    walk(walker) {
        this.callee = walker.walk(this.callee);
        this.args = walker.walk(this.args);
    }
}

module.exports = NewExpression;