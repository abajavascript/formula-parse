const postfixFunc = {
  '!': { //factorial n! = 1*2*3*...n
    func: function factorial(n) {
      let res = 1;
      for (let i = 1; i <= n; i++)
        res *= i;
    },
  },
  '!!': { //superFactorial n!! = 1!*2!*3!*...n!
    func: function superFactorial(n) {
      let res = 1;
      for (let i = 1; i <= n; i++)
        res *= Math.pow(i, n - i + 1);
    },
  },
};

const prefixFunc = {
  'abs': {
    func: Math.abs,
  },
  'sqrt': {
    func: Math.sqrt,
  },
  'log': {
    func: Math.log,
  },
  'log10': {
    func: Math.log10,
  },
  'ceil': {
    func: Math.ceil,
  },
  'floor': {
    func: Math.floor,
  },
  'sin': {
    func: Math.sin,
  },
  'cos': {
    func: Math.cos,
  },
  'tan': {
    func: Math.tan,
  },
};

const binaryOperator = {
  '+': {
    priority: 1,
    func: (x, y) => x + y,
  },
  '-': {
    priority: 1,
    func: (x, y) => x - y,
  },
  '*': {
    priority: 2,
    func: (x, y) => x * y,
  },
  '/': {
    priority: 2,
    func: (x, y) => x / y,
  },
  '%': {
    priority: 2,
    func: (x, y) => x % y,
  },
  '**': {
    priority: 3,
    func: Math.pow
  },
};

const openingBracket = '(';
const closingBracket = ')';
const otherLexemas = [' ', openingBracket, closingBracket];
const Lexemas = Object.keys(postfixFunc)
  .concat(Object.keys(prefixFunc))
  .concat(Object.keys(binaryOperator))
  .concat(Object.keys(otherLexemas));
const reNumber = /^\d+\.{0,1}\d*$/;
const reFuncOrVar = /^[a-zA-Z]\w*$/;
const reLexemas = [reNumber, reFuncOrVar];


function toLexema(s) {
  let resLexemas = [];

  function isLexema(l) {
    return Lexemas.indexOf(l) >= 0 || reLexemas.some(e => e.test(l))
  }

  function addLexema(l) {
    if (l === '') throw 'Cannot add empty lexema';
    if (l !== ' ') resLexemas.push(l);
  }

  s += ' '; //as last Lexema will be missed
  for (let i = 0, lex = ''; i < s.length; i++) {
    if (!isLexema(lex + s.charAt(i))) {
      addLexema(lex);
      lex = s.charAt(i);
    } else {
      lex += s.charAt(i);
    }
  }
  return resLexemas;
}

function toPolishNotation(s) {
  var resOutput = [],
    stack = [];

  for (let i = 0, lex = ''; i < s.length; i++) {
    lex = s[i];
    if (!isNaN(lex) || postfixFunc.hasOwnProperty(lex)) {
      resOutput.push(lex)
    } else if (prefixFunc.hasOwnProperty(lex)) {
      stack.push(lex);
    } else if (lex === openingBracket) {
      stack.push(lex);
    } else if (lex === closingBracket) {
      while (true) {
        if (stack.length === 0) throw 'Error with parentesis';
        lex = stack.pop();
        if (lex !== '(')
          resOutput.push(lex)
        else
          break;
      }
    } else if (binaryOperator.hasOwnProperty(lex)) {
      while (stack.length > 0 && (
          prefixFunc.hasOwnProperty(stack[stack.length - 1]) ||
          (binaryOperator.hasOwnProperty(stack[stack.length - 1]) &&
            binaryOperator[stack[stack.length - 1]].priority >= binaryOperator[lex].priority)
        )) {
        resOutput.push(stack.pop());
      }
      stack.push(lex);

    } else
      throw 'Unknown lexema ' + lex;
  }

  while (stack.length > 0) {
    resOutput.push(stack.pop());
  }

  return resOutput;
}

function calcPolishNotation(s) {
  var stack = [];

  for (let i = 0; i < s.length; i++) {
    lex = s[i];
    if (!isNaN(lex)) {
      stack.push(lex);
    } else if (postfixFunc.hasOwnProperty(lex)) {
      stack.push(postfixFunc[lex].func(+stack.pop()));
    } else if (prefixFunc.hasOwnProperty(lex)) {
      stack.push(prefixFunc[lex].func(+stack.pop()));
    } else if (binaryOperator.hasOwnProperty(lex)) {
      let arg2 = +stack.pop()
      let arg1 = +stack.pop()
      stack.push(binaryOperator[lex].func(arg1, arg2));
    }
  }
  if (stack.length !== 1) throw 'Error in input';
  return stack[0];
}

function calcFormula(s){
  return calcPolishNotation(toPolishNotation(toLexema(s)));
}

var s = '3 + (3.2 + sin(7.65) * log10(6))/(-4)!!+4! !!';
var s = '3 - 5 + 4 * 2 / (1 * (3 - 5/2))**2';
console.log(s + ' => \'', toLexema(s).join('\',\'') + '\'');

var s = ['3', '+', '4', '*', '2', '/', '(', '1', '-', '5', ')', '**', '2'];
console.log('\'' + s.join('\',\'') + ' => \'', toPolishNotation(s).join('\',\'') + '\'');


var s = ['3', '4', '2', '*', '1', '5', '-', '2', '**', '/', '+'];
console.log('\'' + s.join('\',\'') + ' => \'', calcPolishNotation(s) + '\'');

var s = '1*2*5';

console.log(s + ' = ' + calcFormula(s))
