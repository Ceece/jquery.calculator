(function($) {

    $.calculator = function(element, options) {
    	var template = '<div class="calculator-box">\
				<h1 class="calculator-title">Calculator</h1>\
				<div class="calculator-display">0</div>\
				<table>\
					<tr>\
						<td><button type="button" class="calculator-button all-clear">AC</button></td>\
						<td><button type="button" class="calculator-button clear">CE</button></td>\
						<td><button type="button" class="calculator-button operator" value="%">%</button></td>\
						<td><button type="button" class="calculator-button operator" value="/">/</button></td>\
					</tr>\
					<tr>\
						<td><button type="button" class="calculator-button number" value="7">7</button></td>\
						<td><button type="button" class="calculator-button number" value="8">8</button></td>\
						<td><button type="button" class="calculator-button number" value="9">9</button></td>\
						<td><button type="button" class="calculator-button operator" value="*">*</button></td>\
					</tr>\
					<tr>\
						<td><button type="button" class="calculator-button number" value="4">4</button></td>\
						<td><button type="button" class="calculator-button number" value="5">5</button></td>\
						<td><button type="button" class="calculator-button number" value="6">6</button></td>\
						<td><button type="button" class="calculator-button operator" value="-">-</button></td>\
					</tr>\
					<tr>\
						<td><button type="button" class="calculator-button number" value="1">1</button></td>\
						<td><button type="button" class="calculator-button number" value="2">2</button></td>\
						<td><button type="button" class="calculator-button number" value="3">3</button></td>\
						<td rowspan="2"><button type="button" class="calculator-button operator plus" value="+">+</button></td>\
					</tr>\
					<tr>\
						<td><button type="button" class="calculator-button number" value="0">0</button></td>\
						<td><button type="button" class="calculator-button number" value=".">.</button></td>\
						<td><button type="button" class="calculator-button equal" value="=">=</button></td>\
					</tr>\
				</table>\
			</div>';

        var self = this;
        var $element = $(element),
            element = element;
        var defaults = {}
        self.settings = $.extend({}, defaults, options);
        
        var input = "";
        var operators = ["+", "-", "*", "/", "%"];
        var $lastPress;
        var isOperator = function(char) {
            return operators.indexOf(char) !== -1;
        }
        var press = function() {
            var $el = $(this);
            var value = $el.val();
            if ($el.hasClass('number')) addNumber(value);
            if ($el.hasClass('operator')) addOperator(value);
            if ($el.hasClass('equal')) calculate();
            if ($el.hasClass('all-clear')) allClear();
            if ($el.hasClass('clear')) lastClear();
            $lastPress = $el;
            fixInput();
            render();
        }
        var addNumber = function(number) {
            if ($lastPress !== undefined && $lastPress.hasClass('equal')) allClear();
            input += number;
        }
        var addOperator = function(operator) {
            calculate();
            input += operator;
        }
        var calculate = function() {
            removeLastOperator();
            if (input.length) {
                input = (eval(input) + "") || "0";
            }
        }
        var removeLastOperator = function() {
            input = input.split("");
            if (input.length == 1 && input[0] === "-");
            else if (isOperator(input[input.length - 1])) input.pop();
            input = input.join("");
        }
        var render = function() {
            var array = inputToArray();
            var numeric = array.filter(function(e) {
                return !isNaN(e) && e;
            });
            $(".calculator-display").html(numeric[numeric.length - 1] || "0");
        }
        var allClear = function() {
            input = [];
            render();
        }
        var lastClear = function() {
            var array = inputToArray();
            array.pop();
            if (array.length) input = array.reduce(function(a, b) {
                return a + b
            });
            else input = "";
        }
        var fixInput = function() {
            var array = inputToArray();
            input = array.map(function(e) {
                return isOperator(e) || !e || e[e.length - 1] == "." ? e : eval(e) + "";
            }).reduce(function(a, b) {
                return a + b;
            });
        }
        var inputToArray = function() {
            var operator = findOperator();
            if (operator) {
                arr = input.split(operator);
                return [arr[0], operator, arr[1]]
            };
            return [input];
        }
        var findOperator = function() {
            return operators.map(function(operator) {
                return input.indexOf(operator) > 0 ? operator : "";
            }).reduce(function(a, b) {
                return a + b;
            });
        }

        $(element).html(template).find(".calculator-button").click(press);
    }

    $.fn.calculator = function(options) {
        var plugin = new $.calculator(this, options);
        $(this).data('calculator', plugin);
        return this;
    };
})(jQuery);