import Addition
import Subtraction
import Multiplication
import Division

def show_menu():
    print("\n========================================")
    print("      ✦ PYTHON CALCULATOR MENU ✦       ")
    print("========================================")
    print("1. Addition")
    print("2. Subtraction")
    print("3. Multiplication")
    print("4. Division")
    print("5. Exit")
    print("----------------------------------------")

while True:
    show_menu()
    choice = input("Enter choice (1/2/3/4/5): ").strip()

    if choice == '5':
        print("\nThank you for using the calculator! Goodbye!\n")
        break

    if choice in ('1', '2', '3', '4'):
        try:
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
        except ValueError:
            print("\nError: Invalid input. Please enter valid numbers.")
            continue

        if choice == '1':
            print(f"\n  {num1} + {num2} = {Addition.add(num1, num2)}")

        elif choice == '2':
            print(f"\n  {num1} - {num2} = {Subtraction.subtract(num1, num2)}")

        elif choice == '3':
            print(f"\n  {num1} * {num2} = {Multiplication.multiply(num1, num2)}")

        elif choice == '4':
            try:
                print(f"\n  {num1} / {num2} = {Division.divide(num1, num2)}")
            except Exception as e:
                print(f"\nError: {e}")
        
        next_calc = input("\nLet's do next calculation? (yes/no): ").strip().lower()
        if next_calc in ("no", "n"):
            print("\nThank you for using the calculator! Goodbye!\n")
            break
    else:
        print("\nInvalid choice. Please select 1, 2, 3, 4, or 5.")
