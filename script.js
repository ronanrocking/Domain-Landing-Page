class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '*': computation = prev * current; break;
            case '/': computation = prev / current; break;
            default: return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    scientific(action) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        switch (action) {
            case 'sin': this.currentOperand = Math.sin(current); break;
            case 'cos': this.currentOperand = Math.cos(current); break;
            case 'tan': this.currentOperand = Math.tan(current); break;
            case 'log': this.currentOperand = Math.log10(current); break;
            case 'sqrt': this.currentOperand = Math.sqrt(current); break;
            case 'pow': this.currentOperand = Math.pow(current, 2); break;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const numberButtons = document.querySelectorAll('[data-number]');
    const operationButtons = document.querySelectorAll('[data-operator]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const allClearButton = document.querySelector('[data-action="clear"]');
    const scientificButtons = document.querySelectorAll('.btn.scientific');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const calculatorElement = document.getElementById('calculator');
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.getAttribute('data-operator'));
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    allClearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });

    scientificButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.scientific(button.getAttribute('data-action'));
        });
    });

    toggleModeBtn.addEventListener('click', () => {
        const isScientific = calculatorElement.classList.toggle('scientific-mode');
        scientificButtons.forEach(btn => btn.classList.toggle('hidden'));
        toggleModeBtn.innerText = isScientific ? 'Switch to Basic' : 'Switch to Scientific';
    });
});
