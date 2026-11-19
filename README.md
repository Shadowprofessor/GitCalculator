🧮 GitCalculator

A simple yet feature-rich calculator built using JavaScript, HTML, CSS, and Python. GitCalculator provides a modern web-based calculator, a JavaScript calculation library with CLI support, and a Python command-line calculator.

✨ Features
🌐 Web Calculator
Modern, responsive calculator interface.
Basic arithmetic: Addition, Subtraction, Multiplication, and Division.
Advanced mathematical operations:
Exponentiation (^)
Modulo (%)
Integer division (//)
Parentheses for expressions.
Increment and decrement shortcuts.
Positive/negative number toggle.
Calculation history with the option to clear history.
Copy results to clipboard.
Keyboard support for faster calculations.
Error handling for invalid expressions and calculations.
📊 Array Operations

Perform mathematical operations on multiple numbers:

sum() – Add all numbers.
difference() – Subtract numbers sequentially.
product() – Multiply all numbers.
quotient() – Divide numbers sequentially.
power() – Calculate exponentiation.
intDivide() – Perform integer division.
remainder() – Calculate modulo.
💻 JavaScript Calculator Library

The modular JavaScript implementation provides reusable mathematical functions and an expression evaluator.

🐍 Python Calculator

A command-line calculator supporting:

Addition
Subtraction
Multiplication
Division
Interactive menu-driven calculations.
Input validation and error handling.
🛠️ Technologies Used
Technology	Purpose
HTML5	Web application structure
CSS3	Styling and responsive UI
JavaScript	Calculator logic and interactions
Python 3	Command-line calculator
Node.js	JavaScript CLI execution
📁 Project Structure
text
GitCalculator/
│
├── Addition.py
├── Subtraction.py
├── Multiplication.py
├── Division.py
├── Calc.py
│
├── addition.js
├── subtraction.js
├── multiplication.js
├── division.js
├── calc.js
├── app.js
│
├── index.html
├── style.css
│
└── README.md

🚀 Getting Started
1. Clone the Repository
bash
git clone https://github.com/Shadowprofessor/GitCalculator.git

2. Navigate to the Project Directory
bash
cd GitCalculator

3. Run the Web Calculator

Simply open index.html in your web browser.

No additional installation or build process is required for the basic web interface.

4. Run the Python Calculator

Make sure Python 3 is installed.

bash
python Calc.py


On some systems, use:

bash
python3 Calc.py


Follow the interactive menu to perform calculations.

5. Run the JavaScript Calculator

Make sure Node.js is installed.

bash
node calc.js


The JavaScript calculator provides a built-in demonstration and interactive CLI functionality.

📖 Usage Examples
JavaScript
javascript
const { add } = require("./addition");

console.log(add(10, 5)); // 15


For the unified calculator API, use the functions exposed by calc.js.

Examples of supported expressions:

text
12 + 7
100 - 25
6 * 8
144 / 12
2 ^ 5
17 % 5
100 // 4

Python
python
import Addition
import Subtraction
import Multiplication
import Division

print(Addition.add(10, 5))
print(Subtraction.subtract(10, 5))
print(Multiplication.multiply(10, 5))
print(Division.divide(10, 5))

⌨️ Keyboard Shortcuts
Key	Action
0–9	Enter numbers
+	Addition
-	Subtraction
*	Multiplication
/	Division
%	Modulo
^	Exponentiation
Enter or =	Calculate result
Backspace	Delete last character
Escape or C	Clear calculator
🤝 Contributing

Contributions are welcome!

If you want to improve GitCalculator:

Fork this repository.
Create a new branch.
bash
git checkout -b feature/your-feature

Make your changes.
Commit your changes.
bash
git commit -m "Add: your feature"

Push your branch.
bash
git push origin feature/your-feature

Open a Pull Request.
🐛 Issues and Feedback

Found a bug or have an idea for improvement?

Feel free to open an issue in the GitHub Issues section.

⭐ If you find this project useful, consider giving it a star on GitHub!

Happy Calculating! 🧮


